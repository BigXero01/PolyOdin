import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Prediction market insights and trading strategies',
};

const POSTS = [
  {
    slug: 'getting-started-prediction-markets',
    title: 'Getting Started with Prediction Markets',
    description: 'Learn the fundamentals of prediction market trading and how to get started with PolyOdin.',
    category: 'Education',
    date: '2024-01-15',
    readTime: '5 min read',
  },
  {
    slug: 'portfolio-management-strategies',
    title: 'Portfolio Management Strategies for Prediction Markets',
    description: 'Advanced strategies for managing your prediction market portfolio and maximizing returns.',
    category: 'Strategy',
    date: '2024-01-22',
    readTime: '8 min read',
  },
  {
    slug: 'understanding-polymarket-clob',
    title: "Understanding Polymarket's CLOB System",
    description: "A deep dive into Polymarket's Central Limit Order Book and how prices are determined.",
    category: 'Technical',
    date: '2024-02-01',
    readTime: '10 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-16 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Insights on prediction markets, trading strategies, and platform updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="text-base line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
