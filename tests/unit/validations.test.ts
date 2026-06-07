import {
  connectWalletSchema,
  verifySignatureSchema,
  executeTradeSchema,
  withdrawInitSchema,
  contactFormSchema,
} from '@/lib/validations';

describe('connectWalletSchema', () => {
  it('accepts valid Ethereum address', () => {
    const result = connectWalletSchema.safeParse({
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid address', () => {
    const result = connectWalletSchema.safeParse({ walletAddress: 'not-an-address' });
    expect(result.success).toBe(false);
  });

  it('rejects address without 0x prefix', () => {
    const result = connectWalletSchema.safeParse({
      walletAddress: '1234567890abcdef1234567890abcdef12345678',
    });
    expect(result.success).toBe(false);
  });
});

describe('verifySignatureSchema', () => {
  it('accepts valid inputs', () => {
    const result = verifySignatureSchema.safeParse({
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      signature: '0xabc123',
      message: 'Sign in to PolyOdin',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty signature', () => {
    const result = verifySignatureSchema.safeParse({
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      signature: '',
      message: 'test',
    });
    expect(result.success).toBe(false);
  });
});

describe('executeTradeSchema', () => {
  it('accepts valid trade', () => {
    const result = executeTradeSchema.safeParse({
      marketId: 'market-123',
      outcome: 'YES',
      amount: 100,
      maxPrice: 0.65,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid outcome', () => {
    const result = executeTradeSchema.safeParse({
      marketId: 'market-123',
      outcome: 'MAYBE',
      amount: 100,
      maxPrice: 0.65,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero amount', () => {
    const result = executeTradeSchema.safeParse({
      marketId: 'market-123',
      outcome: 'YES',
      amount: 0,
      maxPrice: 0.65,
    });
    expect(result.success).toBe(false);
  });

  it('rejects price above 1', () => {
    const result = executeTradeSchema.safeParse({
      marketId: 'market-123',
      outcome: 'NO',
      amount: 50,
      maxPrice: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('applies default slippage', () => {
    const result = executeTradeSchema.safeParse({
      marketId: 'market-123',
      outcome: 'YES',
      amount: 100,
      maxPrice: 0.5,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slippage).toBe(1);
    }
  });
});

describe('withdrawInitSchema', () => {
  it('accepts valid withdrawal', () => {
    const result = withdrawInitSchema.safeParse({
      amount: 500,
      method: 'APPLE_PAY',
      destination: 'apple-pay-token',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid method', () => {
    const result = withdrawInitSchema.safeParse({
      amount: 500,
      method: 'PAYPAL',
      destination: 'destination',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative amount', () => {
    const result = withdrawInitSchema.safeParse({
      amount: -100,
      method: 'CRYPTO',
      destination: '0xabc',
    });
    expect(result.success).toBe(false);
  });
});

describe('contactFormSchema', () => {
  it('accepts valid form', () => {
    const result = contactFormSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Question about trading',
      message: 'I have a question about how to trade prediction markets on your platform.',
      type: 'general',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = contactFormSchema.safeParse({
      name: 'John',
      email: 'not-an-email',
      subject: 'Subject',
      message: 'This is a long enough message for the validation to pass properly.',
      type: 'support',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short message', () => {
    const result = contactFormSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Subject',
      message: 'Too short',
      type: 'general',
    });
    expect(result.success).toBe(false);
  });
});
