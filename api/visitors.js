import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const LIFETIME_KEY = "sgpa:lifetime_visitors";
const SEEN_KEY_PREFIX = "sgpa:seen:";
const SEEN_TTL_SECONDS = 86400; // 24 hours

const redis = Redis.fromEnv();

// Sliding window: max 10 requests per IP per 60 seconds
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "sgpa:rl",
  analytics: false,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Resolve client IP
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  // --- Rate limit check ---
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", reset);

  if (!success) {
    res.setHeader("Retry-After", Math.ceil((reset - Date.now()) / 1000));
    return res.status(429).json({ error: "Too many requests. Slow down." });
  }
  // --- End rate limit ---

  try {
    const seenKey = `${SEEN_KEY_PREFIX}${ip}`;

    // Check if this IP has visited in the last 24h
    const alreadySeen = await redis.get(seenKey);

    let count;
    if (!alreadySeen) {
      // New unique visitor — atomically increment and mark as seen
      const pipeline = redis.pipeline();
      pipeline.incr(LIFETIME_KEY);
      pipeline.set(seenKey, "1", { ex: SEEN_TTL_SECONDS });
      const results = await pipeline.exec();
      count = results[0]; // INCR result is the new count
    } else {
      // Returning visitor — just read the current count
      count = await redis.get(LIFETIME_KEY);
    }

    // Cache at CDN edge for 60s to avoid hammering Redis
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json({ count: Number(count) || 0 });
  } catch (error) {
    console.error("[visitors] Redis error:", error);
    return res.status(200).json({ count: null });
  }
}
