'use client';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, Shield, Zap, Globe } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const { connectAndAuth, isConnecting } = useWallet();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast({
        variant: 'destructive',
        title: 'Session expired',
        description: 'Your session has expired. Please reconnect your wallet.',
      });
    }
  }, [searchParams, toast]);

  const features = [
    { icon: Shield, text: 'Secure MetaMask authentication' },
    { icon: Zap, text: 'Real-time market data' },
    { icon: Globe, text: 'Trade any prediction market' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">Web3 Native</Badge>
            <Badge variant="secondary" className="text-xs">Non-custodial</Badge>
          </div>
          <CardTitle className="text-xl">Connect Wallet</CardTitle>
          <CardDescription>
            Sign a message with MetaMask to verify ownership — no password required
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => connectAndAuth.mutate()}
            disabled={isConnecting}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect with MetaMask
              </>
            )}
          </Button>

          <div className="space-y-2">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        <p>Don&apos;t have MetaMask?{' '}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Install it here
          </a>
        </p>
      </div>
    </div>
  );
}
