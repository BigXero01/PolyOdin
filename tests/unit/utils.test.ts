import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
  formatAddress,
  formatNumber,
  slugify,
  truncate,
  getPnLColor,
  getStatusColor,
  cn,
} from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  it('formats negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
  it('returns dash for null', () => {
    expect(formatCurrency(null)).toBe('—');
  });
  it('returns dash for undefined', () => {
    expect(formatCurrency(undefined)).toBe('—');
  });
  it('formats string numbers', () => {
    expect(formatCurrency('500.00')).toBe('$500.00');
  });
  it('returns dash for NaN strings', () => {
    expect(formatCurrency('not-a-number')).toBe('—');
  });
});

describe('formatPercent', () => {
  it('formats positive with sign', () => {
    const result = formatPercent(15.5);
    expect(result).toContain('15.50');
    expect(result).toContain('+');
  });
  it('formats negative without extra sign', () => {
    const result = formatPercent(-5.25);
    expect(result).toContain('5.25');
    expect(result).toContain('-');
  });
  it('returns dash for null', () => {
    expect(formatPercent(null)).toBe('—');
  });
});

describe('formatAddress', () => {
  it('shortens ethereum address', () => {
    const addr = '0x1234567890abcdef1234567890abcdef12345678';
    const result = formatAddress(addr);
    expect(result).toBe('0x1234...5678');
  });
  it('returns dash for null', () => {
    expect(formatAddress(null)).toBe('—');
  });
});

describe('formatNumber', () => {
  it('formats millions', () => {
    expect(formatNumber(1_500_000)).toBe('1.50M');
  });
  it('formats thousands', () => {
    expect(formatNumber(2_500)).toBe('2.50K');
  });
  it('formats small numbers', () => {
    expect(formatNumber(42.5)).toBe('42.5');
  });
  it('returns dash for null', () => {
    expect(formatNumber(null)).toBe('—');
  });
});

describe('slugify', () => {
  it('converts spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  it('removes special chars', () => {
    expect(slugify('Test & Value! 123')).toBe('test-value-123');
  });
  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });
  it('leaves short strings intact', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});

describe('getPnLColor', () => {
  it('returns green for positive', () => {
    expect(getPnLColor(100)).toBe('text-green-500');
  });
  it('returns red for negative', () => {
    expect(getPnLColor(-50)).toBe('text-red-500');
  });
  it('returns muted for zero', () => {
    expect(getPnLColor(0)).toBe('text-muted-foreground');
  });
  it('returns muted for null', () => {
    expect(getPnLColor(null)).toBe('text-muted-foreground');
  });
});

describe('getStatusColor', () => {
  it('returns green class for COMPLETED', () => {
    expect(getStatusColor('COMPLETED')).toContain('green');
  });
  it('returns yellow class for PENDING', () => {
    expect(getStatusColor('PENDING')).toContain('yellow');
  });
  it('returns red class for FAILED', () => {
    expect(getStatusColor('FAILED')).toContain('red');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
  it('handles conditional classes', () => {
    expect(cn('base', false && 'excluded', 'included')).toBe('base included');
  });
  it('deduplicates tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });
});
