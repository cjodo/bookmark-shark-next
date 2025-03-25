'use client'

import { useRouter } from "next/navigation"

import { 
	Card, 
	CardContent, 
	CardActions,
	Typography,
	Avatar
} from "@mui/material"

import { StarContainer } from "../StarContainer"

import { Bookmark, User } from "@prisma/client"
import Link from "next/link"

interface BookmarkCardProps {
	bookmark: Bookmark
	author: User
	userId: number | undefined
}
export const BookmarkCard = ({ bookmark, author, userId }: BookmarkCardProps) => {
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
			<div className="flex flex-row justify-between px-5">
				<CardActions>
					<button className="btn btn-primary" onClick={viewBookmark}>View</button>
				</CardActions>
				<div className="flex flex-row justify-around items-center gap-2">
					<div className="author flex flex-row gap-2 items-center">
						<p>Author: <Link className="link link-secondary" href={ `/profile/${author.id}` }>{author.username}</Link></p>
						<Avatar alt="Author Avatar" src={author.avatar || ""} />
					</div>
					<StarContainer userId={userId} bookmarkId={bookmark.id} />
				</div>
			</div>
		</Card>
	)
}
