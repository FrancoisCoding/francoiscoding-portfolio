interface IRateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface IRateLimitEntry {
  count: number;
  resetAt: number;
}

interface IRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const rateLimitStore = new Map<string, IRateLimitEntry>();

export function enforceRateLimit({
  key,
  limit,
  windowMs,
}: IRateLimitOptions): IRateLimitResult {
  const now = Date.now();

  for (const [entryKey, entryValue] of rateLimitStore.entries()) {
    if (entryValue.resetAt <= now) {
      rateLimitStore.delete(entryKey);
    }
  }

  const existingEntry = rateLimitStore.get(key);

  if (!existingEntry || existingEntry.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existingEntry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existingEntry.resetAt - now) / 1000),
      ),
    };
  }

  existingEntry.count += 1;
  rateLimitStore.set(key, existingEntry);

  return { allowed: true, retryAfterSeconds: 0 };
}
