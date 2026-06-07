import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createPaymentIntent } from '@/lib/stripe';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response';
import { applePayInitSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as unknown;
    const { amount, currency } = applePayInitSchema.parse(body);

    const sessionId = nanoid();
    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      userId: user.id,
      metadata: { sessionId, type: 'deposit', method: 'apple_pay' },
    });

    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        type: 'DEPOSIT',
        method: 'APPLE_PAY',
        amount,
        currency,
        status: 'PENDING',
        stripeId: paymentIntent.id,
        metadata: { sessionId },
      },
    });

    return successResponse({
      sessionId,
      transactionId: transaction.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      currency,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return serverErrorResponse(error);
  }
}
