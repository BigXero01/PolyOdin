import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import { stripe } from '@/lib/stripe';
import { updatePortfolio } from '@/lib/portfolio';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as { sessionId: string; paymentIntentId: string };
    const { sessionId, paymentIntentId } = body;

    const transaction = await db.transaction.findFirst({
      where: {
        userId: user.id,
        stripeId: paymentIntentId,
        status: 'PENDING',
      },
    });

    if (!transaction) return errorResponse('Transaction not found', 404);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return errorResponse('Payment not completed', 400);
    }

    const completed = await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await updatePortfolio(user.id);

    await createAuditLog({
      userId: user.id,
      action: 'DEPOSIT_COMPLETED',
      resource: 'Transaction',
      resourceId: transaction.id,
      details: { amount: Number(transaction.amount), method: 'APPLE_PAY' },
    });

    return successResponse({ transaction: completed });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
