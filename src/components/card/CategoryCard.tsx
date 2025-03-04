'use client'

import { useRouter } from "next/navigation";

import { 
	Card, 
	CardActions,
	CardMedia, 
	CardContent 
} from "@mui/material"

import { Typography } from "@mui/material"

interface CategoryProps {
	cardTitle: string
	cardBody: string
	route: string

	image?: string
}
export const CategoryCard = ({ 
	cardTitle,
	image,
	cardBody,
	route
}: CategoryProps) => {
	const router = useRouter();

	return (
		<Card 
			sx={{ 
				maxWidth: 400, 
				minWidth: 200, 
				display: "flex", 
				flexDirection: "column", 
				justifyContent: "space-between"
			}} 
			className="bg-neutral shadow-xl">
			<CardMedia 
				sx={{ height: 140 }}
				image={ image }
				title={ cardTitle }
			/>
			<CardContent>
				<Typography gutterBottom variant="h2" className="text-xl">
					{ cardTitle }
				</Typography>
				<Typography variant="body1">
					{ cardBody }
				</Typography>
			</CardContent>
			<CardActions sx={{ justifyContent: "end", gap: "1rem" }}>
				<button 
					onClick={() => {
						router.push(`/categories/${route}`)
					}}
					className="btn btn-primary">Explore</button>
				<button className="btn btn-outline">Learn More</button>
			</CardActions>
		</Card>
	)
}
