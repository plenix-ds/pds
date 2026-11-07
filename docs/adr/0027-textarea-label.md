# ADR 0027: Textarea `label`: its accessible name when nothing else names it

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on RedSave's fix request P-72 (#926, PR #927). Decision D-0099 (owner may switch).
- **Issue:** #926 (S3)

## Context

- Before 0.91, an unknown `label` on `Textarea` went onto the `<textarea>` as an attribute, so two RedSave boxes had no accessible name.
- `SearchField` takes `label?: string` as its `aria-label`. `Input` takes no `label`. `Field` names any control with a visible `<label for>` and connects its description and error.
- An `aria-label` overrides a `<label for>`. A Textarea inside a labeled Field that also got `label` would be announced with a name that isn't the visible one (WCAG 2.5.3, label in name).

## Options

| Option | For | Against |
|---|---|---|
| **A. `label?: string`, the `aria-label` only when nothing else names the Textarea** | Same prop as SearchField. The visible Field label always wins. | Field must stop the `aria-label` when it has a label. |
| B. `label`, `description` and `error` on Textarea (the issue's first wording) | One-stop prop set | A second way to do what Field does; Input has none of them. |
| C. `label` always becomes the `aria-label` | Simplest | Inside a labeled Field it replaces the visible name. |

## Decision

**Option A** (D-0099; reply B or C on #926 to switch).

- **API:** `TextareaProps.label?: string`. `description` and `error` stay on `Field`.
- **Precedence**, first that applies names the Textarea:
  1. The app's own `aria-labelledby` or `aria-label`.
  2. The enclosing `Field`'s `label` (its `<label for>`). No `aria-label` is set.
  3. `label`, as the `aria-label`.
- **`label` never reaches the DOM** as an attribute.

## Consequences

- **Semver: MINOR** (a new optional prop).
- SearchField keeps its current behavior; the same precedence can be applied to it later as a separate change.

## Check

- `tests/textarea-label-926.test.js`, LTR and RTL: `label` gives the name; the app's `aria-label` and `aria-labelledby` win; **`<Field label="Description"><Textarea label="Notes"/></Field>` is named "Description" and has no `aria-label`**; axe's `label` rule is clean.
