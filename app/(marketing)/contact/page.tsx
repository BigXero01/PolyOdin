import type { Metadata } from 'next';
import { ContactForm } from '@/components/marketing/contact-form';
import { Mail, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the PolyOdin team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question or need help? We&apos;re here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-6">
          {[
            {
              icon: Mail,
              title: 'Email Support',
              description: 'support@polyodin.com',
              sub: 'We respond within 24 hours',
            },
            {
              icon: MessageSquare,
              title: 'Live Chat',
              description: 'Available in the dashboard',
              sub: 'Mon–Fri, 9am–6pm UTC',
            },
            {
              icon: Clock,
              title: 'Response Time',
              description: '< 24 hours',
              sub: 'For all inquiries',
            },
          ].map(({ icon: Icon, title, description, sub }) => (
            <div key={title} className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-foreground">{description}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
