export type BookmarkWithAuthor = Prisma.BookmarkGetPayload<{
	include: { user: true }
}>

export interface ActionResult {
	message: string
}
