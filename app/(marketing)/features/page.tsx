import type { Metadata } from 'next';
import { FeaturesSection } from '@/components/marketing/features';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features',
  description: "Explore PolyOdin's powerful trading features",
};

export default function FeaturesPage() {
  return (
    <div className="space-y-0">
      <div className="py-16 text-center bg-muted/30">
        <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Everything you need to trade prediction markets like a professional.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Start Trading</Link>
        </Button>
      </div>
      <FeaturesSection />
    </div>
  );
}
