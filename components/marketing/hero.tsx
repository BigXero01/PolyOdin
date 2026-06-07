'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            <Zap className="mr-1 h-3 w-3" />
            Real-time Prediction Market Data
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Trade the Future with{' '}
            <span className="gradient-text">PolyOdin</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground text-balance">
            Professional prediction market trading platform. Connect your MetaMask wallet,
            access real-time Polymarket data, and trade on global events with confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/login">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
            <Link href="/features">Learn More</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          {[
            { icon: Shield, text: 'Non-custodial' },
            { icon: Zap, text: 'Real-time data' },
            { icon: TrendingUp, text: 'Live markets' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 rounded-xl border border-border bg-card/50 p-1 shadow-2xl max-w-4xl mx-auto"
        >
          <div className="rounded-lg bg-card p-8 text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">PolyOdin Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['Portfolio Value', 'Day P&L', 'Win Rate'].map((label) => (
                <div key={label} className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <div className="h-6 bg-muted-foreground/20 rounded mt-1 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-end px-4 pb-4 gap-1">
                  {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/40 rounded-t transition-all"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
