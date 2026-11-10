# ADR 0051: LoadingState after about 10 seconds: a "still loading" message and an optional Cancel

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's request (via CTM3 - PM, #1194, D-0158).
- **Issue:** #1194 (S3). G2 (`pds1-design-director`) owns the wording and the look; this entry owns the names.

## Context

- `LoadingState` (`platform/components/Loading/Loading.tsx`) follows the first two response-time limits: nothing before about 1 s (`motion-loading-region-delay`, D-0130, ADR 0042), then a spinner with its label, or a ProgressBar when `progress` is known.
- The third limit (about 10 s: keep the person informed and let them stop) is missing. The same spinner stays indefinitely.
- `LoadingOverlay` already takes `onCancel?(): void` and shows a Cancel button, with the string `loadingOverlay.cancel` (owner-approved Arabic إلغاء).
- `DataGrid loading` draws `<LoadingState size="md" label={strings.loading}>` (`engine/chrome.tsx`), and `ListingPage loading` passes `loading` to its DataGrid.
- The i18n Engineer asked for whole sentences with `{label}` inside, never joined pieces (#1194).

## Options

| Option | For | Against |
|---|---|---|
| **A. A token for the 10 s point; `LoadingState onCancel` (the LoadingOverlay name); `onLoadingCancel` on DataGrid and ListingPage; three `loading.*` strings** | Same names as the overlay; the delay is a token like the 1 s one; the grid prop reads as a handler of the loading state. | Two names for one idea (`onCancel` on the part, `onLoadingCancel` on the grid). The grid already has other cancel handlers, so a bare `onCancel` there would be ambiguous. |
| B. `loadingCancel` on the grid (the issue's example) | Short | Not an `on*` handler name, unlike every other callback prop. |
| C. A `slowAfter` prop instead of a token | Per-region tuning | A timing literal in app code; the 1 s point is already a token. |

## Decision

**Option A.**

### Tokens

- **New ref:** `motion-delay-loading-long`, 10 s, beside `motion-delay-loading-region` (1 s). It is an amount of time, and its name says the purpose, not the value.
- **New sys:** `motion-loading-long-delay` -> `{plx-ref.motion-delay-loading-long}` (`platform/tokens/semantic/motion-loading.tokens.json`). Its description says it is a wait and is not motion, so reduced motion keeps it, like the region delay.
- `LoadingState` reads it once, the same way it reads the region delay (`getComputedStyle` on the root, 10000 ms when it can't be read). The wait counts from when the LoadingState mounts.

### API

- **`LoadingState`:**
  - **`onCancel?(): void`.** From the long point, a Cancel button sits under the message and calls it. Without `onCancel`, there is no button.
  - From the long point, the label becomes the long message. It is the same `role="status"` text, changed once, so it is announced once.
  - With `progress` (a number), nothing changes: no long message and no Cancel from this rule. The bar already informs.
- **`DataGrid`:** `onLoadingCancel?(): void`, passed to its LoadingState as `onCancel`.
- **`ListingPage`:** `onLoadingCancel?(): void`, passed to its DataGrid.
- **No new class** beyond what G2's look needs. If the button needs its own spacing, the class is `plx-loading-state__cancel` (the BEM part name; MINOR).

### Strings (namespace `loading`, through `strings` and the catalog)

- `loading.slow`: the long message without a name (G2 words it, for example "Still loading. This is taking longer than usual.").
- `loading.slowNamed`: the same sentence with `{label}` inside, used when the app gives a string `label` (for example "Still loading {label}. This is taking longer than usual."). One string, with the name inside it, never joined.
- `loading.cancel`: "Cancel" (the owner-approved إلغاء, as `loadingOverlay.cancel`).
- A non-string `label` (a node) uses `loading.slow`.
- Arabic: @pds1-i18n-engineer checks `slow` and `slowNamed` (D-0078) and asks the owner only if needed (D-0012). Until then, the English ships behind it, and G6 holds only the release.

## Consequences

- **Semver: MINOR (1.7.0).** Added: the ref and sys token, `LoadingState.onCancel`, `DataGrid.onLoadingCancel`, `ListingPage.onLoadingCancel`, and the three strings. There is no change before 10 s, and no deprecation.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7: sys -> ref, and no value in a name.
- Locale check (G6): `loading.slow`, `loading.slowNamed` (with `{label}`) and `loading.cancel` are in `en.json`.
- Behavior tests (#1194):
  - nothing is drawn before 1 s, and the spinner shows at 1 s;
  - the long message shows at the long delay and is announced once;
  - Cancel shows only with `onCancel`, and clicking it calls `onCancel`;
  - with `progress`, there is no long message;
  - `DataGrid onLoadingCancel` reaches the button.
