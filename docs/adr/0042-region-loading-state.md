# ADR 0042: LoadingState (a region's loading state: a labeled spinner after a delay)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's ask relayed on #1032 and D-0130 (A: labeled spinner, Skeleton opt-in). Decision D-0131 (owner may switch).
- **Issue:** #1032 (S2).
  - Brief: `docs/pds1/slices/1032/brief.md`.
  - Design (G2, PR #1042): `docs/pds1/slices/1032/design.md`. It owns the look, the sizes, the colors and the Spinner props (§2). This entry adopts them and names the region helper, the new props and the tokens.

## Context

- The owner rejected the gray shimmer bars. He wants a spinner with a short label, centered in the region, shown only when loading takes longer than about 1 second (D-0130).
- What already exists:
  - `Spinner` (`Loading.tsx`): an inline ring for controls, with a hidden label and `role="status"`.
  - `LoadingOverlay`: a veil over content that is already shown, with a spinner or ProgressBar and a message. It takes `delay` in ms (default 0), and its own notes say "for content that loads the first time, use skeletons".
  - `Skeleton`: the default in `EntityTitle` (`loading`) and `MetricCard` (`state="loading"`). CTM copies that pattern with `P.Skeleton`.
  - `DataGrid` shows "Loading records" text only in remote mode (`fetchRows`). With `rows`, it has no loading state, so apps draw their own bars. `ListingPage` has none either.
- `motion-loading-delay` is 0.5 s (`ref.motion-delay-long-press`) and times control spinners. Controls keep it (G2 §1).
- G2 §2 fixes the Spinner props (`labelPosition`, `delay`) and asks G3 to name the one region helper: either `Spinner.Region` or a flag on `Spinner`.

## Options (the region helper's name)

| Option | For | Against |
|---|---|---|
| **A. A named export `LoadingState`, built from `Spinner`** | It is the first-load sibling of `EmptyState`, so it is found the same way. It gets its own export, its own `.d.ts` type and tree-shaking. On the CDN it is `P.LoadingState`. | One new export name. |
| B. A static `Spinner.Region` | It sits next to Spinner, as `Chat.Typing` does. | A static is not a named ESM export: it has no tree-shaking and no separate prop type. A grep for loading regions finds no name of its own. |
| C. A `region` flag on `Spinner` | No new name | A flag that changes layout, delay, size and nesting overloads the inline control ring. |

## Decision

**Option A** (D-0131; reply B or C on #1032 to switch).

### `Spinner` (new props, exactly G2 §2)

- `labelPosition?: 'hidden' | 'after' | 'below'`, default `'hidden'`. Today's behavior is unchanged, and buttons and controls keep it.
- `delay?: number | 'region'`:
  - When it is set, the spinner renders nothing until the delay passes.
  - `'region'` reads `--plx-sys-motion-loading-region-delay` once at mount (fallback 1000 ms), so the token stays the one source.
  - Unset means it shows at once, as today.
- With a visible label, the label **is** the `role="status"` text, with no second hidden copy, so it is announced once. The ring is `aria-hidden`.

### `LoadingState` (new export, from `Loading`)

```ts
type LoadingStateProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: React.ReactNode;            // default: the catalog's loading.label; devWarn asks for a label that names the thing
  progress?: number | null;           // 0 to 100: a ProgressBar with its label above, in place of the ring
  size?: 'sm' | 'md' | 'lg';          // default "lg" (a page, panel, card or dialog body); "md" in one-line regions and grid rows
  labelPosition?: 'after' | 'below';  // default "after" (D-0130 A)
  delay?: number | 'region';          // default "region"; 0 shows at once
  strings?: Catalog | null;
};
```

- **Layout:** it is the centered flex box (both axes) that fills its region. The region keeps its own size: a card keeps its height, and a grid keeps its header and toolbar. The layout lives here only.
- **Accessibility:**
  - It sets no `aria-busy`. The region that owns the content sets it, as `EntityTitle`, `MetricCard` and `DataGrid` do.
  - It holds one `role="status"`, through its Spinner.
- **Nesting:** only the outermost `LoadingState` draws. It provides an internal context, and an inner `LoadingState` renders nothing (G2 §6). The context is not exported.
- **Error:** it has no error state. The owning region swaps it for its error message and Retry (G2 §3).

### Defaults switched (no Skeleton in any default or template, AC-3; sizes from G2 §4)

- **`EntityTitle loading`:** a `sm` `Spinner` with `labelPosition="hidden"` and `delay="region"` at the text's start. It is a line, not a region. `aria-busy` stays.
- **`MetricCard state="loading"`:** `LoadingState size="lg"` in the body, with the label `strings.loading`. The header stays.
- **`DataGrid`:**
  - **New prop `loading?: boolean`** (default `false`). With no rows to show, the placeholder row shows `LoadingState size="md"` with `strings.loading` in place of the empty text.
  - Remote mode's first load shows the same.
  - The "more rows" row uses a `md` `Spinner` with `labelPosition="after"` and `delay="region"`. The row is already `role="status"`, so it is not wrapped in a second status.
  - With rows already shown, `loading` changes nothing; use `LoadingOverlay` for a refresh.
- **`ListingPage`:** **new prop `loading?: boolean`**, passed to its DataGrid.
- **`LoadingOverlay`:** its props, look and behavior are unchanged. Its "use skeletons" note becomes "use `LoadingState`".

### Tokens (ref -> sys -> comp, no skipping)

- `plx-ref.motion-delay-loading-region` = 1 s (G2's name).
- `plx-sys.motion-loading-region-delay` -> `{plx-ref.motion-delay-loading-region}`. It is not in the reduced-motion file, because a delay is not motion. `motion-loading-delay` (0.5 s) is unchanged.
- `plx-comp.spinner-label-gap` -> `{plx-sys.space-inline-sm}`.
- `plx-comp.spinner-label-text` -> `{plx-sys.content-default}`.
- `plx-comp.spinner-label-font-size` -> `{plx-sys.text-body-font-size}`. `spinner-label-line-height` -> `{plx-sys.text-body-line-height}`.
- The arc remap (`spinner-border-*-color` -> `feedback-info-solid`) is G2's, in #1042.
- **Fixed with the build:** `loading-overlay-message-font-size` and `loading-overlay-message-line-height` point at `plx-ref` (a comp -> ref skip). They move to the `text-body-*` sys tokens.

### Classes

- `plx-loading-state`.
- `plx-spinner-wrap--after` and `plx-spinner-wrap--below` (the ring and the visible label).
- `plx-spinner__label`.
- The ring keeps `plx-spinner plx-spinner--<size>`.

### Skeleton

- `Skeleton` keeps its API and is **opt-in only**. No Plenix component, pattern, template or doc example uses it. Its header says so.
- It is **not deprecated** now (D-0130 A). Removing it needs the owner: deprecate in a minor, remove in 2.0.0.

## Consequences

- **Semver: MINOR.**
  - *Added:* `LoadingState`, `Spinner.labelPosition`, `Spinner.delay`, `DataGrid.loading`, `ListingPage.loading`, the tokens and the classes.
  - *Changed:* the EntityTitle, MetricCard and DataGrid loading looks.
  - *Fixed:* the spinner's dark-mode contrast (G2), the filled-button arc (G2), and the overlay tier skip.
- No prop is removed and no type narrows, so the change is not breaking. Every Spinner default is today's behavior.
- CTM replaces `P.Skeleton` with `P.LoadingState`, or with `loading` on its DataGrid or ListingPage (CTM issue).
- Visual baselines are refreshed on the build PR: light and dark, plus RTL, because a label is added.

## Enforced by

- G3 on the build PR: the API diff matches this entry, and it adds no props beyond it.
- Checks 6 and 7 on the new tokens and on the two moved overlay tokens.
- The build PR's tests (brief AC-1 to AC-6, G2 §6):
  - nothing is drawn or announced at 999 ms, and it draws at 1000 ms;
  - one `role="status"`, with the ring `aria-hidden`;
  - `progress` gives a ProgressBar;
  - `delay={0}` shows at once;
  - a nested `LoadingState` draws nothing;
  - the Spinner defaults are unchanged;
  - EntityTitle, MetricCard, DataGrid (`loading` and remote) and ListingPage render no `.plx-skeleton`;
  - reduced motion keeps a still ring and the label;
  - Arabic uses the catalog label and the layout mirrors.
- `planned:no-default-skeleton` (check-system, G2 §8): it fails when a file under `platform/components`, `patterns` or `templates` outside `Loading/` imports `Skeleton` or uses `plx-skeleton`.
