# ADR 0042: LoadingState (a region's loading state: a labeled spinner after a delay)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's ask relayed on #1032 and D-0130 (A: labeled spinner, Skeleton opt-in). Decision D-0131 (owner may switch).
- **Issue:** #1032 (S2). Brief: `docs/pds1/slices/1032/brief.md`. Design (G2): `docs/pds1/slices/1032/design.md`, which owns the look. This entry owns the names.

## Context

- The owner rejected the gray shimmer bars. He wants a spinner with a short label, centered in the region, shown only when loading takes longer than about 1 second (D-0130).
- What already exists:
  - `Spinner` (`Loading.tsx`): an inline ring for controls, with a hidden label and `role="status"`.
  - `LoadingOverlay`: a veil over content that is already shown, with a spinner or ProgressBar and a message. It takes `delay` in ms (default 0), and its own notes say "for content that loads the first time, use skeletons".
  - `Skeleton`: the default in `EntityTitle` (`loading`) and `MetricCard` (`state="loading"`). CTM copies that pattern with `P.Skeleton`.
  - `DataGrid` shows "Loading…" text only in remote mode (`fetchRows`). With `rows`, it has no loading state, so apps draw their own bars. `ListingPage` has none either.
- `motion-loading-delay` is 0.5 s (`ref.motion-delay-long-press`) and times control spinners. The brief keeps controls unchanged.

## Options

| Option | For | Against |
|---|---|---|
| **A. A new `LoadingState` export (the first-load sibling of `EmptyState`), used by the defaults. `LoadingOverlay` draws its status with it** | One region pattern, named the way `EmptyState` is. The progress and label behavior is shared with the overlay, not copied. | One new export. |
| B. Add `delay`, `centered` and a visible label to `Spinner` | No new export | Spinner is the inline control ring. A visible, centered region layout overloads it, and it would need two `role="status"` behaviors. |
| C. Use `LoadingOverlay` without children | No new API | A veil over nothing. Its 0 ms default delay would have to change for every save overlay, and the name says "over content". |

## Decision

**Option A** (D-0131; reply B or C on #1032 to switch).

### `LoadingState` (new export, from `Loading`)

```ts
type LoadingStateProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: React.ReactNode;          // default: the catalog's loading.label
  progress?: number | null;         // 0 to 100: a ProgressBar with the label replaces the spinner
  delay?: number;                   // ms; default: the token motion-loading-region-delay; 0 shows at once
  size?: 'sm' | 'md' | 'lg';        // the spinner size; default "md"
  labelPosition?: 'below' | 'after';// Fluent 2 Spinner's name; default "below"
  strings?: Catalog | null;
};
```

- **Layout:**
  - It fills its region (`block-size: 100%`, `inline-size: 100%`) and centers the spinner and the visible label.
  - It keeps a minimum block size (`loading-state-min-block-size`), so the region keeps its size and nothing jumps when the data arrives.
- **Delay:**
  - Before the delay ends, nothing renders inside it: no ring, no label, no Skeleton (AC-1).
  - The default delay is read once at mount from `--plx-sys-motion-loading-region-delay` (fallback 1000 ms), so the token is the one source.
  - `delay={0}` shows at once.
- **Accessibility:**
  - The wrapper is `role="status"` (polite) and is in the DOM from the start, empty, so the label is announced once when it appears.
  - The ring is `aria-hidden`, so there is only one status, not the Spinner's nested one.
  - With `progress`, the ProgressBar carries the value and the label names it.
- **Reduced motion:** the ring stands still through the existing loop tokens, and the label still shows (AC-5).
- **Arabic:** the default label comes from the catalog (`loading.label`; `ar.js` follows D-0012). The layout uses logical properties only, so it mirrors (AC-6).

### Defaults switched to it (no Skeleton in any default or template, AC-3)

- **`EntityTitle loading`:** `LoadingState size="sm" labelPosition="after"` in place of the two bars. `aria-busy` stays.
- **`MetricCard state="loading"`:** `LoadingState` in the card body. The card keeps its size.
- **`DataGrid`:**
  - New prop **`loading?: boolean`** (default `false`). With no rows to show, the placeholder row shows `LoadingState labelPosition="after"` in place of the empty text.
  - Remote mode (`fetchRows`) shows the same state in place of its "Loading…" text, in the empty row and the "more rows" row.
  - With rows already shown, `loading` changes nothing; use `LoadingOverlay` for a refresh.
- **`ListingPage`:** new prop **`loading?: boolean`**, passed to its DataGrid.
- **`LoadingOverlay`:** draws its status with `LoadingState` (`delay={0}`, since the overlay keeps its own `delay`). Its props and behavior don't change. Its "use skeletons" note becomes "use LoadingState".

### Tokens (comp -> sys only)

- `plx-ref.motion-delay-slow-load` = 1 s (new ref value).
- `plx-sys.motion-loading-region-delay` -> `{plx-ref.motion-delay-slow-load}`. `motion-loading-delay` (0.5 s, controls) is unchanged.
- `plx-comp.loading-state-gap` -> `{plx-sys.space-stack-sm}`.
- `plx-comp.loading-state-padding` -> `{plx-sys.space-inset-lg}`.
- `plx-comp.loading-state-min-block-size` -> a `plx-sys` size that G2 names in the design. It must be a sys token, never a raw value.
- `plx-comp.loading-state-label-color` -> `{plx-sys.content-subtle}` (as `empty-state-text`). G2 may choose otherwise.
- `plx-comp.loading-state-label-font-size` -> `{plx-sys.text-body-font-size}`. `loading-state-label-line-height` -> `{plx-sys.text-body-line-height}`.
- **Fixed with it:** `loading-overlay-message-font-size` and `loading-overlay-message-line-height` point at `plx-ref` (a comp -> ref tier skip). They move to the same sys tokens.

### Classes

- `plx-loading-state`, `plx-loading-state--after`, `plx-loading-state__label`. The ring reuses `plx-spinner plx-spinner--<size>`.

### Skeleton

- `Skeleton` keeps its API, and it is **opt-in only**: no Plenix default, template or doc example uses it for a region's loading.
- Its doc header says so and points to `LoadingState`.
- It is **not deprecated** now (D-0130 A). Removing it is P2 and needs the owner: deprecate in a minor, remove in 2.0.0.

## Consequences

- **Semver: MINOR.**
  - *Added:* `LoadingState`, `DataGrid.loading`, `ListingPage.loading`, the tokens and the classes.
  - *Changed:* the EntityTitle, MetricCard and DataGrid remote loading looks.
  - *Fixed:* the overlay message tier skip.
- No prop is removed and no type narrows, so it is not breaking. The loading defaults change their look, which the owner asked for.
- CTM replaces `P.Skeleton` with `P.LoadingState`, or with `loading` on its DataGrid or ListingPage (CTM issue).
- Visual baselines for EntityTitle, MetricCard, DataGrid and LoadingOverlay are refreshed on the build PR, in light and dark. Add RTL, because a label is added.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7 on the new tokens and on the two moved overlay tokens.
- The build PR's tests (brief AC-1 to AC-6):
  - nothing inside before the delay;
  - after it, a centered label with one `role="status"`, and a ring that is `aria-hidden`;
  - `progress` gives a ProgressBar;
  - `delay={0}` shows at once;
  - EntityTitle, MetricCard, DataGrid (`loading`, remote) and ListingPage render no `.plx-skeleton`;
  - reduced motion keeps a still ring and the label;
  - the Arabic catalog label shows, and the layout mirrors.
- Planned: a check-system rule that fails when any `platform/components`, `patterns` or `templates` file other than `Loading.tsx` renders `Skeleton`.
