"use client"

import { logoutAction } from "@/app/actions"
import { useActionState } from "react"

const initialState = {
	message: ""
}

export const LogoutButton = () => {
	const [, action] = useActionState(logoutAction, initialState);
	return (
		<form action={action}>
			<button className="btn btn primary">Logout</button>
		</form>
	)
}
