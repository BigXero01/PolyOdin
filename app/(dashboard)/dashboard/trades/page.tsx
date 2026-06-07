import type { Metadata } from 'next';
import { TradesView } from '@/components/dashboard/trades-view';

export const metadata: Metadata = { title: 'Trades' };

export default function TradesPage() {
  return <TradesView />;
}
