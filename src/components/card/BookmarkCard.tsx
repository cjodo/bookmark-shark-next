'use client'

import { useRouter } from "next/navigation"

import { 
	Card, 
	CardContent, 
	CardActions,
	Typography
} from "@mui/material"

import { Bookmark } from "@prisma/client"

interface BookmarkCardProps {
	bookmark: Bookmark
}
export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
	const router = useRouter();

	const viewBookmark = () => {
		router.push(`/bookmark/${bookmark.id}`)
	}

	return (
		<Card sx={{ minWidth: 400 }}>
			<CardContent>
				<Typography gutterBottom variant="h2" className="text-2xl">
					{ bookmark.name }
				</Typography>
				<Typography>
					{ bookmark.description }
				</Typography>
			</CardContent>
			<CardActions>
				<button className="btn btn-primary" onClick={viewBookmark}>View</button>
			</CardActions>
		</Card>
	)
}
