import prisma from "@/lib/prisma"
import { AcceleratePromise } from "@prisma/extension-accelerate"
import { Container } from "@mui/material"
import { BookmarkGrid } from "@/components/BookmarkGrid"
import { getCurrentSession } from "@/lib/session"
import { Paginate } from "@/components/Paginate"

import type { BookmarkWithAuthor } from "@/index"

export default async function Page({ 
	params,
	searchParams
}: {
		params: { slug: string };
		searchParams?: { [key: string]: string | string[] | undefined };
	}) {
	const { user } = await getCurrentSession();
	const { slug } = params;

	let page = 1;

	if (searchParams?.page) {
		const parsedPage = parseInt(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			page = parsedPage;
		}
	}

	const category = await prisma.category.findFirst({
		where: {
			slug: slug
		}
	})

	if (!category) {
		return
	}

	// Fetch total count of bookmarks in the category
	const totalBookmarksCount = await prisma.bookmark.count({
		where: {
			categories: {
				some: {
					category: {
						slug: {
							in: [category?.slug]
						}
					}
				}
			} }
	});

	const maxPages = Math.ceil(totalBookmarksCount / 10); // Assuming 10 bookmarks per page
	const skip = (page - 1) * 10; // Calculate offset for pagination

const categoryBookmarks = await prisma.bookmark.findMany({
  where: {
    categories: {
      some: {
        category: {
          slug: category.slug
        }
      }
    }
  },
  include: {
    user: true,
    _count: {
      select: { stars: true } // This counts the number of stars associated with each bookmark
    }
  },
  orderBy: {
    stars: {
      _count: 'desc' // Sort by the count of stars in descending order
    }
  },
  skip,
  take: 10,
}) as unknown as AcceleratePromise<BookmarkWithAuthor[]>;;


	return (
		<Container maxWidth="lg" className="my-5">
			<h1 className="text-4xl my-5">Category: { category?.name }</h1>
			<BookmarkGrid userId={user?.id} bookmarks={categoryBookmarks}/> 
			<Paginate maxPages={maxPages}/>
		</Container>
	)
}

