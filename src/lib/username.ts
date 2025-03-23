import prisma from "./prisma"

export async function checkUsernameAvailability(username: string): Promise<boolean> {
	const user = await prisma.user.findUnique({where: {
		username: username
	}})

	return user === null;
}
