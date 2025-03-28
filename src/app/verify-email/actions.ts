"use server";

import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequestCookie,
	deleteUserEmailVerificationRequest,
	getUserEmailVerificationRequestFromRequest,
	sendVerificationEmail,
	sendVerificationEmailBucket,
	setEmailVerificationRequestCookie
} from "@/lib/email-verification";


import { ExpiringTokenBucket } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

import { globalPostRateLimit } from "@/lib/request";
import { invalidateUserPasswordResetSessions } from "@/lib/password-reset";

import { updateUserEmailAndSetEmailAsVerified } from "@/lib/user";

const bucket = new ExpiringTokenBucket<number>(5, 60*30);

interface ActionResult {
	message: string;
}
export async function verifyEmailAction(_prev: ActionResult,formData: FormData): Promise<ActionResult> {
	if(!globalPostRateLimit) {
		return { message: "Too many requests" }
	}

	const { session, user } = await getCurrentSession()

	if (session === null) {
		return { message: "Not authenticated, please login" }
	}

	if (!bucket.check(user.id, 1)) {
		return { message: "Too many requests" }
	}

	let verificationRequest = await getUserEmailVerificationRequestFromRequest();
	if (verificationRequest === null) {
		return { message: "Not authenticated, please login" }
	}

	const code = formData.get("code");

	if (typeof code !== "string") {
		return { message: "Invalid or missing code" }
	}

	if (code === "") {
		return { message: "Enter your code" }
	}

	if (!bucket.consume(user.id, 1)) {
		return { message: "Too many requests" }
	}

	if (Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(verificationRequest.userId, verificationRequest.email);
		return { message: "The verification code was expired. We sent another code to your inbox." }
	}

	if(verificationRequest.code !== code) {
		return  { message: "Incorrect code." }
	}

	deleteUserEmailVerificationRequest(user.id);
	invalidateUserPasswordResetSessions(user.id);
	updateUserEmailAndSetEmailAsVerified(user.id, verificationRequest.email);
	deleteEmailVerificationRequestCookie();

	return redirect("/");
}

export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (session === null) {
		return {
			message: "Not authenticated"
		};
	}
	if (!sendVerificationEmailBucket.check(user.id, 1)) {
		return {
			message: "Too many requests"
		};
	}
	let verificationRequest = await getUserEmailVerificationRequestFromRequest();
	if (verificationRequest === null) {
		if (user.emailVerified) {
			return {
				message: "Forbidden"
			};
		}
		if (!sendVerificationEmailBucket.consume(user.id, 1)) {
			return {
				message: "Too many requests"
			};
		}
		verificationRequest = await createEmailVerificationRequest(user.id, user.email);
	} else {
		if (!sendVerificationEmailBucket.consume(user.id, 1)) {
			return {
				message: "Too many requests"
			};
		}
		verificationRequest = await createEmailVerificationRequest(user.id, verificationRequest.email);
	}
	sendVerificationEmail(verificationRequest.email, verificationRequest.code);
	setEmailVerificationRequestCookie(verificationRequest);
	return {
		message: "A new code was sent to your inbox."
	};
}
