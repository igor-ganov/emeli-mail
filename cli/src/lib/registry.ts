/**
 * The polyrepo package registry. Because each library is a sibling repository,
 * the CLI resolves them relative to the hub's parent directory.
 */

export type PackageKind = 'lib' | 'component' | 'theme' | 'demo';

export type PackageEntry = {
  readonly name: string; // @emeli/*
  readonly dir: string; // sibling directory name
  readonly kind: PackageKind;
};

export const packages: readonly PackageEntry[] = [
  { name: '@emeli/tokens', dir: 'emeli-mail-tokens', kind: 'lib' },
  { name: '@emeli/ui-message-row', dir: 'emeli-mail-ui-message-row', kind: 'component' },
  { name: '@emeli/theme-terracotta', dir: 'emeli-mail-theme-terracotta', kind: 'theme' },
  { name: '@emeli/demo', dir: 'emeli-mail-demo', kind: 'demo' },
];

/** Resolve a package by `@emeli/*` name or by sibling directory name. */
export const findPackage = (selector: string): PackageEntry | undefined =>
  packages.find((p) => p.name === selector || p.dir === selector);
