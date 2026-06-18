export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 50) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) ?? [];

    // Remove old requests outside the window
    const recentRequests = timestamps.filter(t => now - t < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  getRemaining(key: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(key) ?? [];
    const recentRequests = timestamps.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

export const apiRateLimiter = {
  gemini: new RateLimiter(60000, 50),      // 50 req/min
  fireworks: new RateLimiter(60000, 100),  // 100 req/min
  siliconflow: new RateLimiter(60000, 100),
  cohere: new RateLimiter(60000, 100),
  groq: new RateLimiter(60000, 30),
};
