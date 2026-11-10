# ADR 0057: SettingsLayout's nav is a docked SecondaryPane; navigation panes are 240px at every window size

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's reports (chat, 2026-11-10: "big secondary nav pane is out of place!!", #1242; "why is the nav so wide???", #1243). G2 (`pds1-design-director`, PR #1249, `docs/pds1/slices/1242/design.md`, D-0168, D-0169) owns the look and the widths. This entry owns the API, the tokens and the deprecations.
- **Issues:** #1242 and #1243 (S2), fixed together.

## Context

- **`SettingsLayout`** (`platform/patterns/SettingsLayout/SettingsLayout.tsx`) draws `nav` in a `NavPane as="div"` inside its own frame. It reads as a floating card inside the content: no title, a lone collapse button, and not lined up with the main nav.
- **The case pane** is a `SecondaryPane` in `PagePanes`, docked and full height.
- **Window-width steps** (`platform/system/grid.css`, `@media (1440px <= width < 1920px)` and `(width >= 1920px)` on `:root`) set the starting widths:
  - the main nav: 240 / 272 / 320px;
  - `secondary-pane-width-sm` / `md` / `lg`: 180–260, 220–320 and 280–400;
  - the side panel.
  - Inside the 1366px frame (`frame="centered"`), a 1920px window gives two panes about 640px wide in total.
- **Resizing today:**
  - The main nav is already resizable in an AppShell (`PanelSplitter`, 140–320px from `shell-nav-min-width` / `-max-width`), remembered, with Enter or a double-click on the edge collapsing it.
  - `SecondaryPane` resizes only with `resizable`, between `secondary-pane-width-min` (180) and `-max` (400).
- **G2's decisions:**
  - one standard width of **240px** for the main nav and for a SecondaryPane used as navigation, at every window size, framed or not;
  - resizable in 8px steps (NavPane 200–320, SecondaryPane 180–400), remembered;
  - **Enter or a double-click on the edge resets the width to 240px**, and collapse stays on the Collapse button and Ctrl+[.

## Options

| Option | For | Against |
|---|---|---|
| **A. SettingsLayout renders `PagePanes` + `SecondaryPane` (title, collapsible, resizable, remembered) + `PageContent`; the navigation window steps go and their tokens are deprecated; the limits and the edge keys as G2 says** | Uses the existing docked pane: one look for every secondary nav. No CTM change. The nav width is the same everywhere. | Deprecates 8 tokens. Changes the edge's Enter and double-click from collapse to reset. |
| B. Keep the steps, only when not framed (my first ruling on #1243) | Smallest change | G2 ruled one width at every size: a nav's content doesn't grow with the window. |
| C. Style NavPane-in-SettingsLayout to look docked | No layout change | Two docked-pane implementations. |

## Decision

**Option A.**

### SettingsLayout

- It renders `<PagePanes><SecondaryPane …>{nav}</SecondaryPane><PageContent>{children}</PageContent></PagePanes>`. The SecondaryPane is `side="start"`, `width="md"`, `collapsible` and `resizable`, and its collapsed state and size are remembered per page (`useViewState`, key `settings`).
- **New props:**
  - **`navTitle?: React.ReactNode`**, the pane's title. The default is the string `settingsLayout.navTitle`, "Settings". (The i18n Engineer has the Arabic.)
  - **`pane?: Omit<SecondaryPaneProps, 'children' | 'title'>`**, passed to the SecondaryPane: `detailOpen`, `onBack`, `back`, `label`, a controlled `size` or `collapsed`. At Narrow it is list-detail, with "Back to Settings" through SecondaryPane's own `back`.
  - **`strings?`**: `{ navTitle }`.
- **Classes:** `plx-settings__nav` and `plx-settings__frame` are no longer drawn. `plx-settings` stays on the root, and `plx-settings__content` stays on the `PageContent`. The removed classes are listed in `deprecated-classes` with "SettingsLayout's nav is a SecondaryPane (ADR 0057); removed in 2.0.0". Nothing draws them in 1.x, so an app's CSS on them stops applying, and that is the fix.

### Widths (#1243)

- **The window steps go** for the main nav and the secondary panes. `grid.css` drops `--plx-sys-shell-nav-width` and the `--plx-comp-secondary-pane-width-*` from its two media blocks.
- The **side panel**'s steps (`side-panel-width-default-from-*`) stay, because that's content, not navigation. They apply only when the shell isn't framed (`:root:not([data-plx-frame="centered"])`), as ruled on #1243.
- **Values:**
  - `secondary-pane-width-md` -> `{plx-ref.size-60u}` (240; was 220);
  - `shell-nav-min-width` -> `{plx-ref.size-50u}` (200; was 140);
  - `shell-nav-width` stays 240, `shell-nav-max-width` stays 320, and `secondary-pane-width-min` / `-max` stay 180 / 400.
- **Deprecated** (`$deprecated`: "Navigation panes keep one width at every window size (ADR 0057). Nothing reads it; removed in 2.0.0."):
  - `shell-nav-width-from-wide` and `shell-nav-width-from-ultrawide`, and their older aliases `-from-1440` and `-from-1920` (already deprecated);
  - `secondary-pane-width-sm-from-wide`, `-from-ultrawide`, and the same for `md` and `lg`.

### The resize edge (NavPane in AppShell, and SecondaryPane)

- Arrow keys and dragging move the edge in 8px steps (`shell-splitter-step`), and Home and End go to the limits, as today.
- **Enter or a double-click resets the width** to the pane's standard width and clears the remembered size. Collapse is the pane's Collapse button and Ctrl+[.

## Consequences

- **Semver: MINOR (1.7.0, or a 1.6.x patch if the release architect prefers, since every change is a fix of a default the owner reported).**
  - Added: `SettingsLayout.navTitle`, `pane` and `strings`, and the string `settingsLayout.navTitle`.
  - Changed:
    - SettingsLayout's DOM (a docked pane);
    - the navigation width at 1440px and up (no step);
    - `secondary-pane-width-md` 220 -> 240;
    - the nav's minimum 140 -> 200;
    - the edge's Enter and double-click (reset, not collapse).
  - Deprecated: 8 tokens and 2 classes, removed in 2.0.0.
- CTM gets both fixes from the CDN with no change.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- `deprecated-classes` and the token `$deprecated` notes.
- Checks 6 and 7.
- Behavior tests (#1242, #1243):
  - SettingsLayout's nav container is a SecondaryPane whose block start equals the main nav's, with no outer margin, titled "Settings";
  - in a 1920px window, framed or full, the NavPane and the SecondaryPane compute 240px;
  - Enter on the edge resets to 240px and doesn't collapse;
  - Ctrl+[ collapses;
  - the size and the collapsed state are remembered;
  - Narrow is list-detail;
  - RTL mirrors.
