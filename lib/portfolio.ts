import { db } from './db';
import type { Trade, Transaction } from '@prisma/client';

export interface PortfolioMetrics {
  totalValue: number;
  cash: number;
  invested: number;
  dayPnL: number;
  dayPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  sharpeRatio: number | null;
  maxDrawdown: number | null;
}

export async function calculatePortfolioMetrics(userId: string): Promise<PortfolioMetrics> {
  const [trades, transactions, portfolio] = await Promise.all([
    db.trade.findMany({ where: { userId } }),
    db.transaction.findMany({
      where: { userId, status: 'COMPLETED' },
    }),
    db.portfolio.findUnique({ where: { userId } }),
  ]);

  const deposits = transactions
    .filter((t) => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const withdrawals = transactions
    .filter((t) => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const openTrades = trades.filter((t) => t.status === 'OPEN');
  const closedTrades = trades.filter((t) => t.status === 'CLOSED');

  const invested = openTrades.reduce((sum, t) => sum + Number(t.entryAmount), 0);
  const cash = Math.max(0, deposits - withdrawals - invested);

  const realizedPnL = closedTrades.reduce((sum, t) => sum + Number(t.pnl ?? 0), 0);

  const winningTrades = closedTrades.filter((t) => Number(t.pnl ?? 0) > 0).length;
  const losingTrades = closedTrades.filter((t) => Number(t.pnl ?? 0) < 0).length;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;

  const totalValue = cash + invested + realizedPnL;
  const totalPnL = realizedPnL;
  const totalCost = deposits;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTrades = closedTrades.filter(
    (t) => t.closedAt && t.closedAt >= todayStart,
  );
  const dayPnL = todayTrades.reduce((sum, t) => sum + Number(t.pnl ?? 0), 0);
  const dayPnLPercent = totalValue > 0 ? (dayPnL / totalValue) * 100 : 0;

  return {
    totalValue,
    cash,
    invested,
    dayPnL,
    dayPnLPercent,
    totalPnL,
    totalPnLPercent,
    winRate,
    totalTrades: trades.length,
    winningTrades,
    losingTrades,
    sharpeRatio: null,
    maxDrawdown: null,
  };
}

export async function updatePortfolio(userId: string): Promise<void> {
  const metrics = await calculatePortfolioMetrics(userId);

  await db.portfolio.upsert({
    where: { userId },
    create: {
      userId,
      ...metrics,
    },
    update: metrics,
  });

  await db.portfolioHistory.create({
    data: {
      portfolio: { connect: { userId } },
      totalValue: metrics.totalValue,
      cash: metrics.cash,
      invested: metrics.invested,
      dayPnL: metrics.dayPnL,
    },
  });
}
