import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/', '/features', '/pricing', '/blog', '/contact', '/api/health', '/api/config'];
const AUTH_ROUTES = ['/login'];
const PROTECTED_PREFIX = '/dashboard';
const API_AUTH_PREFIX = '/api/auth';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret-change-me');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '').split(',');

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  // Skip auth for public routes and auth endpoints
  if (
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/')) ||
    pathname.startsWith(API_AUTH_PREFIX) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return response;
  }

  // Check authentication for dashboard routes
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const lastActivity = payload.lastActivity as number;
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;

      if (now - lastActivity > fifteenMinutes) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('expired', 'true');
        const redirectResponse = NextResponse.redirect(loginUrl);
        redirectResponse.cookies.delete('auth_token');
        return redirectResponse;
      }

      // Refresh the activity timestamp
      response.headers.set('X-User-Id', payload.sub as string);
      return response;
    } catch {
      const loginUrl = new URL('/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('auth_token');
      return redirectResponse;
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname)) {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Invalid token, let them proceed to login
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
