import prisma from "@/lib/prisma"


import { CategoryCard } from "@/components/card/CategoryCard"
import { CardContainer } from "@/components/card/CardContainer"
import { Container } from "@mui/material"

import { Paginate } from "@/components/Paginate"

export default async function Categories() {
	const categories = await prisma.category.findMany({ });

	return (
		<>
			<Container maxWidth="md" className="p-5">
				<h1 className="text-4xl">All Categories</h1>
			</Container>
			<CardContainer className="my-5">
				{categories.map((category, i) => {
					return (
						<CategoryCard
							key={i}
							cardTitle={ category.name }
							image={ `/icons/category/${category.name.toLowerCase()}.webp` }
							cardBody={ category.description }
							route={ category.slug }
						/>
					)
				})}
			</CardContainer>
			<Paginate maxPages={10} />
		</>
	)
}
