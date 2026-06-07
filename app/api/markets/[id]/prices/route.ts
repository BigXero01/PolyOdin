import { NextRequest } from 'next/server';
import { getMarketPrices } from '@/lib/polymarket';
import { successResponse, serverErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const prices = await getMarketPrices(params.id);
    return successResponse({
      marketId: params.id,
      prices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
