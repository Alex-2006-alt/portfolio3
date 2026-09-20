/**
 * In-memory sliding-window rate limiter.
 *
 * Suitable for single-instance deployments.
 * For multi-instance (e.g. Vercel serverless), replace with Redis/Upstash.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxAttempts: 10 });
 *   const result = limiter.check(identifier);
 *   if (!result.allowed) { return error with result.retryAfterMs }
 */

interface RateLimiterOptions {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of attempts within the window */
  maxAttempts: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

interface RateLimitEntry {
  timestamps: number[];
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxAttempts } = options;
  const store = new Map<string, RateLimitEntry>();

  // Periodically clean up stale entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of Array.from(store.entries())) {
      entry.timestamps = entry.timestamps.filter((t: number) => now - t < windowMs);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, windowMs);

  // Allow cleanup interval to not prevent process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      let entry = store.get(identifier);

      if (!entry) {
        entry = { timestamps: [] };
        store.set(identifier, entry);
      }

      // Remove timestamps outside the current window
      entry.timestamps = entry.timestamps.filter((t: number) => now - t < windowMs);

      if (entry.timestamps.length >= maxAttempts) {
        const oldestInWindow = entry.timestamps[0];
        const retryAfterMs = oldestInWindow + windowMs - now;
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: Math.max(retryAfterMs, 0),
        };
      }

      entry.timestamps.push(now);
      return {
        allowed: true,
        remaining: maxAttempts - entry.timestamps.length,
        retryAfterMs: 0,
      };
    },

    /** Reset the limiter for a specific identifier (e.g., after successful login) */
    reset(identifier: string): void {
      store.delete(identifier);
    },
  };
}

// Pre-configured limiters for common use cases

/** Login rate limiter: 5 attempts per 15 minutes per IP/email */
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxAttempts: 5,
});

/** Upload rate limiter: 20 uploads per 10 minutes per user */
export const uploadRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxAttempts: 20,
});
