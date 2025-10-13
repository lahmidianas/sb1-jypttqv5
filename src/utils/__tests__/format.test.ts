import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from '../format';

describe('formatPrice', () => {
  it('formats price correctly', () => {
    expect(formatPrice(1000)).toBe('1\u202F000,00 €');
    expect(formatPrice(99.99)).toBe('99,99 €');
    expect(formatPrice(0)).toBe('0,00 €');
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