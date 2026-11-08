# 990: EntityHeader fact tone (danger), and the "required, not chosen" picker

Source: plenix-ds/pds#990, the CTM owner (2026-11-07), relayed by ctm3-product-lead. Decision: D-0118.

## Goal

- A fact in the EntityHeader can be shown in a tone, the same in both header styles, so an app can flag a missing required fact in red.
- The app can show a picker as "required, not chosen" with the danger border and no error message, and screen readers hear why.

## Already implemented

- `platform/patterns/EntityHeader/EntityHeader.tsx`: the Status tile takes `{ tone }` (TONES: neutral, success, active, waiting, action-required, negative; aliases info, warning, danger). In the streamlined style, `detail.facts[].tone` makes a fact a status tile (line ~381). The structured style's `facts[]` has no tone.
- `invalid` on `Select` (`platform/components/Input/Input.tsx`), `Combobox` and `EntityPicker`: `aria-invalid` and the 2px danger border. No message is shown unless a `Field` passes `error`. This already covers item 2 of the issue.

## P0

- `facts[].tone` in the structured style, with the same tones and aliases as the Status tile, rendered with the existing status-tile classes and tokens (`data-plx-tone`). `tone: "danger"` maps to `negative`, as it does today.
- Document in the EntityHeader doc comment and its docs page: "Required, not chosen" = `invalid` on the control plus `aria-describedby` pointing to a hint, with no `Field` error.

## P1

- A docs example: the CTM case header with an unassigned council member (fact in `danger` tone, EntityPicker `invalid`).
- The softer tone is the existing `action-required` (D-0118). No new `attention` tone.

## P2

- None.

## Non-goals

- No new tokens or colors. The status-tile tone tokens are reused.
- No new `status` prop on Select, Combobox or EntityPicker. `invalid` stays the one prop.
- The cut placeholder (item 3) is #993.
- No change to the streamlined style's behaviour.

## Affected packages

- `@plenix-ds/react` (EntityHeader), `@plenix-ds/styles` (only if the status-tile selector needs widening to structured facts).

## Acceptance

- **AC-1:** Given a structured EntityHeader with `facts: [{ label: "Council member", value: picker, tone: "danger" }]`, when it renders, then that tile has `data-plx-tone="negative"` and the status-tile classes, and the other facts are unchanged.
- **AC-2:** Given `tone: "action-required"`, when it renders, then the tile uses the action-required tone. Given an unknown tone, then it falls back to neutral, as the Status tile does.
- **AC-3:** Given a fact with no `tone`, when it renders, then the markup is the same as before this change (no regression).
- **AC-4:** Given an EntityPicker with `invalid` and `aria-describedby` set to a hint's id, outside a Field, when it renders, then it has `aria-invalid="true"` and the danger border, and no error message is shown.
- **AC-5:** Given RTL, when a toned fact renders, then its icon and text mirror like the Status tile (logical properties only).

## Anything unclear

| Question | Answer |
|---|---|
| Should a softer "attention" tone be offered? | Answered: use `action-required` (D-0118). |
| Is a new picker prop needed? | Answered: no, `invalid` exists (code above). |
