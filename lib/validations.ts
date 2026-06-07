import { z } from 'zod';

export const connectWalletSchema = z.object({
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

export const verifySignatureSchema = z.object({
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

export const executeTradeSchema = z.object({
  marketId: z.string().min(1),
  outcome: z.enum(['YES', 'NO']),
  amount: z.number().positive('Amount must be positive'),
  maxPrice: z.number().min(0).max(1, 'Price must be between 0 and 1'),
  slippage: z.number().min(0).max(50).default(1),
});

export const closeTradeSchema = z.object({
  exitAmount: z.number().positive().optional(),
});

export const applePayInitSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
});

export const applePayCompleteSchema = z.object({
  paymentToken: z.object({
    paymentData: z.record(z.unknown()),
    paymentMethod: z.object({
      displayName: z.string(),
      network: z.string(),
      type: z.string(),
    }),
    transactionIdentifier: z.string(),
  }),
  sessionId: z.string(),
});

export const withdrawInitSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['APPLE_PAY', 'BANK_TRANSFER', 'CRYPTO']),
  destination: z.string().min(1, 'Destination is required'),
  currency: z.string().default('USD'),
});

export const revalidateSchema = z.object({
  secret: z.string(),
  path: z.string().optional(),
  tag: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
  type: z.enum(['general', 'support', 'bug', 'feature', 'billing']).default('general'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['DARK', 'LIGHT', 'SYSTEM']).optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  tradeConfirmations: z.boolean().optional(),
  priceAlerts: z.boolean().optional(),
  newsletterSubscribed: z.boolean().optional(),
  defaultSlippage: z.number().min(0).max(50).optional(),
});
