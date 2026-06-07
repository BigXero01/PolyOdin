import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Wallet,
  Shield,
  BarChart3,
  Zap,
  Globe,
  Clock,
  DollarSign,
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Market Data',
    description: 'Live prices, order books, and trading volume from Polymarket. Never trade on stale data.',
  },
  {
    icon: Wallet,
    title: 'MetaMask Integration',
    description: 'Connect your Web3 wallet seamlessly. Non-custodial — you always control your funds.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'SIWE authentication, JWT sessions, rate limiting, and comprehensive audit logging.',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Analytics',
    description: 'Track your P&L, win rate, ROI by market, and risk metrics in real time.',
  },
  {
    icon: Zap,
    title: 'Instant Execution',
    description: "Execute trades directly on Polymarket's CLOB with configurable slippage protection.",
  },
  {
    icon: Globe,
    title: 'All Markets',
    description: 'Access every active prediction market — politics, sports, crypto, finance, and more.',
  },
  {
    icon: Clock,
    title: 'Trade History',
    description: 'Complete trade history with P&L tracking, export capabilities, and tax reporting.',
  },
  {
    icon: DollarSign,
    title: 'Flexible Payments',
    description: 'Apple Pay deposits with no fees. Unlimited withdrawals via Apple Pay, bank, or crypto.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to trade prediction markets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools built for serious traders, with the simplicity of a modern web app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
