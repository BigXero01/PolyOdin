import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ],
  Company: [
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ],
  Trading: [
    { href: '/dashboard/markets', label: 'Markets' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/login', label: 'Get Started' },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">P</span>
              </div>
              PolyOdin
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional prediction market trading platform with real-time data and automated strategies.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PolyOdin. All rights reserved.</p>
          <p>
            Trading prediction markets involves risk.{' '}
            <Link href="/risk-disclosure" className="hover:text-foreground underline">
              Read our risk disclosure.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
