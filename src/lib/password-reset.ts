import prisma from "./prisma";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { generateRandomOTP } from "./utils";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";

import { User } from "@prisma/client";

export async function createPasswordResetSession(token: string, userId: number, email: string): Promise<PasswordResetSession> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: PasswordResetSession = {
		id: sessionId,
		userId,
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		code: generateRandomOTP(),
		emailVerified: false,
	};
	prisma.passwordResetSession.create({
		data: {
			id: session.id,
			userId: session.userId,
			email: session.email,
			code: session.code,
			expiresAt: Math.floor(session.expiresAt.getTime() / 1000)
		}
	})
	return session;
}

export async function validatePasswordResetSessionToken(token: string): Promise<PasswordResetSessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const resetSession = await prisma.passwordResetSession.findFirst({
		where: {
			id: sessionId
		},
		include: {
			user: true
		}
	})
	if (resetSession === null) {
		return { session: null, user: null };
	}
	if (Date.now() >= resetSession.expiresAt) {
		prisma.passwordResetSession.delete({ where: { id: resetSession.id } })
		return { session: null, user: null };
	}

	const session: PasswordResetSession = {
		id: resetSession.id,
		userId: resetSession.userId,
		email: resetSession.email,
		code: resetSession.code,
		expiresAt: new Date(resetSession.expiresAt * 1000),
		emailVerified: resetSession.emailVerified,
	}
	
	return { session, user: resetSession.user };
}

export function setPasswordResetSessionAsEmailVerified(sessionId: string): void {
	prisma.passwordResetSession.update({ 
		where: { id: sessionId },
		data: { emailVerified: true }
	})
}

export function invalidateUserPasswordResetSessions(userId: number): void {
	prisma.passwordResetSession.delete({ where: { userId: userId } })
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
	const cs = await cookies();
	const token = cs.get("password_reset_session")?.value ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validatePasswordResetSessionToken(token);
	if (result.session === null) {
		deletePasswordResetSessionTokenCookie();
	}
	return result;
}

export async function setPasswordResetSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
	const cs = await cookies()
	cs.set("password_reset_session", token, {
		expires: expiresAt,
		sameSite: "lax",
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production"
	});
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
	const cs = await cookies()
	cs.set("password_reset_session", "", {
		maxAge: 0,
		sameSite: "lax",
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production"
	});
}

export function sendPasswordResetEmail(email: string, code: string): void {
	console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
	id: string;
	userId: number;
	email: string;
	expiresAt: Date;
	code: string;
	emailVerified: boolean;
}

export type PasswordResetSessionValidationResult =
	| { session: PasswordResetSession; user: User }
	| { session: null; user: null };
