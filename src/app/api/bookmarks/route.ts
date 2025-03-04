import prisma from "@/lib/prisma"

export const GET = async () => {
	const bookmarks = await prisma.bookmark.findMany({})

	return Response.json({ bookmarks })
}
