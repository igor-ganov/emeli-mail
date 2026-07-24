/**
 * Pure command-line parsing for the `emeli` CLI.
 *
 * Splits an argv tail into a command, its positional arguments and a flag set.
 * No I/O, no process access — fully unit-testable.
 */

export type ParsedArgs = {
  readonly command: string | undefined;
  readonly positionals: readonly string[];
  readonly flags: Readonly<Record<string, string | true>>;
};

const isFlag = (token: string): boolean => token.startsWith('--');

const flagEntry = (token: string): readonly [string, string | true] => {
  const body = token.slice(2);
  const eq = body.indexOf('=');
  return eq === -1 ? [body, true] : [body.slice(0, eq), body.slice(eq + 1)];
};

/**
 * Parse an argv tail (i.e. `process.argv.slice(2)`).
 *
 * @example
 * parseArgs(['new', 'component', 'avatar', '--dry-run'])
 * // { command: 'new', positionals: ['component', 'avatar'], flags: { 'dry-run': true } }
 */
export const parseArgs = (argv: readonly string[]): ParsedArgs => {
  const positionals: string[] = [];
  const flags: Record<string, string | true> = {};

  for (const token of argv) {
    switch (isFlag(token)) {
      case true: {
        const [key, value] = flagEntry(token);
        flags[key] = value;
        break;
      }
      default:
        positionals.push(token);
    }
  }

  const [command, ...rest] = positionals;
  return { command, positionals: rest, flags };
};
