# #997 AppHeader organization brand: the logo slot (G2)

- **Request:** CTM builds its brand by hand ("DIOCESE OF LOS ANGELES" over "CLERICAL TRIBUNAL MANAGEMENT", with its logo) from Plenix's internal classes. G3 (ADR 0039, D-0125) adds `brand={{ logo: { src, alt }, organization, application }}`, drawn with the default brand's markup and tokens. G3 asked for a G2 pass on the logo slot only.
- **Extends:** the default brand (`.plx-app-header__brand`): the mark slot (`--plx-comp-brand-mark-context-size` = `label-height-md` + `label-height-sm`, 36px, as tall as the two lines), the product line (15px, 700) and the app line (12px, 500). There are no new tokens or colours.
- **Readings applied (D-0127, the owner may switch):**
  - **A logo keeps its own proportions.** It is 36px tall (the mark's size). Its width follows its aspect ratio, up to 3 × 36 = 108px, with `object-fit: contain`. A wide logo is never squeezed into the square mark slot.
  - **A logo has no box:** no tile, no border, no fill and no added corner radius (D-0024). It is drawn as given.
  - **The text keeps the case the app writes.** "Diocese of Los Angeles" isn't uppercased by Plenix, as the default's text isn't. CTM passes its own case.

## 1. Look

| Part | Value |
|---|---|
| Logo | `block-size` = `--plx-comp-brand-mark-context-size` (36px); `inline-size: auto`; `max-inline-size` = 3 × that size (108px), as a `calc` on the same token (no new token); `object-fit: contain`. Radius 0 (the image's own shape) |
| Logo to text | `app-header-brand-gap` (12px), the same as the mark |
| Organization | the product line: `app-header-brand-font-size` (15px), 700, tight tracking, a 20px line, `app-header-brand` colour |
| Application | the app line: 12px, 500, wide tracking, a 16px line, the same colour |
| Text width | at most `app-header-name-width` (200px). Each line is one line, ending in an ellipsis, with the full brand in a Tooltip. The switcher already does this; the plain brand takes the same rule |

- **Contrast:** the text uses the existing `app-header-brand` colour on each header variant (accent, frost, plain), as defined. The logo's colours are the app's. On the `accent` header, the app supplies a logo that reads on the accent (a white or one-colour version). Plenix doesn't recolour images.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default | §1 |
| hover | with `brandHref` or as the switcher: the existing item hover (`app-header-hover`). Otherwise n/a (static) |
| focus | with `brandHref` or as the switcher: the existing switch or item focus outline. Otherwise n/a |
| active | the same, through the existing pressed state. Otherwise n/a |
| disabled | n/a (a brand is never disabled) |
| loading | the logo image loading: the slot keeps its 36px height (no layout shift). The width is reserved from `width`/`height` attributes when the app gives them; otherwise the text moves once when the image arrives |
| error | the logo fails to load: it is hidden (no broken-image icon), and the text moves to the start. No message |
| selected | n/a (the brand is never current) |
| empty | no `logo`: no mark (G3). No `organization`: the app line alone, centred on the slot's height. `application` defaults to the app name (G3) |
| long text | §1 text width: an ellipsis, with the Tooltip on hover and focus (with a link or switcher) |

## 3. Densities, themes, Arabic, sizes

- **Densities:** none (the header's height doesn't change by density).
- **Light and dark:** the existing brand colour per header variant. The logo is drawn as given; an app with a dark-only logo passes the right `src` for the theme.
- **RTL:** the logo sits at the inline start (the right) and the text follows it. The image isn't mirrored (a logo has no direction). The organization and application are the app's strings in EN/AR.
- **Narrow (< 600px):** the same as the default brand today. The text truncates first, then the logo stays.

## 4. Edge cases

- **3× English organization:** an ellipsis at 200px, with a Tooltip.
- **A square logo:** 36 × 36px, the same as the Plenix mark.
- **A very wide logo** (a wordmark): 108px wide, shorter than 36px (contain), centred on the line.
- **An SVG with no intrinsic size:** the app passes `width`/`height`, or it renders at 36 × 36.

## 5. Messages

- None. `alt` defaults to `""` (G3), because the name is next to it.

## 6. Choices the engineer must not invent

- 36px tall, a width up to 3×, contain, no box and no radius; text case as given; the 200px text width with an ellipsis and a Tooltip.
- **Tests:**
  - a 1:1 logo is 36 × 36px;
  - a 4:1 logo is at most 108px wide and never distorted;
  - no `plx-app-header__logo` background or border;
  - a failed image is hidden;
  - a long organization truncates, with a Tooltip;
  - RTL puts the logo at the right.
