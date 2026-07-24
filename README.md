# emeli-mail

A modern, mobile-first email client for the [Emeli](https://github.com/igor-ganov?tab=repositories&q=emeli) suite.
Desktop shell on **Tauri**, UI on **Astro + Lit**, protocol layer on
provider **OAuth + native APIs** (Yahoo first, then Outlook, then Gmail).

This repository is the **hub**: product vision, architecture, the living
specification, the roadmap, and the `emeli` developer CLI. The client itself is
built from many small, independently versioned repositories — see
[the repository map](#repository-map).

> Status: **foundation / scaffolding.** The first vertical slice is under
> construction. Nothing here is production-ready yet.

## What it is

- **Multi-platform desktop client** (Windows, macOS, Linux) built on Tauri —
  a small Rust shell around the system WebView, matching the stack used across
  the other Emeli/Prometheus projects.
- **Untrusted email HTML is never rendered in the app WebView.** Message bodies
  render inside a separate, sandboxed engine with a strict Content-Security-Policy,
  no scripting, and proxied remote content. See
  [`docs/architecture.md`](docs/architecture.md#email-body-rendering).
- **Provider-native connectivity.** Each provider is a swappable adapter behind
  one port: Yahoo (IMAP + OAuth), Outlook (Microsoft Graph), Gmail (Gmail API).
- **Headless components.** UI components carry structure, behaviour and
  accessibility only — no baked-in visual style. Styling ships as separate,
  swappable **theme packs**.
- **Mobile-first.** Layout, spacing and interaction are designed for the small
  viewport first and enhanced upward.

## Design principles

- **Functional core.** Logic is pure functions composed into readable pipelines,
  extracted into reusable libraries, unit-tested in isolation.
- **Small components, one level deep.** Every component is minimal and does not
  nest UI beyond a single level (the Angular conventions used across these
  projects, applied to Lit).
- **Polyrepo.** Each component, token set and theme is its own library and its
  own repository, published to the GitHub npm registry under `@emeli/*`.
- **Documentation-first.** Every library ships a README, every public function a
  doc comment, every decision a spec entry.

## Repository map

| Repository | `@emeli/*` package | Role |
| --- | --- | --- |
| [`emeli-mail`](https://github.com/igor-ganov/emeli-mail) | `@emeli/cli` | Hub: vision, architecture, spec, roadmap, `emeli` CLI |
| [`emeli-mail-tokens`](https://github.com/igor-ganov/emeli-mail-tokens) | `@emeli/tokens` | Design tokens (CSS custom properties + typed TS) |
| [`emeli-mail-theme-terracotta`](https://github.com/igor-ganov/emeli-mail-theme-terracotta) | `@emeli/theme-terracotta` | Default pluggable style pack |
| [`emeli-mail-ui-message-row`](https://github.com/igor-ganov/emeli-mail-ui-message-row) | `@emeli/ui-message-row` | Headless message-list-row component |
| [`emeli-mail-ui-message-list`](https://github.com/igor-ganov/emeli-mail-ui-message-list) | `@emeli/ui-message-list` | Headless listbox composing message rows |
| [`emeli-mail-ui-message-body`](https://github.com/igor-ganov/emeli-mail-ui-message-body) | `@emeli/ui-message-body` | Sandboxed email-body renderer (CSP iframe) |
| [`emeli-mail-ui-compose`](https://github.com/igor-ganov/emeli-mail-ui-compose) | `@emeli/ui-compose` | Headless compose form (recipient parsing, validation) |
| [`emeli-mail-demo`](https://github.com/igor-ganov/emeli-mail-demo) | `@emeli/demo` | Component playground (self-hosted "storybook") |
| [`emeli-mail-core`](https://github.com/igor-ganov/emeli-mail-core) | `@emeli/core` | Domain model, `MailPort` contract, in-memory fake |
| [`emeli-mail-sanitize`](https://github.com/igor-ganov/emeli-mail-sanitize) | `@emeli/sanitize` | Email-HTML sanitizer + remote-content gate |
| [`emeli-mail-provider-yahoo`](https://github.com/igor-ganov/emeli-mail-provider-yahoo) | `@emeli/provider-yahoo` | Yahoo adapter: XOAUTH2, OAuth 2.0, IMAP parsing |
| [`emeli-mail-shell`](https://github.com/igor-ganov/emeli-mail-shell) | — | Tauri + Astro/Lit desktop composition |

Planned but not yet created libraries (shell, protocol adapters, more
components) are listed in [`ROADMAP.md`](ROADMAP.md).

## The `emeli` CLI

One entry point for every task in the polyrepo:

```
emeli new component <name>   # scaffold a headless component repo
emeli dev                    # run the component playground
emeli test [package]         # run unit tests
emeli build [package]        # build one or all packages
emeli doctor                 # check toolchain (bun, rust, tauri, gh)
```

See [`docs/cli.md`](docs/cli.md). Install with `bun install` then `bun run cli`,
or link globally (`bun link`) for a bare `emeli`.

## Getting started

```sh
git clone https://github.com/igor-ganov/emeli-mail
cd emeli-mail
bun install
bun run cli doctor      # verify your toolchain
bun run cli dev         # open the playground
```

Prerequisites: **bun ≥ 1.3**, **Rust ≥ 1.94** (for the Tauri shell),
**gh** (for repo automation).

## License

MIT © igor-ganov
