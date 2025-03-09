import { formatCurrency, formatDate } from './formatters';

describe('formatCurrency', () => {
  test('formats number values correctly', () => {
    expect(formatCurrency(10)).toBe('$10.00');
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('formats string values that can be parsed as numbers', () => {
    expect(formatCurrency('10')).toBe('$10.00');
    expect(formatCurrency('10.5')).toBe('$10.50');
  });

  test('handles undefined and null values', () => {
    expect(formatCurrency(undefined)).toBe('$0.00');
    expect(formatCurrency(null)).toBe('$0.00');
  });
});

describe('formatDate', () => {
  test('formats Date object correctly', () => {
    const date = new Date(2023, 0, 15); // Jan 15, 2023
    expect(formatDate(date)).toBe('Jan 15, 2023');
  });

  test('formats string date correctly', () => {
    expect(formatDate('2023-01-15')).toMatch(/Jan 15, 2023/);
  });

  test('formats timestamp correctly', () => {
    const timestamp = new Date(2023, 0, 15).getTime();
    expect(formatDate(timestamp)).toMatch(/Jan 15, 2023/);
  });

  test('accepts custom formatting options', () => {
    const date = new Date(2023, 0, 15);
    expect(formatDate(date, { month: 'long', year: '2-digit' })).toMatch(/January 15, 23/);
  });
});