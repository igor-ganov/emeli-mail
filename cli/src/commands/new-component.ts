import { readdirSync, mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ComponentIdentity } from '../lib/component-name.ts';
import { componentIdentity, rewriteTemplate } from '../lib/component-name.ts';

const here = dirname(fileURLToPath(import.meta.url));
const templateRoot = join(here, '..', '..', 'template', 'component');
// here = <hub>/cli/src/commands → hub root is three levels up; sibling
// repositories live next to the hub, one level above that.
const hubRoot = join(here, '..', '..', '..');
const workspaceRoot = join(hubRoot, '..');

type PlannedFile = { readonly rel: string; readonly content: string };

const walk = (dir: string, base: string): readonly string[] =>
  readdirSync(dir).flatMap((entry) => {
    const abs = join(dir, entry);
    const rel = base === '' ? entry : `${base}/${entry}`;
    return statSync(abs).isDirectory() ? walk(abs, rel) : [rel];
  });

/** Compute the files a new component repo would contain (pure over the template). */
const planFiles = (id: ComponentIdentity): readonly PlannedFile[] =>
  walk(templateRoot, '').map((rel) => ({
    rel: rewriteTemplate(rel, id),
    content: rewriteTemplate(readFileSync(join(templateRoot, rel), 'utf8'), id),
  }));

const writePlan = (targetDir: string, files: readonly PlannedFile[]): void => {
  for (const file of files) {
    const abs = join(targetDir, file.rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, file.content);
  }
};

/** Scaffold a headless-component repository. Returns the created directory. */
export const newComponent = (name: string, dryRun: boolean): string => {
  const id = componentIdentity(name);
  const targetDir = join(workspaceRoot, id.repo);

  switch (existsSync(templateRoot)) {
    case false:
      throw new Error(`component template not found at ${templateRoot}`);
    default:
      break;
  }
  if (existsSync(targetDir)) throw new Error(`target already exists: ${targetDir}`);

  const files = planFiles(id);
  switch (dryRun) {
    case true:
      console.log(`  would create ${targetDir}`);
      for (const f of files) console.log(`    ${f.rel}`);
      break;
    default: {
      writePlan(targetDir, files);
      console.log(`  created  ${targetDir}`);
      console.log(`  package  ${id.pkg}`);
      console.log(`  element  <${id.element}>`);
      console.log(`  next     cd ../${id.repo} && bun install && bun test`);
    }
  }
  return targetDir;
};
