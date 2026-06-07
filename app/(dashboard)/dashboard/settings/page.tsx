import type { Metadata } from 'next';
import { getAuthUser } from '@/lib/auth';
import { SettingsView } from '@/components/dashboard/settings-view';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) return null;
  return <SettingsView user={user} />;
}
