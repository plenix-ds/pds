# ADR 0023: AppShell `frame`: the full window, or a centered frame a person can expand

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on the owner's request (#862, D-0093) and the brief (`docs/pds1/slices/862-shell-frame/brief.md`, #863). The frame's look (the outside grey and the shadow values) is G2's.
- **Issue:** #862 (S1)

## Context

- **The owner** wants two frames: the full window (today), or a 1366-wide frame, centered, on a mid-grey page with a wide shadow, which a person can expand to the full window and back. Each app picks its default, and CTM's is 1366.
- **AppShell** is the page root. It has no frame setting today. AppHeader is passed in by the app (`header`).
- **The ref breakpoints** are `sm` 600, `md` 840, `lg` 1024 and `xl` 1440. **1366 isn't on that scale.** D-0092 names 1366×768 as "the smallest common laptop", the screen every change must look right on.

## Options

| Option | For | Against |
|---|---|---|
| **A. `frame?: "full" \| "centered"`, the width from a token** | The API names the behavior. A later width (1440) is a token change, not an API change (the brief's P1). | The value isn't the owner's word "1366". |
| B. `frame?: "full" \| "1366"` | Reads like the request | A number in the API. Every new width is a new prop value, and a "1440" sits beside a token that may say otherwise. |
| C. `frameWidth?: string` (a token name) | Any width | Free-form. Apps could pass any number, which loses the one-standard-width rule. |

## Decision

**Option A** (D-0094).

- **AppShell props** (no other prop changes):
  - `frame?: "full" | "centered"`. The default is `"full"`, exactly today's layout.
  - `onFrameChange?(frame: "full" | "centered"): void`. It's called when the person toggles, for apps that store the choice themselves (the brief's P1, added now so it needs no second ADR).
- **`"centered"`:**
  - The whole shell has the inline size of `--plx-sys-shell-frame-width`, is centered, uses the full window height, and casts `--plx-sys-shell-frame-shadow` on a page of `--plx-sys-shell-frame-outside`.
  - At a window of that width or less, it fills the window, the same as `"full"`, with no toggle.
- **The person's toggle:**
  - AppHeader shows it at its inline end when it's inside a centered AppShell that has room. It reads that through AppShell's context, so **AppHeader gets no new prop**.
  - The names are "Expand to full window" and "Restore to <frame width> width", in English and Arabic through the catalog. The Arabic needs the owner's approval (D-0012).
  - It's a toggle button (`aria-pressed`).
- **Remembering the choice:**
  - The person's choice is kept in the browser per app: `localStorage` `plenix.shellFrame`, keyed by the app's first path segment.
  - The key is an engine detail, not API. `onFrameChange` lets an app keep it elsewhere.
- **Tokens (no tier skipped, and no value in a name):**
  - `plx-ref.breakpoint-laptop`: 1366px, the D-0092 laptop screen. It's a screen size, not a layout step, so it's exempt from the 4px grid, like the other breakpoints, which are screen sizes too.
  - `plx-sys.shell-frame-width` -> `{plx-ref.breakpoint-laptop}`.
  - `plx-sys.shell-frame-outside` (a color). In light and dark it's an existing ref grey that G2 picks; no new color.
  - `plx-sys.shell-frame-shadow` (a shadow). It's an existing shadow ref or role that G2 picks.

## Consequences

- **Semver: MINOR.** *Added*: two props and four tokens. The default is unchanged (AC-4: `"full"` is identical to today).
- **CTM** sets `frame="centered"` (its own issue).
- **New projects** choose `"full"` or `"centered"` at intake (the brief's P0 item 4).
- **Changing the frame width later** (for example to `breakpoint-xl`, 1440) is a token change under G3, not a new prop value.

## Check

- G3 on the build PR: the diff adds only `frame` and `onFrameChange` to `AppShellProps`, no AppHeader prop, and the four tokens above. CI's `types` check finds no new `any`, and token checks 6 and 7 pass.
- The brief's behavior tests AC-1 to AC-6.
