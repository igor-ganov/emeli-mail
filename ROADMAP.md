# Roadmap — emeli-mail

Tracked on the GitHub Project board
[**Emeli-mail Roadmap**](https://github.com/users/igor-ganov/projects/3). This
file is the human-readable mirror; the board is the source of truth for status.

## Milestones

### M0 — Foundation  ·  _done_
Prove the architecture at the smallest useful size.
- [x] Hub: vision, architecture, spec, roadmap, `emeli` CLI
- [x] `@emeli/tokens` — design tokens (light/dark)
- [x] `@emeli/ui-message-row` — first headless component
- [x] `@emeli/theme-terracotta` — pluggable style pack
- [x] `@emeli/demo` — component playground

### M1 — Read an inbox  ·  _built; live Yahoo pending credentials_
The first user-visible capability: read mail. The whole slice runs today on the
in-memory provider; the shell reads, renders safely, and blocks tracking.
- [x] Tauri shell + secure keychain token storage (`emeli-mail-shell`)
- [x] `MailPort` + in-memory fake (`@emeli/core`)
- [~] Yahoo adapter — XOAUTH2, OAuth 2.0, IMAP parsing built & tested
      (`@emeli/provider-yahoo`); live wiring needs a Yahoo OAuth app
- [x] Sanitizer + sandboxed body renderer with remote-content gate
      (`@emeli/sanitize`, `@emeli/ui-message-body`)
- [x] Message list + reader composition (`@emeli/ui-message-list`, shell)

### M2 — Compose & send  ·  _built on the in-memory provider_
- [x] Compose component + draft model (`@emeli/ui-compose`)
- [x] Send through `MailPort.send`; message lands in Sent (shell)
- [ ] Live SMTP submission via XOAUTH2 (with the Yahoo transport)
- [ ] Attachments

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
