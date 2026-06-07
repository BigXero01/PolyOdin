'use client';

import type { User, Portfolio, Trade, Transaction } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import {
  formatCurrency,
  formatPercent,
  formatDateTime,
  getPnLColor,
  getStatusColor,
  formatAddress,
} from '@/lib/utils';
import Link from 'next/link';
import { usePortfolio } from '@/hooks/use-portfolio';
import { PortfolioChart } from '@/components/dashboard/portfolio-chart';

interface DashboardOverviewProps {
  user: User;
  portfolio: Portfolio | null;
  recentTrades: Trade[];
  recentTransactions: Transaction[];
}

export function DashboardOverview({
  user,
  portfolio: initialPortfolio,
  recentTrades,
  recentTransactions,
}: DashboardOverviewProps) {
  const { data, isLoading } = usePortfolio();
  const portfolio = data?.portfolio ?? initialPortfolio;

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(portfolio?.totalValue ?? null),
      change: portfolio ? formatPercent(Number(portfolio.dayPnLPercent)) : null,
      icon: DollarSign,
      positive: portfolio ? Number(portfolio.dayPnL) >= 0 : null,
    },
    {
      title: 'Day P&L',
      value: formatCurrency(portfolio?.dayPnL ?? null),
      change: portfolio ? formatPercent(Number(portfolio.dayPnLPercent)) : null,
      icon: portfolio && Number(portfolio.dayPnL) >= 0 ? TrendingUp : TrendingDown,
      positive: portfolio ? Number(portfolio.dayPnL) >= 0 : null,
    },
    {
      title: 'Total P&L',
      value: formatCurrency(portfolio?.totalPnL ?? null),
      change: portfolio ? formatPercent(Number(portfolio.totalPnLPercent)) : null,
      icon: Activity,
      positive: portfolio ? Number(portfolio.totalPnL) >= 0 : null,
    },
    {
      title: 'Win Rate',
      value: portfolio ? `${Number(portfolio.winRate).toFixed(1)}%` : '—',
      change: portfolio ? `${portfolio.winningTrades}/${portfolio.totalTrades} trades` : null,
      icon: TrendingUp,
      positive: portfolio ? Number(portfolio.winRate) >= 50 : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user.displayName ?? formatAddress(user.walletAddress)}
        </h1>
        <p className="text-muted-foreground">Here&apos;s your trading overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change && (
                    <p
                      className={`text-xs mt-1 ${
                        stat.positive === true
                          ? 'text-green-500'
                          : stat.positive === false
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stat.change}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PortfolioChart />
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link href="/dashboard/markets">
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse Markets
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/portfolio">
                <Activity className="mr-2 h-4 w-4" />
                View Portfolio
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/trades">
                <ExternalLink className="mr-2 h-4 w-4" />
                Trade History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent trades + Recent transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Trades</CardTitle>
              <CardDescription>Your last 5 trades</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/trades">
                View all <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTrades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No trades yet.{' '}
                <Link href="/dashboard/markets" className="text-primary underline">
                  Browse markets
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium truncate">{trade.marketName}</p>
                      <p className="text-muted-foreground text-xs">
                        {trade.outcome} · {formatDateTime(trade.openedAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium">{formatCurrency(trade.entryAmount)}</p>
                      {trade.pnl !== null && (
                        <p className={`text-xs ${getPnLColor(Number(trade.pnl))}`}>
                          {formatCurrency(trade.pnl)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <CardDescription>Deposits &amp; withdrawals</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-muted-foreground text-xs">
                        {tx.method} · {formatDateTime(tx.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p
                        className={`font-medium ${
                          tx.type === 'WITHDRAWAL' ? 'text-red-500' : 'text-green-500'
                        }`}
                      >
                        {tx.type === 'WITHDRAWAL' ? '-' : '+'}
                        {formatCurrency(tx.amount)}
                      </p>
                      <Badge className={getStatusColor(tx.status)} variant="outline">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
