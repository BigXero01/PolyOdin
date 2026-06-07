import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'OPEN' | 'CLOSED' | 'PARTIAL' | null;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const marketId = searchParams.get('marketId');

  try {
    const where = {
      userId: user.id,
      ...(status ? { status } : {}),
      ...(marketId ? { marketId } : {}),
    };

    const [trades, total] = await Promise.all([
      db.trade.findMany({
        where,
        orderBy: { openedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.trade.count({ where }),
    ]);

    return successResponse({ trades, total, limit, offset });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
