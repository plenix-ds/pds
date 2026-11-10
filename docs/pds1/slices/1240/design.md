# #1240 MetricCard type="person": the compact person card (G2)

- **Request:** the owner (chat, 2026-11-10, two screenshots; D-0166): "it takes up so much space for nothing … i do not want a patch fix but an adjustment to our cards to be more practical with spacing". Brief: issue #1240 (PM).
- **Extends:** `MetricCard type="person"` (`platform/components/MetricCard`). Today it is a header (name, role), a divider, then a 64px (`2xl`) Avatar beside a hero value ("5 active cases" at the display size). That is about 240px tall, and four fit in a row.
- **Rules that apply:**
  - the data font (D-0164, D-0165; audit #1232): the number is Reddit Mono, and the unit and any word value are DM Sans;
  - 4px grid, corners 2 to 6px (the Avatar keeps its own corner token);
  - logical properties; tokens only.
- **Readings applied (D-0167, the owner may switch):**
  - **Opt-in in 1.x, the default in 2.0.0** (G3, ADR 0056, PR #1246). A reflowing default is MAJOR (VERSIONING.md, D-0107), so the compact card is `type="person" layout="tile"`. Its look is this file. CTM sets `layout="tile"` on its person cards and `itemSize="sm"` on their WidgetGrid. My first reading (the default now) is withdrawn: semver is G3's.
  - **A. A word value is a status, not a figure.** A value with no digits ("Hidden") shows in the unit's small label style, not at the value size. Reply **B** to show it at the value size in DM Sans.

## 1. Anatomy (LTR; inline start on the left)

```
┌───────────────────────────────────────────┐  12px block, 16px inline padding
│ ┌────┐  Fr. Youhanna Abdelmessih      [⋯] │  name: heading role, up to 2 lines
│ │ 48 │  Council member                    │  role: secondary role, content-muted, 1 line
│ └────┘                                    │
│ ───────────────────────────────────────── │  inset divider: border-subtle, 1px, 12px above and below
│                                 5 ACTIVE  │  value row at the inline end
└───────────────────────────────────────────┘
```

- **No separate header.** The Avatar, name and role form one row. The divider is between that row and the value row.
- **Avatar:** `size="xl"` (48px) with its own corner, initials and gender colours (`Avatar`; `name`, `src`, `gender`). Its block alignment is start, with its top on the name's first line.
- **Gap**, Avatar to text: 12px (`space-inline-md`, as `metric-card-header-gap`).
- **Name** (the card title, `title || person.name`):
  - role `text-heading` (13px, 600), `content-strong`;
  - up to **2 lines**, then an ellipsis, with the full name in the Plenix Tooltip while it is cut (`useTruncated`);
  - it stays the card's heading element (`headingLevel`) and its `aria-labelledby` target;
  - a link when `href` is set (`metric-card__link`, unchanged).
- **Role** (`person.role`, or `context`):
  - role `text-secondary` (12px), `content-muted`;
  - one line with an ellipsis and a Tooltip;
  - 4px under the name (`space-stack-xs`, as `metric-card-heading-row-gap`).
- **Actions** (`info`, `filter`, `menu`): at the inline end of the first row, aligned to the name's first line, as today (ghost `sm`).
- **Divider:** 1px `border-subtle`, inset to the card's inline padding, with 12px (`space-stack-md`) above and below. It is not drawn when there is no value row (no `value`, no `progress`, not empty).
- **Value row:** at the inline end, on one baseline: the **number**, then 4px (`space-inline-xs`), then the **unit**.
  - **Number:** `font-data` (Reddit Mono), 20px (`text-title-font-size`), 700, `content-strong`, `tabular-nums`, `line-height-tight`. One size for every `size`. The hero sizes belong to the value types, not to a person card.
  - **Unit:** role `text-eyebrow` (12px, 700, uppercase in Latin scripts), `content-muted`, DM Sans.
    - It is the app's `unit` as given ("active").
    - Arabic has no case, so the role writes it as it is.
  - `target` ("/ 8") follows the number in `font-data` at 12px, `content-muted`.
  - `change` (a delta) sits at the **inline start** of the value row, with its own tokens (as today).
  - `status` sits at the inline start too, as a Badge with its icon, if there is no `change`.
- **`progress`:** an `sm` ProgressBar under the value row, the full content width, 8px above it (`space-stack-sm`).
- **Card:** the MetricCard surface, border and corners, unchanged. Inline padding 16px (`metric-card-padding-inline`). Block padding **12px** (`space-inset-md`), so the card is about 121px tall with a value row, and 73px with none. `appearance` "plain", "edge" and "soft" apply as today; "filled" and "gradient" are already refused for person.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default | §1 |
| hover | a link card (`href`): the name takes Link's hover underline. Otherwise n/a (static) |
| focus | a link card: the name link's focus ring (`focus-ring-color`, 2px, 2px offset). Actions: Button's own |
| active | n/a (the card is static). Actions: Button's pressed |
| disabled | n/a (a card has no disabled state) |
| loading (`state="loading"`) | the first row (Avatar, name, role) shows. The value row is the existing `Loading` line (its label "Loading {title}") at the value row's height, so nothing jumps |
| error (`state="error"`) | the first row shows. Under the divider, the existing Notice (danger) with Retry (`size="xs"`) replaces the value row |
| selected | n/a (no selection) |
| empty (`state="empty"`) | the value row shows "–" in `font-data`, 20px, `content-muted`, and no unit |
| word value ("Hidden") | the value row shows the word in the unit's style (`text-eyebrow`, `content-muted`, DM Sans) and no number (reading A). The data font never sets a word (D-0164) |
| stale (`state="stale"`) | as today: the "Stale" status Badge at the inline start of the value row |
| long text | the name wraps to 2 lines, then ends in an ellipsis with a Tooltip. The role and the unit are one line with an ellipsis and a Tooltip. The number never cuts; the unit cuts first |
| no photo | Avatar initials with the gender or name colour (Avatar's own rule) |

## 3. Densities, themes, Arabic

- **Densities:** one size. The person card does not follow region density (as compact Timeline, #1152). Its spacing tokens are fixed.
- **Light and dark:** existing roles only (`content-strong`, `content-muted`, `border-subtle`, the Avatar's pairs). No new pair.
- **RTL:** the Avatar is at the right, the value row at the left, and the actions at the top left (logical properties). The number writes in the locale's digits (DESIGN §10), and the unit follows it in reading order.
- **Arabic:** no new string. The unit and the role are the app's text.
- **Visual check:** light, dark and RTL at standard density. A row of six cards at 1920: a photo, initials, a long name, a word value, empty, with progress.

## 4. Edge cases

- **3x English name:** two lines, then an ellipsis; the card height holds at about 121px in a row.
- **No role:** the name is centred on the Avatar's block axis.
- **No value, no progress:** no divider and no value row. The card is the first row only (about 73px). In a WidgetGrid row the cards match the tallest (D-0163), so the empty space falls below the first row.
- **A large number** (10,000+): `formatNumber` as today ("10,240"). The unit cuts before the number.
- **WidgetGrid `itemSize="sm"`** (ADR 0056): the minimum column width is **`size-50u` (200px)**, in place of `size-70u` (280px). The gaps are unchanged, and it is capped at 6 columns. About 5 fit at 1366 (beside the main nav) and 6 at 1920. The card fits 200px: Avatar 48 + 12 + about 108 of text + 32 padding.

## 5. Messages

- None new. Loading and error use the existing `metricCard.loading` and `metricCard.error` strings, placed per `docs/content/messaging.md` (the Notice in the card).

## 6. Choices the engineer must not invent

- The anatomy in §1: no header band, Avatar `xl`, 12px gap, name 2 lines (`text-heading`, `content-strong`), role 1 line (`text-secondary`, `content-muted`), inset divider, value row at the inline end, number `font-data` 20px 700, unit `text-eyebrow` `content-muted`, 12px block and 16px inline padding.
- One size for every `size`. No density.
- `type="person" layout="tile"` (opt-in in 1.x, the default in 2.0.0; ADR 0056). A word value takes the unit style (reading A). WidgetGrid `itemSize="sm"` is `size-50u`.
- **Tests (test first):**
  - the Avatar is 48px, beside the name in the same row;
  - with a value the card is ≤ 124px tall at 280px wide;
  - the number's computed font is Reddit Mono and the unit's is DM Sans in uppercase;
  - the value row's inline-end edge equals the content's inline-end edge, in LTR and RTL;
  - a 3-line name clamps to 2 lines and shows a Tooltip while cut;
  - `state="empty"` shows "–" with no unit;
  - a word value has no Reddit Mono;
  - no `src` shows initials;
  - light and dark contrast of the name, role and unit on the card surface is ≥ 4.5:1.
