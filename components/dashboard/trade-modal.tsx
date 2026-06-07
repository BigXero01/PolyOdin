'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useExecuteTrade } from '@/hooks/use-trades';
import { formatCurrency } from '@/lib/utils';
import type { PolymarketMarket } from '@/lib/polymarket';

interface TradeModalProps {
  market: PolymarketMarket;
  open: boolean;
  onClose: () => void;
}

export function TradeModal({ market, open, onClose }: TradeModalProps) {
  const [outcome, setOutcome] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState('');
  const executeTrade = useExecuteTrade();

  const yesToken = market.tokens.find((t) => t.outcome === 'Yes');
  const noToken = market.tokens.find((t) => t.outcome === 'No');
  const selectedToken = outcome === 'YES' ? yesToken : noToken;
  const price = selectedToken ? parseFloat(selectedToken.price) : 0;
  const estimatedShares = amount ? parseFloat(amount) / price : 0;
  const estimatedPayout = estimatedShares;

  const handleTrade = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return;

    executeTrade.mutate(
      {
        marketId: market.id,
        outcome,
        amount: amountNum,
        maxPrice: price,
        slippage: 1,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base line-clamp-2">{market.title}</DialogTitle>
          <DialogDescription>
            Place a trade on this prediction market
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Outcome selection */}
          <div className="space-y-2">
            <Label>Select Outcome</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={outcome === 'YES' ? 'default' : 'outline'}
                onClick={() => setOutcome('YES')}
                className={outcome === 'YES' ? 'bg-green-600 hover:bg-green-700 border-green-600' : ''}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                YES {yesToken ? `${(parseFloat(yesToken.price) * 100).toFixed(1)}¢` : ''}
              </Button>
              <Button
                variant={outcome === 'NO' ? 'default' : 'outline'}
                onClick={() => setOutcome('NO')}
                className={outcome === 'NO' ? 'bg-red-600 hover:bg-red-700 border-red-600' : ''}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                NO {noToken ? `${(parseFloat(noToken.price) * 100).toFixed(1)}¢` : ''}
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Trade summary */}
          {amount && parseFloat(amount) > 0 && (
            <div className="rounded-lg border border-border p-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Entry price</span>
                <span>{(price * 100).toFixed(1)}¢</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shares</span>
                <span>{estimatedShares.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Max payout</span>
                <span className="text-green-500">{formatCurrency(estimatedPayout)}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleTrade}
            disabled={!amount || parseFloat(amount) <= 0 || executeTrade.isPending}
            className="w-full"
          >
            {executeTrade.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing trade...
              </>
            ) : (
              `Buy ${outcome} for ${amount ? formatCurrency(parseFloat(amount)) : '$0.00'}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
