import { getCurrentSession } from "@/lib/session"


export const Header = async () => {
	const { user } = await getCurrentSession();

	return (
		<div className="navbar bg-neutral text-base-content">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl" href="/">Bookmark Shark</a>
			</div>

			{user ?  
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
						<div className="w-10 rounded-full">
							<img
								alt="Tailwind CSS Navbar component"
								src="/placeholder-avatar.png" />
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow">
						{ user && ( 
							<li><h3>{ user?.username }</h3></li>
						) }
						<li>
							<a className="justify-between"
								href={`/profile/${user?.id}`}
							>
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li><a href="/upload">New Bookmark</a></li>
						<li>{ user ? <a>Logout</a> : <a href="/login">Login</a>}</li>
					</ul>
				</div> : <a href="/login" className="link link-secondary text-xl px-3">Login</a>
			}
		</div>
	)
}
