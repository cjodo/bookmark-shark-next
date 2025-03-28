import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/session";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { createUserWithGoogle, getUserFromGoogleId, updateUserEmailAndSetEmailAsVerified } from "@/lib/user";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { globalGetRateLimit } from "@/lib/request";

import { decodeIdToken, type OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
	if (!globalGetRateLimit()) {
		return new Response("Too many requests", {
			status: 429
		});
	}
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cs = await cookies()

	const storedState = cs.get("google_oauth_state")?.value ?? null;
	const codeVerifier = cs.get("google_code_verifier")?.value ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		return new Response("Please restart the process.", {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	const claimsParser = new ObjectParser(claims);

	const googleId = claimsParser.getString("sub");
	const name = claimsParser.getString("name");
	const email = claimsParser.getString("email");

	const existingUser = await getUserFromGoogleId(googleId);
	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await updateUserEmailAndSetEmailAsVerified(existingUser.id, email);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	const user = await createUserWithGoogle(googleId, email, name);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);

	await updateUserEmailAndSetEmailAsVerified(user.id, email);

	setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}
