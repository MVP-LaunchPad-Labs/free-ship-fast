import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

export const rateLimiter = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(10, "10 s"),
	analytics: true,
});

export const authRateLimiter = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(5, "30 m"),
	analytics: true,
});

export const emailTokenRateLimiter = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(3, "30 m"),
	analytics: true,
});

export const verifyEmailRateLimiter = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(3, "30 m"),
	analytics: true,
});

type RateLimitProps = {
	actionType: "auth" | "default" | "emailToken" | "verifyEmail";
	identifier: string;
};

function getDynamicRateLimiter(
	actionType: "auth" | "default" | "emailToken" | "verifyEmail",
): Ratelimit {
	switch (actionType) {
		case "auth":
			return authRateLimiter;
		case "emailToken":
			return emailTokenRateLimiter;
		case "verifyEmail":
			return verifyEmailRateLimiter;
		default:
			return rateLimiter;
	}
}

export async function rateLimit({
	actionType,
	identifier,
}: RateLimitProps): Promise<void> {
	const rateLimiter = getDynamicRateLimiter(actionType);
	const { success } = await rateLimiter.limit(identifier);

	if (!success) {
		throw new Error("Too many requests. Please try again later.");
	}
}
