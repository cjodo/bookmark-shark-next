"use server"

import { redirect } from "next/navigation";

import { globalGetRateLimit } from "@/lib/request"
import { getCurrentSession } from "@/lib/session";

import { loginAction } from "./actions";

import { LoginCard } from "@/components/LoginCard";


export default async function Page() {

	if(!globalGetRateLimit()) {
		return "Too many requests";
	}

	const { user } = await getCurrentSession();

	if(user !== null) {
		redirect("/")
	}

	return (
		<>
			<LoginCard action={loginAction} />
		</>
	)
}
