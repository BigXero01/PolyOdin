'use client';

import { useQuery } from '@tanstack/react-query';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      const data = await res.json() as { data: { portfolio: unknown; openPositions: number } };
      return data.data;
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

export function usePortfolioHistory(days = 30) {
  return useQuery({
    queryKey: ['portfolio', 'history', days],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio/history?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json() as { data: { history: unknown[] } };
      return data.data.history;
    },
    staleTime: 60000,
  });
}

export function usePortfolioPerformance() {
  return useQuery({
    queryKey: ['portfolio', 'performance'],
    queryFn: async () => {
      const res = await fetch('/api/portfolio/performance');
      if (!res.ok) throw new Error('Failed to fetch performance');
      const data = await res.json() as { data: unknown };
      return data.data;
    },
    staleTime: 60000,
  });
}
