# Tasks — emeli-mail (first slice)

Each task traces to requirements/design and maps to a roadmap item. `[x]` done in
this foundation session, `[ ]` pending.

## Foundation (this session)

- [x] **T1** Hub docs: README, architecture, spec, roadmap — R1, R6
- [x] **T2** `@emeli/tokens`: typed tokens + CSS emission, light/dark, tests — R2
- [x] **T3** `@emeli/ui-message-row`: headless component + pure helpers + tests — R3, R4
- [x] **T4** `@emeli/theme-terracotta`: pluggable style pack for the component — R2.4, D5
- [x] **T5** `@emeli/demo`: playground with stories, knobs, theme/viewport toggles — R5
- [x] **T6** `@emeli/cli`: `doctor`, `new component`, `dev`, `test`, `build` — R1
- [x] **T7** Create the 5 GitHub repos under igor-ganov, push, open the roadmap Project

## M1 — Read a Yahoo inbox (this session)

- [x] **T8** Tauri shell repo: window, secure keychain token storage, IPC surface — arch §Trust — `emeli-mail-shell` (cargo check green)
- [x] **T9** `MailPort` interface + in-memory fake adapter for tests — arch §Protocol — `emeli-mail-core`
- [~] **T10** Yahoo adapter: OAuth 2.0, IMAP, XOAUTH2 — `emeli-mail-provider-yahoo` built & tested; **live wiring pending Yahoo OAuth credentials**
- [x] **T11** Sandboxed body renderer: sanitizer + CSP iframe + remote-content gate — R6 — `emeli-mail-sanitize` + `emeli-mail-ui-message-body`
- [x] **T12** Message-list component composing `ui-message-row` — R3 — `emeli-mail-ui-message-list`
- [x] **T13** App shell composition (folders / list / reader) in Astro + Lit — NFR1 — `emeli-mail-shell` (verified on the in-memory provider)

## Next (M2+)

- [ ] **T10-live** Register a Yahoo OAuth app; wire the live IMAP/TLS transport in the shell, swap the fake for the Yahoo port
- [ ] **T14** Outlook (Graph) and Gmail (Gmail API) adapters — arch §Protocol
- [ ] **T15** Compose + send pipeline through `MailPort.send` — R (send)
- [ ] **T16** Virtualize the message list for large mailboxes — R3

## Definition of done (per library)

- README with usage; public API documented.
- Unit tests green; no `any`/casting/`null`.
- Mobile-first verified at 360px (for visual components).
- CI runs tests on push.
