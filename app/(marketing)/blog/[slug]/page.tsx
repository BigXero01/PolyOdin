import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CONTENT: Record<string, { title: string; category: string; date: string; content: string }> = {
  'getting-started-prediction-markets': {
    title: 'Getting Started with Prediction Markets',
    category: 'Education',
    date: '2024-01-15',
    content: `
Prediction markets are financial markets where traders can buy and sell shares based on the outcome of future events. Unlike traditional markets, the price of a share directly reflects the probability of an event occurring.

## How PolyOdin Works

PolyOdin connects to Polymarket, one of the largest prediction market platforms, giving you access to hundreds of active markets covering politics, sports, crypto, and more.

## Getting Started

1. **Connect your MetaMask wallet** — No account creation needed. Just connect your Web3 wallet.
2. **Browse markets** — Explore active prediction markets across all categories.
3. **Place a trade** — Buy YES or NO shares based on your prediction.
4. **Track your portfolio** — Monitor your positions and P&L in real time.

## Tips for New Traders

- Start with small positions to understand how markets move
- Focus on markets where you have genuine information advantage
- Always check liquidity before trading large amounts
- Set realistic expectations — even experts are wrong sometimes
    `,
  },
  'portfolio-management-strategies': {
    title: 'Portfolio Management Strategies for Prediction Markets',
    category: 'Strategy',
    date: '2024-01-22',
    content: `
Effective portfolio management is crucial for long-term success in prediction market trading. Here are key strategies to consider.

## Diversification

Don't concentrate all your capital in a single market. Spread positions across different categories and time horizons.

## Position Sizing

Use the Kelly Criterion or a fractional Kelly approach to determine optimal position sizes based on your edge and confidence.

## Risk Management

- Never risk more than you can afford to lose
- Set maximum drawdown thresholds
- Regularly review and rebalance your portfolio

## Tracking Performance

Use PolyOdin's analytics dashboard to monitor your win rate, ROI by market, and monthly P&L trends.
    `,
  },
  'understanding-polymarket-clob': {
    title: "Understanding Polymarket's CLOB System",
    category: 'Technical',
    date: '2024-02-01',
    content: `
Polymarket uses a Central Limit Order Book (CLOB) to facilitate trading. Understanding how this works is essential for effective trading.

## What is a CLOB?

A Central Limit Order Book matches buyers and sellers based on price priority. The best bid and ask prices determine the current market price.

## How Prices Work

Prediction market prices range from $0.01 to $0.99, representing the probability of an event occurring. A YES price of $0.65 means the market believes there's a 65% chance the event will happen.

## Liquidity

Liquidity is provided by market makers who place limit orders on both sides. High-liquidity markets have tighter spreads and allow larger trades without significant price impact.

## Trading Tips

- Check the order book depth before placing large orders
- Use limit orders for better price control
- Monitor volume as an indicator of market confidence
    `,
  },
};

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = CONTENT[params.slug];
  if (!post) return { title: 'Post Not Found' };
  return { title: post.title, description: post.title };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = CONTENT[params.slug];
  if (!post) notFound();

  return (
    <div className="container mx-auto py-16 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="mb-8">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <h1 className="text-4xl font-bold">{post.title}</h1>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {post.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{line}</p>;
        })}
      </div>
    </div>
  );
}
