import type { Metadata } from 'next';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { DashboardOverview } from '@/components/dashboard/overview';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [portfolio, recentTrades, recentTransactions] = await Promise.all([
    db.portfolio.findUnique({ where: { userId: user.id } }),
    db.trade.findMany({
      where: { userId: user.id },
      orderBy: { openedAt: 'desc' },
      take: 5,
    }),
    db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <DashboardOverview
      user={user}
      portfolio={portfolio}
      recentTrades={recentTrades}
      recentTransactions={recentTransactions}
    />
  );
}
