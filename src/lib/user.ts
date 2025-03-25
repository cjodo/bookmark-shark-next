import prisma  from "./prisma";
import { User } from "@prisma/client";

import { hashPassword } from "./password";
import { encryptString } from "./encryption";

import { generateRandomRecoveryCode } from "./utils";


export function verifyUsernameInput(username: string) {
	return username.length > 3 && username.length < 32 && username.trim() === username;
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
	prisma.user.update({
		where: {id: userId},
		data: update
	});
}
