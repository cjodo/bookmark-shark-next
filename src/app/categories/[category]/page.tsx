import prisma from "@/lib/prisma"

import { Container } from "@mui/material"

import { BookmarkCard } from "@/components/card/BookmarkCard"
import { CardContainer } from "@/components/card/CardContainer"

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
		}
	})

	console.log(categoryBookmarks)

	return (
			<Container maxWidth="lg" className="my-5">
				<h1 className="text-4xl my-5">Category: { category?.name }</h1>
				<CardContainer>
					{ categoryBookmarks.map((bookmark, i) => (
						<BookmarkCard key={i} bookmark={bookmark} />
					)) }
				</CardContainer>
			</Container>
	)
}
