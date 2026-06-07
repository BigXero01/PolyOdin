import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret-change-me-in-production');
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret');

export interface JWTPayload {
  sub: string;
  walletAddress: string;
  email?: string;
  lastActivity: number;
  iat: number;
  exp: number;
}

export async function signAccessToken(userId: string, walletAddress: string, email?: string): Promise<string> {
  return new SignJWT({
    walletAddress,
    email,
    lastActivity: Date.now(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;
  if (now - payload.lastActivity > fifteenMinutes) return null;

  const user = await db.user.findUnique({
    where: { id: payload.sub },
    include: { preferences: true, portfolio: true },
  });

  return user;
}

export function setAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
): void {
  const isProduction = process.env.NODE_ENV === 'production';

  response.headers.append(
    'Set-Cookie',
    `auth_token=${accessToken}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=900`,
  );
  response.headers.append(
    'Set-Cookie',
    `refresh_token=${refreshToken}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict; Path=/api/auth; Max-Age=604800`,
  );
}

export function clearAuthCookies(response: Response): void {
  response.headers.append('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0');
  response.headers.append('Set-Cookie', 'refresh_token=; HttpOnly; Path=/api/auth; Max-Age=0');
}
