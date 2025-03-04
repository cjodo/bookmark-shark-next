import { Container } from "@mui/material"
import { Typography } from "@mui/material"

import { CardContainer } from "@/components/card/CardContainer"
import { CategoryCard } from "@/components/card/CategoryCard"

import prisma from "@/lib/prisma"

export default async function Home() {
	const categories = await prisma.category.findMany({
		take: 3
	})

	return (
		<main className="min-h-full flex flex-col items-center justify center bg-base-100">

			<div className="hero min-h-[80vh]"
				style={{
					backgroundImage: `url(/hero-banner.png)`,
				}}
			>
				<div className="hero-overlay bg-opacity-10"> </div>
				<div className="hero-content">
					<div className="max-w-end">
						<h1 className="mb-5 text-7xl font-bold text-primary text-center">Bookmark Shark</h1>

						<p className="mb-5 text-lg">
							Bookmark Shark is a browser bookmark sharing platform, perfect for discovering and sharing entertainment, educational, and professional content.  
							Easily share, rate, and download others' bookmarks in just one click!
						</p>

						<div className="mt-6 flex justify-center space-x-4">
							<button className="btn btn-primary">Get Started</button>
							<button className="btn btn-outline">Learn More</button>
						</div>
					</div>
				</div>
			</div>

			<Container maxWidth="xl" className="mb-5">
				<Typography 
					variant="h2"
					className="text-5xl mt-5"
				>
					Categories
				</Typography>
				<CardContainer className="mt-5 w-full">
					{ categories.map((category) => (
						<CategoryCard 
							key={category.id} 
							cardTitle={ category.name }
							cardBody={ category.description }
							route={category.slug}
						/>
					))}
				</CardContainer>
			</Container>

		</main>
	)
}
