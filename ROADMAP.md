# Roadmap — emeli-mail

Tracked on the GitHub Project board
[**Emeli-mail Roadmap**](https://github.com/users/igor-ganov/projects/3). This
file is the human-readable mirror; the board is the source of truth for status.

## Milestones

### M0 — Foundation  ·  _in progress_
Prove the architecture at the smallest useful size.
- Hub: vision, architecture, spec, roadmap, `emeli` CLI
- `@emeli/tokens` — design tokens (light/dark)
- `@emeli/ui-message-row` — first headless component
- `@emeli/theme-terracotta` — pluggable style pack
- `@emeli/demo` — component playground

### M1 — Read a Yahoo inbox
The first user-visible capability: sign in and read mail.
- Tauri shell + secure token storage
- `MailPort` + in-memory fake
- Yahoo adapter (OAuth 2.0, IMAP IDLE, XOAUTH2)
- Sandboxed body renderer (sanitizer + CSP + remote-content gate)
- Message list (virtualized) + reader composition

### M2 — Compose & send
- Compose component + draft model
- `MailPort.send` (SMTP submission via XOAUTH2)
- Attachments

### M3 — Outlook
- Microsoft Graph adapter (delta + webhooks)

### M4 — Gmail
- Gmail API adapter (history + push)

### M5 — Polish
- Search, threads/conversations, keyboard-first navigation
- Offline cache, background sync
- Packaging & auto-update for all three desktop platforms

## Epics (Project board columns map to these)

| Epic | Repos in scope |
| --- | --- |
| **Design system** | tokens, theme-* |
| **Components** | ui-* libraries, demo |
| **Shell** | tauri shell, CLI |
| **Protocol** | mail-port, provider adapters |
| **Security** | body renderer, token storage, content proxy |
| **Docs** | hub, per-repo READMEs |

## Principles that gate every item

- Headless components, swappable themes.
- Pure functional core, unit-tested.
- Mobile-first, WCAG AA.
- Polyrepo, documentation-first.
