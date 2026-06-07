import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getMarket } from '@/lib/polymarket';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response';
import { executeTradeSchema } from '@/lib/validations';
import { updatePortfolio } from '@/lib/portfolio';
import { createAuditLog } from '@/lib/audit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as unknown;
    const { marketId, outcome, amount, maxPrice, slippage } = executeTradeSchema.parse(body);

    const market = await getMarket(marketId);
    if (!market) return errorResponse('Market not found', 404);
    if (!market.active) return errorResponse('Market is not active', 400);

    const token = market.tokens.find(
      (t) => t.outcome.toUpperCase() === outcome,
    );
    if (!token) return errorResponse('Invalid outcome for this market', 400);

    const currentPrice = parseFloat(token.price);
    const slippageFactor = 1 + slippage / 100;
    const maxAllowedPrice = Math.min(maxPrice * slippageFactor, 1);

    if (currentPrice > maxAllowedPrice) {
      return errorResponse(
        `Price ${currentPrice} exceeds maximum allowed ${maxAllowedPrice} with slippage`,
        400,
      );
    }

    const shares = amount / currentPrice;

    const trade = await db.trade.create({
      data: {
        userId: user.id,
        marketId,
        marketName: market.title,
        marketSlug: market.slug,
        outcome,
        entryPrice: currentPrice,
        entryAmount: amount,
        shares,
        status: 'OPEN',
      },
    });

    await updatePortfolio(user.id);

    await createAuditLog({
      userId: user.id,
      action: 'TRADE_EXECUTED',
      resource: 'Trade',
      resourceId: trade.id,
      details: { marketId, outcome, amount, price: currentPrice },
    });

    return successResponse({ trade }, 201);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return serverErrorResponse(error);
  }
}
