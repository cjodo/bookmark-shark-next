import Link from "next/link"

import { Container } from "@mui/material"
import { Grid2 as Grid } from "@mui/material"
import { List } from "@mui/material"


export const Footer = () => {
	return (
		<div className="w-full bg-primary text-neutral p-6 min-h-[25rem]">
			<Container>
				<Grid container sx={{ justifyContent: "space-between" }}>
					<Grid sx={{ width: 300 }}>
						<h1 className="text-5xl">Bookmark Shark</h1>
						<p>Contact Us</p>
					</Grid>
					<Grid sx={{ width: 300 }}>
						<List>
							<Link href={"/"} > 
								Home
							</Link>
						</List>
					</Grid>
				</Grid>
			</Container>
		</div>
	)
}

