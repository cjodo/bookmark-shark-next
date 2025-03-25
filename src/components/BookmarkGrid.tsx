"use client"

import { AcceleratePromise } from "@prisma/extension-accelerate"
import { useEffect, useState } from "react"

import { Prisma } from "@prisma/client"

import { BookmarkCard } from "./card/BookmarkCard"

import type { BookmarkWithAuthor } from ".."


interface BookmarkGridProps {
		bookmarks: AcceleratePromise<Prisma.BookmarkGetPayload<{ include: { user: true } }>[]>
	userId: number | undefined
}
export const BookmarkGrid = ({ bookmarks, userId }: BookmarkGridProps) => {
	const [loading, setLoading] = useState(true);
	const [resolvedBookmarks, setResolvedBookmarks] = useState<BookmarkWithAuthor[]>([]);

	useEffect(() => {
		if(Array.isArray(bookmarks)) {
			setResolvedBookmarks(bookmarks);
			setLoading(false);
		} else if(bookmarks && typeof bookmarks.then === "function") {
			bookmarks.then((resolvedData) => {
				setResolvedBookmarks(resolvedData)
			}).catch((error) => {
					console.error("Error loading bookmarks: ", error)
				}).finally(() => {
					setLoading(false);
				})
		}
	}, [bookmarks])

	if(loading) {
		return <div className="flex justify-center items-center h-40">Loading...</div>
	}

	return (
		<div className="w-full max-w-[1440px] mt-6 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
			{resolvedBookmarks.map((bookmark, key) => (
				<BookmarkCard bookmark={bookmark} key={key} author={bookmark.user} userId={userId} />
			))}
		</div>
	)
}
