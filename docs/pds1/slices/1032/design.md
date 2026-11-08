# #1032 Loading: a spinner with a label, not skeleton bars (G2)

- **Request:** the owner, relayed from CTM on 2026-11-08 ("I do not want this loading style view": grey shimmer bars). This is the Fluent 2 pattern, Microsoft first (D-0078). The decision is D-0130.
- **Extends:**
  - `Spinner` (`platform/components/Loading/Loading.tsx`, `loading.css`, `spinner-*` comp tokens).
  - `ProgressBar` (known progress).
  - The loading rows of `DataGrid` (`engine/chrome.tsx` `emptyRow` / `moreRow`), `EntityTitle loading`, `MetricCard state="loading"` and the `LoadingOverlay` guidance.
  - There are no new colours and no new component.
- **What changes:**
  - Every default loading state in PDS becomes a **spinner with a visible label**, centred in the region that loads. It shows only after about **1 second**.
  - `Skeleton` stays exported but is **opt-in only**: no PDS component, pattern or template uses it, and its docs say so.
- **Defects fixed (DESIGN.md rule, no owner question):**
  - **Applied by the DS Architect in #1047** (token tiers are theirs, ADR 0001). The spinner arc was `action-primary-background`, which is blue-400 in both themes. On the dark `surface-default` (gray-800) that measures **2.04:1**, below the 3:1 non-text rule. The fix: `spinner-border-{bottom,left,right}-color` point to `feedback-info-solid`. It is blue-400 in light (4.78:1 on white, so light is unchanged) and blue-300 in dark (5.19:1 on gray-800). This is also ProgressCircle's default `info` arc.
  - **For the engineer:** a loading **primary button** draws the blue arc on its blue fill (about 1:1 in both themes). Inside a filled button (primary, danger, accent), the Button stylesheet sets the spinner arc to the button's own text colour (`currentColor`). The test checks the arc against the button fill at 3:1 or more.
- **Readings applied (D-0130; the owner may switch):**
  - **A. The label sits after the ring, on one line** (Fluent `labelPosition="after"`, its default). B: the label goes under the ring.
  - **The ring size:**
    - `lg` (24px) in a page, panel, card or dialog body.
    - `md` (16px) in a grid placeholder row and wherever the region is one line tall.
    - `sm` (12px) only inside a control.
  - **The 1-second delay applies to region loading only.** A button's own spinner keeps `motion-loading-delay` (0.5s), because the button is already busy and blocked from the first moment.

## 1. Look

| Part | Value |
|---|---|
| Ring | the existing `plx-spinner`: track `forced-gap`/transparent, arc `spinner-border-*-color` → `feedback-info-solid` (defect fix below), radius `spinner-radius`, turn `motion-loading-spin-*` |
| Ring size | `spinner-lg-*` (24px, border `border-width-thick`) in regions; `spinner-md-*` (16px) in one-line regions; `spinner-sm-*` (12px) in controls |
| Label | the `body` type role (`text-body-font-size`, 13px, weight 400, line 1.5), `font-body`, colour `content-default` |
| Gap between ring and label | `space-inline-sm` (8px) |
| Placement | centred on both axes in the region that loads (`align-items` / `justify-content: center`). The region keeps its own size: a card keeps its height, and a grid keeps its header and toolbar |
| Region while loading | `aria-busy="true"` on the region. The content that is about to change is not shown (first load), or it stays under `LoadingOverlay` (refresh) |
| Known progress | `ProgressBar` with its label above the bar (the existing component), in place of the ring, after the same 1s delay |

- **New tokens:**
  - `plx-ref.motion-delay-loading-region` = 1s.
  - `plx-sys.motion-loading-region-delay` → that ref.
  - The comp tokens `spinner-label-gap` → `space-inline-sm`, `spinner-label-text` → `content-default` and `spinner-label-font-size` → `text-body-font-size`.
  - Tiers run ref → sys → comp.
- The delay is **not motion**: the reduced-motion file must not set it to 0. If it did, a fast load would flash the spinner.

## 2. Spinner API (the engineer must not invent another)

- `labelPosition?: 'hidden' | 'after' | 'below'`:
  - The default is `'hidden'`, today's behaviour: the label is visually hidden. Buttons and controls keep it.
  - `'after'` is the region default (reading A). `'below'` exists for option B and narrow regions under 160px.
- `delay?: number | 'region'`: when set, the spinner renders nothing until the delay passes. `'region'` reads `motion-loading-region-delay`. Region uses set `'region'`.
- **The visible label is the status text.** It is the content of `role="status"`. With `labelPosition !== 'hidden'` there is no second, visually hidden copy, so it is announced once.
- **Region use is one helper, `LoadingState`** (G3 name, D-0131, ADR 0042: a named export built from Spinner; size `lg` by default). It is the centred flex box with the delay set to `'region'` and `labelPosition="after"`. DataGrid, MetricCard, LoadingOverlay and the templates all use it, so the layout lives in one place.

## 3. State matrix

| State | Spinner (region) | ProgressBar (known progress) |
|---|---|---|
| default (under 1s) | nothing is drawn and nothing is announced; the region is `aria-busy="true"` | nothing is drawn |
| default (1s and later) | ring + label as §1; `role="status"` announces the label once | bar + label + value (existing tokens) |
| hover | n/a (not interactive) | n/a (not interactive) |
| focus | n/a (no tab stop; focus stays where it was) | n/a |
| active | n/a | n/a |
| disabled | n/a (a disabled region does not load) | n/a |
| loading | this *is* the loading state | this *is* the loading state |
| error | the spinner is replaced by the region's error message and its one Retry button (existing DataGrid `failed`/`retry`, MetricCard `error`). `aria-busy` is removed | the same |
| selected | n/a | n/a |
| empty (no label given) | uses the component's catalog word: DataGrid `strings.loading` "Loading records", Spinner `loading.label` "Loading". A dev warning asks for a label that names the thing ("Loading cases…") | the existing ProgressBar label rule |
| long text | the label wraps inside the region, centred, and the ring stays at the first line's start. In a grid placeholder row it is one line, ending in an ellipsis (the full text is still the status text) | as ProgressBar today |
| over ~10s | the app adds a Cancel button (`messaging.md` §Loading) under the label; `LoadingOverlay onCancel` already does this | the same, with the value |
| reduced motion | the ring stands still (full arc, no turn: `plx-motion-spin` is guarded); the label shows as usual | the indeterminate run stands still |
| forced colours | the arc in `CanvasText`, the label in `CanvasText` | existing |

## 4. Where it applies (per component)

| Component | Today | After |
|---|---|---|
| DataGrid first load (`emptyRow` with `remoteBusy`) | the word "Loading records", no ring | `Spinner` region, `md`, label `strings.loading`, centred in the placeholder row; the header, toolbar and pager stay |
| DataGrid next page (`moreRow`) | the word, no ring | the same `md` spinner and label; it is already `role="status"`, so it is not wrapped in a second one |
| MetricCard `state="loading"` | three Skeleton bars | `Spinner` region, `lg`, label `strings.loading` (the catalog's "Loading…"), centred in the body; the header stays (MetricCard rule) and the card keeps its height |
| EntityTitle `loading` | two Skeleton bars | a `sm` spinner at the text's start with its label hidden (`labelPosition="hidden"`). The item keeps its 36px height and stays `aria-busy`. It is a line, not a region, so it gets no visible label; the region around it shows the label |
| LoadingOverlay | spinner + message (already this pattern) | unchanged look. Its note "for content that loads the first time … use skeletons" becomes "use the region spinner (`LoadingState`)" |
| Card / Panel bodies, RecordPage, templates | the app's own choice | the docs and examples show `LoadingState`; no example uses Skeleton |
| Skeleton | used by EntityTitle and MetricCard | used by nothing in PDS. The header comment and the docs page say "opt-in only; not a Plenix default (D-0130)" |

- **Spec wording:** 34 `loading:` notes in 14 files under `platform/design-system/parts/*.docs.js` tell people to use Skeleton rows. The Technical Writer rewords them to the region spinner with a label. That work is listed for #1032, and the rule is this file.

## 5. Densities, light and dark, Arabic

- **Densities:** the ring and label do not change with density. The grid placeholder row follows the row height (36 / 40 / 48px), and the `md` ring and the one-line 13px label fit in all three.
- **Light and dark:**
  - The arc `feedback-info-solid` measures 4.78:1 on white and 4.46:1 on the light canvas. It measures 5.19:1 on dark gray-800 and 11.19:1 on black, so it is 3:1 or more in both themes (the non-text rule). The label `content-default` measures 12.09:1 in light and 8.02:1 in dark.
  - The QA visual check covers light and dark at standard density.
- **RTL:** the ring is at the inline start (the right) and the label after it. The ring's turn is not a direction icon, so it does not flip (D-0011). There are no new words: every label is an existing catalog key or the app's own string. The Arabic is already approved (`جارٍ تحميل السجلات`, `جارٍ التحميل…`). The visual check adds RTL because the text position changes.

## 6. Edge cases

- **3× English label:** it wraps in regions and ends in an ellipsis in grid rows (§3).
- **A load under 1s:** nothing flashes and nothing is announced. A test uses fake timers at 999ms and at 1000ms.
- **A load that ends after the spinner shows:** the content replaces it at once, with no fade (Fluent), and nothing is announced at the end.
- **10,000 rows:** the first load is one region spinner. Later pages use the `moreRow` spinner, and the virtualised rows are unaffected.
- **Nested regions** (a card inside a loading page): only the outermost loading region shows a spinner. Inner regions stay `aria-busy` with nothing drawn, so a page never shows a stack of spinners. `LoadingState` does this through a context flag.

## 7. Messages

- Placement and wording follow `docs/content/messaging.md` §Loading:
  - nothing for the first second;
  - then say what is loading ("Loading hearings…");
  - past about 10s, add a cancel option or a progress value.
- The wording belongs to the Technical Writer. There are no new catalog keys.

## 8. Choices the engineer must not invent

- The ring sizes per place (§1), the label position (`after`), the 8px gap, and the label's role and colour.
- The 1s region delay token. Buttons keep 0.5s.
- One status region, with no duplicate hidden label.
- Removing Skeleton from EntityTitle and MetricCard. Skeleton stays exported. The check `planned:no-default-skeleton` (in `check-system.js`) fails if any file under `platform/components`, `platform/patterns` or `platform/templates` other than `Loading/` imports `Skeleton` or uses `plx-skeleton`.
- No new colours, and no inline styles.

## 9. Evidence

- Ran: `grep` for `Skeleton` / `plx-skeleton` across `platform/` (2 component uses: EntityTitle, MetricCard; 34 spec notes in 14 parts files).
- Ran: contrast computed from the ref hex values (node): blue-400 on gray-800 2.04 (the defect), blue-300 on gray-800 5.19.
- Ran: `npm run tokens:build` with the remap applied locally (7435 tokens, 4 changed). The remap was then taken out of PR #1042 for the DS Architect.
- Ran: read `motion-loading.tokens.json` (delay 0.5s), `Loading.tsx` (Spinner label hidden only) and `engine/chrome.tsx` (grid loading is text only).
- Planned: the §7e tests (delay at 999 and 1000ms, one announcement, reduced motion, error replaces spinner, no Skeleton import check).
- Planned: the CI visual check, light and dark at standard density plus RTL.
