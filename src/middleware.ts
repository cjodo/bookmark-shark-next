import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest): Promise<NextResponse> {
	if(req.method === "GET" || req.method === "POST") {
		const response = NextResponse.next();
		const token = req.cookies.get("session")?.value ?? null;
		if(token !== null) {
			response.cookies.set("session", token, {
				path: "/",
				maxAge: 60 * 60 * 24 * 30,
				sameSite: "lax",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production"
			})
		}

		return response
	}

	// const originHeader = req.headers.get("Origin");
	// // NOTE: You may need to use `X-Forwarded-Host` instead
	// const hostHeader = req.headers.get("Host");
	// if (originHeader === null || hostHeader === null) {
	// 	return new NextResponse(null, {
	// 		status: 403
	// 	});
	// }
	// let origin: URL;
	// try {
	// 	origin = new URL(originHeader);
	// } catch {
	// 	return new NextResponse(null, {
	// 		status: 403
	// 	});
	// }
	// if (origin.host !== hostHeader) {
	// 	return new NextResponse(null, {
	// 		status: 403
	// 	});
	// }

	return NextResponse.next()
}

