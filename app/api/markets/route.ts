import { NextRequest } from 'next/server';
import { getMarkets } from '@/lib/polymarket';
import { successResponse, serverErrorResponse } from '@/lib/api-response';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { allowed } = checkRateLimit(getRateLimitKey(request));
  if (!allowed) return new Response('Too many requests', { status: 429 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const category = searchParams.get('category') ?? undefined;

  try {
    const markets = await getMarkets({ limit, offset, category, active: true });
    return successResponse({ markets, total: markets.length, limit, offset });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
