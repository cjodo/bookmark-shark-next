import prisma from "./prisma";

export function verifyEmailInput(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,255}$/;
  return emailRegex.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
	const user = await prisma.user.findUnique({where: {
		email: email
	}})

	return user === null;
}
