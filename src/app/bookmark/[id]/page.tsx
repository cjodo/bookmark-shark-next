import prisma from "@/lib/prisma"

import { 
	Container,
	List,
	ListItem
} from "@mui/material"

import { StarContainer } from "@/components/StarContainer"
import { getCurrentSession } from "@/lib/session"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const { user } = await getCurrentSession();

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

	if (!bookmarkMeta?.userId) {
		return <>Error</>
	}

	const author = await prisma.user.findFirst({
		where: {
			id: bookmarkMeta?.userId
		}
	})

	return (
		<Container maxWidth="lg" className="flex flex-col min-h-screen">
			<div className="grow">
				<h1 className="text-4xl">{ bookmarkMeta?.name } <StarContainer userId={ user.id } bookmarkId={parseInt(id)}/> </h1>
				<p>Description: {bookmarkMeta?.description}</p>
				<p>Author: {author?.username}</p>


				<div className="flex flex-col items-center p-7">
					<List>
						{ urls.map((url, i) => {
							return <ListItem key={i}><a className="link w-full bg-white rounded p-4 link-secondary" href={url.url}>{ url.title ?? url.url}</a></ListItem>
						}) }
					</List>
				</div>
			</div>
		</Container>

	)
}
