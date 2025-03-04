import { 
	Box, 
	Grid2 as Grid 
} from "@mui/material";
import { ReactNode } from "react";

interface CardContainerProps {
	children: ReactNode
	className?: string
}

export const CardContainer = ({ children, className}: CardContainerProps) => {
	return (
		<Box  
			className={ className }
			sx={{ 
				flexGrow: 1,
			}}
		>
			<Grid 
				container 
				spacing={2} 
				sx={{ 
					width: "100%",
					justifyContent: "center"
				}}>
				{ children }
			</Grid>
		</Box>
	)
}

