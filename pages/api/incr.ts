import crypto from "node:crypto";
import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

const hasRedis = !!(
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasRedis ? Redis.fromEnv() : null;

export default async function incr(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.status(405).send("use POST");
		return;
	}
	if (req.headers["content-type"] !== "application/json") {
		res.status(400).send("must be json");
		return;
	}

	const body = req.body;
	const slug: string | undefined = body?.slug;
	if (!slug) {
		res.status(400).send("Slug not found");
		return;
	}

	const ip = (
		(Array.isArray(req.headers["x-forwarded-for"])
			? req.headers["x-forwarded-for"][0]
			: req.headers["x-forwarded-for"]) ||
		(Array.isArray(req.headers["x-real-ip"])
			? req.headers["x-real-ip"][0]
			: req.headers["x-real-ip"]) ||
		req.socket.remoteAddress ||
		null
	)
		?.toString()
		.split(",")[0]
		.trim();

	if (!redis) {
		res.status(202).end();
		return;
	}

	try {
		if (ip) {
			const hash = crypto.createHash("sha256").update(ip).digest("hex");
			const isNew = await redis.set(
				["deduplicate", hash, slug].join(":"),
				true,
				{ nx: true, ex: 24 * 60 * 60 },
			);
			if (!isNew) {
				res.status(202).end();
				return;
			}
		}
		await redis.incr(["pageviews", "projects", slug].join(":"));
	} catch {
		// Best-effort counter — swallow Redis errors.
	}
	res.status(202).end();
}
