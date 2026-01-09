import prisma  from "./prisma";
import { User } from "@prisma/client";

import { hashPassword } from "./password";
import { encryptString } from "./encryption";

import { generateRandomRecoveryCode } from "./utils";
import { profile } from "console";


export function verifyUsernameInput(username: string) {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function getUserFromEmail(email: string): Promise<Partial<User> | null> {
	const user = await prisma.user.findMany({ 
		where: {
			email: email
		}
	})

	// email is unique but findMany won't throw an error if it's not found
	return user[0];
}

export async function createUser(email:string, username:string, password:string): Promise<Partial<User> | null> {
	const passwordHash = await hashPassword(password);
	const recoveryCode = generateRandomRecoveryCode();
	const encryptedRecoveryCode = encryptString(recoveryCode);

	console.log({recoveryCode, encryptedRecoveryCode});

	const newUser = await prisma.user.create({
		data: {
			email: email,
			username: username,
			passwordHash: passwordHash,
			recoveryCode: encryptedRecoveryCode
		},
	})

	if (newUser === null) {
		throw new Error("Unexpected error");
	}
	const user: Partial<User> = {
		id: newUser.id,
		username,
		email,
		emailVerified: false,
	};

	return user;
}

//TODO: Add avatar
export async function createUserWithGoogle(
	googleId: string, 
	email: string, 
	username: string
): Promise<User> {
	
	const user = await prisma.user.create({
		data: {
			email: email,
			username: username,
			googleId: googleId,
			passwordHash: "",
			createdAt: new Date()
		}
	})

	if (user === null) {
		throw new Error("Unexpected error");
	}

	return user
}

export async function getUserPasswordHash(userId: number): Promise<string>{
	const passwordHash = await prisma.user.findFirstOrThrow({
		where: {
			id: userId,
		},
		select: { passwordHash: true }
	});

	if(passwordHash === null) {
		return "";
	}

	return passwordHash.passwordHash 
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
	const user = await prisma.user.findFirst({ where: { googleId: googleId } });
	return user;
}

export async function updateUserEmailAndSetEmailAsVerified(userId: number, email: string): Promise<void> {
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			email: email,
			emailVerified: true
		}
	})
}

export async function updateUser(update: Partial<User> | User, userId: number) {
	if(update === null) {
		return 
	}

	const updated = await prisma.user.update({
		where: {id: userId},
		data: update
	});

	console.log(updated);

	return updated;
}
