import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Connect your wallet to access PolyOdin',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to PolyOdin</h1>
          <p className="mt-2 text-muted-foreground">
            Connect your wallet to start trading prediction markets
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          By connecting, you agree to our{' '}
          <a href="/terms" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
