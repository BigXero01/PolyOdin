import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const type = searchParams.get('type');

  try {
    const where = {
      userId: user.id,
      ...(type ? { type: type as 'DEPOSIT' | 'WITHDRAWAL' } : {}),
    };

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.transaction.count({ where }),
    ]);

    return successResponse({ transactions, total, limit, offset });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
