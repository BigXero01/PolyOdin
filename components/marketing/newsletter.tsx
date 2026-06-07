'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: 'Subscribed!', description: 'Thanks for subscribing to our newsletter.' });
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto text-center max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">Stay updated</h2>
        <p className="text-muted-foreground mb-8">
          Get the latest prediction market insights, trading tips, and platform updates.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
