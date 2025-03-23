
import { Container } from "@mui/material"

import NestedLinksComponent from "@/components/upload/components"

export default function Page() {
	return (
		<div className="min-h-screen">
			<Container maxWidth="md" className="p-5">
				<h1 className="text-4xl">New Bookmark</h1>
				<NestedLinksComponent />
			</Container>
		</div>
	)
}
