import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getMarketPrices } from '@/lib/polymarket';
import { successResponse, unauthorizedResponse, notFoundResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import { updatePortfolio } from '@/lib/portfolio';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const trade = await db.trade.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!trade) return notFoundResponse('Trade');
    if (trade.status === 'CLOSED') return errorResponse('Trade is already closed', 400);

    const prices = await getMarketPrices(trade.marketId);
    const currentPrice = parseFloat(prices[trade.outcome] ?? '0');
    const exitAmount = Number(trade.shares) * currentPrice;
    const pnl = exitAmount - Number(trade.entryAmount);
    const pnlPercent = (pnl / Number(trade.entryAmount)) * 100;

    const closedTrade = await db.trade.update({
      where: { id: params.id },
      data: {
        exitPrice: currentPrice,
        exitAmount,
        pnl,
        pnlPercent,
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });

    await updatePortfolio(user.id);

    await createAuditLog({
      userId: user.id,
      action: 'TRADE_CLOSED',
      resource: 'Trade',
      resourceId: trade.id,
      details: { exitPrice: currentPrice, pnl },
    });

    return successResponse({ trade: closedTrade });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
