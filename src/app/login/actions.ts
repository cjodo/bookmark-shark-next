"use server"

import { globalPostRateLimit } from "@/lib/request"
import { ActionResult } from "@/index"
import { RefillingTokenBucket, Throttler } from "@/lib/rate-limit"
import { headers } from "next/headers";

import { verifyEmailInput } from "@/lib/email";
import { getUserFromEmail } from "@/lib/user";

import { verifyPasswordHash } from "@/lib/password";

import { getUserPasswordHash } from "@/lib/user";
import { setSessionTokenCookie, generateSessionToken, createSession } from "@/lib/session";

import { redirect } from "next/navigation";

const throttler = new Throttler<number>([1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);
export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {

	console.log("loginAction");
	if (!globalPostRateLimit()) {
		return {
			message: "Too many requests"
		};
	}

	const head = await headers();
	// TODO: Assumes X-Forwarded-For is always included.
	const clientIP = head.get("X-Forwarded-For");
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return {
			message: "Too many requests"
		};
	}

	const email = formData.get("email");
	const password = formData.get("password");
	if (typeof email !== "string" || typeof password !== "string") {
		return {
			message: "Invalid or missing fields"
		};
	}
	if (email === "" || password === "") {
		return {
			message: "Please enter your email and password."
		};
	}
	if (!verifyEmailInput(email)) {
		return {
			message: "Invalid email"
		};
	}
	const user = await getUserFromEmail(email);
	if (user === null || user === undefined) {
		return {
			message: "Account does not exist"
		};
	}
	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return {
			message: "Too many requests"
		};
	}
	if (!throttler.consume(user.id as number)) {
		return {
			message: "Too many requests"
		};
	}

	const passwordHash = await getUserPasswordHash(user.id as number);
	if(!passwordHash) {
		redirect("/login/google");
	}
	const validPassword = await verifyPasswordHash(passwordHash, password);
	if (!validPassword) {
		return {
			message: "Invalid password"
		};
	}
	throttler.reset(user.id as number);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id as number);
	await setSessionTokenCookie(sessionToken, session.expiresAt); 

	if (!user.emailVerified) {
		return redirect("/verify-email");
	} else {
		redirect("/")
	}
}

