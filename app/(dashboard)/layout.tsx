import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
