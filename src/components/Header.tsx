import Link from "next/link";
import Image from "next/image";

import { getCurrentSession } from "@/lib/session"

import { LogoutButton } from "./LogoutButton";

export const Header = async () => {
	const { user, session } = await getCurrentSession();
	console.log({ user, session })

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
								src="/placeholder-avatar.png" 
								width={100}
								height={100}
							/>
							
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow">
						{ user && ( 
							<li><h3>{ user?.username }</h3></li>
						) }
						<li>
							<Link className="justify-between"
								href={`/profile/${user?.id}`}
							>
								Profile
								<span className="badge">New</span>
							</Link>
						</li>
						<li><Link href="/upload">New Bookmark</Link></li>
						{ user ? <LogoutButton /> : <a href="/login">Login</a>}
					</ul>
				</div> : <Link href="/login" className="link link-secondary text-xl px-3">Login</Link>
			}
		</div>
	)
}
