# ADR 0034: AvatarUpload's corner action (Change photo as a corner icon)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on CTM's owner rule (LighthouseCollection/CTM#240, CTM request PLX-027). Decision D-0113 (owner may switch).
- **Issue:** #977 (S3)

## Context

- The CTM owner wants changing a photo to be discreet: a small icon in the corner of the image, never a full button.
- The request names `Avatar` and `AvatarUpload`.
- `Avatar` is presentational. It is a `<span>`, an image (`role="img"`) when labeled, with a presence dot at its bottom-end corner.
- `AvatarUpload` already owns the flow: the file input, the `ImageCrop` step, removal, the size and type limits, and the words (`strings.change`, `strings.remove`).
- AvatarUpload's sizes are `xl` (48px) and `2xl` (64px). CTM also needs it in card headers, at 40px.
- `photo_camera` is in the icon library.

## Options

| Option | For | Against |
|---|---|---|
| **A. `AvatarUpload` gets `actions: "buttons" \| "corner"`** | One part owns the whole flow. Additive. No new words. | One more prop value. |
| B. `Avatar` gets `action={{ icon, label, onPress }}` | Works on any avatar | It puts a button inside an image (`role="img"`). Each app re-wires the file and crop flow, so they drift. |
| C. A new part, `AvatarEditButton` | Composable | A second way to do what AvatarUpload does. Each app places and spaces it itself. |

## Decision

**Option A** (D-0113; reply B or C on #977 to switch).

- **Prop:** `actions?: "buttons" | "corner"`, default `"buttons"` (today's look, unchanged).
- **`actions="corner"`:**
  - The secondary buttons and the `description` line are not drawn.
  - One icon-only button (`photo_camera`) sits at the avatar's **bottom-end** corner. It follows logical properties, so it moves to bottom-left in RTL. It is ringed in the surface color, like the presence dot.
  - It is always in the tab order. Its accessible name is `strings.change` (Change photo) when there is a picture, and `strings.add` (Add photo) when there is none. A Tooltip shows the same words. It is quiet at rest and fully shown on hover, on focus-visible and while its menu is open.
  - Press:
    - With no picture, or when `removable` is false: it opens the file picker, then the existing crop step.
    - With a picture and `removable`: it opens a Menu with Change photo and Remove photo (`strings.change`, `strings.remove`). Remove returns focus to the corner button.
  - The target is 24px or more (WCAG 2.5.8).
- **`size`** becomes `"lg" | "xl" | "2xl"`. `"lg"` (40px) is allowed only with `actions="corner"`. With `"buttons"`, `devWarn` names the allowed sizes, as it does today.
- **`Avatar`** is unchanged: no action prop. An avatar people can change is an `AvatarUpload`.
- **Comp tokens** (comp -> sys only; G2 sets the values from existing sys roles): `avatar-upload-corner-size`, `-icon-size`, `-background`, `-text`, `-ring-color`, `-ring-width`, `-rest-opacity`, plus the per-size inset if G2 needs one. No new sys token or ref.
- **Strings:** none new. The existing keys `change`, `add` and `remove` are reused, so no Arabic is needed (D-0012).

## Consequences

- **Semver: MINOR** (*Added*: the `actions` prop and its `"corner"` value, the `"lg"` size, the `avatar-upload-corner-*` tokens and the corner element's classes). The default look doesn't change.
- CTM replaces its ghost `Button size="sm"` with `<AvatarUpload actions="corner" size="lg">`.

## Enforced by

- G3 on the build PR: the API diff matches this entry (one prop, one size value, no Avatar change).
- Checks 6 and 7 on the `avatar-upload-corner-*` tokens.
- The build PR's behavior tests (plan §7e):
  - keyboard and pointer both open the picker, or the menu when there is a picture;
  - the button's name is read;
  - it is in the tab order at rest;
  - the target is 24px or more at every allowed size;
  - it sits at the bottom-end corner in LTR and RTL.
