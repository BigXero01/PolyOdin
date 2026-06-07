'use client';

import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const connectAndAuth = useMutation({
    mutationFn: async () => {
      const metamaskConnector = connectors.find((c) => c.id === 'metaMask');
      if (!metamaskConnector) throw new Error('MetaMask not found. Please install MetaMask.');

      await connect({ connector: metamaskConnector });

      const accounts = await (window as Window & { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum?.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts?.[0];
      if (!walletAddress) throw new Error('No wallet address found');

      const connectRes = await fetch('/api/auth/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      const connectData = await connectRes.json() as { data?: { message: string }; error?: string };
      if (!connectRes.ok || connectData.error) throw new Error(connectData.error ?? 'Connection failed');

      const signature = await signMessageAsync({ message: connectData.data!.message });

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, signature, message: connectData.data!.message }),
      });

      const verifyData = await verifyRes.json() as { data?: { user: unknown }; error?: string };
      if (!verifyRes.ok || verifyData.error) throw new Error(verifyData.error ?? 'Verification failed');

      return verifyData.data!.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
      toast({ title: 'Connected', description: 'Wallet connected successfully' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Connection failed', description: error.message });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      disconnect();
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/');
      toast({ title: 'Disconnected', description: 'Wallet disconnected' });
    },
  });

  return {
    address,
    isConnected,
    chain,
    connectAndAuth,
    logout,
    isConnecting: connectAndAuth.isPending,
    isLoggingOut: logout.isPending,
  };
}
