'use client';

import { createTheme } from "@mui/material";

const theme = createTheme({
	typography: {
		fontFamily: 'var(--font-roboto)'
		
	},
	cssVariables: true,
	components: {
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					h1: 'h1',
					h2: 'h2',
					h3: 'h3',
					h4: 'h4',
					h5: 'h5',
					h6: 'h6',
				}
			}
		}
	}
})

export default theme;
