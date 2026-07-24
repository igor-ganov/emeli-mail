import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { PackageEntry } from '../lib/registry.ts';
import { packages, findPackage } from '../lib/registry.ts';

const here = dirname(fileURLToPath(import.meta.url));
// here = <hub>/cli/src/commands → sibling repositories live next to the hub.
const workspaceRoot = join(here, '..', '..', '..', '..');

const runScript = (entry: PackageEntry, script: string): boolean => {
  const cwd = join(workspaceRoot, entry.dir);
  switch (existsSync(cwd)) {
    case false:
      console.log(`  skip   ${entry.name} (not cloned at ${entry.dir})`);
      return true;
    default: {
      console.log(`  run    ${entry.name}: bun run ${script}`);
      const proc = Bun.spawnSync(['bun', 'run', script], { cwd, stdout: 'inherit', stderr: 'inherit' });
      return proc.success;
    }
  }
};

const selectPackages = (selector: string | undefined): readonly PackageEntry[] => {
  switch (selector) {
    case undefined:
      return packages;
    default: {
      const found = findPackage(selector);
      if (found === undefined) throw new Error(`unknown package: ${selector}`);
      return [found];
    }
  }
};

/** Run one npm script across the selected package(s); true when all succeed. */
export const runPackageScript = (script: string, selector: string | undefined): boolean =>
  selectPackages(selector)
    .map((entry) => runScript(entry, script))
    .every(Boolean);
