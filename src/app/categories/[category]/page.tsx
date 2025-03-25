import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { AcceleratePromise } from "@prisma/extension-accelerate"
import { Container } from "@mui/material"
import { BookmarkGrid } from "@/components/BookmarkGrid"
import { getCurrentSession } from "@/lib/session"

type BookmarkWithAuthor = Prisma.BookmarkGetPayload<{
	include: { user: true }
}>

export default async function Page({ 
	params,
}: {
		params: Promise<{ categorySlug: string }>
	}) {
	const { user } = await getCurrentSession();

	const slug  = (await params).categorySlug

	const category = await prisma.category.findFirst({
		where: {
			slug: slug
		}
	})

	if (!category) {
		return
	}

	const categoryBookmarks = await prisma.bookmark.findMany({
		where: {
			categories: {
				some: {
					category: {
						slug: {
							in: [category?.slug]
						}
					}
				}
			}
		},
		include: {
			user: true
		}
	}) as unknown as AcceleratePromise<BookmarkWithAuthor[]>

	return (
		<Container maxWidth="lg" className="my-5">
			<h1 className="text-4xl my-5">Category: { category?.name }</h1>
			<BookmarkGrid userId={user?.id} bookmarks={categoryBookmarks}/> 
		</Container>
	)
}
