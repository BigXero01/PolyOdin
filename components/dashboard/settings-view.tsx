'use client';

import type { User, UserPreference } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/use-wallet';
import { Loader2, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface SettingsViewProps {
  user: User & { preferences: UserPreference | null };
}

export function SettingsView({ user }: SettingsViewProps) {
  const { logout } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Your wallet and identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <div className="flex items-center gap-2">
              <Input value={user.walletAddress} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={copyAddress}>
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email (optional)</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              defaultValue={user.email ?? ''}
              disabled
            />
            <p className="text-xs text-muted-foreground">Email coming soon</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Login count</p>
              <p className="text-xs text-muted-foreground">{user.loginCount} total logins</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              label: 'Email Notifications',
              desc: 'Receive important account updates',
              key: 'emailNotifications',
            },
            {
              label: 'Trade Confirmations',
              desc: 'Get notified when trades execute',
              key: 'tradeConfirmations',
            },
            {
              label: 'Price Alerts',
              desc: 'Alerts when markets move significantly',
              key: 'priceAlerts',
            },
          ].map(({ label, desc, key }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                defaultChecked={
                  (user.preferences as Record<string, boolean> | null)?.[key] ?? true
                }
                disabled
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Notification settings coming soon. Connect your email to enable.
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
          <CardDescription>Manage your session and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session Timeout</p>
              <p className="text-xs text-muted-foreground">
                Auto-logout after 15 minutes of inactivity
              </p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-1">Disconnect Wallet</p>
            <p className="text-xs text-muted-foreground mb-3">
              Sign out from your wallet and clear the session
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect Wallet'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
