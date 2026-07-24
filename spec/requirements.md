# Requirements — emeli-mail

Requirements use EARS phrasing (Easy Approach to Requirements Syntax). Each
acceptance criterion is testable. IDs are stable and referenced from
[`design.md`](design.md) and [`tasks.md`](tasks.md).

## Scope of the first slice

The first vertical slice proves the architecture end to end at the smallest
useful size: **read a Yahoo inbox and display its message list**, with the whole
UI built from headless components and themed by a swappable pack. Compose, more
providers, and search follow on the [roadmap](../ROADMAP.md).

## R1 — Toolchain & polyrepo foundation

- **R1.1** The system SHALL provide an `emeli` CLI that scaffolds, builds and
  tests every library from the hub.
- **R1.2** WHEN a developer runs `emeli doctor`, the CLI SHALL report the
  presence and version of bun, Rust, Tauri prerequisites and gh.
- **R1.3** WHEN a developer runs `emeli new component <name>`, the CLI SHALL
  generate a headless-component repository skeleton with a passing unit test.

## R2 — Design tokens & theming

- **R2.1** The system SHALL expose design tokens both as CSS custom properties
  and as typed TypeScript values from a single source.
- **R2.2** The system SHALL provide light and dark token sets selectable via a
  `data-theme` attribute on the document root.
- **R2.3** Components SHALL contain no hard-coded colour, spacing or typography;
  all visual values SHALL resolve from tokens through a theme pack.
- **R2.4** WHEN the active theme pack is swapped, the rendered appearance SHALL
  change with no modification to component source.

## R3 — Headless components

- **R3.1** Each component SHALL be its own repository and `@emeli/*` package.
- **R3.2** A component SHALL expose styling seams (`part`, named `slot`s, `--*`
  custom properties) and SHALL NOT ship a finished visual style.
- **R3.3** A component SHALL nest UI no deeper than one level.
- **R3.4** WHERE a component conveys state (unread, selected, flagged), it SHALL
  express that state on a host attribute or `part` so themes can target it.
- **R3.5** Each component SHALL meet WCAG AA: correct roles, keyboard operability
  and a visible focus indicator (theme-provided).
- **R3.6** Every pure helper used by a component SHALL have unit tests.

## R4 — Message-row component (first component)

- **R4.1** The component SHALL display sender, subject, snippet and a relative
  timestamp from a single `message` property.
- **R4.2** WHEN `message.unread` is true, the component SHALL set an `unread`
  host state that themes can target.
- **R4.3** WHEN the user activates the row (click, Enter or Space), the component
  SHALL emit an `emeli-open` event carrying the message id.
- **R4.4** WHILE the row is selected, the component SHALL set `aria-selected` and
  a `selected` host state.
- **R4.5** The relative timestamp SHALL be produced by a pure function that,
  given a message time and a reference time, returns a compact label
  (e.g. `now`, `12m`, `3h`, `Mon`, `14 Mar`).

## R5 — Playground (demo framework)

- **R5.1** The playground SHALL render each registered component story in
  isolation.
- **R5.2** The playground SHALL provide a knob for every public property of a
  storied component.
- **R5.3** The playground SHALL toggle light/dark theme and a mobile/desktop
  viewport.

## R6 — Mail body safety (design-level, enforced later)

- **R6.1** Untrusted message HTML SHALL NOT be rendered in the app WebView; it
  SHALL render only in the sandboxed body context (see architecture).
- **R6.2** Remote content in a message body SHALL be blocked until the user
  consents for that sender.

## Non-functional

- **NFR1** Mobile-first: every component SHALL be usable and legible at 360px
  width before any desktop enhancement.
- **NFR2** No `any`, no type casting, no `null` in TypeScript sources.
- **NFR3** Every library SHALL ship a README and CI that runs its tests.
