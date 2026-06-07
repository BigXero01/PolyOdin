import { NextRequest } from 'next/server';
import { getMarket } from '@/lib/polymarket';
import { successResponse, serverErrorResponse, notFoundResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const market = await getMarket(params.id);
    if (!market) return notFoundResponse('Market');
    return successResponse({ market });
  } catch (error) {
    if ((error as Error).message.includes('404')) return notFoundResponse('Market');
    return serverErrorResponse(error);
  }
}
