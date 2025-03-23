import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserEmailVerificationRequestFromRequest } from "@/lib/email-verification";
import { globalGetRateLimit } from "@/lib/request";

import { verifyEmailAction, resendEmailVerificationCodeAction } from "./actions";

import { EmailVerificationForm } from "@/components/EmailVerificationForm";
import { ResendEmailVerificationForm } from "@/components/ResendEmailVerificationForm";

export default async function Page() {
	if (!globalGetRateLimit()) {
		return "Too many requests";
	}

	const { user } = await getCurrentSession();

	if(user === null) {
		return redirect("/login");
	}

	const verificationRequest = getUserEmailVerificationRequestFromRequest();
	if (verificationRequest === null && user.emailVerified) {
		return redirect("/")
	}

	return (
		<>
			<EmailVerificationForm action={ verifyEmailAction }/>
			<ResendEmailVerificationForm action={resendEmailVerificationCodeAction} />
		</>
	)
}
