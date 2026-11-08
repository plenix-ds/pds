# #990 EntityHeader fact tone, and the "required, not chosen" picker (G2)

- **Request:** the CTM owner (2026-11-07): an unassigned council member's fact box "in red tones, and the border of the drop down as in danger style". Spec: `brief.md` (G1), D-0118. A: reuse the Status tile's tones and the existing `invalid` prop.
- **Extends:** the Status tile (`.plx-entity-header__fact--status[data-plx-tone]`, `entity-header-status-<tone>-*` tokens), which now applies to any fact with `tone`, in both header styles. The picker is the existing `invalid` state of `Select`, `Combobox` and `EntityPicker`. There are no new colours, tokens or props for colour.
- **Readings applied (D-0120, the owner may switch):**
  - **Inside a toned tile, the fact's icon tile takes the tone.** The icon is in the tone's text colour, and the tile's border is the tone's border. The issue asks for "label, value, icon tile in red tones".
  - **No red focus ring.** A field's focus is its border turning the focus colour, with no ring outside it (owner, 2026-10-16, `input.css`). An `invalid` field keeps its 2px danger border while focused: danger wins over focus, as it does today. Nothing new is drawn.
  - **The "Required: not assigned" hint is visually hidden** (read through `aria-describedby`). The visible cues that are not colour are the empty placeholder ("Choose a council member") and the label. The header has no room for a line of text under a tile.

## 1. Look

| Part | Neutral fact (today) | `tone="danger"` (= `negative`) | `tone="action-required"` (the softer tone) |
|---|---|---|---|
| Tile fill | `fact-background` | `status-negative-background` (red-100 light, gray-700 dark) | `status-action-required-background` (orange-100 / gray-700) |
| Tile border | `fact-border-color` | `status-negative-border` (red-300 / gray-800) | `status-action-required-border` |
| Label and value | `fact-label-text`, `fact-value-text` | inherit `status-negative-text` (red-800 / red-100) | inherit `status-action-required-text` (brown-500 / orange-200) |
| Icon (fact with `icon`) | `fact-icon-tile-text` | `currentColor` (the tone text) | `currentColor` |
| Icon tile | `fact-icon-tile-background` / `-border-color` | fill stays `fact-icon-tile-background`; border `status-negative-border` | fill stays; border `status-action-required-border` |
| An embedded picker | its own field look | with `invalid`, the existing invalid field: `input-invalid-border-color` 2px (red-700 / red-200) on the lightest red fill | `invalid` is not used with this tone (it is a reminder, not a missing required value) |

- **No new tokens.** The structured style's toned fact uses the existing selectors. G3 widens them (`fact--status` plus `fact--icon` together) and adds one rule: `.plx-entity-header__fact--status .plx-entity-header__fact-icon { color: inherit; border-color: <tone border>; }`.
- **Sizes don't change.** A toned tile is as tall and as wide as the same fact untoned: the border width is the same, and tone is fill and colour only.
- **Contrast, measured:** red-800 on red-100 7.54; red-800 on the white icon tile 8.92; picker border red-700 against red-100 5.89 (≥ 3:1 boundary); brown-500 on orange-100 6.26. Dark: red-100 on gray-700 6.01; red-200 border against gray-700 3.86; orange-200 on gray-700 4.95.

## 2. State matrix (the toned fact; the picker inside it)

| State | Tokens / behaviour |
|---|---|
| default | §1 |
| hover | Tile: n/a (a fact isn't interactive). Picker: its own hover. The `invalid` border stays |
| focus | Picker: the existing field rule. The `invalid` danger border stays while focused, with no outer ring. The tile doesn't change |
| active | Picker: its own pressed state. Tile: n/a |
| disabled | Picker disabled: its own disabled look, and `invalid` is dropped (a control nobody can change can't ask to be filled). The tile keeps its tone |
| loading | Picker loading (options fetching): its own spinner; the border and tone don't change |
| error | That is the `danger` tone plus `invalid`. No message under the tile. A real error after a save attempt follows the form's ErrorSummary or Toast (§5) |
| selected | Once a person is chosen, the app removes `tone` and `invalid`, and the tile returns to neutral. No transition animation |
| empty | The picker shows its placeholder (the visible cue that nothing is chosen) |
| long text | The value and label follow the fact's existing rules (`white-space: nowrap`, the header's wrap ladder). The cut placeholder is #993 |

- **Motion:** none new.
- **Names:** the picker has `aria-invalid="true"` and `aria-describedby` pointing to the visually hidden hint. The tile's label stays the picker's label (`aria-labelledby` on the fact's `dt`), as today.

## 3. Densities, themes, Arabic

- **Densities:** none; tones change colour only.
- **Light and dark:** §1. In dark, the tone tile is gray-700 with red-100 text (the existing Status tile, D-0009: kept as defined). Forced colours: the tile border is `CanvasText`, and the picker's `invalid` border is `Mark`, as `invalid` does today.
- **Arabic:** no direction change (logical properties). The hint's words go through the i18n Engineer (D-0012).

## 4. Edge cases

- **3× English:** the label and placeholder follow the fact's wrap ladder and #993. The tone doesn't change widths.
- **Several toned facts:** each is toned on its own. There's no limit, but more than one red fact means the app should show a Notice instead.
- **Status tile and toned fact side by side:** they look alike by design (same tokens). The Status tile keeps its icon and its "Status" label.

## 5. Messages (placement per `docs/content/messaging.md`; wording is the Technical Writer's)

- **Hint:** visually hidden, one per picker, through `aria-describedby`, using the Field validation pattern ("Choose a council member." is the needed action). Wording: the Technical Writer's. Arabic: the i18n Engineer's.
- **No visible error** under the tile. A save blocked by the missing value is the form's or page's error (ErrorSummary or Toast), not the header's.

## 6. Choices the engineer must not invent

- The token mapping in §1 and the icon and icon-tile rule. No focus styling of its own: the field's existing invalid-over-focus order applies.
- `invalid` only with `danger`, and never on a disabled picker.
- No size change between toned and untoned tiles.
- **Tests:** AC-1 to AC-5 in `brief.md`, plus:
  - the icon in a toned tile computes to the tone's text colour;
  - a toned and an untoned tile have the same box size;
  - the focused `invalid` picker keeps the danger border.
