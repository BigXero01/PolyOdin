import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  userId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100),
    currency: params.currency.toLowerCase(),
    payment_method_types: ['card', 'apple_pay'],
    metadata: {
      userId: params.userId,
      ...params.metadata,
    },
  });
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  sig: string,
): Promise<Stripe.Event> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  return stripe.webhooks.constructEvent(payload, sig, secret);
}

export async function verifyApplePayMerchant(validationURL: string): Promise<unknown> {
  const response = await fetch(validationURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantIdentifier: process.env.APPLE_PAY_MERCHANT_ID ?? '',
      displayName: 'PolyOdin',
      initiative: 'web',
      initiativeContext: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') ?? '',
    }),
  });

  if (!response.ok) {
    throw new Error('Apple Pay merchant validation failed');
  }

  return response.json();
}
