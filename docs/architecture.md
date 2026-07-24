# Architecture

emeli-mail is a desktop email client assembled from small, independently
versioned libraries. This document describes the layers, the trust boundaries,
and the conventions every library follows.

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Tauri shell (Rust)                                          │
│  · window / tray / notifications / secure token storage     │
│  · IPC command surface consumed by the UI                   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  App WebView  (Astro + Lit)                           │  │
│  │  · headless UI components (@emeli/ui-*)               │  │
│  │  · theme pack (@emeli/theme-*)  ← swappable           │  │
│  │  · view state, routing, composition                  │  │
│  │                                                       │  │
│  │   renders message body via ↓ (never inline)           │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Sandboxed body renderer  (isolated)            │  │  │
│  │  │  · strict CSP, no scripting, no top-nav          │  │  │
│  │  │  · remote content proxied + consent-gated        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Protocol layer (TS, runs in the Rust-side sidecar/worker)  │
│  · MailPort  ← one interface, many provider adapters         │
│  · yahoo (IMAP+OAuth) · outlook (Graph) · gmail (Gmail API)  │
└─────────────────────────────────────────────────────────────┘
```

## Trust boundaries

Three boundaries, from most to least trusted:

1. **Rust shell** — holds OS integration and, crucially, the OAuth tokens.
   Tokens live in the OS keychain via Tauri, never in the WebView or in
   `localStorage`. The UI asks the shell to perform authenticated calls; it
   never sees a refresh token.
2. **App WebView** — our own trusted Astro + Lit code. It composes UI and issues
   IPC commands. It handles no third-party HTML.
3. **Sandboxed body renderer** — the only place untrusted email HTML is ever
   parsed. See below.

### Email body rendering

Email HTML is hostile by default: tracking pixels, CSS exfiltration, `<script>`,
`<form>` phishing, `<meta refresh>` redirects. The rule is absolute: **untrusted
message HTML never runs in the app WebView.**

- The body renders in a **separate isolated context** (sandboxed `iframe` with
  `sandbox` allowing neither `allow-scripts` nor `allow-same-origin`, backed by
  a strict `Content-Security-Policy` that denies `script-src`, `object-src`,
  `frame-src`, and default-denies `img-src`/`connect-src`).
- HTML is **sanitized** before display (allowlist of tags/attributes; all event
  handlers, `<script>`, `<style>` scoping, `javascript:`/`data:` URLs stripped).
- **Remote content is off by default.** Images and links route through a proxy
  that strips referrers and blocks until the user consents per-sender, defeating
  open-tracking pixels.

This is why the product brief's "Firefox engine for mail" instinct is honoured
as a *dedicated, sandboxed rendering context* rather than a second browser
engine bundled into the app: the security goal (isolate untrusted HTML) is met
without the weight of shipping Gecko.

## Protocol layer — `MailPort`

One port, many adapters. The UI and the sync engine speak only to `MailPort`;
providers are swappable implementations selected per account.

```ts
interface MailPort {
  readonly listFolders: () => Effectful<readonly Folder[]>;
  readonly listMessages: (q: MessageQuery) => Effectful<Page<MessageHeader>>;
  readonly getBody: (id: MessageId) => Effectful<MessageBody>;
  readonly send: (draft: OutgoingDraft) => Effectful<SentReceipt>;
  readonly watch: (folder: FolderId) => AsyncIterable<MailEvent>;
}
```

| Provider | Auth | Transport | Notes |
| --- | --- | --- | --- |
| Yahoo (first) | OAuth 2.0 | IMAP IDLE + SMTP submission | OAuth bearer as SASL XOAUTH2 |
| Outlook | OAuth 2.0 | Microsoft Graph | delta queries, webhooks |
| Gmail | OAuth 2.0 | Gmail API | history API, watch push |

Adapters are pure translation between the provider's shape and our domain model;
network effects are described as values (see *Functional core*) so adapter logic
is unit-testable without a live account.

## UI: headless components + theme packs

Components are **headless**: they own structure, behaviour, state and
accessibility, and expose styling seams — never a finished look.

- Styling seams: `part` attributes, named `slot`s, and a documented set of CSS
  custom properties (`--emr-*` per component).
- A **theme pack** (`@emeli/theme-*`) is a separate repository that ships CSS
  targeting those parts and variables. Swapping the theme swaps the entire look
  with no change to component code.
- **Tokens** (`@emeli/tokens`) are the shared vocabulary — colour, spacing,
  radius, typography — consumed by every theme pack.

Component rules (from the shared Angular/Lit conventions):

- Minimal size; **no UI nesting beyond one level**.
- Declarative templates; no imperative DOM building.
- Logic extracted into pure helpers in a sibling `lib/`, each unit-tested.

## Functional core

- Business logic is **pure functions** composed into readable pipelines and
  extracted into reusable libraries.
- Side effects (network, storage, clock) are pushed to the edges and described
  as result-returning values rather than thrown exceptions, so pipelines read
  top-to-bottom and test without mocks-of-mocks.
- No `any`, no casting, no `null` (use `undefined`) — see the repo's TypeScript
  conventions.

## Demo framework

`@emeli/demo` is a small, self-written component playground (a lightweight
"storybook"): it loads component *stories*, renders knobs for each public
property, and offers theme and viewport (mobile-first) toggles so components can
be exercised in isolation. It depends on the component libraries and the theme
packs, never the other way around.

## Tooling

- **Runtime / package manager:** bun.
- **Component tests:** `@web/test-runner` + `@open-wc/testing` (real browser).
- **Pure-logic tests:** bun's test runner.
- **Build:** `tsc` per library; Astro for the demo and app; Tauri for the shell.
- **CLI:** `emeli` orchestrates scaffolding, dev, test and build across repos.
