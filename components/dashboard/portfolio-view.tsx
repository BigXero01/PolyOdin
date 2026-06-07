'use client';

import { usePortfolio, usePortfolioPerformance } from '@/hooks/use-portfolio';
import { useTrades } from '@/hooks/use-trades';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatPercent, getPnLColor } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { Trade } from '@prisma/client';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface PortfolioRecord {
  totalValue: number;
  cash: number;
  invested: number;
  winRate: number;
  dayPnL: number;
  dayPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

interface PerformanceData {
  monthly: Array<{ month: string; pnl: number }>;
}

export function PortfolioView() {
  const { data: portfolioData, isLoading } = usePortfolio();
  const { data: performance } = usePortfolioPerformance();
  const { data: tradesData } = useTrades({ status: 'OPEN' });

  const portfolio = (portfolioData as { portfolio: PortfolioRecord | null } | undefined)?.portfolio;
  const openTrades = (tradesData?.trades as Trade[] | undefined) ?? [];

  const allocationData = portfolio
    ? [
        { name: 'Cash', value: Number(portfolio.cash), color: COLORS[0] },
        { name: 'Invested', value: Number(portfolio.invested), color: COLORS[1] },
      ].filter((d) => d.value > 0)
    : [];

  const monthlyData = (performance as PerformanceData | undefined)?.monthly ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Your investment portfolio overview</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: formatCurrency(portfolio?.totalValue ?? null) },
          { label: 'Cash Available', value: formatCurrency(portfolio?.cash ?? null) },
          { label: 'Invested', value: formatCurrency(portfolio?.invested ?? null) },
          { label: 'Win Rate', value: portfolio ? `${Number(portfolio.winRate).toFixed(1)}%` : '—' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-7 w-20" /> : <p className="text-xl font-bold">{value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : allocationData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">No allocation data yet</p>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {allocationData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly P&L */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly P&amp;L</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">No monthly data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${v}`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Open positions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Positions ({openTrades.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {openTrades.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-6">No open positions</p>
          ) : (
            <div className="space-y-3">
              {openTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium truncate">{trade.marketName}</p>
                    <p className="text-xs text-muted-foreground">
                      {trade.outcome} · Entry: {(Number(trade.entryPrice) * 100).toFixed(1)}¢
                    </p>
                    <Progress
                      value={Number(trade.entryPrice) * 100}
                      className="h-1 mt-1"
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{formatCurrency(trade.entryAmount)}</p>
                    <p className="text-xs text-muted-foreground">{Number(trade.shares).toFixed(2)} shares</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
