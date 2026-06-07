import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows first request', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('tracks remaining requests', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    const first = checkRateLimit(key);
    const second = checkRateLimit(key);
    expect(second.remaining).toBeLessThan(first.remaining);
  });

  it('returns reset timestamp', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    const result = checkRateLimit(key);
    expect(result.reset).toBeGreaterThan(Date.now());
  });
});
