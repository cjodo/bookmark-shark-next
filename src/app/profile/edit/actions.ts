"use server"

import fs from "fs";
import path from "path";
import { updateUser } from "@/lib/user";
import { User } from "@prisma/client";

const saveAvatar = async (avatar: File, userId: number): Promise<string> => {
  const uploadDir = path.join(process.cwd(), "public/avatars");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = avatar.name.split(".").pop();
  const fileName = `${userId}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  // Convert file to buffer and write to disk
  const buffer = await avatar.arrayBuffer();
  await fs.promises.writeFile(filePath, Buffer.from(buffer));

  // Return the relative path to the avatar image
  return fileName;
};

interface ActionResult {
	message: string;
}
export async function updateProfileAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
	const username = formData.get("username") as string | null;
	const id = formData.get("id") as string | null;
	const avatar = formData.get("avatar") as File | null; // Ensure avatar is a file

	console.log("form action: ");
	console.log({ username, id, avatar });

	if (typeof username !== "string" || typeof id !== "string") {
		console.log("Invalid types:", typeof username, typeof id);
		throw new Error("Unexpected error");
	}

	const parsedId = parseInt(id);
	if (isNaN(parsedId)) {
		throw new Error("Invalid ID");
	}

	const updates: Partial<User> = { username };

	// If an avatar is uploaded, send it to the backend and update the avatar URL
	if (avatar) {
		console.log("avatar found: ", avatar);
		const avatarPath = await saveAvatar(avatar, parsedId);
		updates.avatar = avatarPath;
	}

	// Update user profile in database
	await updateUser(updates, parsedId);

	return {
		message: "Update success"
	};
}

