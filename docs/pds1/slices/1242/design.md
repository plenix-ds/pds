# #1242 and #1243 Navigation panes: the settings nav is a docked pane; one standard width, resizable (G2)

- **Requests:**
  - **#1242** (owner, chat, 2026-11-10): "big, secondary nav pane is out of place!!". CTM Settings draws its section nav as a white card floating inside the grey content area.
  - **#1243** (owner, chat): "why is the nav so wide???", then: "the navs should have a standard fixed width that can be resized!!" (**D-0168**, PR #1247).
- **Extends:** `SettingsLayout` (`platform/patterns/SettingsLayout`), `SecondaryPane` and `PagePanes` (`platform/patterns/SecondaryPane`), `NavPane`, and the shell widths in `platform/system/grid.css`.
- **Readings applied (D-0169, the owner may switch):**
  - **A. The edge's double-click and Enter reset the width.** D-0168 asks for "a double-click returns it to the standard width". Today, Enter or a double-click on the edge **collapses** the pane (NavPane, SecondaryPane). Both now reset the width. Collapsing keeps the header's Collapse button and Ctrl+[. Reply **B** to keep Enter as collapse (keyboard) while the double-click resets.
  - **A. One standard width for every navigation pane: 240px** (`size-60u`). The main NavPane already starts at 240px, and the SecondaryPane `md` goes from 220px to 240px, so the two line up. Reply **B** for 260px (`size-65u`) for both.

## 1. #1242: the settings nav is a docked secondary pane

- **Structure:** `SettingsLayout` draws `PagePanes` holding a `SecondaryPane` (the nav) and `PageContent` (the sections). This is the case pane's structure, so the look is SecondaryPane's (DESIGN §"Panes", D-0123). The names and how the shell's `multi-pane` layout is chosen are G3's.
- **The look:**
  - The pane is flush beside the main NavPane, from the top of the main region to its bottom, with no outer margin, no gap above it and no card. It has the **page surface**, with SecondaryPane's divider on its content side.
  - Its block start equals the main nav's block start.
  - **Pane title:** "Settings" by default (a new catalog string, `settingsLayout.navTitle`; the app may pass its own). SecondaryPane's title role is `surface-title` (15px, 700, `content-default`), the strongest text in the pane (#995 order: the title, then the NavList items).
  - **Collapse:** SecondaryPane's Collapse button at the end of the header row, aligned with the title, as in the case pane. Folded, it shows the rail.
  - **The NavList** fills the body. Its items are unchanged, and the body scrolls on its own.
  - **The content area** keeps its own padding (`settings-content-padding-*`, unchanged), and the sections stay cards (owner, 2026-10-13).
- **Narrow** (< 600px): SecondaryPane's list-detail behaviour. The nav fills the width; choosing a section shows it with "Back to Settings". This replaces today's stacked nav-over-content at Narrow.

## 2. #1243: one standard width, resizable, remembered

| Pane | Standard (the start width, every window) | Min | Max | Step (arrow key, drag) |
|---|---|---|---|---|
| NavPane (main nav) | **240px** (`size-60u`) | 200px (`size-50u`) | 320px (`size-80u`) | 8px (`DRAG_STEP`) |
| SecondaryPane `md` (case pane, settings nav, every nav pane) | **240px** (`size-60u`; was 220) | 180px (`secondary-pane-width-min`) | 400px (`secondary-pane-width-max`) | 8px |
| SecondaryPane `sm`, `lg` | 180px, 280px (unchanged) | as `md` | as `md` | 8px |

- **No window steps:** the `-from-1440` / `-from-wide` and `-from-1920` / `-from-ultrawide` widths no longer apply to any pane, in a frame or full window (D-0168). Deprecating the tokens is G3's.
- **Resize** (SecondaryPane's existing separator, now the default for a nav pane; NavPane's `PanelSplitter`):
  - drag the content-side edge, or focus it and use Arrow Left / Right (mirrored in RTL) and Home / End (min / max);
  - its name is "Resize {name}" (existing strings), `role="separator"` with `aria-valuenow`, `-min` and `-max`;
  - double-click or Enter returns it to the standard width (reading A).
- **The edge:** SecondaryPane's existing hover and focus treatment, unchanged. The `col-resize` cursor shows on hover.
- **Remembered per person:** the dragged width is kept between visits, per pane, through the existing view state. Reset clears it.
- **Collapse to the rail** still works, and expanding returns to the remembered width.
- **Labels:** a label longer than the width ends in an ellipsis with its Tooltip (NavList's rule). It is never shortened (D-0048). The longest CTM labels ("TRIBUNAL SESSIONS", "All Active Cases") fit at 240px.

## 3. State matrix

### The resize edge (separator)

| State | Tokens / behaviour |
|---|---|
| default | SecondaryPane's divider (`border-subtle`, 1px), unchanged |
| hover | the existing splitter hover line and `col-resize` cursor |
| focus | `focus-ring-color` on the separator (existing) |
| active (dragging) | the existing pressed line. The width follows the pointer in 8px steps |
| disabled | n/a: no edge at Narrow or when folded (existing) |
| loading, error | n/a |
| selected | n/a |
| at min or max | the edge stops, and `aria-valuenow` equals the limit |

### The settings nav pane

| State | Tokens / behaviour |
|---|---|
| default | SecondaryPane: page surface, divider, `surface-title` header, NavList body |
| hover, focus, active, selected | the NavList items' own states. The current section is the NavList's selected item (`aria-current="page"`) |
| collapsed | SecondaryPane's rail with Expand |
| disabled | n/a |
| loading | n/a in the pane. A section's own LoadingState is in the content |
| error | n/a in the pane |
| empty (no `nav`) | no pane; the content takes the full width (as today) |
| long text | NavList item ellipsis with Tooltip. The pane title wraps (SecondaryPane) |

## 4. Densities, themes, Arabic

- **Densities:** the pane widths are fixed, as above, in every density (the owner's "standard fixed width"). Item heights follow density, as today.
- **Light and dark:** existing roles only. No new pair.
- **Arabic:** one new string, `settingsLayout.navTitle` ("Settings"). The i18n Engineer proposes it (D-0012), and English shows until it is approved. RTL: the panes are at the right, the edge is on their left side, and the arrow keys are mirrored (existing).
- **Visual check:** light and RTL at standard density (the brief). A CTM-like settings page in the 1366 frame and in a 1920 window, at the same widths.

## 5. Edge cases

- **3x English labels:** an ellipsis and a Tooltip; the pane stays 240px unless the person drags it.
- **A 1920 window, full width or framed:** 240px + 240px. Today it is 320 + 320.
- **A remembered width past a new max** (an old saved value): clamp it to the max.
- **Narrow:** no resize (existing). The settings nav is the list screen of a list-detail.

## 6. Messages

- None new beyond the pane title. Wording: the Technical Writer.

## 7. Choices the engineer must not invent

- SettingsLayout's nav is a SecondaryPane in PagePanes: flush, full height, page surface, no card or margin, a "Settings" title (`surface-title`), and Collapse in the header.
- The widths in §2: 240px standard for NavPane and for SecondaryPane `md`; the mins and maxes; the 8px step; no window steps.
- Resize is the default for nav panes. Double-click or Enter resets the width (reading A). The width is remembered per pane.
- **Tests (test first):**
  - in a 1366 and a 1920 window (framed and full width), NavPane and the settings SecondaryPane compute to 240px;
  - the settings pane's block start equals NavPane's, and its outer margin is 0;
  - its header title is "Settings" with `surface-title`;
  - Arrow Right adds 8px; End reaches the max and Home the min;
  - a drag changes the width within the limits;
  - the width persists after a reload;
  - a double-click and Enter reset it to 240px;
  - Collapse folds it to the rail;
  - RTL mirrors the arrow keys;
  - light, and RTL.
