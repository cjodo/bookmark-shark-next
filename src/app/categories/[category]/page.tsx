import prisma from "@/lib/prisma"

import { Container } from "@mui/material"

import { BookmarkGrid } from "@/components/BookmarkGrid"

export default async function Page({ 
	params,
}: {
		params: Promise<{ categorySlug: string }>
	}) {
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
	})

	console.log(categoryBookmarks)

	return (
		<Container maxWidth="lg" className="my-5">
			<h1 className="text-4xl my-5">Category: { category?.name }</h1>
			<BookmarkGrid bookmarks={categoryBookmarks}/> 
		</Container>
	)
}
