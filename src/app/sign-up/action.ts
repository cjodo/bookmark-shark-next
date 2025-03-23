"use server"

import { headers } from "next/headers";

import { redirect } from "next/navigation";

import { RefillingTokenBucket } from "@/lib/rate-limit";

import { createUser } from "@/lib/user";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/lib/session";
import { globalPostRateLimit } from "@/lib/request";

import { verifyUsernameInput } from "@/lib/user";
import { verifyEmailInput } from "@/lib/email";
import { checkEmailAvailability } from "@/lib/email";
// import { verifyPasswordInput } from "@/lib/password";
// import { verifyPasswordStrength } from "@/lib/password";
import { createEmailVerificationRequest, sendVerificationEmail, setEmailVerificationRequestCookie } from "@/lib/email-verification";
import { checkUsernameAvailability } from "@/lib/username";


const ipBucket = new RefillingTokenBucket<string>(3, 10);

interface ActionState {
	message: string
}

export async function SignUpAction(_prev: ActionState, formData: FormData): Promise<{message: string}> {
	if(!globalPostRateLimit()) {
		return { message: "Too many requests" };
	}

	const head = await headers()
	const clientIP = head.get("X-Forwarded-For");
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return { message: "Too many requests" };
	}

	const email = formData.get("email");
	const username = formData.get("username");
	const password = formData.get("password");


	//TODO: figure out a way to send client error messages 
	if (typeof email !== "string" || typeof username !== "string" || typeof password !== "string") {
		return { message: "Invalid field found" }
	}
	if (email === "" || password === "" || username === "") {
		return { message: "Missing a field" }
	}
	if (!verifyEmailInput(email)) {
		return { message: "Invalid email" }
	}
	const emailAvailable = await checkEmailAvailability(email);
	if (!emailAvailable) {
		return { message: "Email is already taken" }
	}

	const usernameAvailable = await checkUsernameAvailability(username);
	if (!usernameAvailable) {
		return { message: "Username is already taken" }
	}

	if (!verifyUsernameInput(username)) {
		return { message: "Invalid username" }
	}
	//TODO: Password strength
	// const strongPassword = await verifyPasswordStrength(password);
	// if (!strongPassword) {
	// 	return;
	// }
	//
	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return { message: "Too many requests" }
	}

	const user = await createUser(email, username, password);

	if(user?.id === undefined || user?.email === undefined) {
		throw new Error("unexpected error")
	}

	const emailVerificationRequest = await createEmailVerificationRequest(user?.id, user?.email);
	sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code);
	setEmailVerificationRequestCookie(emailVerificationRequest);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);

	setSessionTokenCookie(sessionToken, session.expiresAt);

	return redirect("/");
}
