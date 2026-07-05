// middleware/loginRateLimit.ts
// Simple in‑memory rate limiter for login attempts.
// Allows up to 5 attempts per 15 minutes per username.

interface RateInfo {
  timestamps: number[]; // epoch ms of recent attempts
}

const RATE_LIMIT = 5; // max attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginMap: Map<string, RateInfo> = new Map();

/**
 * Checks whether a login attempt for the given username is allowed.
 * Returns true if the attempt is within the allowed quota, otherwise false.
 */
export async function ensureLoginAllowed(username: string): Promise<boolean> {
  const now = Date.now();
  const info = loginMap.get(username) ?? { timestamps: [] };
  // Remove timestamps older than the window
  info.timestamps = info.timestamps.filter((ts) => now - ts < WINDOW_MS);
  if (info.timestamps.length >= RATE_LIMIT) {
    // Too many attempts in the window
    return false;
  }
  // Record this attempt and allow
  info.timestamps.push(now);
  loginMap.set(username, info);
  return true;
}
