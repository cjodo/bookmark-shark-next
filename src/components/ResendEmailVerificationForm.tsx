"use client"

import { useActionState } from "react";

interface ResendEmailVerificationFormProps {
	action: (prevState: {message: string }, formData: FormData) => Promise<{ message: string }>;
}
export const ResendEmailVerificationForm = ({ action }: ResendEmailVerificationFormProps) => {
	const [state, formAction] = useActionState(action, { message: "" });


	return (
		<form action={formAction}>
			<button className="btn btn-secondary">Resend code</button>
			<p>{state.message}</p>
		</form>
	)
}
