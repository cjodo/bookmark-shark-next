import Link from "next/link";

import { getCurrentSession } from "@/lib/session"

import { Navigation } from "./Navigation"; 

import { ProfileDropdown } from "./ProfileDropdown";

export const Header = async () => {

	return (
		<div className="navbar flex justify-between bg-neutral text-base-content">
			<div className="flex-1 md:grow-7">
				<Link className="btn btn-ghost text-xl" href="/">Bookmark Shark</Link>
			</div>
			<Navigation />
			<ProfileDropdown />
		</div>
	)
}


