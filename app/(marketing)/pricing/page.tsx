import type { Metadata } from 'next';
import { PricingSection } from '@/components/marketing/pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for PolyOdin',
};

export default function PricingPage() {
  return (
    <div>
      <div className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-lg text-muted-foreground">Start free, scale as you grow.</p>
      </div>
      <PricingSection />
    </div>
  );
}
