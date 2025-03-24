
import { generateRandomOTP } from "./utils";
import prisma from "./prisma";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32 } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";

export async function getUserEmailVerificationRequest(userId: number, id: string): Promise<EmailVerificationRequest | null> {
	const vr = await prisma.emailVerificationRequest.findFirst({
		where: {
			id: id,
			userId: userId
		}
	})
	if (vr === null) {
		return vr;
	}
	const request: EmailVerificationRequest = {
		id: vr.id,
		userId: vr.userId,
		code: vr.code,
		email: vr.email,
		expiresAt: new Date(vr.expiresAt * 1000)
	};

	return request;
}

export async function createEmailVerificationRequest(userId: number, email: string): Promise<EmailVerificationRequest >{
	await deleteUserEmailVerificationRequest(userId);
	const idBytes = new Uint8Array(20);
	crypto.getRandomValues(idBytes);
	const id = encodeBase32(idBytes).toLowerCase();

	const code = generateRandomOTP();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

	await prisma.emailVerificationRequest.create({
		data: {
			id,
			userId,
			code,
			email,
			expiresAt: expiresAt.getTime() / 1000
		}
	})

	const request: EmailVerificationRequest = {
		id,
		userId,
		code,
		email,
		expiresAt
	};

	return request;
}

export async function deleteUserEmailVerificationRequest(userId: number): Promise<void> {
	await prisma.emailVerificationRequest.deleteMany({ where: {userId: userId} })
}

export function sendVerificationEmail(email: string, code: string): void {
	//TODO: email
	console.log(`To ${email}: Your verification code is ${code}`);
}

export async function setEmailVerificationRequestCookie(request: EmailVerificationRequest): Promise<void> {
	const cs = await cookies()
	cs.set("email_verification", request.id, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: request.expiresAt
	});
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
	const cs = await cookies();
	cs.set("email_verification", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0
	});
}

export async function getUserEmailVerificationRequestFromRequest(): Promise<EmailVerificationRequest | null> {
	const { user } = await getCurrentSession();
	if (user === null) {
		return null;
	}

	const cs = await cookies()

	const id = cs.get("email_verification")?.value ?? null;
	if (id === null) {
		return null;
	}
	const request = getUserEmailVerificationRequest(user.id, id);
	if (request === null) {
		deleteEmailVerificationRequestCookie();
	}
	return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(3, 60 * 10);

export interface EmailVerificationRequest {
	id: string;
	userId: number;
	code: string;
	email: string;
	expiresAt: Date;
}

