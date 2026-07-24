import { describe, expect, it } from 'bun:test';
import { parseArgs } from './parse-args.ts';

describe('parseArgs', () => {
  it('returns undefined command for empty argv', () => {
    const parsed = parseArgs([]);
    expect(parsed.command).toBeUndefined();
    expect(parsed.positionals).toEqual([]);
    expect(parsed.flags).toEqual({});
  });

  it('splits command and positionals', () => {
    const parsed = parseArgs(['new', 'component', 'avatar']);
    expect(parsed.command).toBe('new');
    expect(parsed.positionals).toEqual(['component', 'avatar']);
  });

  it('reads boolean flags', () => {
    const parsed = parseArgs(['new', 'component', 'avatar', '--dry-run']);
    expect(parsed.flags['dry-run']).toBe(true);
  });

  it('reads valued flags with =', () => {
    const parsed = parseArgs(['build', '--target=tokens']);
    expect(parsed.command).toBe('build');
    expect(parsed.flags['target']).toBe('tokens');
  });

  it('keeps flags out of positionals regardless of position', () => {
    const parsed = parseArgs(['test', '--watch', 'tokens']);
    expect(parsed.positionals).toEqual(['tokens']);
    expect(parsed.flags['watch']).toBe(true);
  });
});
