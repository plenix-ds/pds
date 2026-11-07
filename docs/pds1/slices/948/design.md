# #948 Footers without a fill: Save and Cancel sit on the surface (G2)

- **Request:** the owner, through CTM: "why is there grey bar bg behind the save / cancel". Intake applied Fluent 2 (D-0078): card, form and dialog footers have no fill. A hairline is used only where the content needs separating (D-0102).
- **Extends:** `ActionBar` (and `FormActions`, which is an ActionBar, used by `FormFlow`), the `Dialog` footer, and the Card / panel footer. No new component.

## 1. Cause

| Where | Fill today | Seen as |
|---|---|---|
| `ActionBar` / `FormActions` (FormFlow, Form, DraftState pages) | `plx-comp-action-bar-background` = `surface-canvas` (gray-75) | invisible on a page (also canvas), a grey band inside a Card, a panel or a Dialog (white) |
| `Dialog` footer | `plx-comp-dialog-footer-background` = `surface-dialog-chrome` (gray-200; the dark value is the same light grey, "provisional") | a grey band in light, and a light band in dark |
| Card / panel footer (`.plx-panel__footer`) | none, `border-top` hairline | already right |

## 2. The rule

- **A footer has no fill of its own.** The actions sit at the end (inline-end) on the surface of whatever holds them.
- **ActionBar, static** (`sticky={false}`, as in FormFlow): transparent.
- **ActionBar, sticky:** content scrolls under it, so it stays opaque. It takes the surface it sits on, never a different grey:
  - It reads `--plx-comp-action-bar-context-background`, falling back to `surface-canvas`, the page.
  - Every surface that can hold one publishes its own fill there: Card / panel and SidePanel (`surface-default`), Dialog, Drawer and Sheet (their surface token), and the settings section card (it already does).
  - The existing hairline above a stuck bar (`action-bar-line`) stays. It is the divider that's needed, because content passes under the bar.
- **Dialog footer:** `background-color: transparent` (the dialog surface).
  - **Hairline only while the body scrolls:** a `border-dialog-chrome` 1px block-start border shows only when `.plx-dialog__body` overflows.
  - The Dialog sets `data-plx-overflow="true"` on the dialog from a ResizeObserver on the body, the same way `utils/overflow.ts` measures.
  - With short content there is no line: the actions follow the content (Fluent 2).
- **Card / panel footer:** unchanged (no fill, hairline above).
- **Spacing:** the existing paddings and `action-bar-margin-block-start` stay. Nothing moves.
- **Out of scope:** the Dialog header band (`dialog-header-background`) was not part of the request and stays as it is. Removing it would be a separate owner decision.
- **No opt-in fill variant** is added: no part needs one. A part that needs one later gets it through a new decision.

## 3. State matrix (the footer containers; buttons keep their own matrices)

| State | Tokens |
|---|---|
| default | static: `transparent`; sticky: `action-bar-context-background` → surface, `action-bar-line`; dialog: `transparent`, and `border-dialog-chrome` while the body overflows |
| hover | n/a(container; buttons own hover) |
| focus | n/a(container is not focusable; buttons keep `focus-ring-color`, and the sticky bar keeps `scroll-padding-block-end` so focus is never hidden, WCAG 2.4.11) |
| active | n/a(container) |
| disabled | n/a(container; disabled buttons follow DESIGN §9) |
| loading | n/a(the submitting button shows its own loading state; the footer keeps its size) |
| error | n/a(form errors go to ErrorSummary at the top and under fields, DESIGN §11, never in the footer) |
| selected | n/a(container) |
| empty | no actions → no footer rendered; no empty band or hairline is left |
| long text | buttons follow the bar's fit ladder (what doesn't fit folds into More actions; under 400px the main pair stacks), unchanged |

## 4. Densities, themes, Arabic

- Densities: no change. Paddings come from the existing tokens.
- **Light:** the band disappears on white surfaces. The surface tones behind the button labels don't change, so contrast is unchanged.
- **Dark:** the light gray-200 band disappears from the dialog footer. That removes a dark-mode mismatch: dark text on dark surfaces passes as defined.
- **Arabic:** no text or direction change. The actions stay at the inline-end (left in RTL). No RTL run is needed.

## 5. Edge cases

- **3× English button labels:** the existing fit ladder applies.
- **A dialog with 10,000 rows (a long list in the body):** the body scrolls, so the hairline shows.
- **A sticky FormActions inside a Card in a scrolling page:** the bar takes the card's `surface-default`, so there is no band.

## 6. Messages

- None. Placement is unchanged.

## 7. Choices the engineer must not invent

- Static means transparent. Sticky means the context surface, falling back to canvas.
- The Dialog hairline uses `border-dialog-chrome`, and only while the body overflows.
- The Dialog header and the Card footer don't change. No fill variant is added.
- Who publishes the context background: Card / panel, SidePanel, Dialog, Drawer, Sheet.

## 8. Visual checks

- Before and after, light and dark, standard density, at 1366×768 and 1920×1080, plus once at 1024×640.
- Show four cases: FormFlow in a Card, a short Dialog, a scrolling Dialog, and a sticky FormActions on a page.
- The shots go on #948 and its PR.
