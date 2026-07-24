# `emeli` CLI

One command surface for the whole polyrepo. Implemented in TypeScript, run with
bun. From the hub: `bun run cli <command>`, or `bun link` to expose a global
`emeli`.

## Commands

### `emeli doctor`
Checks the toolchain and prints a table of what is present and whether the
version is in the required range.

```
$ emeli doctor
  bun    1.3.14   ✓  (>=1.3.0)
  rustc  1.94.0   ✓  (>=1.80.0)
  cargo  1.94.0   ✓  (>=1.80.0)
  gh     2.62.0   ✓  (>=2.40.0)
```

Exit code is non-zero if any required tool is missing or out of range.

### `emeli new component <name>`
Scaffolds a new headless-component repository from the template: package
`@emeli/ui-<name>`, element `<emeli-<name>>`, a passing unit test, README and CI.

```
$ emeli new component avatar
  created  ../emeli-mail-ui-avatar
  package  @emeli/ui-avatar
  element  <emeli-avatar>
  next     cd ../emeli-mail-ui-avatar && bun install && bun test
```

`--dry-run` prints the plan without writing files.

### `emeli dev`
Runs the component playground (`@emeli/demo`).

### `emeli test [package]`
Runs unit tests for one package (by directory or `@emeli/*` name) or, with no
argument, every known package.

### `emeli build [package]`
Builds one package or all of them (`tsc` per library; Astro for demo).

## Design

Commands are declarative descriptors dispatched by a small runner. Argument
parsing, the version-range comparison used by `doctor`, and the name-rewrite used
by `new component` are pure functions with their own unit tests; process spawning
and file I/O sit at the edges. See [`spec/design.md`](../spec/design.md#d1--polyrepo--cli-r1).
