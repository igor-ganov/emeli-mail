# Design — emeli-mail (first slice)

Traces to [`requirements.md`](requirements.md). Covers the foundation, tokens,
the first headless component, its theme pack, and the playground.

## D1 — Polyrepo & CLI (R1)

- The hub (`emeli-mail`) hosts the `emeli` CLI as `@emeli/cli` with a `bin`.
- CLI subcommands are pure command descriptors dispatched by a small runner; each
  subcommand is a function `(args) => Effect`, unit-tested without spawning
  processes where possible. → R1.1
- `doctor` probes tool versions by reading `--version` output and comparing with
  a required-range table (pure comparison; process spawn at the edge). → R1.2
- `new component <name>` copies a template directory and rewrites the package
  name / element tag from `<name>`. Template ships with one passing test. → R1.3

## D2 — Tokens `@emeli/tokens` (R2)

- **Single source:** token values are declared once as typed TS objects
  (`colors`, `spacing`, `radius`, `typography`, `shadows`, `transitions`).
- **Two emissions from that source:**
  - a `:root` / `:root[data-theme="dark"]` CSS file with `--emeli-*` custom
    properties (R2.1, R2.2);
  - the typed objects, re-exported for tools that need values in TS.
- **Palette (evolved from Prometheus public-website):** the warm terracotta
  identity is kept as the brand accent; a cool "focus/unread" accent is added
  because a mail list needs an unmistakable unread/active signal; semantic
  colours (success/warning/danger) cover mail states (sent, draft, error/spam).
- Naming: `--emeli-color-*`, `--emeli-space-*`, `--emeli-radius-*`,
  `--emeli-font-*`, `--emeli-shadow-*`, `--emeli-motion-*`. → R2.3

## D3 — Headless component contract (R3)

Every `@emeli/ui-*` component:

- extends a thin Lit base; template is declarative; helpers live in `src/lib/*`
  as pure functions, one concern per file, each unit-tested. → R3.6
- exposes: `part` on every stylable node; named `slot`s for content seams;
  `--<prefix>-*` custom properties for local tuning. Ships **no colours**. → R3.2
- reflects state to host attributes (`unread`, `selected`, `flagged`) so themes
  and parents can target `:host([unread])`. → R3.4
- carries correct ARIA roles, is keyboard operable, exposes a focus target the
  theme styles. → R3.5
- keeps UI one level deep. → R3.3

## D4 — `@emeli/ui-message-row` (R4)

Public API:

```ts
type MessageRowData = {
  readonly id: string;
  readonly sender: string;      // display name or address
  readonly subject: string;
  readonly snippet: string;
  readonly time: number;        // epoch ms
  readonly unread?: boolean;
  readonly flagged?: boolean;
};

// properties
message: MessageRowData;
selected = false;
now?: number;                   // injectable reference time (defaults to Date.now at render edge)

// events
'emeli-open'  detail: { id: string }
'emeli-flag'  detail: { id: string; flagged: boolean }
```

Structure (one level deep):

```
:host([unread])[role=option]
  part="row"        (the activatable container)
    part="sender"   <slot name="avatar"></slot> {sender}
    part="subject"  {subject}
    part="snippet"  {snippet}
    part="time"     {relativeTime(time, now)}
    part="flag"     (button, aria-pressed=flagged)
```

Helpers (pure, in `src/lib/`):

- `relativeTime(time, now) => string` — compact label; the R4.5 table. Pure and
  fully unit-tested across boundaries (seconds, minutes, hours, this week, older,
  year rollover). → R4.5
- `activationFromEvent(event) => 'open' | 'flag' | undefined` — maps click /
  Enter / Space / flag-button to an intent, keeping the element's event handler
  a thin dispatch. → R4.3

Behaviour: Enter/Space and click on the row → `emeli-open`; activating the flag
part → `emeli-flag` and toggles the `flagged` state (R4.2–R4.4).

## D5 — `@emeli/theme-terracotta` (R2.4)

- A separate repo shipping one CSS entry that styles `@emeli/ui-*` parts using
  `@emeli/tokens` variables: `emeli-message-row::part(row)`,
  `:host([unread])::part(subject)`, focus ring, hover, selected background.
- Importing this CSS is the only step to give headless components a look; a
  second theme pack could replace it wholesale. → R2.4

## D6 — Playground `@emeli/demo` (R5)

- Astro app; each *story* is `{ element, title, args, argTypes }`.
- A `<story-host>` Lit element renders the element with current args and
  regenerates knobs from `argTypes` (string → text, boolean → checkbox,
  number → range/number, enum → select). → R5.1, R5.2
- Top bar toggles `data-theme` and a viewport frame (360px vs full). → R5.3
- Imports the terracotta theme so stories are styled; theme is swappable in the
  bar to demonstrate R2.4.

## Testing strategy

- Pure helpers (`relativeTime`, `activationFromEvent`, CLI comparators, knob
  derivation): bun test, exhaustive on boundaries.
- Component behaviour/DOM/ARIA: `@web/test-runner` + `@open-wc/testing`.
- Each repo runs its own tests in CI (GitHub Actions).
