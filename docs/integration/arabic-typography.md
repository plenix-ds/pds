# Arabic type and right-to-left coverage

Written for CTM 3.0's request (issue #180, CTM PLX-008): an app that removes all local CSS needs to know what the Platform already does for Arabic. Checked against `platform/system/fonts.css`, `platform/tokens/reference.tokens.json` and `platform/tokens/semantic/typography.tokens.json` on main.

## Which Arabic face is used where

- **Mechanism:** each stack lists the Latin face first. The Arabic `@font-face` rules carry an Arabic `unicode-range`, so only Arabic letters use them. Latin text, digits in Latin form and punctuation outside the range stay in DM Sans or Reddit Mono. A page with no Arabic downloads neither face.
- **No `lang` needed:** the face follows the letters. `lang="ar"` is still required for screen readers, spelling and translation (see `mixed-direction.md`).

| Text | Token | Latin face | Arabic face |
|---|---|---|---|
| Body, captions, labels, controls, table cells | `--plx-sys-typeface-sans` (from `--plx-ref-font-sans`) | DM Sans | IBM Plex Sans Arabic, 300 to 700 |
| Headings, titles, display text (`text-heading`, `text-title`, `text-display`; bare `h1` to `h6`) | `--plx-sys-font-heading` (from `--plx-ref-font-sans-title`) | DM Sans | Readex Pro, 300 to 700 (variable) |
| Code and data text, chart axes | `--plx-sys-typeface-mono` (from `--plx-ref-font-mono`) | Reddit Mono | IBM Plex Sans Arabic, so Arabic in data is joined, not drawn by a system monospace font |

- Owner decision: arabic-font-35. Files and licenses: `platform/fonts/README.md`.
- Fallbacks after the Arabic face are `system-ui` and the platform fonts.

## Line height

- There is no Arabic-only line height. The text roles use the same `line-height` tokens in both scripts.
- Both Arabic faces are drawn inside that line box. If an app sees clipped diacritics in its own text, it sets a larger line-height token on that text. It does not write a number.

## Right-to-left coverage

- `DirectionProvider` (or `LocaleProvider dir="rtl"`) sets `dir` on a region or on `<html>`. The stylesheets use logical properties and `:dir()` rules, so every part follows the nearest `dir`.
- The eleven parts below have no physical `left`, `right`, `margin-left` or similar in their stylesheets (checked by `grep` of each part's CSS). The Arabic stack is the same for all of them.

| Part | Mirrors | Note |
|---|---|---|
| Table | Yes | Column order and cell alignment follow `dir`. |
| DataGrid | Yes | Its scroll thumb has an explicit `-rtl` animation (`plx-data-grid-thumb-x-rtl`). |
| Timeline | Yes | |
| Columns | Yes | |
| PropertyList | Yes | |
| AvatarUpload | Yes | |
| SegmentedControl | Yes | Arrow keys follow the direction (`utils/direction.ts`, `arrowStep`). |
| ButtonGroup | Yes | Part of `button.css` (`.plx-button-group`). |
| EntityHeader | Yes | |
| FormActions | Yes | `.plx-form-actions`, in `form.css`. |
| Dialog | Yes | Rendered in a Portal; the Portal copies `dir` and `lang` from where it was written. |

- **What mirrors:** layout, order, alignment, directional icons (arrows, chevrons, undo, redo).
- **What does not:** text content, numbers, media controls and non-directional icons.

## Status and gaps

- **Ran:** `grep` of the CSS for physical properties on the eleven parts; reading `DirectionProvider.tsx`, `fonts.css` and the token files.
- **Not run (owner starts tests):** a per-part RTL render. Existing RTL tests cover other parts (`tests/rtl-*.test.js`). A per-part test for these eleven is a gap; it goes to `pds1-qa-engineer` (plan §7e).
- **Open for the owner:** whether Arabic needs its own line-height tokens. Applied: none until a clipped glyph is reported. To switch, reply on #180.
