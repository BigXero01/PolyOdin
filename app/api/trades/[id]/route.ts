import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const trade = await db.trade.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!trade) return notFoundResponse('Trade');
    return successResponse({ trade });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
