import type { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero';
import { FeaturesSection } from '@/components/marketing/features';
import { PricingSection } from '@/components/marketing/pricing';
import { NewsletterSection } from '@/components/marketing/newsletter';

export const metadata: Metadata = {
  title: 'PolyOdin - Professional Prediction Market Trading',
  description: 'Trade prediction markets with professional tools, real-time data, and automated strategies. Connect your wallet and start trading today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <NewsletterSection />
    </>
  );
}
