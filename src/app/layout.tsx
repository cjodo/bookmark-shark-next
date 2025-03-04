import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material";
import "./globals.css";

import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import theme from "@/theme";

const roboto = Roboto({
	weight: ['300', '400', '500'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto',
})

export const metadata: Metadata = {
	title: "Bookmark Shark",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
		children: React.ReactNode;
	}>) {
	return (
		<html lang="en">
			<body
				className={`${roboto.variable} ${roboto.variable} antialiased bg-base-200 h-full` }
			>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<ThemeProvider theme={theme}>
					<Header />
					{children}
						<Footer />
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
