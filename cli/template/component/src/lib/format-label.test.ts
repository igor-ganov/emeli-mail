import { describe, expect, it } from 'bun:test';
import { formatLabel } from './format-label.js';

describe('formatLabel', () => {
  it('trims surrounding whitespace', () => {
    expect(formatLabel('  hello  ')).toBe('hello');
  });

  it('collapses internal whitespace', () => {
    expect(formatLabel('a   b\t c')).toBe('a b c');
  });

  it('leaves clean input unchanged', () => {
    expect(formatLabel('already clean')).toBe('already clean');
  });
});
