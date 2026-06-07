import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyEthSignature } from '@/lib/siwe';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { errorResponse, validationErrorResponse } from '@/lib/api-response';
import { verifySignatureSchema } from '@/lib/validations';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit';
import { generateNonce } from '@/lib/siwe';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const rateLimitKey = getRateLimitKey(request);
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) return errorResponse('Too many requests', 429);

  try {
    const body = await request.json() as unknown;
    const { walletAddress, signature, message } = verifySignatureSchema.parse(body);
    const normalizedAddress = walletAddress.toLowerCase();

    const isValid = await verifyEthSignature({ walletAddress: normalizedAddress, signature, message });
    if (!isValid) return errorResponse('Invalid signature', 401);

    const newNonce = generateNonce();
    const user = await db.user.update({
      where: { walletAddress: normalizedAddress },
      data: {
        nonce: newNonce,
        loginCount: { increment: 1 },
        lastLogin: new Date(),
      },
      include: { preferences: true, portfolio: true },
    });

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(user.id, user.walletAddress, user.email ?? undefined),
      signRefreshToken(user.id),
    ]);

    const response = NextResponse.json({
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          preferences: user.preferences,
        },
      },
      error: null,
    });

    setAuthCookies(response, accessToken, refreshToken);

    await createAuditLog({
      userId: user.id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user.id,
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('Authentication failed', 500);
  }
}
