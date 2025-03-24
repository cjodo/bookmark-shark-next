'use client'

import { useRouter } from "next/navigation";

import { 
	Card, 
	CardActions,
	CardMedia, 
	CardContent 
} from "@mui/material"

import { Typography } from "@mui/material"
import Link from "next/link";

interface CategoryProps {
	cardTitle: string
	cardBody: string
	route: string

	image?: string
	attributionLink?: string
}
export const CategoryCard = ({ 
	cardTitle,
	image,
	cardBody,
	route,
	attributionLink
}: CategoryProps) => {
	const router = useRouter();

	return (
		<Card 
			raised
			sx={{ 
				maxWidth: 400, 
				minWidth: 350, 
				display: "flex", 
				flexDirection: "column", 
				justifyContent: "space-between",
				padding: "0.5rem"
			}} 
			className="bg-neutral shadow-xl">
			<CardMedia 
				sx={{ height: 250, width: 250, objectFit: "contain", margin: "0 auto"}}
				image={ image }
				title={ cardTitle }
			/>
				{ attributionLink && <Link className="link link-neutral" href={attributionLink}>Photo source</Link> }
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
			</CardActions>
		</Card>
	)
}
