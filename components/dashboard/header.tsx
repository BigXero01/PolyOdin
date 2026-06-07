'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatAddress } from '@/lib/utils';
import type { User } from '@prisma/client';
import { ThemeToggle } from '@/components/theme-toggle';

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 w-64">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search markets..."
            className="border-0 bg-transparent h-auto p-0 text-sm focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono text-xs hidden sm:block">
            {user.displayName ?? formatAddress(user.walletAddress)}
          </span>
        </div>
      </div>
    </header>
  );
}
