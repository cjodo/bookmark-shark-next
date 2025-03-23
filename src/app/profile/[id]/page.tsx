import prisma from "@/lib/prisma";

export default async function Profile({ params }: {params: Promise<{ id: string }>}) {
	const userSlug = await params

	const currentUser = await  prisma.user.findFirst( {
		where: {
			id: parseInt(userSlug.id)
		}
	} ) 

	if (!currentUser?.id) {
		return <h1 className="text-5xl">User Not Found</h1>
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="flex flex-col md:flex-row">
				<h1 className="text-5xl">{ currentUser.username }</h1>
			</div>
		</div>
	)
}
