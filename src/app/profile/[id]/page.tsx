import prisma from "@/lib/prisma";

import { Avatar, Typography } from "@mui/material";

import { BookmarkGrid } from "@/components/BookmarkGrid";

export default async function Profile({ params }: {params: Promise<{ id: string }>}) {
	const userSlug = await params

	const currentUser = await prisma.user.findFirst( {
		where: {
			id: parseInt(userSlug.id)
		}
	}) 

	if (!currentUser?.id) {
		return <h1 className="text-5xl">User Not Found</h1>
	}

	const bookmarks = await prisma.bookmark.findMany({
		where: {
			userId: currentUser.id
		},
		include: { user: true }
	})

	let avatar: string;

	if (currentUser.avatar == null || currentUser.avatar == undefined) {
		avatar = "/placeholder-avatar.png"
	} else {
		avatar = "/avatars/" + currentUser.avatar;
	}

	return (
		<div className="flex flex-col items-center p-6 min-h-screen">
			{/* Profile Header */}
			<div className="flex flex-col items-center space-y-2">
				<Avatar src={avatar} sx={{ width: 80, height: 80 }} />
				<Typography variant="h5" className="font-bold text-3xl">{currentUser.username}</Typography>
			</div>

			{/* Bookmarks Section */}

			<div className="w-full max-w-[1440px] mt-6 space-y-4">
				<Typography variant="h5" className="font-bold text-3xl">Users Bookmarks</Typography>
				<BookmarkGrid bookmarks={bookmarks} />
			</div>
		</div>
	);
}
