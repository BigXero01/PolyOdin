import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000');
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100');

export function getRateLimitKey(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown';
  return `ip:${ip}`;
}

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, reset: now + WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, reset: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, reset: entry.resetTime };
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  options?: { maxRequests?: number },
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    const key = getRateLimitKey(req);
    const { allowed, remaining, reset } = checkRateLimit(key);

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests', retryAfter: Math.ceil((reset - Date.now()) / 1000) }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(options?.maxRequests ?? MAX_REQUESTS),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
          },
        },
      );
    }

    const response = await handler(req);
    response.headers.set('X-RateLimit-Limit', String(options?.maxRequests ?? MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(reset / 1000)));
    return response;
  };
}
