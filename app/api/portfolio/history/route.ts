import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') ?? '30');

  try {
    const portfolio = await db.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return successResponse({ history: [] });

    const since = new Date();
    since.setDate(since.getDate() - Math.min(days, 365));

    const history = await db.portfolioHistory.findMany({
      where: {
        portfolioId: portfolio.id,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: 'asc' },
    });

    return successResponse({ history });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
