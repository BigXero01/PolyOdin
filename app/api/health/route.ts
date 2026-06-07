import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();

  let dbStatus = 'unknown';
  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'ok';
  } catch {
    dbStatus = 'error';
  }

  return NextResponse.json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: Date.now() - start,
    services: {
      database: dbStatus,
      api: 'ok',
    },
    version: process.env.npm_package_version ?? '1.0.0',
  });
}
