export type BookmarkWithAuthor = Prisma.BookmarkGetPayload<{
	include: { user: true }
}>
