'use client';

import { useQuery } from '@tanstack/react-query';

export function useMarkets(params?: { limit?: number; offset?: number; category?: string }) {
  return useQuery({
    queryKey: ['markets', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      if (params?.category) searchParams.set('category', params.category);

      const res = await fetch(`/api/markets?${searchParams}`);
      if (!res.ok) throw new Error('Failed to fetch markets');
      const data = await res.json() as { data: { markets: unknown[] } };
      return data.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useMarket(id: string) {
  return useQuery({
    queryKey: ['markets', id],
    queryFn: async () => {
      const res = await fetch(`/api/markets/${id}`);
      if (!res.ok) throw new Error('Failed to fetch market');
      const data = await res.json() as { data: { market: unknown } };
      return data.data.market;
    },
    staleTime: 15000,
    refetchInterval: 30000,
  });
}

export function useMarketPrices(id: string) {
  return useQuery({
    queryKey: ['markets', id, 'prices'],
    queryFn: async () => {
      const res = await fetch(`/api/markets/${id}/prices`);
      if (!res.ok) throw new Error('Failed to fetch prices');
      const data = await res.json() as { data: { prices: Record<string, string> } };
      return data.data.prices;
    },
    staleTime: 5000,
    refetchInterval: 10000,
  });
}
