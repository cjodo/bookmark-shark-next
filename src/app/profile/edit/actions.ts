"use server"

import { updateUser } from "@/lib/user";
import { User } from "@prisma/client";



interface ActionResult {
	message: string;
}
export async function updateProfileAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
	const username = formData.get("username");
	const id = formData.get("id");

	if (typeof username !== "string" || typeof id !== "string"){
		throw new Error("Unexpected error");
	}

	let updates:Record<string, any> = {};

	for(const [key, value] of formData.entries()) {
		updates[key as keyof User] = value;
	}

	updateUser(updates as Partial<User>, parseInt(id))

	return {
		message: "Update success"
	}
}
