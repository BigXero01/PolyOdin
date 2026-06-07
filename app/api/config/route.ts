import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      appName: 'PolyOdin',
      appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '137'),
      wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3000',
      features: {
        trading: true,
        deposits: true,
        withdrawals: true,
        portfolio: true,
      },
      limits: {
        minDeposit: 0,
        minWithdrawal: 0,
        maxWithdrawal: null,
      },
    },
    error: null,
  });
}
