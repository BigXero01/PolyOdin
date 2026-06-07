import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, notFoundResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import { updatePortfolio } from '@/lib/portfolio';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const transaction = await db.transaction.findFirst({
      where: { id: params.id, userId: user.id, type: 'WITHDRAWAL', status: 'PENDING' },
    });

    if (!transaction) return notFoundResponse('Transaction');

    const confirmed = await db.transaction.update({
      where: { id: params.id },
      data: {
        status: 'PROCESSING',
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'WITHDRAWAL_CONFIRMED',
      resource: 'Transaction',
      resourceId: params.id,
      details: { amount: Number(transaction.amount) },
    });

    return successResponse({ transaction: confirmed });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
