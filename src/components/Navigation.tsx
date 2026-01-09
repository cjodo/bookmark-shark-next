"use client";

import Link from "next/link";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";

export const Navigation = () => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<Toolbar disableGutters>
			{/* Mobile Navigation */}
			<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "center", padding: "1rem" }}>
				<IconButton
					size="large"
					aria-label="open menu"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={handleOpenNavMenu}
					color="inherit"
				>
					<MenuIcon />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorElNav}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					keepMounted
					onClose={handleCloseNavMenu}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					open={Boolean(anchorElNav)}
					sx={{ display: { xs: "block", md: "none" } }}
				>
					<MenuItem onClick={handleCloseNavMenu}>
						<Link href="/" passHref>
							Home
						</Link>
					</MenuItem>
					<MenuItem onClick={handleCloseNavMenu}>
						<Link href="/categories" passHref>
							Categories
						</Link>
					</MenuItem>
					<MenuItem onClick={handleCloseNavMenu}>
						<Link href="/explore" passHref>
							Explore
						</Link>
					</MenuItem>
				</Menu>
			</Box>

			{/* Desktop Navigation */}
			<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: "1rem" }}>
				<Link href="/" passHref>
					<button className="btn btn-ghost text-xl">Home</button>
				</Link>
				<Link href="/categories" passHref>
					<button className="btn btn-ghost text-xl">Categories</button>
				</Link>
				<Link href="/explore" passHref>
					<button className="btn btn-ghost text-xl">Explore</button>
				</Link>
			</Box>
		</Toolbar>
	);
};

