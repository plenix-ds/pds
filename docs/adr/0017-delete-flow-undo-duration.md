# ADR 0017: DeleteFlow's undo window: `undoDuration` and `plx-sys.undo-duration`

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), on the Design Director's D-0057 (#144, PR #403)
- **Issue:** #144 (S3, RedSave P-44: "DeleteFlow's undo lasts a few seconds and cannot be lengthened")

## Context

- DeleteFlow's `undo` and `trash` variants offer Undo in a toast, and the deletion is final when the toast leaves. The toast uses ToastProvider's default, `--plx-comp-toast-duration` (4s), so the undo window is 4s and an app can't change it.
- D-0057: the undo toast stays 10s by default, pauses while hovered or focused (Toast already does), shows no countdown, and an app may keep it until dismissed.
- Toast already takes `duration` in milliseconds, where `0` means "stays until dismissed or its action is used".

## Options

| Option | For | Against |
|---|---|---|
| **A. `undoDuration` (ms, `0` = until dismissed) on DeleteFlow; the default from its own token `plx-comp.delete-flow-undo-duration` -> the system role `plx-sys.undo-duration` -> `plx-ref.timeout-lg` (10s)** | Same unit and meaning as Toast's `duration`; the default is a token, as Toast's is; tiers hold (the literal only in ref) | Two new tokens |
| B. A literal 10s in DeleteFlow's code | No token | A design value in code; not themeable |
| C. Raise `toast-duration` to 10s | One token | Every toast lingers, not just undo |

## Decision

**Option A.**

- **Prop (addition):** `DeleteFlow.undoDuration?: number`, in milliseconds. It applies to the `undo` and `trash` variants' toast. `0` keeps it until dismissed or Undo is used. Missing: `tokenMs('--plx-comp-delete-flow-undo-duration')`. A negative or non-number value gives a development warning and the default.
- **Tokens (additions):**

| Token | Value |
|---|---|
| `plx-ref.timeout-lg` | `10s` (a long wait; not a motion duration) |
| `plx-sys.undo-duration` | `{plx-ref.timeout-lg}` |
| `plx-comp.delete-flow-undo-duration` | `{plx-sys.undo-duration}` (added with the build, #404, with the code that reads it) |

- The toast keeps Toast's pause on hover and focus. No countdown and no new words (D-0057).
- DeleteFlow reads its own component token, which points to the system role (comp -> sys -> ref), like every other part's tokens. That's amended from the first draft, which read the role directly, after the build (#404) asked.

## Consequences

- **Semver: MINOR.** One optional prop and three tokens. The default undo window grows from 4s to 10s: a *Changed* entry (behavior within its role, as RedSave asked).
- WCAG 2.2.1 (timing adjustable): met by the pause, the 10s floor and `undoDuration: 0`.

## Enforced by

- Checks 6 and 7 (the literal in ref; no value in the names).
- G3 review of the build PR: the prop as above, the default read from the token.
- The behavior test: 10s by default, the pause on hover and focus, `0` stays.
