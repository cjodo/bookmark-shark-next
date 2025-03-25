
import prisma from "./prisma";

import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";

import type { User } from "@prisma/client";

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await prisma.session.findFirst({
		where: {
			id: sessionId
		},
		include: {
			user: true
		}
	})

	if (row === null) {
		return { session: null, user: null };
	}

	const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
	const expirationDate = new Date(expirationTime);

	const session: Session = {
		id: row.id,
		userId: row.userId,
		expiresAt: expirationDate,
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		prisma.session.delete({ where: { id: session.id } })
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		prisma.session.update({ 
			where: { id: sessionId },
			data: { expiresAt: session.expiresAt.getTime() / 1000 }
		})
	}


	return { session, user: row.user };
}

export const getCurrentSession =  cache(async (): Promise<SessionValidationResult> => {
	const cs = await cookies()
	const token = cs.get("session")
	if (token === null || token === undefined) {
		return { session: null, user: null };
	}
	const result = await validateSessionToken(token.value);

	return result;
});

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } })
}

export async function invalidateUserSessions(userId: number): Promise<void> {
	await prisma.session.delete({ where: { userId: userId } });
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
	const cs = await cookies()
	cs.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	console.log("deleting session cookie")
	const cs = await cookies()
	cs.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes);
	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	console.log("Generated sessionId: ", sessionId);

	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};

	const existingSession = await prisma.session.findFirst({
		where: {
			userId: userId
		}
	})

	if(existingSession != null) {
		await invalidateUserSessions(userId);
	}

	const res = await prisma.session.create({
		data: {
			id: sessionId,
			userId: userId,
			expiresAt: Math.floor(session.expiresAt.getTime() / 1000)
		}
	})

	console.log("create: ", res)

	return session;
}

export interface Session {
	id: string;
	expiresAt: Date;
	userId: number;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
