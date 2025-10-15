import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from '../format';

describe('formatPrice', () => {
  it('formats price in MAD without decimals', () => {
    const nf = (n: number) => new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

    expect(formatPrice(1000)).toBe(nf(1000));
    expect(formatPrice(99.99)).toBe(nf(99.99));
    expect(formatPrice(0)).toBe(nf(0));
  });
});

describe('formatDate', () => {
  it('formats date string correctly', () => {
    expect(formatDate('2024-01-01')).toBe('01/01/2024');
  });

  it('formats Date object correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('01/01/2024');
  });
});
