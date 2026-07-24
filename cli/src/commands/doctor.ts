import type { SemVer } from '../lib/version-range.ts';
import { meetsMinimum } from '../lib/version-range.ts';

type ToolCheck = {
  readonly name: string;
  readonly cmd: string;
  readonly args: readonly string[];
  readonly min: SemVer;
};

const checks: readonly ToolCheck[] = [
  { name: 'bun', cmd: 'bun', args: ['--version'], min: [1, 3, 0] },
  { name: 'rustc', cmd: 'rustc', args: ['--version'], min: [1, 80, 0] },
  { name: 'cargo', cmd: 'cargo', args: ['--version'], min: [1, 80, 0] },
  { name: 'gh', cmd: 'gh', args: ['--version'], min: [2, 40, 0] },
];

const probe = (check: ToolCheck): string | undefined => {
  try {
    const out = Bun.spawnSync([check.cmd, ...check.args]);
    return out.success ? out.stdout.toString() : undefined;
  } catch {
    return undefined;
  }
};

const mark = (ok: boolean | undefined): string =>
  ok === true ? '✓' : ok === false ? '✗ out of range' : '✗ missing';

const line = (name: string, min: SemVer, text: string | undefined): { row: string; ok: boolean } => {
  const ok = text === undefined ? undefined : meetsMinimum(text, min);
  const version = text?.match(/\d+\.\d+\.\d+/)?.[0] ?? '—';
  const range = `(>=${min.join('.')})`;
  return {
    row: `  ${name.padEnd(7)}${version.padEnd(9)}${mark(ok)}  ${range}`,
    ok: ok === true,
  };
};

/** Probe the toolchain, print a report, and return true when all checks pass. */
export const doctor = (): boolean => {
  const rows = checks.map((c) => line(c.name, c.min, probe(c)));
  for (const r of rows) console.log(r.row);
  const allOk = rows.every((r) => r.ok);
  console.log(allOk ? '\n  toolchain ready' : '\n  toolchain incomplete');
  return allOk;
};
