# #1155 Female person pill: a softer dark pink border (G2)

- **Request:** the owner (chat, 2026-11-10 11:47 UTC): "the border here is strong, use a softer dark pink". D-0147 A: mix the existing pinks, with no new colour. ADR 0049 (PR #1157) sets the token names and tiers.
- **Extends:** `DataPill` soft variant (`.plx-data-pill--soft`, `data-plx-category="pink"`, used by `gender="female"`). Every other hue is unchanged.

## 1. The amount

- **`category-pink-soft-border-amount` = `plx-ref.mix-amount-lg` (35%) in light and in dark.** It is an existing step, so no new ref is needed.
- The border is 35% pink-700 and 65% of the pill's fill, pink-100: **#ccafba**, a muted rose. It was pink-700 (#6c3b4f), the text colour.
- The soft pill is the same pastel in both themes, so one amount serves both.

| Border | Against the pill fill | Against the surface (light / dark) |
|---|---|---|
| Pink before (pink-700) | 7.91 | 8.84 / 1.10 |
| **Pink after (35%)** | **1.81** | 2.02 / 4.83 |
| Blue (male, reference) | 1.64 | 1.88 / 5.19 |
| Magenta (reference) | 1.53 | 1.71 / 5.69 |

- At 35%, pink sits with blue and magenta and stays a touch darker, which keeps the owner's "dark" pink. 30% would match blue exactly, but it is not a step and would add a ref.
- The border is decorative. The pill's fill and text carry it, and text contrast does not change (check 8), so no 3:1 boundary rule applies.

## 2. State matrix

| State | Tokens |
|---|---|
| default | fill `category-pink-soft`, text `category-pink-on-soft`, border = the 35% mix (§1) |
| hover, focus, active | n/a: DataPill is static. A pill inside a link or button takes that control's states |
| disabled, loading, error | n/a: DataPill has none |
| selected | n/a: DataPill has none |
| empty | n/a: a pill without text is not drawn (unchanged) |
| long text | unchanged: one line, with an ellipsis and a Tooltip while cut (fit-and-overflow) |

- **Densities:** none; colour only. **Dark:** the same amount (§1). **Arabic:** n/a (no text or direction change).
- **Forced colours:** unchanged (the border is `CanvasText`).

## 3. Choices the engineer must not invent

- The amount `mix-amount-lg` for pink in light and dark. Every other hue reads `category-soft-border-amount` = 100%, which is today's colour.
- The scope is DataPill's soft border only. `Tag` and the grouped Timeline keep their rules (ADR 0049).
- The test: the female soft pill's computed border is #ccafba in light and dark, and the blue soft pill's border is unchanged (#a2c0e3).

## Pictures (before and after; 1.5.0 CDN CSS with the mix applied)

- Light: `pill-before-after-light.png`
- Dark: `pill-before-after-dark.png`
