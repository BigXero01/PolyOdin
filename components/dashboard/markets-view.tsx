'use client';

import { useState } from 'react';
import { useMarkets } from '@/hooks/use-markets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TradeModal } from '@/components/dashboard/trade-modal';
import type { PolymarketMarket } from '@/lib/polymarket';

const CATEGORIES = [
  'All',
  'Politics',
  'Sports',
  'Crypto',
  'Finance',
  'Science',
  'Entertainment',
];

export function MarketsView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState<PolymarketMarket | null>(null);

  const { data, isLoading, error } = useMarkets({
    limit: 50,
    category: category === 'All' ? undefined : category,
  });

  const markets = (data?.markets as PolymarketMarket[] | undefined) ?? [];

  const filtered = markets.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="text-muted-foreground">Browse and trade prediction markets in real-time</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className="shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Markets grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Failed to load markets. Please try again.
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No markets found matching your search.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onTrade={() => setSelectedMarket(market)}
            />
          ))}
        </div>
      )}

      {selectedMarket && (
        <TradeModal
          market={selectedMarket}
          open={!!selectedMarket}
          onClose={() => setSelectedMarket(null)}
        />
      )}
    </div>
  );
}

function MarketCard({
  market,
  onTrade,
}: {
  market: PolymarketMarket;
  onTrade: () => void;
}) {
  const yesToken = market.tokens.find((t) => t.outcome === 'Yes');
  const noToken = market.tokens.find((t) => t.outcome === 'No');
  const yesPrice = yesToken ? parseFloat(yesToken.price) : null;
  const noPrice = noToken ? parseFloat(noToken.price) : null;

  return (
    <Card className="flex flex-col hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold line-clamp-2 flex-1">
            {market.title}
          </CardTitle>
          {market.category && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {market.category}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span>Vol: {formatCurrency(market.volume, 'USD', 0)}</span>
          <span>Liq: {formatCurrency(market.liquidity, 'USD', 0)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-3">
        {/* Price bars */}
        <div className="space-y-2">
          {yesPrice !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6">YES</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${yesPrice * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-green-500 w-10 text-right">
                {(yesPrice * 100).toFixed(1)}¢
              </span>
            </div>
          )}
          {noPrice !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6">NO</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${noPrice * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-red-500 w-10 text-right">
                {(noPrice * 100).toFixed(1)}¢
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={onTrade}
          size="sm"
          className="w-full"
          disabled={!market.active}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Trade
        </Button>
      </CardContent>
    </Card>
  );
}
