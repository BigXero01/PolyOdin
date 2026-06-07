import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { buildSiweMessage, generateNonce } from '@/lib/siwe';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { connectWalletSchema } from '@/lib/validations';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const rateLimitKey = getRateLimitKey(request);
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return errorResponse('Too many requests', 429);
  }

  try {
    const body = await request.json() as unknown;
    const { walletAddress } = connectWalletSchema.parse(body);
    const normalizedAddress = walletAddress.toLowerCase();

    const nonce = generateNonce();

    const user = await db.user.upsert({
      where: { walletAddress: normalizedAddress },
      create: {
        walletAddress: normalizedAddress,
        nonce,
        preferences: { create: {} },
      },
      update: { nonce },
    });

    const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '137');
    const message = buildSiweMessage({
      walletAddress: normalizedAddress,
      nonce,
      chainId,
    });

    return successResponse({ message, nonce, userId: user.id });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('Failed to generate signing message', 500);
  }
}
