import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/lib/providers';
import '@/app/globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'PolyOdin - Prediction Market Trading',
    template: '%s | PolyOdin',
  },
  description:
    'Professional prediction market trading platform. Trade on real-world events with automated strategies and real-time data.',
  keywords: ['prediction market', 'trading', 'polymarket', 'crypto', 'defi', 'forecasting'],
  authors: [{ name: 'PolyOdin' }],
  creator: 'PolyOdin',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'PolyOdin - Prediction Market Trading',
    description: 'Professional prediction market trading platform',
    siteName: 'PolyOdin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolyOdin - Prediction Market Trading',
    description: 'Professional prediction market trading platform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
