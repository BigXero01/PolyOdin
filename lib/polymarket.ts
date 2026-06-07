const GAMMA_API = process.env.POLYMARKET_API_URL ?? 'https://gamma-api.polymarket.com';
const CLOB_API = process.env.POLYMARKET_CLOB_URL ?? 'https://clob.polymarket.com';

export interface PolymarketMarket {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  resolution: string | null;
  volume: string;
  liquidity: string;
  tokens: PolymarketToken[];
  active: boolean;
  closed: boolean;
}

export interface PolymarketToken {
  token_id: string;
  outcome: string;
  price: string;
  winner: boolean;
}

export interface PolymarketOrderBook {
  market: string;
  asset_id: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: string;
}

export interface OrderBookLevel {
  price: string;
  size: string;
}

export interface PolymarketTrade {
  id: string;
  market: string;
  asset_id: string;
  side: 'BUY' | 'SELL';
  price: string;
  size: string;
  timestamp: string;
  transaction_hash: string;
}

async function fetchGamma<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${GAMMA_API}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchClob<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${CLOB_API}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 5 },
  });

  if (!response.ok) {
    throw new Error(`Polymarket CLOB error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getMarkets(params?: {
  limit?: number;
  offset?: number;
  category?: string;
  active?: boolean;
}): Promise<PolymarketMarket[]> {
  return fetchGamma<PolymarketMarket[]>('/markets', {
    limit: String(params?.limit ?? 50),
    offset: String(params?.offset ?? 0),
    ...(params?.category ? { category: params.category } : {}),
    ...(params?.active !== undefined ? { active: String(params.active) } : {}),
  });
}

export async function getMarket(id: string): Promise<PolymarketMarket> {
  return fetchGamma<PolymarketMarket>(`/markets/${id}`);
}

export async function getMarketOrderBook(tokenId: string): Promise<PolymarketOrderBook> {
  return fetchClob<PolymarketOrderBook>(`/book?token_id=${tokenId}`);
}

export async function getMarketPrices(marketId: string): Promise<Record<string, string>> {
  const market = await getMarket(marketId);
  const prices: Record<string, string> = {};
  for (const token of market.tokens) {
    prices[token.outcome] = token.price;
  }
  return prices;
}

export async function getRecentTrades(tokenId: string, limit = 20): Promise<PolymarketTrade[]> {
  return fetchClob<PolymarketTrade[]>(`/trades?token_id=${tokenId}&limit=${limit}`);
}
