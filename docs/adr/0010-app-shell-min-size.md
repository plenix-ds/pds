# ADR 0010: AppShell minimum screen size notice (`minSize`)

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), decision D-0044 (owner may switch)
- **Issue:** #274 (S1, CTM owner: LighthouseCollection/CTM#108)

## Context

- CTM asks for one shell-level check: below 1024 × 640, replace the app with a "Screen size not supported" notice, so every Plenix app behaves the same. CTM turns it on.
- The suggested `minSize={{ width: 1024, height: 640 }}` writes breakpoints as numbers in app code. Check-style `media` forbids that; the shell reads breakpoint tokens (`below('--plx-sys-shell-rail-below')`).
- **Accessibility:** a desktop user who zooms to 200% on a 1280 × 800 screen has a 640 × 400 CSS-pixel viewport. A hard block would lock them out, against WCAG 2.2 1.4.4 (Resize text) and 1.4.10 (Reflow).
- Unmounting the app below the size would lose its state on a rotate or resize.

## Options

| Option | For | Against |
|---|---|---|
| **A. `minSize` boolean, sizes from tokens, the app kept mounted (hidden and inert), with a "Continue anyway" action** | No numbers in apps; one standard; zoomed users can go on; state survives a resize | Not identical to the CTM reference (which has no way past) |
| B. The same, without "Continue anyway" (a hard block, as the CTM reference) | Matches the reference exactly | Blocks zoomed and low-vision users (WCAG 1.4.4, 1.4.10) |
| C. `minSize={{ width, height }}` in px, as asked | Each app picks its size | Numbers in app code (check-style `media`); apps drift apart |

## Decision

**Option A** (D-0044; reply B on #274 to switch).

**Prop (addition):** `minSize?: boolean` on `AppShell` (default `false`: nothing changes for current apps).

**Tokens (additions, `plx-sys`, in `semantic.tokens.json` beside `shell-phone-below`):**

| Token | Value |
|---|---|
| `plx-sys.shell-min-width` | `{plx-ref.breakpoint-1024px}` |
| `plx-sys.shell-min-height` | `{plx-ref.size-640px}` |

**Behavior:**

- With `minSize`, when the viewport is narrower than `--plx-sys-shell-min-width` **or** lower than `--plx-sys-shell-min-height`, the shell shows the notice. The query is built from the tokens at run time, like the shell's other breakpoints, and is live: growing the window brings the app back.
- The app stays mounted and gets `hidden` and `inert`, so nothing is lost on a resize or a rotation.
- The notice is an `EmptyState size="page"` (a computer icon) in the shell's main landmark, with a title (an `h1`) and text that name the size, filled from the two tokens as `{width}` and `{height}`.
- **Continue anyway** (a secondary Button) dismisses the notice for the browser session (`sessionStorage`, key `plx-shell-min-size-dismissed`) and shows the app at the current size.

**Words** (catalog `appShell.minSize`, the Technical Writer's messaging standard: what, why, how to fix):

| Key | English |
|---|---|
| `title` | Screen size not supported |
| `text` | This app shows a lot of detailed information and isn't designed for small screens yet. Use a desktop or laptop with a screen of at least {width} × {height}. A design for mobile is planned. |
| `continue` | Continue anyway |

- The Arabic is proposed by pds1-i18n-engineer and approved by the owner (D-0012). It's not written before approval; English shows until then.
- `strings` already exists on AppShell. It gains `minSize: { title, text, continue }`.

## Consequences

- **Semver: MINOR.** One optional prop, two tokens, three catalog words. Default off.
- RTL: the notice is an EmptyState (logical properties), so it mirrors.
- Visual checks: the build PR adds a story at 800 × 600 (notice) and 1280 × 800 (app), light and dark.
- Mobile stays parked (D-0013). This notice is the stated stopgap, not a mobile design.

## Enforced by

- G3 review of the build PR: prop, tokens and strings as above.
- Check-style `media`: no number in the query (it reads the two tokens).
- Behavior tests (plan §7e): below the width, below the height, above both, live resize back, app state kept, Continue anyway persisting for the session, and the notice's `h1` and landmark.
- Locale checks: the three EN keys; no unapproved Arabic.
