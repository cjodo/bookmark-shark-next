import { headers } from "next/headers";
import { TokenBucket } from "./rate-limit";

export const globalBucket = new TokenBucket<string>(100, 1);

export const globalGetRateLimit = async (): Promise<boolean> => {
	const head = await headers();
	const clientIp = head.get("X-Forwarderd-For");
	if (clientIp === null){
		return true
	}

	return globalBucket.consume(clientIp, 1)
}

export const globalPostRateLimit = async (): Promise<boolean> => {
	const head = await headers();
	const clientIp = head.get("X-Forwarded-For");

	if (clientIp === null) {
		return true;
	}

	return globalBucket.consume(clientIp, 3);
}
