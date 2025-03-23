import prisma from "@/lib/prisma"

import { CategoryCard } from "@/components/card/CategoryCard"
import { CardContainer } from "@/components/card/CardContainer"

export default async function Categories() {
	const categories = await prisma.category.findMany({ })

	return (
		<>
			<CardContainer className="my-5">
				{categories.map((category, i) => {
					return (
						<CategoryCard
							key={i}
							cardTitle={ category.name }
							image={ category.feature_image }
							cardBody={ category.description }
							route={ category.slug }
						/>
					)
				})}
			</CardContainer>
		</>
	)
}
