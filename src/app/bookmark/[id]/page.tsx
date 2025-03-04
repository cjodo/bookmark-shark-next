import prisma from "@/lib/prisma"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const bookmarkMeta = await prisma.bookmark.findFirst({
		where: {
			id: parseInt(id)
		}
	})

	const urls = await prisma.bookmarkUrl.findMany({
		where: {
			bookmarkId: parseInt(id)
		}
	})

	console.log(bookmarkMeta)
	console.log(urls)

	return (
		<h1>{ bookmarkMeta?.name }</h1>
	)
}
