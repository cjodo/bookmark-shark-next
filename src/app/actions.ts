"use server";

import { globalPostRateLimit } from "@/lib/request";
import { deleteSessionTokenCookie, getCurrentSession, invalidateSession } from "@/lib/session";
import { redirect } from "next/navigation";

//TODO: have a types.d.ts for less repetitive type def
interface ActionResult {
	message: string
}
export async function logoutAction(): Promise<ActionResult> {
	if(!globalPostRateLimit())  {
		return {
			message: "Too many requests"
		};
	}

	const { session } = await getCurrentSession();
	if(session === null) {
		return { 
			message: "Not authenticated" 
		}
	}

	invalidateSession(session.id);
	deleteSessionTokenCookie();
	return redirect("/login")
}
