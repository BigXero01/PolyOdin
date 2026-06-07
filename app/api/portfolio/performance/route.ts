import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const trades = await db.trade.findMany({
      where: { userId: user.id, status: 'CLOSED' },
      orderBy: { closedAt: 'asc' },
    });

    const byMarket = trades.reduce<Record<string, { pnl: number; trades: number }>>((acc, t) => {
      if (!acc[t.marketName]) acc[t.marketName] = { pnl: 0, trades: 0 };
      acc[t.marketName].pnl += Number(t.pnl ?? 0);
      acc[t.marketName].trades++;
      return acc;
    }, {});

    const monthlyPnL = trades.reduce<Record<string, number>>((acc, t) => {
      if (!t.closedAt) return acc;
      const key = t.closedAt.toISOString().slice(0, 7);
      acc[key] = (acc[key] ?? 0) + Number(t.pnl ?? 0);
      return acc;
    }, {});

    return successResponse({
      byMarket: Object.entries(byMarket).map(([market, data]) => ({
        market,
        ...data,
      })),
      monthly: Object.entries(monthlyPnL).map(([month, pnl]) => ({ month, pnl })),
      totalTrades: trades.length,
      winRate:
        trades.length > 0
          ? (trades.filter((t) => Number(t.pnl ?? 0) > 0).length / trades.length) * 100
          : 0,
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
