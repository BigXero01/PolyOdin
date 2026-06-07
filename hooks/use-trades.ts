'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export function useTrades(params?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: ['trades', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const res = await fetch(`/api/trades?${searchParams}`);
      if (!res.ok) throw new Error('Failed to fetch trades');
      const data = await res.json() as { data: { trades: unknown[]; total: number } };
      return data.data;
    },
    staleTime: 15000,
  });
}

export function useExecuteTrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      marketId: string;
      outcome: 'YES' | 'NO';
      amount: number;
      maxPrice: number;
      slippage?: number;
    }) => {
      const res = await fetch('/api/trades/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json() as { data?: { trade: unknown }; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? 'Trade failed');
      return data.data!.trade;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({ title: 'Trade executed', description: 'Your trade was placed successfully' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Trade failed', description: error.message });
    },
  });
}

export function useCloseTrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tradeId: string) => {
      const res = await fetch(`/api/trades/${tradeId}/close`, { method: 'POST' });
      const data = await res.json() as { data?: { trade: unknown }; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to close trade');
      return data.data!.trade;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({ title: 'Position closed', description: 'Your position was closed successfully' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Close failed', description: error.message });
    },
  });
}
