import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-response';
import { withdrawInitSchema } from '@/lib/validations';
import { createAuditLog } from '@/lib/audit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as unknown;
    const { amount, method, destination, currency } = withdrawInitSchema.parse(body);

    const portfolio = await db.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return errorResponse('Portfolio not found', 404);

    const availableCash = Number(portfolio.cash);
    if (amount > availableCash) {
      return errorResponse(`Insufficient funds. Available: ${availableCash}`, 400);
    }

    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        type: 'WITHDRAWAL',
        method: method as 'APPLE_PAY' | 'BANK_TRANSFER' | 'CRYPTO',
        amount,
        currency,
        status: 'PENDING',
        toAddress: destination,
        metadata: { destination },
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'WITHDRAWAL_INITIATED',
      resource: 'Transaction',
      resourceId: transaction.id,
      details: { amount, method },
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    return successResponse({ transaction }, 201);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return serverErrorResponse(error);
  }
}
