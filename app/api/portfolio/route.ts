import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response';
import { updatePortfolio } from '@/lib/portfolio';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    await updatePortfolio(user.id);

    const portfolio = await db.portfolio.findUnique({
      where: { userId: user.id },
    });

    const openTrades = await db.trade.count({
      where: { userId: user.id, status: 'OPEN' },
    });

    return successResponse({
      portfolio,
      openPositions: openTrades,
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
