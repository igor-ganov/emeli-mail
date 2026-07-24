/**
 * Minimal semantic-version comparison for `emeli doctor`.
 *
 * Only the subset the CLI needs: parse a dotted numeric version out of a tool's
 * `--version` output and test it against a `>=x.y.z` minimum. Pure.
 */

export type SemVer = readonly [number, number, number];

const toInt = (value: string | undefined): number => {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isNaN(n) ? 0 : n;
};

/**
 * Extract the first `major.minor.patch` triple found in arbitrary text.
 * Returns undefined when no version-looking token is present.
 *
 * @example parseSemVer('rustc 1.94.0 (4a4ef493e 2026-03-02)') // [1, 94, 0]
 */
export const parseSemVer = (text: string): SemVer | undefined => {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(text);
  return match === null ? undefined : [toInt(match[1]), toInt(match[2]), toInt(match[3])];
};

const compare = (a: SemVer, b: SemVer): number =>
  a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** True when `version` is greater than or equal to `minimum`. */
export const satisfiesMin = (version: SemVer, minimum: SemVer): boolean =>
  compare(version, minimum) >= 0;

/**
 * Parse `text` and test it against a minimum. Returns undefined when the text
 * carries no parseable version (caller treats that as "missing/unknown").
 */
export const meetsMinimum = (text: string, minimum: SemVer): boolean | undefined => {
  const parsed = parseSemVer(text);
  return parsed === undefined ? undefined : satisfiesMin(parsed, minimum);
};
