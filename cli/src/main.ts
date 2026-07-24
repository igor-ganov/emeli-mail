#!/usr/bin/env bun
/**
 * `emeli` — the Emeli-mail polyrepo CLI.
 *
 * Thin dispatch over pure argument parsing and command functions. See
 * docs/cli.md for the command surface.
 */
import { parseArgs } from './lib/parse-args.ts';
import { doctor } from './commands/doctor.ts';
import { newComponent } from './commands/new-component.ts';
import { runPackageScript } from './commands/run-package.ts';

const usage = `emeli — Emeli-mail polyrepo CLI

  emeli doctor                 check the toolchain
  emeli new component <name>   scaffold a headless-component repo
  emeli dev                    run the component playground
  emeli test [package]         run unit tests (one package or all)
  emeli build [package]        build (one package or all)

  flags: --dry-run (new component)
`;

const fail = (message: string): never => {
  console.error(`emeli: ${message}\n`);
  console.error(usage);
  return process.exit(1);
};

const parsed = parseArgs(Bun.argv.slice(2));

const run = (): boolean => {
  switch (parsed.command) {
    case 'doctor':
      return doctor();
    case 'new': {
      const [kind, name] = parsed.positionals;
      if (kind !== 'component') return fail(`unknown subject for "new": ${kind ?? '(none)'}`);
      if (name === undefined) return fail('usage: emeli new component <name>');
      newComponent(name, parsed.flags['dry-run'] === true);
      return true;
    }
    case 'dev':
      return runPackageScript('dev', '@emeli/demo');
    case 'test':
      return runPackageScript('test', parsed.positionals[0]);
    case 'build':
      return runPackageScript('build', parsed.positionals[0]);
    case undefined:
      console.log(usage);
      return true;
    default:
      return fail(`unknown command: ${parsed.command}`);
  }
};

process.exit(run() ? 0 : 1);
