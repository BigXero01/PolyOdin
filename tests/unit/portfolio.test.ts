import { formatCurrency, formatPercent, getPnLColor } from '@/lib/utils';

describe('Portfolio calculation helpers', () => {
  describe('P&L formatting', () => {
    it('formats positive P&L correctly', () => {
      expect(formatCurrency(150.75)).toBe('$150.75');
    });

    it('formats negative P&L correctly', () => {
      expect(formatCurrency(-50.25)).toBe('-$50.25');
    });

    it('formats zero P&L correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('P&L percentage formatting', () => {
    it('adds plus sign to positive percentage', () => {
      const result = formatPercent(12.5);
      expect(result.startsWith('+')).toBe(true);
    });

    it('does not double-add minus sign to negative', () => {
      const result = formatPercent(-8.3);
      const minusCount = (result.match(/-/g) ?? []).length;
      expect(minusCount).toBe(1);
    });
  });

  describe('Portfolio value color coding', () => {
    it('maps positive value to green', () => {
      expect(getPnLColor(250)).toContain('green');
    });

    it('maps negative value to red', () => {
      expect(getPnLColor(-100)).toContain('red');
    });

    it('maps null to muted', () => {
      expect(getPnLColor(null)).toContain('muted');
    });
  });
});
