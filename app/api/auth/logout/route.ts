import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { clearAuthCookies } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();

  if (user) {
    await createAuditLog({
      userId: user.id,
      action: 'LOGOUT',
      resource: 'User',
      resourceId: user.id,
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });
  }

  const response = NextResponse.json({ data: { success: true }, error: null });
  clearAuthCookies(response);
  return response;
}
