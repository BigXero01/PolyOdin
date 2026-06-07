'use client';

import { useState } from 'react';
import { useTrades, useCloseTrade } from '@/hooks/use-trades';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatPercent, formatDateTime, getPnLColor, getStatusColor } from '@/lib/utils';
import type { Trade } from '@prisma/client';
import { Loader2, X } from 'lucide-react';

export function TradesView() {
  const [activeTab, setActiveTab] = useState('all');
  const status = activeTab === 'open' ? 'OPEN' : activeTab === 'closed' ? 'CLOSED' : undefined;
  const { data, isLoading } = useTrades({ status });
  const closeTrade = useCloseTrade();

  const trades = (data?.trades as Trade[] | undefined) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trades</h1>
        <p className="text-muted-foreground">Your complete trade history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {data?.total ?? 0} trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : trades.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No trades found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Market</th>
                        <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Outcome</th>
                        <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Entry</th>
                        <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Amount</th>
                        <th className="text-right py-2 pr-4 font-medium text-muted-foreground">P&amp;L</th>
                        <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {trades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-muted/50">
                          <td className="py-3 pr-4">
                            <p className="font-medium truncate max-w-[200px]">{trade.marketName}</p>
                            <p className="text-xs text-muted-foreground">{formatDateTime(trade.openedAt)}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant={trade.outcome === 'YES' ? 'success' : 'destructive'}
                              className="text-xs"
                            >
                              {trade.outcome}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4 text-right font-mono text-xs">
                            {(Number(trade.entryPrice) * 100).toFixed(1)}¢
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {formatCurrency(trade.entryAmount)}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {trade.pnl !== null ? (
                              <div>
                                <p className={getPnLColor(Number(trade.pnl))}>
                                  {formatCurrency(trade.pnl)}
                                </p>
                                <p className={`text-xs ${getPnLColor(Number(trade.pnlPercent))}`}>
                                  {formatPercent(Number(trade.pnlPercent))}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge className={getStatusColor(trade.status)} variant="outline">
                              {trade.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            {trade.status === 'OPEN' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => closeTrade.mutate(trade.id)}
                                disabled={closeTrade.isPending}
                                className="h-7 text-xs"
                              >
                                {closeTrade.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Close
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
