# #977 Avatar: a discreet corner action (Change photo) (G2)

- **Request:** the CTM owner (LighthouseCollection/CTM#240, PLX-027): "changing a photo must be discreet, a small icon in the corner", never a full button.
- **Extends:** the Avatar presence dot (`platform/components/Avatar/avatar.css`, `.plx-avatar__presence`) for its corner, ring and offset, and `AvatarUpload` (`platform/patterns/AvatarUpload`) for the flow (file choice, crop, its messages). It adds one optional part, the **corner action**. The API name is G3's (for example `action` on Avatar, built in on AvatarUpload).
- **Readings applied (D-0112):**
  - The corner action is only on `lg`, `xl` and `2xl`. A 24px target over a 28–32px avatar would cover most of the face, so it would not be discreet. Smaller avatars, such as the one in a Panel header, keep CTM's ghost `Button size="sm"` (icon-only, with a tooltip).
  - With `presence` set, the action moves to the **top-end** corner, and presence keeps the bottom-end.
  - When AvatarUpload is `disabled` or read-only, the action is **not rendered**.

## 1. Look

| | `lg` (40px) | `xl` (48px) | `2xl` (64px) |
|---|---|---|---|
| Badge (visible) | 20px (`plx-ref.size-5u`) | 24px (`size-6u`) | 24px (`size-6u`) |
| Icon `photo_camera` | 12px (`icon xs`) | 16px (`icon sm`) | 16px (`icon sm`) |
| Target | 24px: the hit area extends 2px beyond the badge on every side (a transparent `::before`), WCAG 2.5.8 | 24px (the badge) | 24px (the badge) |

- **Shape:** `plx-sys.shape-mark` (6px), the presence dot's shape. It is not a circle (owner, 2026-10-27).
- **Fill:** `surface-raised`. **Ring:** `avatar-presence-ring-color` and `avatar-presence-ring-width`, the same as the presence dot. That is the surface colour, so it reads on any photo.
- **Icon:** `currentColor`, Material Symbols Sharp, weight 300. It is not mirrored in RTL (a camera has no direction).
- **Position:** `inset-block-end` and `inset-inline-end` are `avatar-presence-offset`, the presence dot's corner. In RTL it is at the bottom-left. With presence, it uses `inset-block-start` instead.
- **This is a control, not an icon in a box.** It is a button with a fill, as the presence dot is a mark with a ring. On a photo, a bare icon would be unreadable.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default (quiet) | fill `surface-raised`, icon `content-muted`. Always visible, because touch has no hover. Contrast of the icon on the fill is ≥ 3:1 (gray-700 on white 7:1; gray-300 on gray-800 6.3:1) |
| hover (the avatar or the badge) | fill `state-hover` over `surface-raised`, icon `content-default`, the cursor is a pointer. Tooltip: `strings.change` ("Change photo"), or `strings.add` ("Add photo") with no picture |
| focus (keyboard) | as hover, plus `focus-ring-color` 2px with a 2px offset around the badge (DESIGN focus). The tooltip opens on focus too. It is always in the tab order, after the avatar's content |
| active (pressed) | fill `state-pressed`, icon `content-default` |
| disabled | not rendered (D-0112). AvatarUpload's existing disabled look applies to the rest |
| loading (uploading) | the icon is replaced by Spinner `xs` at the same size, with `aria-busy="true"`. It is not pressable, and the tooltip reads AvatarUpload's existing busy text |
| error | the badge is unchanged. AvatarUpload's existing messages (`tooLarge`, `notImage`) stay where they are today, per `docs/content/messaging.md`, and focus returns to the badge |
| selected | n/a (an action, not a choice) |
| empty (no picture) | the badge shows over the initials with the label "Add photo". The icon is the same |
| long text | n/a (icon only). A long translated name wraps in the tooltip, per the Tooltip rule |

- **Motion:** `background-color` and `color` over `plx-sys.motion-duration-quick`. No `transition: all`. The duration is 0 under `prefers-reduced-motion`.
- **Name:** `aria-label` = `strings.change` or `strings.add`. With a label on the avatar, the badge is a sibling button outside the `role="img"`, so the image name and the button name stay separate.
- **Press:** it opens AvatarUpload's file choice, then the crop step (existing). On Avatar alone, it calls the app's handler.

## 3. Densities, themes, Arabic

- **Densities:** none. The avatar's size is set explicitly, and the badge follows it (§1).
- **Light and dark:** the tokens above apply in both. In dark, the ring is gray-800 (`surface-default`), like the presence dot. Forced colours: `ButtonFace` fill, `ButtonText` icon and a `ButtonText` border.
- **Arabic:** the corner mirrors (logical insets). The words come from `strings`, and the i18n Engineer proposes them (D-0012).

## 4. Edge cases

- **3× English:** the label only appears in the tooltip, which wraps.
- **A photo with a light or busy corner:** the ring and the fill keep the badge readable.
- **Presence and action together:** presence is at the bottom-end and the action at the top-end. They never overlap.
- **In a list of 10,000 rows:** not offered. Grid avatars are `sm` or smaller.

## 5. Messages

- None new. The tooltip and the name use AvatarUpload's existing `change` and `add` strings. Their wording is the Technical Writer's.

## 6. Choices the engineer must not invent

- The sizes, icon sizes and 24px target in §1, the presence-dot tokens for ring, offset and shape, and the state tokens in §2.
- The `lg`+ limit, the top-end corner with presence, and not rendering when disabled (D-0112).
- **Tests:**
  - keyboard (Tab, then Enter or Space) and pointer open the file choice;
  - the name is read;
  - the hit area is ≥ 24px at `lg`;
  - RTL puts the badge at the bottom-left;
  - with presence, there is no overlap.
