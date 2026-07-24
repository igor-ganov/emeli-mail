import { describe, expect, it } from 'bun:test';
import { meetsMinimum, parseSemVer, satisfiesMin } from './version-range.ts';

describe('parseSemVer', () => {
  it('extracts a triple from noisy tool output', () => {
    expect(parseSemVer('rustc 1.94.0 (4a4ef493e 2026-03-02)')).toEqual([1, 94, 0]);
    expect(parseSemVer('gh version 2.62.0 (2026-01-10)')).toEqual([2, 62, 0]);
  });

  it('returns undefined when no version is present', () => {
    expect(parseSemVer('command not found')).toBeUndefined();
  });
});

describe('satisfiesMin', () => {
  it('orders by major, then minor, then patch', () => {
    expect(satisfiesMin([1, 3, 0], [1, 3, 0])).toBe(true);
    expect(satisfiesMin([1, 3, 14], [1, 3, 0])).toBe(true);
    expect(satisfiesMin([2, 0, 0], [1, 9, 9])).toBe(true);
    expect(satisfiesMin([1, 2, 9], [1, 3, 0])).toBe(false);
    expect(satisfiesMin([0, 9, 9], [1, 0, 0])).toBe(false);
  });
});

describe('meetsMinimum', () => {
  it('parses then compares', () => {
    expect(meetsMinimum('bun 1.3.14', [1, 3, 0])).toBe(true);
    expect(meetsMinimum('bun 1.2.0', [1, 3, 0])).toBe(false);
  });

  it('returns undefined for unparseable text', () => {
    expect(meetsMinimum('not installed', [1, 0, 0])).toBeUndefined();
  });
});
