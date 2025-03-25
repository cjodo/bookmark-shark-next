import Link from "next/link";
import Image from "next/image";

import { getCurrentSession } from "@/lib/session"

import { LogoutButton } from "./LogoutButton";

export const Header = async () => {
	const { user } = await getCurrentSession();

	const avatar = (): string => {
		if(!user?.avatar) {
			return "/placeholder-avatar.png"
		}
		return 	`/avatars/${user.avatar}`;
	}

	return (
		<div className="navbar bg-neutral text-base-content">
			<div className="flex-1">
				<Link className="btn btn-ghost text-xl" href="/">Bookmark Shark</Link>
			</div>

			{user ?  
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
						<div className="w-10 rounded-full">
							<Image
								alt="Profile avatar"
								src={avatar()} 
								width={100}
								height={100}
							/>
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-4 shadow flex flex-col gap-2">
						{ user && ( 
							<li style={{ pointerEvents: "none", textDecoration: "underline", padding: "1rem", textAlign: "center" }}><h3 className="text-xl text-center">{ user?.username }</h3></li>
						) }
						<li className="border">
							<Link className="justify-between p-3"
								href={`/profile/${user?.id}`}
							>
								Profile
							</Link>
						</li>
						<li><Link className="p-3 border" href="/profile/edit">Edit Profile</Link></li>
						<li><Link className="p-3 border" href="/upload">New Bookmark</Link></li>
						<LogoutButton /> 
					</ul>
				</div> : <Link href="/login" className="link link-secondary text-xl px-3">Login</Link>
			}
		</div>
	)
}
