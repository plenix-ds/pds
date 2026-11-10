# #1194 LoadingState: the 10-second stage (G2)

- **Request:** the owner (via CTM3 - PM, 2026-11-10): the spinner appears only for a real wait, following the standard response times (Nielsen: 0.1 s, 1 s, 10 s). Decision **D-0158** (PR #1195). Brief: issue #1194.
- **Extends:** `LoadingState` (`platform/components/Loading/Loading.tsx`, D-0130, ADR 0042) and DESIGN.md "Loading". DESIGN.md already says "past about 10 seconds, the region adds a Cancel button or a progress value". This builds that sentence.
- **Pattern reused:** LoadingOverlay's optional Cancel (`onCancel`, a `size="sm"` default Button under the indicator, `space-stack-sm` gap).
- **Readings applied (D-0159, the owner may switch):**
  - **A. The label stays and a second line is added.** At 10 s, "Loading cases…" stays, and a line under it reads "This is taking longer than usual." (one new catalog string). Reply **B** to replace the label with "Still loading cases…" (a `{label}` pattern per app label, so each app writes a second label).
- **With `progress`, nothing changes** (the PM's brief on #1194, ADR 0051): no second line and no Cancel. The bar already informs.
- **Names** (token, prop, string keys) are ADR 0051's (G3). The label is a whole phrase ("Loading cases…"), so the long message never wraps it: no `{label}` pattern ("Still loading {label}" would read "Still loading Loading cases…"). One string, `loading.slow`.

## 1. Look and timing

| Time from mount | No `progress` | With `progress` |
|---|---|---|
| 0 to 1 s (`motion-loading-region-delay`) | nothing (unchanged) | nothing (unchanged) |
| 1 to 10 s | ring and label (unchanged) | ProgressBar with its label (unchanged) |
| from 10 s (sys `motion-loading-long-delay` -> ref `motion-delay-loading-long`, 10 s; ADR 0051) | ring and label, **the second line** (`loading.slow`), and **Cancel** (`loading.cancel`) if `onCancel` | unchanged: the ProgressBar only |

- **The timer runs from mount**, not from when the ring appears. With a custom `delay` longer than 10 s, the long stage starts when the state draws.
- Like the region delay, the long delay is not motion: the reduced-motion file never sets it to 0.
- **Layout from 10 s:** the loading state becomes a centred column. The `row-gap` is `space-stack-sm` (8px), as in LoadingOverlay:
  1. the ring and label row, unchanged (`labelPosition` "after" or "below" as before);
  2. the second line: the `body` role in `content-muted`, centred, wrapping (no ellipsis). On the light canvas it is at least 4.5:1 (D-0151), and on `surface-default` more;
  3. Cancel: `<Button size="sm">` (default variant), `loading.cancel` ("Cancel", approved Arabic إلغاء). It is the only button and is never primary. Its spacing class, if needed, is `plx-loading-state__cancel` (ADR 0051).
- **No motion added:** the second line and Cancel appear without a transition. The ring keeps turning; under reduced motion it stands still, as today.

## 2. State matrix (LoadingState)

| State | Tokens / behaviour |
|---|---|
| default (< 1 s) | nothing drawn (unchanged) |
| loading (1 to 10 s) | ring `lg`, `feedback-info-solid` arc; label `body`, `content-default`; `role="status"` (unchanged) |
| loading, long (≥ 10 s), no `progress` | as above, plus the second line (`body`, `content-muted`) and Cancel (Button sm tokens) if `onCancel` |
| hover | Cancel: Button's own hover (`state-hover`). The rest: n/a (static) |
| focus | Cancel: Button's focus ring (`focus-ring-color`, 2px, 2px offset). **Focus is not moved** to Cancel; it is the next Tab stop |
| active | Cancel: Button's pressed (`state-pressed`, `motion-press-scale`) |
| disabled | n/a (Cancel shows only when it can act. With no `onCancel`, there is no button) |
| error | n/a in the component: the app swaps the region to its Notice (messaging.md) |
| selected | n/a (nothing selectable) |
| empty | n/a: the app shows EmptyState when the load returns nothing |
| long text | the label and the second line wrap, centred (`overflow-wrap: anywhere`, as the label today); never cut |
| after Cancel | LoadingState only calls `onCancel`. The app ends the load and replaces the region (its previous content, or EmptyState). LoadingState does not hide itself |

- **Announcements:** the second line sits in its own polite `role="status"` element. It is present (empty) from the moment the state draws and is filled at 10 s, so it is announced once. The label's status is unchanged, so it is not announced again. Cancel is not announced.
- **Nested:** only the outermost LoadingState draws (ADR 0042). The inner one's `onCancel` is ignored, and the app passes it to the outer one.

## 3. Densities, themes, Arabic

- **Densities:** the gaps are sys space tokens, and Button sm follows the region density. The ring size is unchanged.
- **Light and dark:** existing roles only (`content-default`, `content-muted`, Button). No new pair.
- **Arabic:** one new sentence (`loading.slow`). The i18n Engineer proposes it, and the owner approves it (D-0012). Until then, the English line shows, as for any word awaiting the owner, and G6 holds only the release. No Arabic-only branch. RTL: a centred column, nothing to mirror.
- **Visual check:** light and dark at standard density, plus RTL (text changes). One specimen at the long stage with Cancel (a fixed clock in the story).

## 4. Edge cases

- **3x English:** the label and the second line wrap within the region. Cancel stays under them, centred.
- **A one-line region** (grid placeholder row, `size="md"`): the column grows the row. For a DataGrid's first load, the grid's empty area holds it, so nothing is cut.
- **10,000 rows:** n/a (the state shows before rows exist). One timer per drawn LoadingState. Nested states draw nothing and start no visible stage.
- **Unmount before 10 s:** the timer is cleared, and nothing is announced.
- **The load ends between 10 s and a Cancel click:** the app unmounts the state, and the click never happens.

## 5. Messages (placement per `docs/content/messaging.md`, "Loading"; wording is the Technical Writer's)

- **Second line:** `loading.slow`, proposed "This is taking longer than usual." under the label, from 10 s. It does not repeat what is loading; the label above it says that.
- **Cancel:** `loading.cancel`, "Cancel".
- No error or success text here. The app's Notice or toast owns what happens after the load or the Cancel.

## 6. Choices the engineer must not invent

- 10 s from mount, a token (not a literal), not motion.
- Reading A (above): the label stays and the second line is added. No `{label}` pattern. With `progress`, nothing changes.
- The column, the 8px gap, the second line in `body` / `content-muted`, and Cancel as a `size="sm"` default Button.
- Focus is never moved. The second line is its own polite status, present from first draw.
- DataGrid and ListingPage pass `onLoadingCancel` through as `onCancel` (ADR 0051).
- **Tests (test first):** nothing before 1 s; the ring and label at 1 s with no second line and no Cancel; at 10 s the second line in `content-muted` and Cancel (only with `onCancel`); Cancel calls `onCancel` once; with `progress` at 10 s, no second line and no Cancel; the label text is unchanged at 10 s; focus unchanged at 10 s; nested: only the outer state shows the stage; LTR and RTL, light and dark.
