# Changelog

All notable changes to Plenix: the packages (`@plenix-ds/tokens`, `icons`, `styles`, `react`), the CDN and the API.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow `VERSIONING.md`.
The batch numbers point to the work log (Plenix - DAM/audit/batches/).

## [Unreleased]

## [0.83.0] - 2026-11-02

**In short.** A clean-up release from the code health check (#882). Pages download less: the nine apps other than Settings no longer load settings data, CDN pages get the minified stylesheet, and small npm imports of icons are about 10 KB lighter. Six library parts show a plain icon instead of an icon in a box. Two bugs are fixed: "Insert image" in the rich-text editor works again, and a Time whose value comes and goes no longer crashes. On a narrow phone, a carousel shows fewer, wider items so each one is readable. 252 unused utility classes and 14 unused tokens are marked "going away", and 98 color names retired since 0.48.0 are removed.

### Upgrading from 0.82.0
1. **Removed color names:** 98 `--plx-ref-color-category-*` and old palette shade aliases are gone (deprecated since 0.48.0). Each one's replacement is listed under "Replacements for the removed color names" below; `orange-700` stays one more release.
2. **Going away:** 252 `plx-u-*` utility classes (listed in `platform/standards/deprecated-classes.json`) and 14 tokens keep working in this release; move off them before they are removed.
3. **Contributors:** run `npm ci` after pulling; generated files are no longer in git.
4. **Nothing else to change.** Apps on the CDN loader follow this release by themselves; npm apps update the version as usual.

### Changed
- Generated files are no longer kept in git (#692): `npm ci` builds them (the `prepare` script runs `node build-app.js`), in this repository and in the design spec's. A fresh checkout opened without `npm ci` stops `check-system` with "run npm ci first". Spec lanes carry sources only, plus a `lanes/<task>/BASE` file naming the spec commit they were built on.
- Pages that load Plenix from the CDN through the page loader get the minified stylesheet, `plenix.min.css` (about 270 KB less per page; no visible change) (#882).
- ESLint is adopted with one rule, `import/no-unresolved` (`npm run lint:js`, in CI), so an import of a renamed or deleted file fails (#904).
- More of the Platform is TypeScript: slice 5, the field parts (20 files); no behavior change (#708).
- Clean-up with no visible change (#882): unused application data and design-spec styles, unused `headerAlign` props, American English spellings, 18 one-time scripts removed, and the design spec's index built for loading its parts on demand.
- The npm package loads the icon name tables only when an icon is drawn by name (#882):
  - The Plenix names, symbols and mirrored symbols now load with the Material library's names, the first time an Icon meets a name. An icon drawn from an imported or registered module never loads them.
  - One import costs about 10 KB less: `{ Button }` 103.2 to 93.2 KB, `{ Badge }` 26.5 to 16.5 KB (Vite, minified).
  - Until the tables arrive, `resolveIcon(name)` answers `null` and a named icon draws nothing, as Material names already did; it draws when they arrive.
  - The browser global, the CDN's `plenix.esm.js` and the CommonJS build keep the tables built in, unchanged.
- The suite applications load less data (#882): the data only Settings reads (the feature areas, capability documentation, schema and terminology tables, about 280 KB, 88 KB compressed) moved from `suite/plenix-app-data.js` to a new `suite/settings-data.js` that only the Settings page loads. The nine other suite pages go from 310 KB to 20 KB of data. Release folders now hold `apps/suite/settings-data.js`; a page pinned to an older release still works (its own data file holds everything).
- Platform source: 43 unused imports and about 20 dead local values are removed (#882). Nothing reads them, and nothing changes for users.
- Platform source: one copy of each helper that several files had written out the same way (reduced motion, a duration token on an element, a placeholder filled with an element, an empty value, a field as a menu choice, the optional toast, leaving the full-screen search). Six exports nothing imported are now internal to their files. Nothing changes for users (#882).
- TypeScript: 13 props of @plenix-ds/react now have real types instead of `any` (Icon.filled, Chat.Thread.follow, DirectionProvider.root, LineChart.x, zero, interactive and zoom, the two overscan props, ConnectedAccounts.headingLevel, ProductOptions.min, Metric.trendColor, SelectionSummary.noun). Their documentation now says what they take; nothing changes at run time (#882).

### Changed (visual)
- Six parts show a plain icon instead of an icon in a box (#882):
  - Affected parts: EntityPicker, FeatureCard, MetricCard (icon-start and list rows), RoleManager, PeopleGroup and ConnectedAccounts.
  - Each icon keeps the box's icon size. A gray icon takes the muted content color, a data hue its data color, and a FeatureCard tone its feedback content color.
  - PeopleGroup keeps a 40px slot, so a group's name lines up with a team's.
  - New component tokens only; no new colors. IconTile itself is unchanged.

### Fixed
- Carousel: with several slides per view, a strip too narrow for the least slide width shows fewer at once, down to one with the next slide peeking (#883). At 320px a three-up carousel (the Storefront's "Recommended for you") had slides 65px wide that cut off their title, rating and Add to cart.
  - The least slide width is the new token `--plx-comp-carousel-slide-min` (152px). The pages and dots follow what shows. `perView` is still the most that shows.
- RichTextEditor: Insert image works again. Since #178 it showed a script error and inserted nothing, because the picture address check moved into the rich-text cleaner and the editor lost it; the editor now uses the cleaner's own check (#884).
- Time no longer crashes when its value is empty at first and filled in later, or the other way around: it asks for its words before it decides there is nothing to show, so its React hooks run in the same order every time (#885).

### Deprecated
- 252 utility classes (`plx-u-*`) that no page, application, the design spec or CTM uses: the list is `platform/standards/deprecated-classes.json`. They keep working, and are removed no earlier than the next minor release; use a component or another utility. #882
- 14 tokens nothing uses: `--plx-ref-opacity-45`, `--plx-ref-breakpoint-768px`, `--plx-ref-breakpoint-1920px`, `--plx-ref-control-visual-size-16px`, `-20px`, `-24px`, `--plx-ref-control-target-size-24px`, `-28px`, `-32px`, `-44px`, `--plx-ref-content-max-2600px`, `--plx-sys-space-stack-2xl`, `--plx-sys-space-cluster-lg`, `--plx-sys-data-grid-menu-button-hover`. Each token's page in the design spec says so. #882
- `--plx-ref-color-orange-700` stays, still Deprecated (use `--plx-ref-color-brown-500`): CTM uses it. It is removed in a later release, once CTM has moved to `--plx-ref-color-brown-500`. #882

### Removed
- 98 retired palette aliases, deprecated since 0.48.0 and used by no page, application, the design spec, the St. John site, CTM or AITEAM: the 80 `--plx-ref-color-category-*` aliases and 18 old shade names. #882

### Replacements for the removed color names
- **A page or stylesheet that still writes one of the 98 removed palette aliases** uses its replacement (each was an alias of exactly that color, so nothing looks different):
  - The 20 category bases: write the category role `--plx-sys-category-<name>` (the same color), or the palette color: `--plx-ref-color-category-red` → `--plx-ref-color-red-500`, `--plx-ref-color-category-green` → `--plx-ref-color-green-300`, `--plx-ref-color-category-yellow` → `--plx-ref-color-yellow-150`, `--plx-ref-color-category-blue` → `--plx-ref-color-blue-400`, `--plx-ref-color-category-orange` → `--plx-ref-color-orange-500`, `--plx-ref-color-category-purple` → `--plx-ref-color-purple-500`, `--plx-ref-color-category-cyan` → `--plx-ref-color-cyan-300`, `--plx-ref-color-category-magenta` → `--plx-ref-color-magenta-500`, `--plx-ref-color-category-lime` → `--plx-ref-color-yellow-150`, `--plx-ref-color-category-pink` → `--plx-ref-color-pink-300`, `--plx-ref-color-category-teal` → `--plx-ref-color-teal-500`, `--plx-ref-color-category-lavender` → `--plx-ref-color-purple-300`, `--plx-ref-color-category-brown` → `--plx-ref-color-orange-500`, `--plx-ref-color-category-beige` → `--plx-ref-color-yellow-100`, `--plx-ref-color-category-maroon` → `--plx-ref-color-red-800`, `--plx-ref-color-category-mint` → `--plx-ref-color-green-100`, `--plx-ref-color-category-olive` → `--plx-ref-color-green-500`, `--plx-ref-color-category-apricot` → `--plx-ref-color-orange-200`, `--plx-ref-color-category-navy` → `--plx-ref-color-blue-950`, `--plx-ref-color-category-grey` → `--plx-ref-color-gray-400`.
  - The category shades: `--plx-ref-color-category-red-100` → `--plx-ref-color-red-100`, `--plx-ref-color-category-red-300` → `--plx-ref-color-red-200`, `--plx-ref-color-category-red-700` → `--plx-ref-color-red-800`, `--plx-ref-color-category-green-100` → `--plx-ref-color-green-100`, `--plx-ref-color-category-green-300` → `--plx-ref-color-green-200`, `--plx-ref-color-category-green-700` → `--plx-ref-color-green-700`, `--plx-ref-color-category-yellow-100` → `--plx-ref-color-yellow-100`, `--plx-ref-color-category-yellow-300` → `--plx-ref-color-yellow-300`, `--plx-ref-color-category-yellow-700` → `--plx-ref-color-brown-600`, `--plx-ref-color-category-blue-100` → `--plx-ref-color-blue-100`, `--plx-ref-color-category-blue-300` → `--plx-ref-color-blue-300`, `--plx-ref-color-category-blue-700` → `--plx-ref-color-blue-700`, `--plx-ref-color-category-orange-100` → `--plx-ref-color-orange-100`, `--plx-ref-color-category-orange-300` → `--plx-ref-color-orange-300`, `--plx-ref-color-category-orange-700` → `--plx-ref-color-brown-700`, `--plx-ref-color-category-purple-100` → `--plx-ref-color-purple-100`, `--plx-ref-color-category-purple-300` → `--plx-ref-color-purple-300`, `--plx-ref-color-category-purple-700` → `--plx-ref-color-purple-700`, `--plx-ref-color-category-cyan-100` → `--plx-ref-color-cyan-100`, `--plx-ref-color-category-cyan-300` → `--plx-ref-color-cyan-300`, `--plx-ref-color-category-cyan-700` → `--plx-ref-color-cyan-700`, `--plx-ref-color-category-magenta-100` → `--plx-ref-color-magenta-100`, `--plx-ref-color-category-magenta-300` → `--plx-ref-color-magenta-300`, `--plx-ref-color-category-magenta-700` → `--plx-ref-color-magenta-700`, `--plx-ref-color-category-lime-100` → `--plx-ref-color-green-100`, `--plx-ref-color-category-lime-300` → `--plx-ref-color-green-200`, `--plx-ref-color-category-lime-700` → `--plx-ref-color-green-700`, `--plx-ref-color-category-pink-100` → `--plx-ref-color-pink-100`, `--plx-ref-color-category-pink-300` → `--plx-ref-color-pink-300`, `--plx-ref-color-category-pink-700` → `--plx-ref-color-pink-700`, `--plx-ref-color-category-teal-100` → `--plx-ref-color-teal-100`, `--plx-ref-color-category-teal-300` → `--plx-ref-color-teal-300`, `--plx-ref-color-category-teal-700` → `--plx-ref-color-teal-700`, `--plx-ref-color-category-lavender-100` → `--plx-ref-color-purple-100`, `--plx-ref-color-category-lavender-300` → `--plx-ref-color-purple-300`, `--plx-ref-color-category-lavender-700` → `--plx-ref-color-purple-700`, `--plx-ref-color-category-brown-100` → `--plx-ref-color-orange-100`, `--plx-ref-color-category-brown-300` → `--plx-ref-color-orange-300`, `--plx-ref-color-category-brown-700` → `--plx-ref-color-brown-700`, `--plx-ref-color-category-beige-100` → `--plx-ref-color-yellow-100`, `--plx-ref-color-category-beige-300` → `--plx-ref-color-orange-200`, `--plx-ref-color-category-beige-700` → `--plx-ref-color-brown-600`, `--plx-ref-color-category-maroon-100` → `--plx-ref-color-red-100`, `--plx-ref-color-category-maroon-300` → `--plx-ref-color-red-200`, `--plx-ref-color-category-maroon-700` → `--plx-ref-color-red-800`, `--plx-ref-color-category-mint-100` → `--plx-ref-color-green-100`, `--plx-ref-color-category-mint-300` → `--plx-ref-color-green-200`, `--plx-ref-color-category-mint-700` → `--plx-ref-color-green-700`, `--plx-ref-color-category-olive-100` → `--plx-ref-color-yellow-100`, `--plx-ref-color-category-olive-300` → `--plx-ref-color-orange-200`, `--plx-ref-color-category-olive-700` → `--plx-ref-color-brown-600`, `--plx-ref-color-category-apricot-100` → `--plx-ref-color-orange-100`, `--plx-ref-color-category-apricot-300` → `--plx-ref-color-orange-300`, `--plx-ref-color-category-apricot-700` → `--plx-ref-color-brown-700`, `--plx-ref-color-category-navy-100` → `--plx-ref-color-blue-100`, `--plx-ref-color-category-navy-300` → `--plx-ref-color-blue-300`, `--plx-ref-color-category-navy-700` → `--plx-ref-color-blue-700`, `--plx-ref-color-category-grey-100` → `--plx-ref-color-gray-100`, `--plx-ref-color-category-grey-300` → `--plx-ref-color-gray-300`, `--plx-ref-color-category-grey-700` → `--plx-ref-color-gray-700`.
  - The old shade names: `--plx-ref-color-orange-900` → `--plx-ref-color-brown-800`, `--plx-ref-color-orange-800` → `--plx-ref-color-brown-700`, `--plx-ref-color-brown-300` → `--plx-ref-color-orange-300`, `--plx-ref-color-brown-200` → `--plx-ref-color-orange-200`, `--plx-ref-color-brown-100` → `--plx-ref-color-orange-100`, `--plx-ref-color-brown-950` → `--plx-ref-color-brown-900`, `--plx-ref-color-yellow-900` → `--plx-ref-color-brown-800`, `--plx-ref-color-yellow-700` → `--plx-ref-color-brown-600`, `--plx-ref-color-yellow-600` → `--plx-ref-color-green-500`, `--plx-ref-color-yellow-400` → `--plx-ref-color-yellow-500`, `--plx-ref-color-yellow-250` → `--plx-ref-color-orange-200`, `--plx-ref-color-yellow-175` → `--plx-ref-color-yellow-150`, `--plx-ref-color-green-150` → `--plx-ref-color-yellow-150`, `--plx-ref-color-cyan-500` → `--plx-ref-color-cyan-300`, `--plx-ref-color-blue-800` → `--plx-ref-color-blue-700`, `--plx-ref-color-blue-500` → `--plx-ref-color-blue-400`, `--plx-ref-color-purple-visited` → `--plx-ref-color-purple-900`, `--plx-ref-color-purple-visited-light` → `--plx-ref-color-purple-300`.

## [0.82.0] - 2026-11-01

**In short.** Every DataGrid that doesn't fit its width now shows the owner's row template card (layout A) by default, built to match the approved sample, and a grid with thousands of rows stays responsive as cards (they draw 100 at a time). Split views resize as far as the window allows, up to 90%. New: EntityTitle, and control cards (a checkbox, radio or switch inside a clickable card). Trees load a branch when it's first opened and draw only the rows in view. The date and time pickers follow the app's time zone. Two pages no longer overflow at phone width. 0.81.0 was released to the CDN and the apps only; its contents are part of this release on npm and GitHub.

### Upgrading from 0.81.0
1. **Narrow grids look different on purpose:** a grid that doesn't fit shows the template card (title, date, subtitle, the primary value and two more lines; extra fields as "Label: value" lines). An app that needs the old plain card passes `layout="plain"`; one that must stay a table passes `narrow="table"`.
2. **SplitView `maxSize` no longer limits dragging side by side** (it still limits the stacked form). Nothing to change; remove it when convenient.
3. **Time zone:** an app with a `timeZone` on LocaleProvider now gets moments in UTC from a date-time DatePicker: store them as they are. A picker that must keep the computer's zone inside such a region passes `timeZone={null}`. Apps without a `timeZone` are unchanged.
4. **Long trees:** a Tree with over 200 visible rows now scrolls itself: give its container a height, or pass `virtualized={false}` to keep the old layout.
5. **Nothing else to change.** ChoiceList without `control` is a radio group of cards as before (now named by each card's label alone); a hierarchy without `hasChildren` and `loadChildren` works as before. Apps on the CDN loader follow this release by themselves; npm apps update the version as usual.

### Added
- EntityTitle (#803, idea 3 of the component study #767): a short title line for list rows and cards, where EntityHeader is too big.
  - An icon (plain, decorative), the title on one line cut with "…" (its whole text in a tooltip while it is cut), a subtitle under it and a tag after it. Each part but the title is optional.
  - `tag`: a string is a Tag; `{ label, tone, icon }` is a status Badge with its icon; `{ label, category }` is a category Tag; an element is drawn as given.
  - `level` (1 to 6) makes the title a heading, for a card.
  - `loading` shows bars in place of the text and marks the item `aria-busy`.
  - Its lines are 20px and 16px: one line is as tall as plain row text and two lines 36px, on the 4px grid, the same while loading. It adds no padding, so list rows and cards keep their height rules.
- The design spec has its page (03 Content › Identity › Entity title), with examples in a list row and a card.
- Control cards (#804, idea 4 of the component study #767): ChoiceList takes `control`: "radio" (the default, one choice), "checkbox" (several) or "switch" (each option on or off).
  - Each card is the label of its native control. A click anywhere on the card changes it. The keyboard and screen readers meet one control, named by the card's label alone (`aria-labelledby`) and described by its description (`aria-describedby`), so neither is read twice. A switch is the native checkbox with `role="switch"`.
  - A checkbox or switch card takes `values` and gives `onChange(values)`. A radio card keeps `value` and `onChange(value)`.
  - Keys: radio cards are a native radio group (the arrows move the choice); checkbox and switch cards toggle with Space, with no arrow keys.
  - An option can be `disabled`: the card is dimmed, has no hover fill and is skipped by the keys.
  - The switch sits at the card's end, as in a settings row. Inside a switch card the card's outline is the one focus mark.
- The design spec's Choice card page shows one example of each kind.
- DatePicker and TimePicker follow the app's time zone (#813, from the Semi study #767): with a `timeZone` on LocaleProvider (or their own `timeZone` prop), they show and save dates and times in that zone instead of each computer's.
  - DatePicker: today, the calendar's today mark and the presets are the zone's today. A date-time value is one moment: it reads an ISO string ending in Z or an offset, shows its date and time in the zone, names the zone for that moment (EST or EDT), and saves the moment chosen as UTC (`2026-03-08T07:30:00.000Z`). A date or a range stays a calendar date.
  - TimePicker: a moment value shows its time in the zone and saves the moment on the same day there. An `"HH:MM"` value stays a time of day.
  - Clock changes: a time the zone skips reads as the time after the change (02:30 is 03:30). A time it repeats is the earlier moment.
  - Without a time zone both work exactly as before.
- `useTimeZone()`: the nearest LocaleProvider's time zone, or undefined (the computer's). `useLocale()` also gives `timeZone`.
- A branch loads only when it is first opened (#814, from the Semi study #767): `useBranchLoader`, one mechanism shared by Tree, TreeSelect and Cascader (through MillerColumns). Big hierarchies open at once.
  - Mark a branch with `hasChildren: true` and no `children` array, and pass `loadChildren(node)` (it returns an array or a promise of one). It is asked for once, the first time the branch opens.
  - While the children load, the row shows a spinner and "Loading…", the item (or column) is `aria-busy`, and "Loading {label}" is announced. A failure shows "Couldn’t load these items" with Try again and is announced. Arrow Right on the branch, or closing and opening it, also asks again.
  - Choosing, searching and the keys work the same on loaded and not-yet-loaded branches. Search finds the items loaded so far and never loads a branch by itself. With TreeSelect `multiple`, checking a branch that has not loaded loads it, then checks everything under it.
  - The words are in the catalog's new `branch` section, in English and Arabic.
  - `useBranchLoader` and `BranchStatus` are exported for other hierarchies. MillerColumns takes `loadChildren` too, or a shared `loader`.
- Tree and TreeSelect draw only the rows in view (#815 part 1, from the Semi study #767), with the existing `useVirtualizer`. Long folder lists open and scroll fast.
  - It switches on by itself above 200 visible rows (`TREE_AUTO_VIRTUAL`). Short trees are unchanged. `virtualized` (true or false) decides.
  - The rows are flat, each with its `aria-level` and its `aria-posinset` of `aria-setsize` among its siblings, so a screen reader says "12 of 5,000".
  - The keys move through every row, drawn or not. The active row scrolls into view only as far as needed. No row animates.
  - A virtualized Tree scrolls itself: give it a height (its container's block size). In TreeSelect it is the popover's scroll area.
  - The loading row of a branch that loads when opened (#814) works the same.
- `useVirtualizer`: `scrollToIndex(index, { align: 'nearest' })` scrolls only as far as brings the item into view.

### Changed
- Every DataGrid's narrow cards are the row template by default, drawn as the owner's approved sample (#679, reopened by the owner: "every grid, by default"). A grid that names no `layout` and no `template` (and is not `narrow="table"`) draws layout A when its columns do not fit: a bar over the cards with the select-all checkbox and the count of records, then each record as three aligned lines (title and date, subtitle and primary value, secondary and tertiary), one thin vertical line per line at the same place down the list, the checkbox at the start and the row menu at the end, 8px padding (4px at the end), 24px lines, the selected record's fill and its 3px start bar. The slots are filled by the fixed rule of #839 from `columns` (the first date column is the date, the first number column the primary value, then title, subtitle, primary, secondary and tertiary in column order); `keyColumns`, if an app gives them, are the title, the subtitle and the primary value. The values are the columns' own cells' (their `render` or formatter), so the card says "Oct 28" and "$1,240.00" where the table does. The fields no slot takes stay, as "Label: value" lines under the third line, so no field disappears from an existing grid's narrow view. Type as the sample's Text roles: the title in body size semibold, the subtitle and secondary 12px muted, the date in the data font 12px muted, the primary value in the data font at body size semibold (the strongest value), the tertiary in the data font 11px; the row menu's dots are the 28px button with the 20px icon at any density; no line beside the checkbox. A wide grid is unchanged (a table while its columns fit). `layout` still overrides (A, B, wide), `narrow="table"` still keeps a table, and the new `layout="plain"` is the card of before (key values, then every other field as a labeled detail). The static Table keeps its plain list. New words: `dataGrid.cardCount` (English and Arabic); new tokens (`data-grid-template-*`: padding, check and menu widths, the menu button and icon sizes, the bar's height, padding and gap) name existing roles; no new color. Test: `tests/data-grid-default-cards-679.test.js` (written, not run).
- SplitView resizes as far as its room allows (#873, P1; the owner: "I need to be able to resize any split view screen"). Side by side, the first panel drags until the second panel keeps only its minimum width, and never past 90% of the window (`--plx-sys-shell-pane-window-share`, as Resizable's side panels read it). The fixed 720px ceiling is gone.
  - `defaultSize` stays the starting width, and a remembered `size` comes back up to the new ceiling. `minSize` stays a floor, capped at the ceiling so both panels stay usable.
  - The keyboard's End, the separator's `aria-valuemax` and the words at the limit follow the same ceiling. A smaller window lowers it at once, and under 900px the panels still stack.
  - In Arabic, the "other pane needs at least …" words write their number in Arabic-Indic digits.
- Side panels (Resizable detail drawers) are unchanged (the owner, 2026-11-01).
- The size limit for importing the whole npm package (`* as P`) is 1,430 KB (was 1,420), for the parts added in this release: visible rows only in Tree and TreeSelect (#815), the pickers' time zone (#813), EntityTitle (#803) and the control cards (#804). The one-part limits (`{ Button }` 105, `{ Badge }` 30, `{ DataGrid }` 450 KB) are unchanged.

### Fixed
- The cards of #839 (layout A) matched the owner's sample in layout but not in type or spacing: the title and the primary value were 12px, the checkbox column and the menu column were wider than the sample's, the divider sat 12px too far toward the start, a second vertical line stood beside the checkbox, the selected card had a line above it, and the row menu's dots were small. All measured against the sample's page and made equal (the table is in the pull request).
- DataGrid: the card form of a big table no longer freezes the page (#809, first step). In the narrow card list the grid now draws the first 100 cards, then the next 100 each time the end of the list nears the view (the grid's own scroll area, or the window when the grid grows with the page). Before, it drew every card at once: 10,000 rows took about 20 seconds at 320px.
  - End (or Ctrl or Command with End) on a card draws every card and goes to the last. Arrow Down past the drawn cards draws the next chunk first.
  - Select-all, the counts, find and filters work on all the rows. `aria-rowcount` is the full count.
  - A list of 100 cards or fewer, the wide table and remote grids are unchanged.
  - Full virtualization of the variable-height cards is #809's later step.
- MillerColumns (and so Cascader): right to left, a parent's chevron points left, toward its children.
- `useVirtualizer` no longer queues a state update when nothing moved. In a tree whose rows re-render on focus, that update never settled ("Maximum update depth exceeded") while the keys moved through rows not drawn yet.
- Two narrow-width overflows the reflow job found on the test site (#880):
  - DataToolbar: the end group (a count or a summary) may now shrink, so a `<Text truncate>` there ends in an ellipsis inside the row instead of running past it. The Directory was 390px wide at 320.
  - NavPane's bottom bar: an item's minimum width is the 44px touch target (`--plx-comp-nav-bar-item-min-width`, was 64px). Five items now fit a bar narrowed by a page scrollbar (the Document page cut off "Browse"). The items still share the width equally.
- The test site's Directory summary uses `truncate` (site PR #22, pinned in CI).

### Deprecated
- SplitView `maxSize` side by side: it no longer caps the drag (a larger one is the room anyway; a smaller one is ignored, with no error). Stacked, `maxSize` is still the first panel's ceiling.

## [0.81.0] - 2026-11-01

**In short.** The dashboard design system study is in the design spec: the owner's specification rebuilt on Plenix, with the original kept beside it. DataGrid: drag with the mouse to select a block of cells, and F2 or typing starts editing a cell. The Manage-columns dialog loads on first use in npm apps, so the npm DataGrid is about 25 KB lighter. Rating can show half stars, Divider can show a short text, and the spec has a Suggest page. A plain right arrow joins the icons, and the site icon tool reads TypeScript apps.

### Upgrading from 0.80.0
Nothing to change. Apps on the CDN loader follow this release by themselves; npm apps update the version as usual.

### Added
- A plain right arrow in the Plenix icon set (#270): `arrow-right` is Material Symbols Sharp `arrow_forward`, weight 300, unedited (the files were already in `platform/icons/`; `map.json` now names it, next to `arrow-left`). It mirrors in right to left like the other directional arrows (`arrow_forward` is in the mirrored list). The DataGrid header menu study (`docs/grid-header-study`) uses it for "Insert right" instead of the curved `forward` icon; "Insert left" already used `arrow-left`. The column menu items themselves are the application's (`columnMenu`): applications that used `forward` for "Insert right" can switch to `arrow-right`.
- Cell range selection with the pointer (#465, part 2; `cellSelection`, off by default): dragging with the mouse from one cell to another selects the block between them, and the grid scrolls when the pointer is near its edge (the rows and columns drawn change under the pointer, so the cell under it is read again each frame); Shift with a click makes the block from where it began (or from the focused cell) to the clicked cell, and again from the same anchor; a plain click still ends it. A drag ends with keyboard focus on its last cell, so Shift with an arrow goes on from there. No text is selected while dragging, nothing starts on a button, link or field inside a cell, and only the primary mouse button counts (touch keeps scrolling). With the option the grid is `aria-multiselectable`. The pointer code is in the lazily loaded `cellRangeOps.js` (the npm package loads it on the first press or key; the iife builds inline it), so `import { DataGrid }` stays under its limit. Nothing changes without the option. Test: cases added to `tests/data-grid-cell-range-465.test.js` (written, not run).
- DataGrid: F2 and typing start editing (#737, the APG grid pattern). On a cell whose column has an editor, F2 starts editing with the value kept, and a printable character starts it with that character in place of the value (a number column takes only a digit, a point or a minus). Neither starts in a read-only cell, during IME composition, with Ctrl, Alt or Meta held, or on Space (which still chooses the row); Shift with the arrows still extends a cell block, and a started edit ends the block. Enter and double-click work as before. The keyboard help (the DataGrid's header and the spec's editing page) lists both. Test: `tests/data-grid-edit-keys-737.test.js` (written, not run).
- Rating half stars (#808): `half` shows and sets halves (3.5): a click on the first half of a star (the right half in right to left) sets the half, the arrow keys move by half a star with focus staying on the star that holds the value (named "3.5 stars"), and read-only reads "Rating: 3.5 of 5". The half is the star in the off color with the same star in the on color over its first half, clipped, so the button and its focus ring stay one box. Without `half` nothing changes.
- Divider with a text (#808): `<Divider>or</Divider>` draws a line on each side of a short text in the middle (named by the text, one line, the muted text color; the lines and the text keep their order in right to left); a vertical divider ignores it. Tokens `divider-text-gap` and `divider-text-color` name existing roles.
- A "Suggest" page in the design spec (#808), under Select and lookup: type-ahead built from the existing Combobox, with the iOS and Android counterparts of Autocomplete. Spec examples for half stars and the divider with text.
- Test: `tests/rating-divider-808.test.js` (written, not run).
- The dashboard design system study (#861, owner): the owner's Dashboard Design System Specification 1.0, rebuilt on Plenix components and tokens at `docs/dashboard-study/dashboard-spec.html`, with a table mapping its reference values to Plenix and a list of every change made to follow Plenix's rules; the original is kept unchanged in `docs/dashboard-study/original/`. Both are published with the other study pages. The design spec adds a Dashboard page (principles, layout and density, card anatomy, data states, Customize mode) that links to the study. Its "Items to confirm" stay open until the owner answers them.

### Changed
- The canonical full-room grid pattern is complete (#522): the integration guide names `ListingPage` as the starter for a full-page list (the CDN README says so too) and adds the migration line for a grid that paginates by habit (drop `mode: "pages", pageSize: 25`, give the container the bounded chain or use `ListingPage`; `fetchRows` loads as the person scrolls). Documentation only; no code or behavior changes.
- Upgrade note: for an extension or an offline app, build your site icon file with `tools/icons/site-icons.js`; don't copy icon files. (Measured on the 0.78.0 CDN: a site file for 59 icons is 71 KB, for 316 icons about 380 KB; copying every weight and size of each Material icon is what makes an icon file megabytes.) The line is also in `platform/icons/README.md`.
- The column-manage dialog loads on first use in the npm package (#807): `engine/chromeRare.jsx`, drawn by `engine/rare.jsx` once its dynamic import has loaded (the same pattern as the lazy cell range, #848). A bundler such as Vite or Rollup puts the dialog (its list, search, reorder and the components only it needs) in its own chunk, so `import { DataGrid }` is about 25 KB smaller at the start (444.0 to 419.4 KB with the dependency fix, measured with Vite; the dialog opens one network load later the first time, from the cache after). The grid's error state stays in the first load, so it always draws. If the dialog's file cannot load, the grid shows "The column list could not open" with Retry and Close in its place; the failed load is not kept, so Retry or the next "Manage columns" asks for it again. In the CDN script and the application bundles (iife, pages opened from `file://`) the import is inlined: nothing is fetched and the dialog opens at once, as before. `{ Button }` and `{ Badge }` keep today's size.

### Fixed
- `tools/icons/site-icons.js` reads TypeScript (#682): `.ts`, `.tsx`, `.mts` and `.cts` (and `.cjs`) beside `.js`, `.jsx` and `.mjs`, with Babel's own TypeScript parser (the same icon-name rules as JavaScript). `.ts` and `.tsx` were already read; `.mts`, `.cts` and `.cjs` were not, and a name written with a TypeScript wrapper (`'folder' as const`, `x!`, `x satisfies T`, `<T>x`) was reported as a name built at run time: the wrapper is now read through. On RedSave's source (239 TypeScript files) it lists the 59 icons RedSave uses and writes a 71 KB icon file. Test: a case in `tests/site-icons.test.js` (written, not run).

## [0.80.0] - 2026-11-01

**In short.** Every app page now loads all of Plenix from one release, picked once per page, so pages never mix versions and follow each new release by themselves (an app can be held on an earlier one). DataGrid gets cell range selection (an option), a row template with three layouts, and becomes row cards only when its columns don't fit. The Menu takes Blueprint's typography and spacing, with a lighter divider, and a new MenuBar puts File, Edit and View menus in a bar. New: Anchor (a page jump list), OverflowList, a warning state beside error in every input, Combobox and Cascader extras, and the typed text marked in search results. Phone numbers and IBANs keep their order on Arabic pages, and a page served without a charset no longer breaks. The npm DataGrid is lighter.

### Upgrading from 0.79.1
1. **Grids in a narrow space:** a DataGrid now becomes row cards when its visible columns don't fit its width. A grid that must stay a table passes `narrow="table"`. A grid that relied on row-label columns staying pinned marks them `frozen: true`.
2. **Menus look different on purpose:** larger text, more padding, a lighter divider. Nothing to change in code.
3. **Nothing else to change.** Apps on the CDN loader follow this release by themselves; npm apps update the version as usual.

### Added
- Cell range selection in DataGrid, an option that is off by default (#465, part 1 of 2): `<DataGrid cellSelection>` lets a person select a block of cells with the keyboard. Shift with an arrow extends the block from the cell that had focus; Shift with Home or End goes to the first or last column of the row (Home and End alone keep their meaning); Escape or a plain arrow ends the block; Enter edits the active cell and ends it. The block has the selected fill and a border on its outer edges only (logical, so mirrored in right to left), and its cells carry `aria-selected`. Ctrl or Command with C copies the block as tab-separated text that Excel and Google Sheets paste as rows and columns (a cell with a tab, a line break or a quote is quoted; group rows are skipped; one cell copies as before). Copied cells keep their text as is: a value starting with =, +, - or @ is read by spreadsheet apps as a formula when pasted. Apps that copy untrusted text into spreadsheets should guard it. A screen reader hears "N cells selected" once the keys pause (not once per key press) and "N cells copied". The block is kept by row id and column id, so it grows past the drawn rows in a long grid and copies whole. It is separate from the row checkboxes. `onCellSelectionChange` hears `{ from, to, cellCount, rowCount, columnCount, fields }` and `null` when the block ends; the adapter adds `getCellRange()`, `clearCellRange()` and `copyCellRange()`. Without the option nothing changes: the engine's differential probe (DOM, focus, scroll, fetches, render and mutation counts, left to right and right to left) is identical before and after, except the known timing of one remote-sort step. New tokens only name existing roles: `data-grid-range-background`, `data-grid-range-border-color`, `data-grid-range-border-width`. The English and Arabic catalogs add `dataGrid.cellsSelected` and `dataGrid.cellsCopied`. The design spec adds a Cell selection example. Part 2 adds the pointer (drag and Shift with click). Test: `tests/data-grid-cell-range-465.test.js` (written, not run).
- MenuBar and MenuBarMenu (#805, owner build 2026-11-02, the study's option A plus C): a bordered bar of menus across an application (File, Edit, View), built on the Menu, so items, check and radio items, groups and sub menus are the Menu's own. The keys are Radix Menubar's and the APG's: one Tab stop; Left and Right move between the menu buttons (mirrored in right to left), wrapping, Home and End go to the ends; Down, Enter or Space opens a menu on its first item and Up on its last; with a menu open Left and Right switch to the neighboring menu (a sub menu takes them first), Escape returns to the button, Tab leaves the bar; hover does nothing until a menu is open, then pointing at another button opens it; typing a letter jumps to the next button that starts with it. The bar never wraps: the menus that do not fit fold from the end into a "More menus" button (each as a labeled group, the fit is the command bar's `useBarFit`, it waits while a menu is open, and focus moves to More when its button folds). Tokens only, no new color: `menubar-*` name the menu's surface, the subtle border, the 4px padding and gap. English and Arabic words (`menuBar.more`). The design spec adds "Menu, menu bar and command bar: which one" (Menu, MenuBar, and the bar of buttons over a table, which is the CommandBar) and a Menu bar page. Test: `tests/menubar-805.test.js` (written, not run).
- The typed text is marked in every result it matches, the same way in four places (#810): `utils/highlight.tsx` has `highlightMatch(label, text)` (every match, in either case, as plain `plx-match` spans) and `matchesText(label, text)` (the one finder that decides what is listed). SearchField, Combobox, Cascader search and TreeSelect search use them; SearchField's own bolding function is gone, and the four controls no longer keep their own `indexOf` match. Arabic matches without its vowel marks and the stretching line (`محمد` finds `مُحَمَّد`), a vowel mark stays inside the mark of its letter, and a match of Arabic letters (`plx-match--joined`) is underlined instead of set heavier, because a change of weight inside a word breaks the joined letter shapes. The list is read as plain text (spans, not `<mark>` or `<strong>`), and keyboard movement is unchanged. Tokens `highlight-font-weight` and `highlight-joined-underline-width` replace SearchField's `search-match-font-weight`; the design spec shows it on the SearchField, Cascader and TreeSelect samples. Test: `tests/highlight-810.test.js` (written, not run).
- A page jump list, `Anchor` (#811, the third of its four parts): `<Anchor items={[{ id, label, children }]} />` lists the sections of a page as links; choosing one scrolls to it (smoothly, or at once for people who ask for less motion) and moves focus to it, and the section in view is marked as the person scrolls (`aria-current="location"`, the selected look of a navigation row). It works for the page or for a scrolling region (`scrollRef`), keeps the page's address as it is, counts the targets' scroll margin (to clear a fixed header), marks the last section at the end of the page, and takes `value` and `onChange` when the application follows or sets the current section. Each row takes NavList's item roles (the way vertical Tabs do), so there is no new color: 15 `anchor-*` tokens name them. The name is the catalog's `anchor.label` ("On this page", Arabic "في هذه الصفحة"). The design spec's Section navigation page gets an example with a long page in a window. Test: `tests/anchor-811.test.js` (written, not run; it opens a browser).
- Three Combobox extras (#811, the second of its four parts): `clearable` shows a Clear button at the end of the field while there is text or a chosen value (it empties the text and the values, `onChange('')` or `[]` with `multiple`, and returns focus to the field, as SearchField's does; not in a disabled or read-only field); an option can have `icon` and `description` (a second line, as EntityPicker's options do; the description is searched too; no other drawing of the row); and `emptyAction: { label, onSelect(text), icon }` offers one action under "No matches" (for example "Add new person"), as an option the arrow keys reach, that Enter or a click chooses, with the list closing. New tokens: `combobox-option-icon-gap`, `-icon-text`, `-description-text`, `-description-font-size`. The word is `combobox.clear` in the catalogs (Arabic مسح). The design spec's async-select sample gets the Icon and description options, the Clear button, and the No matches state with its action. Test: `tests/combobox-extras-811.test.js` (written, not run; it opens a browser).
- An overflow list, `OverflowList` (#811, the last of its four parts): `<OverflowList items={[{ id, label, icon, href, onSelect }]} />` is one row of items that shows the ones that fit and puts the rest behind a "…" button that opens them in a menu, the behavior the Toolbar's More has, for any row. An item is a ghost button by default, or your own element (`content`: a Tag, a link) in the row, and a menu item (with the same `label`, `icon`, `href` and `onSelect(id)`) once it folds. The row never wraps; items fold from the end until the rest and the "…" button fit; the button is the last thing in the row at the end in both directions. The fit is the command bar's own (`useBarFit`, utils/barFit.ts): one more item folds at a time before paint until the row fits, and it starts again when the container or window changes, items or labels change, and the fonts finish loading (waiting while the menu is open or focus is in the row). When the focused item folds, focus moves to the "…" button. The button's name is the catalog's `overflowList.more` ("More items", Arabic "عناصر أخرى"); the row is a named group when it has a `label`. New token: `overflow-list-gap` (the toolbar's cluster gap). The design spec's Overflow menu page gets an example at three widths. Test: `tests/overflow-list-811.test.js` (written, not run; it opens a browser).
- A warning state beside error, in Field and every input (#811, the first of its four parts): `<Field warning="…">` shows a caution under the control with a warning icon and the word "Warning" for screen readers (never color alone; read politely, `role="status"`; an error wins when both are set), and hands `warning` to the control, which takes a warning border (kept while focused and hovered) and the lightest warning fill. Controls: Input, Textarea, Select, NumberInput, InputGroup (and what it holds), Combobox and the selects built on it (TimeZoneSelect, CountrySelect), Cascader, TreeSelect, DatePicker, TimePicker, EntityPicker, OtpInput, CodeEditor, RichTextEditor and RelativeDateInput. The colors are the existing feedback-warning roles (content for the border, message and icon; soft for the fill); no new color. New tokens only name them: `input-warning-border-color`, `input-warning-background`, `input-warning-inner-width`, `field-warning-text`, `field-warning-font-size`, and one border token each for CodeEditor, InputGroup, RichTextEditor and OtpInput. The Arabic word is `field.warning` in the catalogs. The design spec adds a Warning state to the field samples (Input, Textarea, Select, InputGroup and the others that share them). Not included: FileInput has no invalid look of its own, so it has no warning look yet. Test: `tests/field-warning-811.test.js` (written, not run).
- Four Cascader extras (#812): **choose a parent** (`choosableParents`, or `choosable` on one option): "Europe" can be the answer, not only "Paris"; a choosable parent lists "All of Europe" first in its column, an ordinary row (click, Enter, a checkbox with `multiple`), and a search lists the parent too. **"+N" tags** (`maxTags`, opt-in: the default 0 shows every tag, so existing Cascaders look as they did; `maxTags={3}` shows three and "+N"): the field shows the first tags and one "+N" tag, a Tab stop named "N more" whose tooltip lists the others on hover and focus (TreeSelect's "… and N more"), and pressing it opens the list. **A limit on choices** (`maxChoices`): past it a click or Enter chooses nothing, and the list says "You can choose up to N." (also announced). **Server search** (`loadOptions(text)`, with `searchable`): the search asks the server with Combobox's rules (`loadDelay` pause in typing, `minChars`, a late answer dropped, a loading row, the count announced, a failed load shown and announced); matches are `{ id, label, path }` (the parents' labels, or `{ id, label }`), the typed text marked by the shared highlight, and a chosen result is named in the field. New words in the catalogs (English and Arabic): `allOf`, `more`, `moreLabel`, `limit`, `loading`, `error`; new tokens: `cascader-loading-gap`, `-error-text`, `-limit-text`, `-limit-font-size`, `-limit-padding-block`, `-limit-padding-inline` (existing roles). The design spec's Cascader page gets the four variants and the loading and failed states. Test: `tests/cascader-extras-812.test.js` (written, not run; it opens a browser). Drawing only the visible result rows is #815.
- Row template for DataGrid, an option (#839, owner 2026-11-01, from the #679 card-view review): `layout="A" | "B" | "wide"` and `template={{ title, subtitle, date, primary, secondary, tertiary }}` (each a column's `field`) draw every record from six slots. A and B are the narrow view: the grid stays a table while its visible columns fit and becomes the template cards when they do not (#679's measured switch, unchanged). A is three aligned lines (title | date, subtitle | primary, secondary | tertiary) with one vertical line down the list, for records with many fields that scan down; B has the primary value beside the title, the subtitle on its own line and secondary | tertiary | date on the third, for short lists where the primary value matters most. "wide" draws the same slots as one aligned row at any width, a column each in slot order, for when the room always fits. Slots the app leaves out are filled by one fixed rule (the first date column is the date, the first number column the primary value, then title, subtitle, primary, secondary, tertiary and date take the next columns in the order of `columns`). A column that fills no slot is not drawn in a card; map every field a person needs while scanning, the rest shows when the row is opened. Selection, the open row, the keyboard (arrows go to the next drawn cell) and the row menu work in every layout; left to right and right to left. With neither prop set nothing changes (the engine's differential probe, run with the option off, is identical before and after). New tokens only name existing roles: `data-grid-template-*` (line height, gap, column widths, divider color, muted and subtle text, title weight); no new color. The design spec adds the three layouts to the Data grid page and the guidance "which layout for which scenario". Test: `tests/data-grid-row-template-839.test.js` (written, not run).
- Every app page follows one Plenix release (#842, owner): the 10 suite apps and the 4 Asset Manager pages load Plenix through one small loader, `platform/loader/loader.js` (plus `loader.css`), instead of 12 to 14 tags of their own. The loader picks one release per page and loads every Plenix file (theme, fonts, stylesheet, React, script, the app's icons, data and script) from that one `/cdn/<version>/` folder, so a page can no longer mix two releases. On the live site the release is the one `/cdn/latest.json` names (`{"latest", "pins": {app: version}}`), read once per page; an app can be held on an earlier release with `tools/cdn-pin.sh <app> <version|off>`. Locally (file://, localhost, tests) the pages run on the source copy as before, and `?plenix=local` or `?plenix=<version>` choose by hand. The page stays hidden until its styles have loaded (at most 3 seconds). `window.PlenixLoader` says what was chosen. A release now carries each app's own files (`apps/<app>/`), so a held app runs its own script from its release.
- A version stamp (#842): `Plenix.version` (also exported by `@plenix-ds/react`) names the release, and the CDN's `plenix.css` carries `--plx-version`. When a page loads the stylesheet and the script of two different releases, one warning in the console says so.

### Changed
- Cell range selection loads its heavy half on first use (#465, a size refactor before part 2): the range and its rectangle (what every cell draws from) stay in the grid; the rules for moving the block, the copy's text, the counts and the announcements are in `engine/cellRangeOps.js`, loaded with one dynamic import the first time a person extends a block (Shift with an arrow, Home or End). In the npm package that file is its own chunk, so `import { DataGrid }` costs about 1 KB less and part 2's pointer code will not add to it; in the CDN script and the application bundles (iife) the import is inlined, so pages that open from `file://` need no second file. Nothing changes for a person: the first press waits one tick for the chunk, presses that repeat before it arrives are applied in order, and grids without `cellSelection` load nothing.
- DataGrid (#679, the owner's priority 1): every DataGrid, inside a SplitView too, is a full table while its visible columns fit its measured width. When they don't, it shows the row cards. The switch follows the grid's own width (its columns, plus the selection, row menu and view columns), not a fixed breakpoint, and it switches back when the table fits again.
  - Row cards: the key values first, as the primary and secondary lines, then every other visible field as a labeled detail. The checkbox, the action buttons and the row menu stay on the card. Nothing scrolls sideways. A card reads in the page's direction, and each value keeps its own reading order.
  - Nothing is pinned by default: no selection column, no row-label columns, no trailing row menu. `frozen: true` still pins a column, and the selection column pins beside it.
  - Sort, filters, groups, selection, the open row, the saved view and right to left carry across the switch. The cards are drawn in full; the table keeps its virtualization.
  - `narrow="table"` keeps a fixed table that may scroll sideways, the escape hatch for dense specialized grids. `narrow="list"` keeps the cards under `narrowAt`.
  - A static Table is unchanged. (Upgrading: see the release's "Upgrading from 0.79.1".)
- More of the Platform is TypeScript (#708, slices 2 to 4): the hooks and providers, and the core display and status parts (Icon, Button, Text, Stack, Tooltip and 24 more), with their public types in the npm package. No behavior change.
- The size limit for importing the whole npm package (`* as P`) is 1,420 KB (was 1,400), for the parts added in this release.
- The DataGrid engine's element tree is its own module (#714, the last planned piece): `DataGrid/engine/gridFrame.jsx` holds what the engine returns (the width provider, the manage-columns dialog, the frame with its data attributes and classes, the failure state, the table with its header, rows, empty and more rows, the scrollbars and the paged and load-more footers). It is a render function over the engine's state, not a component, so the element tree and the React layers are the same as before. The code moved without a change; `NextEngine` is about 100 lines shorter and ends in `return gridFrame({ ... })`. No behavior change: the serialized-DOM and interaction probe (also at a 500px viewport) and the column, keyboard and sort-and-group probes, run on the bundle before and after, give identical results at every step.
- The DataGrid engine's measuring is two more modules (#714): `DataGrid/engine/usePillWidths.js` (every standard pill of a column as wide as the column's widest in the view, the rule in a stylesheet the grid owns, measured again when the fonts are ready) and `engine/useGridMetrics.js` (the columns' autosizing and floors, the room under the table that the page keeps, the row, line and menu heights and the narrow switch from the container, the density and the fonts, and the virtualizer re-measured). The effects moved from the engine function without a change, in the same order between the same neighbors; `NextEngine` is about 245 lines shorter. No behavior change: the serialized-DOM and interaction probe (now with a pill grid, and a second pass at a 500px viewport where the narrow switch fires) and the column, keyboard and sort-and-group probes, run on the bundle before and after, give identical results at every step.
- Menu restyled with Blueprint's typography and spacing (#805, owner 2026-11-01), in DM Sans: larger item text in the strongest text color, items padded 4px by 8px, a bold group heading in the default text color, dividers from edge to edge, and Blueprint's triangle for a submenu (mirrored in right to left). The font is one token, `menu-font-family`. Tokens only, no new color.
- Menu dividers use a new border role, `border-separator` (#805, owner 2026-11-01): gray 250 in the light theme, Blueprint's shade, a step lighter than before; gray 700 in the dark theme; `border-strong` in both more-contrast themes. MenuBar's dividers follow. No other border changes.
- `Menu` takes optional `open`, `openStart` and `onOpenChange(open, { start })` so a caller can say who is open (the MenuBar keeps one menu open at a time). Without them the menu keeps its own state exactly as before.
- DataGrid no longer pulls ReviewFlow into every grid (#807, a dependency fix, not lazy loading): it only used ReviewFlow's `useOptionalToast`, which brought the command bar, the quick filter, the avatar and a dialog with it. It uses Toast's own hook with the same behavior (a toast when the page has a `ToastProvider`, nothing otherwise). `import { DataGrid }` is smaller; nothing changes for a person.
- The size of one import from the npm package is measured with Vite (Rollup) now (#807, owner): `node tools/agent/one-part-sizes.js` and `check-bundle.js` check the limits against it, because it is what most consumers use and it keeps what only a lazily loaded part needs in that part's own chunk; esbuild's number stays beside it as a cross-check that reports and never fails. Limits unchanged (`{ Button }` 105, `{ Badge }` 30, `{ DataGrid }` 450, `* as P` 1,420 KB). `docs/build.md` lists the tool and why.
- Deploy stops instead of mixing versions (#842): it needs a clean tree, an already published version must match the build exactly (raise the version instead), every app page must use the loader on the CDN with no other Plenix file of its own, and nothing goes live before every check passes. Deploy writes `/cdn/latest.json` in one step and keeps the apps' pins. The check-system rule `one-source` holds the pages to the loader.

### Fixed
- Zero overlap for the icon-only Button's `min-inline-size` and the Input's `max-inline-size` and `min-inline-size` (#764): each property is now declared once, in `.plx-button` and `.plx-input`, reading a state variable (`--plx-state-button-min-inline-size`, `--plx-state-input-min-inline-size`, and the new `--plx-state-input-max-inline-size`). The icon-only variant, the Input's width roles (the large one) and the "no width role" rule assign the variable instead of declaring the property again. No visible change: a one-off probe of every icon-only Button variant and state, and of the Input in every type, width role and state (rest, hover, active, focus, focus-visible, disabled; with and without the context hooks; left to right and right to left) gives identical computed values before and after (576 element-states, about 4 million property values). The zero-overlap snapshot is not refreshed here.
- A spaced phone number or IBAN keeps its digit groups in order on an Arabic page (#838, Unicode rule N1): "(617) 555-0142" read ٦١٧ ٠١٤٢ ٥٥٥ in `Text variant="data"` (also with an explicit `dir="ltr"`), `PropertyList.Item data` and a DataGrid or Table cell of kind data, because with Arabic-Indic digits and no strong letter the spaces between the groups take the page's direction. A data value with no letter of a right-to-left script is now a left-to-right island, as Isolate already was by default (`Text` data gets `dir="ltr"` and `unicode-bidi: isolate-override`; `Isolate dir="auto"` resolves to it too, through the new `readsLeftToRight()` in `utils/direction.ts`); a value with an Arabic letter in it, or an element as its child, keeps `dir="auto"`. A value whose source already has Arabic-Indic digits also keeps `dir="auto"` (those digits count as right-to-left characters here); the fix covers the usual case, where the source has Latin digits and the page shows them as Arabic-Indic digits. Nothing changes in a left-to-right page. Test: `tests/bidi-data-838.test.js` (written, not run).
- A page that loads `plenix.js` (or any app bundle) without a charset no longer breaks (the charset break of #819): `platform/utils/highlight.tsx` wrote its Arabic character ranges as raw characters, the build kept them, and a page served without a charset read the bytes as Latin-1, so the regular expression threw "Range out of order" and `window.Plenix` was never set (the offline archive, a server that sends no charset). The two ranges are now written as `\uXXXX`, and so are the other regular expressions with a raw non-ASCII character (a byte-order mark, a zero-width space, no-break spaces, the minus sign, dashes and an ellipsis in TimeZoneSelect, DatePicker, Toast, NumberInput, announce, iconSafety and richTextClean). The Vite configs for the Platform, the apps and the packages set esbuild's `charset: 'ascii'` (with `.js` sources included), so a string or a name with a non-ASCII character is written as an escape in every bundle. Guards: the check-system rule `ascii-bundles` fails when a built page script (`platform/dist/platform.js`, each app's `app.js`, `dam/app/assets.js`) has a non-ASCII character in its code, and `check-bundle.js` does the same for the CDN scripts (`plenix.js`, `plenix.esm.js` and the others). Comments may hold any character: a few dashes remain in comments (the banner's and four in source comments), 12 bytes in `plenix.js`; nothing in code.
- A guard for 0.79.1's fix (the npm DataGrid's "React is not defined"): `node check-bundle.js` now fails when a shipped ES module (every file of `packages/react/dist`, and `plenix.esm.js`) uses `React` without binding it (`check-system.rules/react-in-scope.js`; the parser finds the real reference, so a comment or a word in a string never counts). It fails on the 0.79.0 build and passes on this one.

## [0.79.1] - 2026-11-01

**In short.** A fix for apps that use Plenix from npm, or the CDN's `plenix.esm.js`: the DataGrid drew nothing and stopped with "React is not defined" in 0.79.0. Pages that load the classic `plenix.js` script were not affected. Nothing else changes.

### Upgrading from 0.79.0
Nothing to change. Apps on 0.79.0 that use the npm package or `plenix.esm.js` should move to 0.79.1.

### Fixed
- The npm package's DataGrid (and `plenix.esm.js`) failed to draw with "React is not defined" (0.79.0): `engine/chrome.jsx` and `engine/headerRows.jsx` used JSX without importing React, which only works where React is a global (the CDN script and the applications). Both import React now (#847).

## [0.79.0] - 2026-10-31

**In short.** A large quality release from the code audit (#684). Apps that use the npm package load only the parts they use: a button costs about 101 KB instead of 913 KB, and a badge page needs 172 KB of styles instead of 2,166. React 19 is accepted. Plenix is now built with Vite (the main script and the 10 apps are 20 to 44% smaller), the first parts are in TypeScript, and the design tokens start moving to Style Dictionary. Toolbars, command bars and action bars no longer fold to icons too early on a fresh load. The rich-text cleaner is final in one pass. SplitWorkspace takes the list's grid options (row click, selection, the open row, the row menu). Behind the scenes: the data grid engine is split into clear modules, 120 tests are documented, and every test now runs in CI.

### Upgrading from 0.78.0
1. **Arabic in npm apps:** an npm app turns Arabic on with one line at its start: `import '@plenix-ds/react/i18n/ar';`. Without it, an Arabic page shows Plenix's own words in English. The CDN keeps Arabic built in.
2. **Nothing else to change.** Imports work as before, with the same exports map. React 19 apps can install without forcing. Pages loading `plenix.js` with a script tag keep React 18. `plenix.css` works as before; an npm app may switch to `foundations.css` plus the `parts/<part>.css` files it uses (one or the other, never both).
3. **What people will see:** bars keep their words on first load; the step counter's numbers are in the data font.

### Added
- SplitWorkspace: `grid`, the list's DataGrid options, passed to the grid it draws from `rows` and `columns` (#681; RedSave P-61). For example `onRowClick` to open a row in the detail side, `openKey` to mark the open row (`aria-current`), `selectable`, `selected` and `onSelectionChange` (a plain click selects only that row), and `rowMenu`. `grid.label` renames the list; the default is still `paneTitle`. The grid keeps its own fill and scroll. Nothing breaks: without `grid` the template draws as before.
- `check-bundle.js` measures one import from the package: `{ Button }` (limit 330 KB), `{ Badge }` (100 KB), `{ DataGrid }` (700 KB) and `* as P` (1,610 KB). It fails when one goes over its limit, so tree-shaking can't break again unseen. `tools/agent/one-part-sizes.js` prints the same numbers on its own.
- A test of the rich-text sanitizer with hostile input (#689, audit finding #684). `tests/rich-text-clean-689.test.js` feeds `cleanRichText` an OWASP-style list of about 190 inputs (script and style tags in any case, event handlers, `javascript:`, `data:` and `vbscript:` links and pictures with entity, tab, newline and control-character tricks, svg and math with nested script, frames, objects, forms, meta refresh, style attributes with `url()` and `expression()`, noscript, template and other mutation cases, comments and CDATA) and checks that no element, attribute, link scheme or style outside the allow-list survives, that a cleaned result cleans to itself, that nothing runs when the result is put on the page (in a div and in a table cell), and that the allowed formatting is kept. The sanitizer itself is unchanged: reading it found no hole.
- CI reports a red `styling/phase-2` (#690, audit finding #684): the `red-main` job at the end of `ci.yml` runs after a push to `styling/phase-2`, opens or updates ONE issue labeled `red-main` that names the failing jobs and the commit, and closes it with a comment when a push is green again. A cancelled run (a newer push took its place) changes nothing. It uses only the run's `GITHUB_TOKEN` (`issues: write`, `actions: read`, for that job alone). HANDOFF.md has a new "Green before a merge" section that names the checks that must be green.
- Keyboard tests for the interactive parts that had none (#691, audit finding #684): `tests/keyboard-apg-691.test.js` presses real keys, by the WAI-ARIA Authoring Practices patterns, on Menu (and its sub menu and radio group), SplitButton's menu, Combobox, Dialog, Drawer, Sheet, Popover, Popconfirm, Slider, Checkbox, Switch, RadioGroup, SplitView's divider, Calendar and OtpInput, in a left-to-right and a right-to-left page where the arrows flip. A manual screen-reader checklist is in `docs/accessibility/screen-reader-pass.md` (NVDA with Firefox, VoiceOver with Safari, TalkBack; the results table is left empty for the owner's run).
- Dependency watch (#696): `.github/dependabot.yml` opens weekly pull requests for npm packages and GitHub Actions, and the CI build job runs `npm audit --omit=dev` as a step that informs and never blocks. The vendored libraries in `platform/vendor/` are not npm dependencies and are not watched by either.
- `@plenix-ds/react/i18n/ar`: Plenix's own words in Arabic, for an npm app (an import for its effect; it exports nothing).
- `check-bundle.js`'s one-part limits are lowered to match: `{ Button }` 105 KB, `{ Badge }` 30 KB, `{ DataGrid }` 440 KB, `* as P` 1,400 KB. The measure counts what loads at the start; a chunk only a dynamic `import()` reaches is not counted.
- Keyboard tests for the last interactive parts without one (#706, follow-up to #691): `tests/keyboard-706.test.js` presses real keys on CommandMenu, EntityPicker, MillerColumns, RowButton, AssignControl, ImageUpload and ImageCrop, RenameAction, SessionTimeout, DeleteFlow, DraftState, QueryBuilder, FilterBar, SearchWorkspace and ProductOptions. It runs in a left-to-right and a right-to-left page where arrows flip. Written, not run here.
- Menu type-ahead (#706): in an open menu, typing a letter moves to the next item whose label starts with it, wrapping. It works in Menu, its sub menus and ContextMenu.
- Combobox (#706): on a closed list, Arrow Up opens it on the last option, and Alt+Arrow Down opens it on the first without moving. On an open list, Alt+Arrow Down moves nothing.
- `@plenix-ds/styles` also ships its rules per part (#710, option S1, owner's GO on #710). `foundations.css` holds the layer order, tokens, theme and base, and loads once. `parts/<part>.css` holds one part's rules, its component settings and its step rules, and imports the parts it needs. Together the files are exactly `plenix.css`: the same rules in the same order. Measured page sizes (foundations plus the part and the parts it imports):
  | A page uses | `plenix.css` | Per part |
  |---|---|---|
  | Badge | 2,092.7 KB (199.3 KB gzipped) | 171.8 KB (19.4 KB gzipped) |
  | Button | same | 273.6 KB (28.2 KB gzipped) |
  | DataGrid | same | 756.1 KB (75.5 KB gzipped) |
- `check-bundle.js` checks the per-part files against `plenix.css` (`tools/agent/style-parts-check.js`). No rule may be lost, doubled or out of order. Two parts whose rules can tie on one element must always load in `plenix.css`'s order.
- `THIRD-PARTY-NOTICES.md` gathers the licenses of the software Plenix copies or bundles: React and ReactDOM, TanStack Table and Virtual, Apache ECharts with ZRender and tslib, PDF.js, Tiptap and its 46 bundled packages, the four typefaces and Material Symbols (#724).
- `platform/vendor/package.json` records the version of each library copied into `platform/vendor/`. CI prints `npm outdated` for it as information only, so an outdated copy shows up without failing the build. It is never installed.

### Changed
- `@plenix-ds/react` ships its ES module as one file per part (#685, from the audit #684). An application that imports one part now bundles that part and what it uses, instead of the whole library. Measured with esbuild, minified, React external:
  | Import | Before | After |
  |---|---|---|
  | `{ Badge }` | 913.1 KB | 79.0 KB |
  | `{ Button }` | 913.1 KB | 317.5 KB |
  | `{ DataGrid }` | 913.1 KB | 645.0 KB |
  | `* as P` (everything) | 1,608.0 KB | 1,608.5 KB |
  - `dist/index.js` is still the entry, and re-exports every part from `dist/<folder>/<Part>.js`. Code that parts share is in `dist/chunks/`.
  - `sideEffects` lists only the CSS and the two scripts that act when loaded (`dist/plenix.global.js`, `dist/plenix-engines.js`).
  - Most of a one-part import is now the built-in word catalogs: Arabic 162 KB and English 53 KB, through `useStrings`. Making Arabic opt-in for npm users is #702.
- The CDN's `plenix.js` and `plenix.esm.js`, the CommonJS file (`dist/index.cjs`), the exports and the type declarations are unchanged.
- `@plenix-ds/react` can be installed next to React 19 (#686, from the audit #684). The peer range is `>=18.2.0 <20`; it was `<19`.
  - The source was checked for what React 19 removes: defaultProps on function parts, propTypes, string refs, findDOMNode, legacy context, `ReactDOM.render`, `hydrate` and `unmountComponentAtNode`, `createFactory`, class lifecycles, and reads of `element.ref`.
  - Two places were adjusted:
    - InputGroup passes the field's own ref through `props.ref` on React 19 (reading `element.ref` warns there).
    - The development warnings (`devWarn`) recognize React 19's development build.
- The script-tag way (the CDN's `plenix.js`, the offline archive, `platform/vendor/`) stays on React 18.2.0, because React 19 publishes no UMD script. This is documented in `platform/vendor/README.md` and the package README.
- TypeScript: @plenix-ds/react's `index.d.ts` types far more props (#687, from the audit #684). Props typed `any` went from 1147 to 398. The most-used parts are typed first: Button, Input, Textarea, Select, Combobox, SearchField, NumberInput, DataGrid, Dialog, Menu, Tabs, AppShell, Field, Popover, Tooltip and every Chat part (`Chat.Message`, `Chat.Group`, `Chat.Typing` and the rest now have their own Props). Types only: nothing changes at run time.
- A wrongly typed prop on these parts can now fail your TypeScript build where it passed before, for example `<Input size="xl" />` or `<NumberInput min="zero" />`.
- The count of `any` props never goes up: CI checks it against `types-any.baseline.json` (`node tools/agent/types-any.js --check`).
- The long hand-written lines named by #688 are readable (audit finding #684): `button.css` (35 lines over 200 characters, up to 2,779), `chat.css`, `entity-header.css`, `tabs.css`, `find-panel.css` (one declaration per line) and the five source files `scrollbars.jsx`, `ImageAnnotation.jsx`, `SuggestedEdit.jsx`, `RefineMenu.jsx` and `PromptSuggestions.jsx`. A pure reflow: the same rules in the same order with the same values (checked rule by rule), and the built JavaScript is byte-identical. `tokenize-component.js` keeps a rule written one declaration per line as it is, so running it does not undo the reflow.
- The DataGrid engine is readable and diffable (#688, audit finding #684): `DataGridEngine.jsx` is reflowed from lines of up to 3,600 characters (57 over 300) to lines of at most about 120 (three strings are a little longer), and its small parts move into `DataGrid/engine/` by concern: `helpers.jsx` (shared values and functions), `pill.js` (a pill's text measured as the page draws it), `useVirtualizer.js` (the virtual window) and `parts.jsx` (the gaps, the cell editor, the checkbox, the width wrapper, the row targets). No behavior change, no renamed export, public imports unchanged. The main component (`NextEngine`) is still one function; splitting it by seam (selection, keyboard, columns, editing) moves hook state and is left to later pull requests, one seam each. The hook-adoption list names `engine/parts.jsx` for `usePressable` and `dataWhenText`, where those uses now are.
- One `fill` for every catalog text, one `TOP_LAYER` for every floating part (#693, audit finding #684). The helper that fills `{name}` placeholders was copied into 44 files in four versions; it is now `platform/utils/fill.js` (and `utils/fillNodes.jsx` for the two that draw the values in the data font). The top-layer check was copied into nine components; it is now `TOP_LAYER` in `utils/floating.js`. A new check-system rule, `shared-fill`, refuses a new local copy. A value that is missing (`undefined`) or `null` leaves its placeholder (`{name}`) in the text; eight of the old copies wrote the word "undefined" and most wrote "null" (see the pull request). The ProgressSteps step count ("Step 2 of 5") is now in the data font, as the #260 decision says. `tests/fill-693.test.js` checks the helper and the rule.
- The login service trusts the proxy's `X-Real-IP` header only when `TRUST_PROXY=1` (#695, audit finding #684). The default is the connection's own address, so a client that reaches the service without the proxy cannot start a fresh sign-in budget with every request by sending its own header. The container's Dockerfile already sets `TRUST_PROXY=1`, so the deployed service behaves as before; the README and the nginx example say so. The save service looks a token up by own property, so a token named `constructor` no longer reaches the global `Object`. `tests/login.test.js` has cases for both.
- `@plenix-ds/react`'s ES modules load Plenix's Arabic words only when the app asks, and the full icon name list only when a name needs it (#702, owner's OK on #702). Measured as in #685 (esbuild, minified, React external), counting what loads at the start:
  | Import | Before | After |
  |---|---|---|
  | `{ Badge }` | 79.0 KB | 25.0 KB |
  | `{ Button }` | 317.5 KB | 101.4 KB |
  | `{ DataGrid }` | 645.0 KB | 428.9 KB |
  | `* as P` (everything) | 1,608.5 KB | 1,392.4 KB |
  - Arabic: an app imports `@plenix-ds/react/i18n/ar` to turn it on. Its Arabic pages then show Plenix's words exactly as before.
  - Icons: the Material library's names (54 KB) are a chunk of their own. Icon loads it the first time a name is not a Plenix icon or a registered module. Until it arrives (one short request) that icon draws nothing; then it draws as before. A name that is still unknown warns after the list arrives.
  - Button's start is now mostly the English words (53 KB) and Icon (24 KB).
- Unchanged: the CDN's `plenix.js` and `plenix.esm.js`, `dist/plenix.global.js`, the CommonJS file (`dist/index.cjs`) and the suite's pages keep Arabic and the icon names built in and behave exactly as before. Only Icon's code in them differs (a few lines that do nothing when the names are built in).
- The owner's rule on custom tooling is in `CLAUDE.md` (#712, word for word): standard tools for build, check, test and release work; a new custom script, generator or check only when its pull request shows no standard tool or plugin can do the job; every remaining custom tool listed in `docs/build.md`; one-time scripts deleted after use. `docs/build.md` is the one inventory of the custom tools (what each writes or checks, necessary or replaceable, the standard replacement), linked from `CLAUDE.md` and `HANDOFF.md` (#698). `CLAUDE.md` also loses its unfilled title, the old Windows drive path and a stale capability count (#697).
- The DataGrid body's row drawing is its own module (#714): `DataGrid/engine/bodyRows.jsx` holds what the grid draws for each line of its body: a group row (and its sticky copy), an add-to-group row, a gap between groups, and a record's row with its cells. They are render functions over the engine's state, not new components, so the element tree and the React layers are the same as before (the row's own memo, `MemoGridRow`, stays in the engine). The code moved without a change; `NextEngine` is about 410 lines shorter. No behavior change: a serialized-DOM snapshot and an interaction probe, run on the bundle before and after, give identical markup, focus, scroll position, custom-cell render counts and DOM mutation counts at every step, with editing (Enter, typing, Escape), the row menu, selection and grouping included, left to right and right to left. Also: the unused `sorted` import in `DataGridEngine.jsx` is gone, and a note on #747: the fetch effect of `useRemoteRows` now runs first among the engine's passive effects, which is harmless because `fetchRows` runs in a microtask after all effects.
- The DataGrid engine's column state is its own module (#714, third of the engine's concerns): `DataGrid/engine/useColumns.js` holds the order, the hidden columns, each column's width (saved, measured, floors), what a change tells the caller (`onViewChange`), the pinned columns, and `resize`, `changeOrder`, `changeVisibility` and `move`. The code moved from the engine function without a change; `NextEngine` is about 60 lines shorter. No behavior change: the same probe, run on the bundle before and after, gives identical column order, widths, pins and `onViewChange` payloads in 60 steps (keyboard resize, mouse drag, the column menu's hide and show, props-driven order, hidden columns and widths; left to right and right to left; the grid's own view and a controlled one).
- The DataGrid engine's cell editing is its own module (#714, fourth of the engine's concerns): `DataGrid/engine/useEditing.js` holds the edited copy of the rows, the cell being edited, committing an edit (`onCellEdit`, then the `cellEdit` event once the rows have drawn), and `replaceData` and `updateRecord` for the adapter (`updateRow`, `addData`, `deleteRow`, `setData`). The code moved from the engine function without a change; `NextEngine` is about 20 lines shorter. No behavior change: the same probe, run on the bundle before and after, gives identical rows, editor state, focus and `onCellEdit` calls in 66 steps (Enter to edit, type then Enter, Tab or a click away to commit, Escape to cancel, a row that cannot be edited, the number editor, F2 and typing on a cell, the adapter's methods, and a caller that replaces the data; left to right and right to left; the grid's own rows and controlled ones).
- The DataGrid engine's sorting and grouping are their own modules (#714, fifth and last of the engine's concerns that move as a block): `DataGrid/engine/useSorting.js` (which sort the grid shows: the caller's, the grid's own, or none, and who owns it now), `engine/sortActions.js` (a change of sort: the page returns to the first, `onViewChange` and the `dataSorted` event hear it), `engine/useGrouping.js` (the group levels and the collapsed groups) and `engine/groupActions.js` (changing the grouping, opening and closing a group). The code moved from the engine function without a change; `NextEngine` is about 60 lines shorter. No behavior change: the same probe, run on the bundle before and after, gives identical sort state, rows, groups, `onViewChange` payloads and `dataSorted` events in every step (clicks, Enter and Space on headers, shift-click, the column menu's group and ungroup, group rows opened and closed by click and arrow keys, a caller that sends `sort`, `groupBy` and `collapsedGroups`; left to right and right to left; the grid's own view, a caller-kept view and a caller-set start).
- The DataGrid header's drawing is its own module (#714): `DataGrid/engine/headerRows.jsx` holds what the grid draws for each column of its header: the title with its sort mark and type icon, the column menu (the application's field actions, sort, filter, group by this field), the right-click column chooser, the filter field, the resize handle (mouse, touch and keyboard) and the drag handle that reorders. Render functions over the engine's state, not new components. The code moved without a change; `NextEngine` is about 240 lines shorter. In `bodyRows.jsx` the two imports of the engine's own folder are written `./keys.js` and `./parts.jsx` (QA's nit on #758). No behavior change: the serialized-DOM and interaction probe, and the column, keyboard and sort-and-group probes, run on the bundle before and after, give identical results at every step (header clicks, Enter and Space, the column menu, the chooser, resizing by mouse and keyboard, fit, hide and show, pinned columns; left to right and right to left).
- The DataGrid engine's keyboard paths are their own module (#714, second of the engine's concerns): `DataGrid/engine/keys.js` holds the handlers for sorting a column with Enter or Space, resizing it with the arrow keys, Home and End, a group row, a record row, a cell (copy, Enter to edit, the arrows across cells, mirrored in right to left), the table body, and `focusCell`. Each handler is the same function text it was inline, built from the same names; `NextEngine` is about 105 lines shorter. No behavior change: the same probe, run on the bundle before and after, gives identical focus, sort state, column widths and row clicks in 152 keyboard steps (left to right and right to left; a plain, a grouped and a selectable grid).
- The DataGrid engine's row model is its own module (#714, the data pipeline): `DataGrid/engine/useRowModel.js` holds the rows in view (loaded so far) and TanStack's grouped row model over them, turned into the list of group rows, gaps, add rows and records that the body draws. The code moved from the engine function without a change; `NextEngine` is about 100 lines shorter. No behavior change: a serialized-DOM snapshot and an interaction probe, run on the bundle before and after, give identical markup, focus, scroll position and DOM mutation counts at every step (plain, grouped, two-level grouped, selectable, tree, load-more, paged and server-fed grids; scroll, sort, collapse and expand, select, load more, next page, arrow keys; left to right and right to left).
- The DataGrid engine's row selection is its own module (#714, first of the engine's concerns): `DataGrid/engine/useSelection.js` holds the selection map and its owner, what a change tells the caller and the events, the one-row pick, and the clicks and checkboxes that choose rows (plain, Ctrl or Command, Shift for a range, select all). The code moved from the engine function without a change; `NextEngine` is about 70 lines shorter. No behavior change: the same probe, run on the bundle before and after, gives identical selection state and `onSelectionChange` calls in 33 steps (the grid's own selection, a controlled `selected`, and `keepHiddenSelection={false}`, with a filter hiding selected rows).
- The DataGrid's hand sizing of columns is its own module (#714, the last of the planned pieces): `DataGrid/engine/columnSizing.js` holds `fit` (the width of the widest value, measured in the grid's own font, plus the cell's space on both sides) and `startResize` (the drag, with the cover that keeps the pointer, then TanStack's resize handler for mouse and touch). They are plain functions over the engine's state, not hooks, so the module is `columnSizing`, not `useColumnSizing`. The code moved from the engine function without a change; `NextEngine` is about 30 lines shorter. No behavior change: the column probe (resize by key and mouse, double-click fit, size all to fit, hide, show, pinned columns) and the serialized-DOM, keyboard and sort-and-group probes, run on the bundle before and after, give identical results at every step, left to right and right to left.
- The DataGrid engine's table model and server fetch are their own modules (#714): `DataGrid/engine/useTableModel.js` holds the column definitions (accessor, sort and filter functions, sizes) and the TanStack table over the records, and `engine/useRemoteRows.js` holds whether the rows come from a server (`fetchRows` with the mode `pages`, `load-more` or `fill`) and the requests for them (one per page, sort, filter or search, the old one aborted; the total; busy and failure state; Retry). The code moved from the engine function without a change; `NextEngine` is about 200 lines shorter. The check-system rule `pane-limit` now looks for `shareOf` in `useTableModel.js`, where the column limit lives. No behavior change: a serialized-DOM snapshot and an interaction probe, run on the bundle before and after, give identical markup, focus, scroll position, `fetchRows` calls and DOM mutation counts at every step (plain, grouped, selectable, tree, load-more, paged and server-fed grids in all three server modes, a failing request and Retry; scroll, sort, collapse, select, load more, next page, arrow keys; left to right and right to left).
- The DataGrid's chrome (the parts around the header cells and rows) is its own module (#714): `DataGrid/engine/chrome.jsx` holds the manage-columns dialog, the failure state with Retry, the view menu at the end of the header (row height and wrapped headers), the empty and loading row, the "more rows are coming or failed" row of a fill grid, and the footers of the paged and load-more modes. Each is a render function that returns the same element the engine used to write inline, in the same place, so the element tree and the React layers are unchanged. The code moved without a change; `NextEngine` is about 145 lines shorter. The unused `typeIcons` import in `DataGridEngine.jsx` is gone (QA's nit on #761). No behavior change: the serialized-DOM and interaction probe, and the column, keyboard and sort-and-group probes, run on the bundle before and after, give identical results at every step, with the view menu, the manage-columns dialog, the empty grid, both footers, the failure state and Retry included, left to right and right to left.
- The DataGrid engine's view sync and live values are their own modules (#714): `DataGrid/engine/useViewSync.js` holds what the grid does once it has drawn (the adapter handed to `onReady` with the `tableBuilt` event, the saved view written to storage when the application does not keep the view, the selection reconciled against the records and filters with `onSelectionChange` and the `dataFiltered` event, and the `dataChanged` event), and `engine/liveState.js` holds the per-render assignment of the engine's current values that the adapter reads (`live.current`). The adapter itself was already its own module (`adapter.js`). The code moved from the engine function without a change, in the same order between the same neighbors; `NextEngine` is about 35 lines shorter. The unused `words` import in `DataGridEngine.jsx` is gone (QA's nit on #770). No behavior change: the serialized-DOM and interaction probe (now with a grid that has a storage key, selection, a filter, `onReady` and events, and the adapter's `addData` and `deleteRow`) and the column, keyboard and sort-and-group probes, run on the bundle before and after, give identical results at every step, including the saved view in storage, the events and the selection counts.
- One `asIcon` (#719, audit finding #684). Six components defined their own `asIcon = (i) => iconElement(i)` over the one exported by `Icon.jsx`; they import it directly now. Three (Button, NavList, Tabs) named `stateIcon` as `asIcon`; they call `stateIcon` by its name, and Tree's own helper (it also fills an Icon element the caller gives) is `treeIcon`, so the name `asIcon` means one thing. The check-system `shared-fill` rule refuses a new local `asIcon`. No behavior change.
- Test wiring (#756, found while writing docs/tests in #748). Wiring only: no check changed, no test was run.
  - **Into CI:** icon-safety and selector-kinds now run in CI and in the full suite. fill-693 also joins the full suite.
  - **Not in CI:** zero-overlap fails against a stale snapshot; the decision is pending in #763.
  - **Layout's child tests:** they now start when their own test file (or a fixture they load) changes, as well as when what they cover changes.
  - **Messages:** messages-chat-s6 now starts when the Messages app changes.
  - **Tests that were started by hand only:**
    - date-only, focus-group-6a, line-ticks-593, select-data-font and the five right-to-left tests are now Layout children.
    - remote-fill-522, remote-fill-614, listing-page-522, data-grid-next-capabilities and data-grid-next-independent are now DataGrid children.
    - arabic-catalog-427, baseline-scan-273 and site-icons are now automatic.
    - perf, w15c-packages, icons-package-282 and cdn-devx form the new release group (`node tests/run.js --release`), which the CI build job runs after the release build.
    - data-grid-perf and data-grid-next-perf stay manual: they measure time, which varies on shared CI machines.
  - **Clean exit:** layout.test.js now closes its browser and deletes its page file however the run ends (QA note on #752).
  - **Docs:** the affected docs/tests pages are updated.

### Fixed
- `api.cell(id, field).setValue(value)` now reaches the row's record (#736). The adapter's `api.row` and `api.cell` took the id as the grid's own key (`"string:r10"`), so an application's id (`'r10'`, `3`) found no record and `onCellEdit` got no row. They now accept the application's id, and still accept the grid's key. Test: `tests/data-grid-setvalue-736.test.js` (written, not run). The one ambiguity: an application id that literally equals a grid key (such as `"string:r10"`) is read as that key; no real id has that shape.
- Tests (#762): w15c-packages and cdn-devx no longer look like a pass when the design system is not checked out. They print "skipped: design system not available … nothing was checked", and on GitHub they add a warning to the run's summary.
- Tests (#762): readonly-adoption now also starts when TimePicker, Cascader or RelativeDateInput changes, the three controls it checked but was not started by.
- Tests (#768): chat-s1-637's check of your own message's colors read the wrong element. The drawing area and the third message shared the id "c", so the check measured the first message. The Chat colors were right and are unchanged; the area now has its own id.
- Tests (#768): layout.test.js runs every child test even after one fails, then lists the failed children at the end and fails. One red child no longer hides the 38 after it.
- Tests (#772): commandbar-find-fold-274 failed because its stage page had lost its 200px pane, not because of a CommandBar change. The page lived in docs/briefs and drew its widths from docs/briefs/review.css, which #694 moved to the archive. Without the width the bar never had to fold. The stage pages of commandbar-find-fold-274, segmented-fold-276 and header-labels-start-326 now live in tests/fixtures/stages/ with their widths in stage.css. A change to a stage page now starts its test, which docs/ never did.
- Toolbar, CommandBar and ActionBar (#777): a bar first measured while the page's web font (DM Sans) was still loading measured the wider fallback text, folded its buttons to icons, and stayed folded once the font arrived. The bars now measure again when the fonts finish loading. On a first visit, a 520px toolbar with five buttons now shows every word, where it showed only the first.
- cleanRichText (#783): a link whose unsafe address was dropped (`javascript:`, in all 17 of its disguises) came out as `<a>x</a>`, and cleaning that again gave `<a href="">x</a>`, a link to the page itself. One pass is now final: an `href` is written only when the source has a non-empty, safe one, and an empty `href=""` is dropped too. Nothing could run before or after; the fix makes the cleaner's output stable.

### Removed
- The team's working history is out of the product repository (#694, audit finding #684): 79 of the 84 working pages in `docs/briefs`, five study and sample folders no one opens, the one-off proof and review folders in `tests/`, and a 14 MB baseline no test read: about 40 MB and 645 files. Nothing is lost: it is archived on the team server and still in git history, and `docs/ARCHIVE.md` is the index (where it is, how to bring a file back, what stayed and why). The stale Card accent entries of `tests/baselines/overlap-strict.json` are removed (#621 removed the accent).
- 59 one-time scripts from `tools/agent` (migrations, one-off patches and throwaway probes that no build, check, workflow, test or npm script referenced); the pull request lists each and why.

### Upgrading from 0.78.0
Nothing to change. Imports from `@plenix-ds/react` work as before. The package's `exports` map is unchanged, so deep imports into `dist/` are still not part of the public API.
Nothing to change. An app on React 19 can now install `@plenix-ds/react` without forcing the peer range. Pages that load `plenix.js` with a script tag keep React 18.
- An npm app turns Arabic on with one line at its start: `import '@plenix-ds/react/i18n/ar';`. Without it, an Arabic page falls back to English for Plenix's own words. The CDN keeps Arabic built in.
- Nothing to change: `plenix.css` works as before. An npm app may switch to `foundations.css` plus the `parts/<part>.css` files it uses. It loads one or the other, never both.

### Unchanged, by choice
- Combobox: Escape on a closed list keeps the value. The WAI-ARIA pattern makes clearing optional, and one key should never lose a chosen value. The choice is recorded in Combobox's header.

### Unchanged
- The CDN, `platform.css`, `plenix.css` and `plenix.min.css`: the same rules in the same order. CDN apps change nothing.

## [0.78.0] - 2026-10-30

**In short.** Controls in a side pane's header now fit the pane. A Select in the NavPane's top row (beside Collapse) used to take its longest option's width and run past the pane's edge; it now shrinks to the field minimum and ends in "…" with the full text on hover. Buttons with words in the second row do the same, and SecondaryPane and SidePanel headers follow the same rule. Icon buttons keep their size, and buttons everywhere else are unchanged.

### Upgrading from 0.77.0
Nothing to change. There is no breaking change.

### Fixed
- Controls in a pane's header no longer run past the pane's edge (#677).
  - **The cause:** NavPane's title-row actions never shrank (`flex-shrink: 0`). A Select there, such as a project switcher, drew at the width of its longest option: 286px in a 240px pane.
  - **NavPane:** the actions and the second row now fit the pane.
    - A field shrinks to the fit-field minimum (`--plx-sys-fit-field-min-width`, 100px) and shows its cut text in full in a tooltip.
    - A button with words shrinks, and its label ends in an ellipsis.
    - Icon buttons, such as Collapse, keep their size.
    - With no title, the actions fill the row.
  - **SecondaryPane and SidePanel:** their header rows fit the same way.
- Button: the context hooks `--plx-comp-button-context-flex-shrink` and `--plx-comp-button-context-min-inline-size`, which a container sets so its buttons with words can shrink. An icon-only button never shrinks.

## [0.77.0] - 2026-10-30

**In short.** Chat gets message actions and reactions: a React, Reply and More bar beside a message (bordered, never covering the text), Edit and Delete on your own messages, reactions as named pills with Add reaction, quotes and "Replying to", and "Edited" and "This message was deleted". The design spec's Chat page shows every Chat part with the owner's rules, and the suite's Messages app uses the new Chat look.

### Upgrading from 0.76.0
Nothing to change. There is no breaking change.

### Added
- Chat message actions (#637 slice 4; the owner's go, built as drawn):
  - Chat.Message takes `onReact`, `onReply`, `onQuote`, `onCopy` (default: copies the text), `onForward`, and on your own messages `onEdit` and `onDelete`.
  - Any of them gives the message an action bar beside the bubble, in the free space so it never covers text: React, Reply and More, all bordered buttons.
  - More opens the menu: Reply, Quote, Copy text, Forward, then Edit and Delete (red) on your own messages.
  - The bar shows on hover, on a long press and on keyboard focus (a Tab into it reveals it). It is mirrored in right to left.
- Reactions: `reactions` ([{ emoji, count, mine }]) draws pills under the text, with yours outlined in the action color, then Add reaction.
  - React opens 👍 ❤️ 😂 😮 😢 🙏 and More reactions (a placeholder until the emoji picker, #646).
  - Each pill is named ("Thumbs up: 2") and says whether you reacted (aria-pressed).
- `quote` ({ author, text }) shows a quoted or replied-to message inside the bubble. Chat.Composer's `replyTo` and `onCancelReply` show "Replying to <name>" above the text, with Cancel.
- `edited` shows "· Edited" in the footer. `deleted` shows "This message was deleted", muted, with no actions, reactions or quote.
- Chat strings in English and Arabic for the actions, reactions and their names, Replying to, Edited and deleted.
- The Chat spec page shows every part as built (the thread, message, run, date line, status, attachments, voice message, composer with files, the AI label), with the owner's do and don't rules (no ratings; the photo crosses the bubble's border in the bubble's outline color; a state is never color alone; people's own words are not set in the data font) and a marked place for slice 4 (message actions and reactions). The written sections (anatomy, contrast, announcements) describe the built parts. This is a spec lane (`lanes/637-chat-s6`).

### Changed
- The suite's Messages app draws a conversation on the Chat parts, with the new look (#637, slice 6): a date line ("Today"), one photo and one name for each run of messages from one side (Chat.Group, the sender's photo or initials on the bubble's top corner, the person's own from their account), and the status of the person's own messages (read for the earlier ones, sent for a new reply). Its behavior is the same: the conversations, a reply sent with Enter, the unsaved-work guard. AIChat already stands on the Chat parts, so it shows the new look with no change.

## [0.76.0] - 2026-10-30

**In short.** Chat gets the owner's new look: outlined bubbles in his colors with the photo on the top edge, runs and date lines, a "Sent | Read" footer with status checks, a message box with files, voice to text and a Send button, pictures, files and voice messages in the bubbles, and AI logos for the photo. Action buttons are slightly raised (the card glow, a thin shadow, one step more on hover), the red button gets a third shade, and button labels sit centered. On Arabic pages computed identifiers read 01-20261020. Numbers inside phrases use the data font everywhere. Pills have equal side padding. Big server-backed tables load more rows as you scroll. Icons load one file each, a few at a time, retry once, and work offline and in browser extensions. The Card accent edge is removed (see Breaking).

### Upgrading from 0.75.0
1. **Card accent:** remove `accent` from your Cards. Where the color meant something, show it inside the card (a `ColorSwatch`, a colored `ProgressBar`, or a `Tag`). A leftover `accent` is ignored and warns once in development.
2. **Identifiers on Arabic pages:** DataGrid id cells, `DataPill kind="id"` and `PropertyList.Item kind="id"` now follow the page and read 01-20261020. Where you wrap an ID in `Isolate` yourself, add `kind="id"` to get the same; the default `Isolate` (emails, web addresses, codes) is unchanged.
3. **What people will see without any change:** raised action buttons, the new pressed red, centered button labels, equal pill padding, numbers in phrases in the data font, the new Chat look, and a selected button readable in dark.
4. **Server tables:** a DataGrid with `fetchRows` in its default fill mode now loads as you scroll; a page shorter than the page size ends the list.

### Breaking
- **Card `accent` is removed (#621).** Remove `accent` from your Cards. If the color carried meaning (a project's or a calendar's color), show it inside the card instead: a `ColorSwatch color={…}` beside the meta text, a `ProgressBar color={…}` when the card shows progress, or the color's name in a `Tag`. Never set a border color yourself; app CSS stays forbidden.
  - The `accent` prop, `.plx-card--accent` and the token `--plx-comp-card-accent-border-inline-start-width` are gone (the iOS, Android and Flutter token files lose it too, and the Android Card guidance has no accent edge).
  - An `accent` still passed to a Card is ignored: no edge draws, nothing breaks, and development warns once (`[Plenix] Card: the accent prop was removed`).
  - Why: an app could use the edge as decoration (one blue on every card) where it is meant for a color from the data, and no check could tell the difference (the owner's decision, 2026-10-29).

### Added
- `@plenix-ds/icons` carries every Plenix icon as its own ES module (#282): `plenix/<name>.js`, with its four SVG files beside it, plus a module for each alias spelling (`arrow_back` imports `arrow-back`), and `plenix/index.json`. They are exported as `./plenix/*` and listed in `icons.json`. An app installed from npm imports only the icons it uses (`import Add from '@plenix-ds/icons/plenix/add.js'`, then `<Icon icon={Add} />` or `registerIcons(Add)`), as it already could from `plenix-platform` and the CDN. The package is now `"type": "module"`.
- DataGrid: rows from a server now load as you scroll (#522, owner decision). A grid with `fetchRows` in the default fill mode asks for the next page by itself when the scroll comes near the end. It shows a "Loading records" row at the end while the page arrives, and a row with Retry if the page fails; the rows already shown stay. It stops at the total. There are no page controls and no Load more button. A sort, filter or search starts again from the first page. `mode="pages"` and `mode="load-more"` are unchanged.
- ListingPage is the starter for a full-room list (#522): a `toolbar` above the grid, `grid` for more DataGrid props (selection, row clicks, row menus), and `detail` (with `detailTitle` and `onDetailClose`) for the chosen record in a SidePanel beside the list. The grid fills the room left below the toolbar and scrolls inside, with no page controls. The grid is now named after the page title (or `label`). Existing ListingPage pages look the same.
- Button hooks for the raised look: per-state glow (background image), bottom edge and shadow. Bars set the context hooks `--plx-comp-button-context-glow` and `--plx-comp-button-context-elevation` to `none`.
- The tokens for the glows, the shadows and the bottom edges (`--plx-comp-button-*-glow-image`, `-raised-*-shadow`, `-border-end`), and the roles `--plx-sys-control-raised-hover-rim` and `--plx-sys-control-raised-pressed`, from existing colors.
- A new reference color, `--plx-ref-color-red-900` (#7a0000), the pressed step of the Danger and Danger secondary buttons (#610; the owner's explicit OK for this one color, an exception to the no-new-colors rule). `--plx-sys-action-danger-background-pressed` now points at it in the light and the dark theme, so Danger has three distinct steps (rest red-700, hover red-800, pressed red-900) and Danger secondary's pressed is no longer its hover color. The native token files (iOS, Android, Flutter) carry it too. No other button color changes.
- Avatar `ai`: an AI participant shows its provider's logo (#637; owner: "use the known SVG logos, keep it simple"). The built-in logos are Claude, Anthropic, Gemini, Perplexity, Meta, Mistral and DeepSeek.
  - Each is the brand's own single-color mark from Simple Icons 16.35.0, its path unedited, drawn through the icon path like every icon (never markup) and in the avatar's own colors.
  - Their sources, and the providers not included (OpenAI, Microsoft Copilot, Muse) with the reason, are in `platform/icons/custom/BRANDS.md`.
- Avatar `logo`: any other logo, as an icon module or icon name.
- The order: a logo first, then the picture, then the gender icon or the initials.
- The icon names `ai-claude`, `ai-anthropic`, `ai-gemini`, `ai-perplexity`, `ai-meta`, `ai-mistral` and `ai-deepseek`, and the `--plx-comp-avatar-logo-size` token (75% of the square, as the gender icon).
- `tools/icons/import-brand-logos.js` writes the logo files from the pinned package.
- New palette steps from the owner's chat colors (#637, his explicit OK for these four): blue 125 `#e6f0fc`, blue 275 `#b2cbe9`, and a new **slate** family (a blue-gray) with slate 375 `#a9b8c7` and slate 900 `#253442`. Each number places the color by lightness between its neighbors. His #F5F7F9 reuses gray 75.
- Message color roles, light and dark: `--plx-sys-message-incoming-background`, `-incoming-border`, `-outgoing-background`, `-outgoing-border` and `--plx-sys-message-text`.
- Avatar: the context hooks `--plx-comp-avatar-context-background`, `-content` and `-border-color`, so a slot can color the photo while the avatar keeps its own rules.
- Chat.Group: one sender's run of messages, with the photo and the name on the first message only and the messages closer together (#637).
- Chat.Divider: a date line across the thread. With `unread`, it is the "New messages" line.
- Chat.Message: `status` (sending, sent, delivered, read), plus `readTime` and `readDateTime`. The marks are a clock (sending), one gray check (sent), two gray checks (delivered) and two green checks (read). The word "Read" is always written, so green is never the only sign.
- The `--plx-sys-message-read` role for the green read checks, from existing colors: green 500 in light, green 200 in dark (the success roles are too pale or too dark on a dark message).
- Chat strings in English and Arabic: Sent, Read, Delivered, Sending, New messages.
- Chat composer, slice 3 (#637, the owner's go 2026-10-29): one outlined box that holds the files waiting, the text and a row of tools.
  - **Tools:** Attach, Image and Emoji at the start; Listening, the microphone and Send at the end, the microphone right before Send. Send is an arrow with its word, off while there is nothing to send (no text and no ready file) and while a file uploads. There is no "Enter to send" hint.
  - **Files:** `attachments`, `onAttach` (the Attach and Image buttons, paste and drop), `onRemoveAttachment`, `onRetryAttachment`, `onCancelAttachment`, `accept` and `imageAccept`. Each file is a card (the card standard: 1px border, 6px corners) with its picture or file icon, a progress bar while it uploads, a Ready badge, or an error badge with Retry. The app uploads; the composer only shows and reports.
  - **Voice:** a microphone dictates into the box with the browser's speech recognition, shown only where the browser has it (looked for each time the composer is drawn, so a browser that gains it shows it with no change). The words appear as they are spoken; "Listening…" with a red dot, a ring on the microphone and a Stop button show; the language follows the page (ar-EG for Arabic, en-US for English; `lang` sets another). Typing in the box while dictating ends the dictation and keeps the text as typed. "Listening…" and a microphone problem are announced once each. Where the audio goes is the browser maker's business (Chrome sends it to Google); Plenix has no speech service. `voice={false}` hides it.
  - **Emoji:** the button opens a placeholder panel ("The emoji picker is coming soon."); `emoji={(insert) => node}` draws an app's own picker; `emoji={false}` hides the button. A real picker is a separate piece of work (#646); until then the suite's Messages app passes `emoji={false}` and keeps the microphone.
  - `sendOn="mod-enter"` makes Ctrl or Command with Enter send and Enter a new line.
- Input context hooks: `--plx-comp-input-context-border-block-width`, `--plx-comp-input-context-background` and `--plx-comp-textarea-context-min-height`, so a parent that draws the box (the Chat composer) takes the field's own border and fill off through hooks, not a rule that reaches into it.
- Chat.Attachment, Chat.Attachments and Chat.Voice: a message shows pictures, files and voice messages (#637, slice 5, drawn in 637-s5c and 637-s3c). A picture is a button that opens the MediaViewer (one viewer for the message's pictures; a row when there are two or more); one that does not load becomes a card that says so. A file is a card with a bordered type icon, its name and size, and a bordered Download button. The voice player has Play and Pause (one plays at a time), a waveform of bars with the played part in the accent color, the time, a speed button (1×, 1.5×, 2×) and a keyboard seek (a range slider: arrows, Home, End). The waveform stays left to right in right-to-left pages. New words in English and Arabic; new `--plx-comp-chat-media-*`, `-file-*` and `-voice-*` tokens, no new color.
- The composer shows a disabled record control with the tooltip "Voice messages coming soon". It does nothing: recording a voice message is #654.

### Changed
- Five hand-made screen-reader regions are now the system's `LiveRegion` (#262, PR 7): the reorder message of `WidgetGrid`, the copy message of `CodeBlock`, the size-limit message of `Resizable`, and the messages of `ColumnsMenu` and the Sort and Filter panels (reorder). Nothing changes for a person: each says the same text at the same time, as a polite status. The region now carries `aria-live="polite"` and `aria-atomic="true"` explicitly, which a status role already implied.
- `check-system`'s `hook-adoption` list gains `LiveRegion` for these five, so none can go back to a bare hidden element. The rule now also accepts a component drawn as `<LiveRegion>` as its use.
- An icon file that fails to load is asked for once more (#283). Before, one network failure or server error (5xx) left an icon that Plenix loads at run time empty until the page reloaded. Now the file is requested again after a quarter of a second; a file that is not there (404), too large or not a drawing is still answered once, and two failures draw nothing (never a square). Icons that are imported or registered are not affected. The optional sprite from the issue is not built.
- `plenix.esm.js` finds its icons beside itself, under any file name (#284, step A). A page that imports the ES module from a self-hosted folder or from a host that renames the Plenix files used to need `window.PlenixIconLibrary` (or `setIconLibrary`) before any run-time icon drew, because the icon code looked only for a script or stylesheet named `plenix.js`, `plenix.css` or `platform.js`. The ES module build now carries its own address and resolves `icons/library/` and `icons/plenix/` beside it (the CDN keeps its versioned `/cdn/material/<commit>/`). The classic `plenix.js` is unchanged, `setIconLibrary` still overrides, and the npm package's `dist/index.js` is left out on purpose because it carries no icon folder.
- The build of the self-hosting archive fails when a documented icon has no file in it (#284, step C, part 1). Every Material name of the Icon's glyph list must have its four files under `icons/library/`, and every Plenix icon its four under `icons/plenix/`; `platform/icons/layout.js` has the check (`missingPackageIcons`), and `build-packages.js` throws with the first missing paths. Today's archive is complete, so nothing changes in what ships.
- `tests/data-grid-perf.test.js` no longer depends on the design spec (#338). It never opened the spec (it draws its own host page from this checkout's Platform), but it skipped itself when the spec folder was missing, so a checkout without the spec silently skipped the DataGrid performance targets. It now skips only without Chrome. No code of the Platform changes.
- Knip's report is cleaner (#363, PR 1): `postcss` is a listed dev dependency (`check-bundle.js` uses it), the page-loaded files (each app's icon file, the engines script and the icon uses file) are Knip entries, and `paper` and `paperjs-offset` (installed for the icon tools with `npm install --prefix tools/icons`) are ignored by the root check. Unused files go from 22 to 9, and unlisted dependencies from 3 to 0. Nothing changes for users: no code, only the Knip setup and the dev dependency (the lock file's own version line moves to 0.75.0 with it).
- Asset Manager source: 29 exports nothing imports are no longer exported, and 7 unused sample values are removed (#363, PR 3): the dialog functions of `BulkDialogs`, `BrowseDialogs`, `MetadataFilterDialog` and `UploadDialog` (each is still used inside its file), `AssetShell`'s header and status bar, the unused `isSingleOnly`, `METADATA_FIELD_KEYS`, `CATEGORY_COUNT_LABEL`, `SEARCH_QUERY`, `SEARCH_COUNT`, `SORT_OPTIONS` and `ROLES`. Checked by grep across the pages, tests, docs and scripts first. `dam/app/assets.js` is rebuilt. Nothing changes for users.
- Knip's report lists no unused file now (#363, PR 2). The nine it listed are not dead: `services/auth/npm-advanced-config.mjs` is a runbook step (`services/login/README.md`), `tests/ci197-*.cjs` and `tests/lane-198-proof/**/*.cjs` are proof tools their READMEs tell people to run, and `vote-kit/` is the open-source vote kit, a package of its own. They are marked in `knip.jsonc` with the reason, and nothing was deleted. No code changes; nothing changes for users.
- Platform source: 22 exports nothing imports are no longer exported, and one unused function is removed (#363, PR 5): `squarify`, Calendar's `isoDate` and `firstDayOf`, CodeBlock's `detect`, CountrySelect's code lists, `flagOf` and `countryOptions`, the RichTextEditor font and size lists, DataGrid's `readView`, File's `fileIconModule`, AppHeader's `SIGN_OUT`, AppShell's `LayoutContext`, `readPref` and `writePref`, ColumnsMenu's `ColumnsList`, SortPanel's `fieldOption`, `toArabicIndic`, `FLOATING_POINTER` and `inBar` (each is still used inside its file), and the unused `groupSummary` of the DataGrid records. None is in the public Platform API (`platform/index.js`). The exports that tests, build scripts and checks use in ways Knip cannot see (the icon layout, `groupedRows`, `matchesCondition`, the generated page layouts, `monitorKey`) are marked in `knip.jsonc` with the reason. `RICH_TEXT_STYLE_PROPERTIES`, a re-export of RichTextEditor, stays listed for a decision. Nothing changes for users.
- App and suite source: 24 exports nothing imports are no longer exported, and 5 unused pieces of code are removed (#363, PR 4): the dashboard's seven widgets, the projects screens, `FeatureRow`, `FIND_SOURCES`, `SUITE`, `readPrefs` and `writePrefs`, and the suite's `P`, `callClaude`, `AV_SIZES` and the priority and status tables (each is still used inside its file); and the unused `SOLID` and `SolidIco` solid icons, the `CARD` style, `RowItem` and the projects' `ProjStatus` badge. Checked by grep across the pages, tests, docs and scripts first. Each app's `app.js` is rebuilt. Nothing changes for users: all ten pages load without errors, as before.
- EntityHeader's note on identifiers is exact (issue 606): plain text reads an ID as `01-20261020` only after an Arabic letter or in Arabic-Indic digits; an ID with Latin digits and no Arabic letter before it stays `20261020-01`, and `<Isolate kind="id">` makes it follow the page. Documentation only; nothing changes on screen.
- A computed identifier reads `01-20261020` on a right-to-left page, as the owner decided (#606, from #590: "01-20261020 everywhere"). Before, Plenix kept identifiers left to right (`20261020-01`) in Arabic text. Each number keeps its own order and the two follow the page, so the text itself, copy, search and screen readers still get `20261020-01`. Left-to-right pages are unchanged.
  - New `kind="id"` on `Isolate` (it follows the direction around it, in a span), on `DataPill` and on `PropertyList.Item`.
  - A DataGrid column of kind `id` now follows the table's direction.
  - Emails, web addresses, phone numbers and code stay left to right, and `Isolate`'s default is still left to right, so existing uses keep their order; a use for an identifier moves to `kind="id"`. Arabic-Indic digits apply where they are on. The editor needs no change.
  - The docs say the rule: Isolate's header, EntityHeader's notes, the PropertyList and DataPill headers, and the mixed-direction integration note. CTM is told before it moves to the release that has this.
- Action buttons are slightly raised (#610; the owner's pick G-R4-H): secondary, tertiary, primary and danger.
  - At rest they carry the Card builder's Glow (the fill to 55%, fading to its rim) and the Halo shadow.
  - On hover, the Glow sits on the hover fill with the Lifted shadow. Pressed and disabled are flat.
  - Ghost buttons, buttons in a bar (Toolbar, command bars, FilterBar, AppHeader) and the 2xs size stay flat.
- Primary and danger: the border is the glow's rim (blue 600, red 800) and the bottom edge one shade deeper (blue 700, red 900). Hovered, the border is one shade deeper.
- Secondary: the hover fill is gray 200 (dark gray 700) and the pressed fill gray 250 (dark gray 900).
- Tertiary sits on the control fill (white, dark gray 800) and hovers gray, as secondary does; it is still outlined in the action blue. Its words use the link blue (blue 600, dark blue 200), so they pass 4.5:1 on every fill.
- Our own pages show the color inside the card (#621): the dashboard's project cards a `ColorSwatch` of the project's color before the category, the calendar's event cards a `ColorSwatch` beside the calendar tag, and the Settings feature-area cards (documentation) the same colored progress bar as the Features page, which also drops its edge. The project notes' cards drop it (every note there belongs to the same project).
- Chat messages are outlined (#637). Theirs use the light gray fill and slate outline; yours use the light blue fill and blue outline instead of the solid action blue with white text. The text is slate 900. Every bubble has a 1px border and the card's 6px corner, and the thread is white (it was the sunken gray). Dark mode uses the existing dark grays and blues.
- Chat.Message's `avatar` sits on the bubble's top edge (the owner's mockup): 8px in from the start edge for theirs and, now also, from the end edge for yours. It sits half above the bubble and takes its bubble's fill, text color and outline. It is mirrored in right to left and never covers the text: a bubble with a photo has 24px of top padding. Before, the photo sat beside their messages only. The bubble's left and right padding are equal (12px).
- A message's time moved from the line above the text to a footer line at the bottom of the bubble: "Sent <time>", then "| Read <time>" once read. The footer is 10px, smaller than the caption, in the secondary gray, and uses the regular font.
- Dark mode: your messages are gray 700 with a gray 500 outline instead of blue, so both kinds of message are grays.
- The Chat composer's text area starts at two lines (one at a phone width) and grows to its maximum height; it had one fixed line and a bar above it. The composer's old top border and gap tokens (`--plx-comp-chat-composer-border-block-start-*`, `--plx-comp-chat-composer-gap`) are gone; its new tokens are `--plx-comp-chat-composer-box-*`, `-tools-*`, `-strip-*`, `--plx-comp-chat-attachment-*`, `--plx-comp-chat-voice-*` and `--plx-comp-chat-panel-padding`.
- Every icon-only control of the Chat composer (Attach, Image, Emoji, the dictation microphone, a file's cancel ×) is a bordered button (the secondary variant), and a file's icon has a 1px border, in the bubble and in the composer (the owner, #637).
- The dashboard's header comment no longer says the project cards carry their color as an accent (#621, QA's note on #639): they show it as a `ColorSwatch`. A comment only; nothing changes on screen.
- Knip lists nothing: the baseline-scan fixture app (read as text by its test) and the optional `@plenix-ds/lint` load are in its ignore lists, each with its reason.

### Fixed
- A count in a Metric's description, a chart's description (ChartFrame and Gauge), a RecordPage header's description, an ActivityList row's meta and a Table cell whose render function returns a string is in the data font, its words in the normal font (#260, the owner, 2026-10-30): "40 pledges" is [40 in Reddit Mono] + " pledges", in the phrase's own size, and Arabic-Indic digits keep working. A string goes through `dataWhenText`; an element given instead is drawn as it was given. The parts are listed under `dataWhenText` in `check-system.rules/hook-adoption.json`. Second of three PRs (the first is the feedback parts; the third the Settings row).
- A count in a Banner's text, a Field's description (hint) or a Checkbox's description is in the data font, its words in the normal font (#260, the owner, 2026-10-30): "40 days" is [40 in Reddit Mono] + " days", in the phrase's own size, and Arabic-Indic digits keep working. A string given to these parts goes through the new `dataWhenText` (in `platform/utils/dataText.jsx`); an element given instead is drawn as it was given. The three parts are listed under `dataWhenText` in `check-system.rules/hook-adoption.json`, so they cannot go back to plain text. First of three PRs (feedback parts; data parts; the Settings row).
- A count in a SettingsSection's or a SettingsRow's description is in the data font, its words in the normal font (#260, the owner, 2026-10-30): "up to 3 lines" has the 3 in Reddit Mono, in the phrase's own size, and Arabic-Indic digits keep working. A string goes through `dataWhenText`; an element given instead is drawn as it was given. The Settings layout is listed under `dataWhenText` in `check-system.rules/hook-adoption.json`. Third of three PRs (the first is the feedback parts; the second the data parts).
- Arabic: a dialog's close button is named إغلاق on Arabic pages (#427). Before, it was read aloud in English ("Close"). This was the last built-in word without Arabic.
- A panel or dialog opened from a bar keeps the focus on its first field (#558 follow-up). The bar's field sizing reached the overlay through the markup, so its Input took the bar's cut-text Tooltip after it rendered; the field was then mounted again and the focus fell to the page. Overlays (Dialog, Sheet, SidePanel, Popover and the find panels) now clear the bar's "content" sizing for what they hold (`layout.json` › fields › overlay), so their fields are sized by the overlay.
- Every suite page has exactly one level-1 heading (#603). The dashboard, and the Projects, Contacts and Notes lists before an item is chosen (and a project's coming-soon panels), had none, so a screen reader had no page title to jump to. Each now has a visually hidden `h1` naming the page ("Dashboard", "Projects", "Contacts", "Notes", or the panel's name); with an item open, the item's own title stays the `h1`. Nothing looks different: the heading uses the standard visually hidden class and the layout is unchanged.
- A button's label is centered by its capital letters (#610). The label box is trimmed to the letters (`text-box: trim-both cap alphabetic`), clipped with room for descenders (`overflow: clip` with a 4px clip margin, the new `--plx-comp-button-label-clip-margin`), so the capitals sit within half a pixel of the button's middle at 32px and at 28px; before, they sat about 1.1px high at 28px. Browsers without `text-box` ignore it and keep the old position.
- DataGrid with rows from a server (#614): in fill and load-more, a page that comes back empty or short ends the list, even when the server's total says there are more, so the grid no longer asks for page after page without end. A search, filter or sort change now starts again from page 1 in the same update, so no request for the old page number goes out first.
- Projects: a project's notes show again (#632). The Notes panel, the overview's Recent notes and the Notes count compared a note's whole folder ("Kitchen Reno") with the project's first word ("Kitchen"), so every project said "No notes yet." A note now belongs to the project whose name starts with its folder's first word, the rule the project's tasks already use.
- An icon that Plenix loads at run time asks for the one file it will show, and at most 6 icon files are in flight at a time (#642). Before, each such icon asked for both its 20px and its 24px drawing, and a page of many icons asked for all the files at once: 150 icons were about 300 requests together, and the live CDN refused about half, leaving most of the icons empty. Now an icon asks for its optical size only (the 24px file for `lg` and `xl`, in a comfortable density or inside `data-plx-icon-optical="24"`, else the 20px one) and the files are asked for in turn. A density change on the page reads the optical size again and fetches the other file. Imported, registered and site-file icons are not affected. The retry from #283 still applies.
- A selected button (a toggle that is on) is readable in the dark theme (#645). Its fill was the palette color gray-200, which does not change with the theme, while its text and icon turn light in dark, so in dark the button showed light text on a light fill (contrast 1.0). `--plx-comp-button-selected-background` now takes the themed role `--plx-sys-fill-neutral-hover` (gray-200 in light, gray-700 in dark): light is unchanged (contrast 9.96) and dark reads at 5.86 for text and icon, in all four variants.
- The DataPill stylesheet's comment on the md size now says 4px before and 4px after, matching the rule below it (#649).
- A pill in a DataGrid or Table cell has equal padding at both sides (#649, the owner: "the same as the top and bottom"). The md pill had 6px before its content and 10px after it (made for an icon at the start), and the shared width of a column's pills was rounded up to the 4px grid with the text left at the start, so in a column of identical pills the text sat 7px from one edge and about 14px from the other, above and below it 4px. Now `--plx-comp-data-pill-md-padding-inline-start` and `-end` are both 4px (the space above and below the text, and the top margin of a 16px icon). A column's pills are still one width: the widest text plus the two paddings and borders, on the 4px grid, and a narrower pill's content, or the leftover of the rounding, is centered, so it splits between the sides. A data column's width follows (the pills are 8px narrower than before).

### Removed
- Twelve built-in English words that no part shows: the `common` section (save, cancel, close, retry, next, back), `wizard.finish`, `wizard.step`, `wizard.error`, and `emptyState.title`, `emptyState.description` and `emptyState.action` (#427). An app that passed these keys in its own catalog is unaffected. No Plenix component reads them, and the spec's "Localized content" example now carries its own English word for its Save button (Arabic falls back to it).
- The `--plx-comp-chat-time-font-family` token (the time now uses the regular font).

## [0.75.0] - 2026-10-29

**In short.** Dates without a time show the same day in every time zone, in charts and filters too. On Arabic pages, chart time runs left to right, Gantt task names are no longer cut, the heat map's weekday labels no longer overlap, and arrow icons such as Sign out point the right way. Short line charts mark days instead of every 12 hours. A cut-off dropdown choice shows its full text on keyboard focus, and the DataGrid column header's menu and filter open with Enter and Space. Seventeen more controls hold inside a read-only region, and six more link their help and error text through the shared hook. The spec's record page drawings fit mid-size windows.

### Upgrading from 0.74.0
Nothing to change. There is no breaking change. Apps with their own right-to-left patches for mixed-direction question blocks can remove them (see `docs/integration/mixed-direction.md`).

### Added
- Tooltip: the context hook `--plx-comp-tooltip-context-position` (default `relative`). A slot that lays the tooltip's control over another sets it on the wrapper (Select uses `absolute`).

### Changed
- Six controls build their `aria-describedby` with `useDescribedBy` instead of joining ids by hand (#262, PR 3): Cascader, CodeEditor, FileInput, InputGroup, RelativeDateInput and AvatarUpload. Nothing changes for a person: measured before and after in a Field with a help text and an error, each control describes the same elements in the same order (Cascader: its value, then the help and the error; CodeEditor, FileInput and InputGroup: the help and the error, then their own line, the Tab hint, the chosen file, the prefix and suffix). The attribute is also never empty: where nothing is described it is absent, as before.
- `check-system`'s `hook-adoption` list gains these six, plus Field and Tooltip (which already used the helper), so none can go back to joining ids by hand.
- `SegmentedControl`, `ColorSwatch`, `ColorPicker`, `PromptInput` and `TimeZoneSelect` take a `readOnly` prop (default: the nearest ReadOnly region's, through `useReadOnly`). Nothing changes outside a read-only region.
- `check-system` has a new rule, `hook-adoption`: the components that have moved onto a foundation hook (`check-system.rules/hook-adoption.json`) must keep using it. The list grows with each step of #262.
- `DatePicker`, `Combobox`, `CountrySelect`, `TreeSelect`, `TransferList` and `InlineEdit` take a `readOnly` prop (default: the nearest ReadOnly region's, through `useReadOnly`). Nothing changes outside a read-only region.
- The `hook-adoption` check now requires an actual `import { hook } from …` and a call of the hook in the code, not just the name: a mention in a comment or a string no longer counts (QA's note on #583). The list gains the nine components above.
- Right to left: time runs left to right in every chart, Arabic pages included (#413, owner decision #584). The line and area charts no longer reverse their dates in right-to-left pages, and their value axis stays at the left. Titles, legends and the labels' Arabic-Indic digits still follow the page.

### Fixed
- The DataGrid column menu opens from the keyboard (#262, PR 4). Its chevron and the filter button in a column header were spans with a button role, so Enter and Space did nothing there and only the mouse or Arrow Down opened the menu. Both now take their press from `usePressable`: Enter, Space and a click open them as a button does, and the key no longer also sorts the column.
- `check-system`'s `hook-adoption` list gains `DataGridEngine.jsx` under `usePressable`.
- Four controls now follow a read-only region and their own `readOnly` prop (#262, PR 1; an owner decision of the Tech Lead: a control inside a ReadOnly region follows the region, as the region promises). Measured: with the region around them, `ColorSwatch` (a swatch button or a ColorPicker) still picked a color and `TimeZoneSelect` still let a person choose a zone; with their own `readOnly`, `SegmentedControl`, `ColorSwatch` and `PromptInput` still changed. Now none of the four changes: the options keep their place and focus, the chosen value shows, and `PromptInput` also turns off Send, the attachments and the model. `SegmentedControl` marks its group `aria-readonly`; folded into its drop-down list, the Select is read-only too. `SearchField` and `Rating` already held and are unchanged.
- Eight more controls follow a read-only region and their own `readOnly` prop (#262, PR 2; the Tech Lead's decision: a control inside a ReadOnly region follows the region, as the region promises). Measured before the change: with the region around them, `NumberInput` (its step buttons), `DatePicker`, `Combobox`, `CountrySelect`, `TransferList` and `RichTextEditor` still changed their value; with their own `readOnly`, `Combobox`, `CountrySelect`, `TreeSelect`, `TransferList` and `InlineEdit` still changed (`DatePicker`, `TreeSelect` and `InlineEdit` had no `readOnly` prop at all). Now none changes: the value shows, the control stays focusable, and
  - `DatePicker`: the field is read-only and the calendar button is not shown;
  - `Combobox` (and `CountrySelect`, which is one): the list does not open, nothing is chosen or created, and the tags lose their remove button;
  - `TreeSelect`: the tree does not open;
  - `TransferList`: the move and reorder buttons are off (items can still be checked to read them);
  - `InlineEdit`: it does not open for editing and shows no edit hint;
  - `NumberInput`, `RichTextEditor`, `CodeEditor` and `MentionInput` had their own `readOnly` and now also follow the region.
- The read-only test changes each control the way a person does before it checks that nothing changes: it types a date and presses Enter, types one and leaves the field, and picks a day in the calendar (`DatePicker`); it opens the list and clicks an option (`Combobox`, `CountrySelect`, `RelativeDateInput`). Each step must change the free control, so a zero in a region or with `readOnly` proves the control holds. `RelativeDateInput` already holds (its Select follows the region) and is now checked.
- Not fixed yet: `TimePicker` and `Cascader` do not follow read-only: inside a ReadOnly region and with their own `readOnly`, a click on an option of their list still changes the value (measured: 1 change each; typed text is held). The test checks only that they change while free; their read-only check is left for a later change (#262).
- The record page's lab in the design spec no longer cuts off its drawings in a narrower window (owner, #352, option B: one drawing per row at full width). The first fix (#511) gave every drawing its own row, but the drawings keep a width of their own (the entity headers 720px) and the row only had 704px at a 1360px window, so the right side of each header, the next step and the action buttons, was cut off. A drawing now takes the room its row has and its content reflows: the next step moves under the facts, as on a narrow page. Spec only (a lane).
- Select: a chosen value too long for its box now shows in full in a tooltip on keyboard focus as well as on hover, only while it is cut, in both reading directions (#577).
- A date with no time ("2026-10-18") is that calendar day wherever the reader is, everywhere (#342, the owner's rule). Gantt charts, calendar heat maps and the time axes of line, area and bar charts no longer show it a day early in the Americas. The "within N days" filter and the date quick filter no longer count a day off east of UTC around midnight.
- Right to left: icons that point somewhere now mirror in right-to-left pages (#413). This adds Sign out (the account menu), Sign in, forward and back arrows, first and last page, reply, reply all, forward, send, and the keyboard's backspace and return, beside the arrows, chevrons, panel toggles, undo and redo that already mirrored. Left-to-right pages are unchanged.
- Right to left: Gantt task labels are no longer cut at the edge, and the calendar heat map's weekday labels no longer overlap its cells (#413).
- `TimePicker` and `Cascader` follow a read-only region and their own `readOnly` prop (#596, from #262 PR 2). Before, typed text was blocked but a click on a time in the list changed the `TimePicker`, and a click on an option changed the `Cascader`, in a region and with `readOnly`. Now the value shows and nothing changes it: the list does not open, the `TimePicker` segments take no digits or arrows that change a value (Left and Right still move between them), and the `Cascader` tags lose their remove button. While free both change as before.
- `check-system`'s `hook-adoption` list gains both under `useReadOnly`.
- Charts: dates without a time (such as "2026-10-01") no longer get time-of-day ticks ("12:00 AM", "12:00 PM") when the chart covers only a few days (#593). Line, area, Gantt and timeline charts now label such an axis by day, or by week, month or year when the range is longer. Charts with real times keep their hour ticks.

## [0.74.0] - 2026-10-29

**In short.** The live design spec and the CDN now show the icon rebuild (each icon is its own small file; the icon stylesheet went from 555 KB to 4 KB; each site can load just its own icons), the matching top and bottom borders on selected and hovered table rows, the splitter that becomes a draggable bar between stacked panes, and toolbars that fold extra buttons into More instead of wrapping. Also: fields in toolbars size to their content and shrink before anything overflows, numbers inside phrases use the data font, the spec's color samples are full bars again, and the page-header examples show all five layouts. Bare icon class names and icons-all.css are removed (see Breaking).

### Upgrading from 0.73.0
An app that moves from 0.73.0 to 0.74.0 does these, in any order:
1. **Icons:** replace every bare icon class (`<span class="plx-icon plx-icon--add">`, without the Icon component) with `<Icon name="add">`, or with `Plenix.iconMarkup(icon)` where the page writes HTML. A bare class now draws nothing.
2. **icons-all.css:** stop loading it. It is no longer published. Any Material Symbols name draws through `<Icon name>`.
3. **Icon settings:** remove any override of `--plx-comp-icon-glyph-*`, `--plx-comp-icon-auto-*` or `--plx-sys-icon-forced-stroke`. They no longer exist.
4. **Icon file (recommended):** load `plenix-icons-<site>.js` (made by `tools/icons/site-icons.js` from your source) or the compatibility file `plenix-icons-plenix.js` after `plenix.js`, so icons draw at once and work offline. Without either, Plenix icons load their files once from the CDN.
5. **Engines:** a page that shows a rich-text editor, a chart or a PDF loads `plenix-engines.js` after `plenix.js`. Without it, those parts say that the engines script is missing.
6. **Renamed tokens:** if your theme or page sets one of the four `-radius` circle sizes below, use its `-size` name.
7. **DataGrid:** remove `uniformPillWidths`. It is ignored, because uniform pill widths are always on.
8. **What people will see without any change:**
   - Toolbars and footer buttons stay on one row and fold extra buttons into More instead of wrapping.
   - Fields in bars size to their content and shrink before overflowing.
   - Panes start wider on large windows, and a dragged width is remembered per monitor.
   - Selected and hovered table rows show a top border too.
   - A stacked split view has a horizontal splitter between the panes.
   - Numbers inside phrases ("7 files") are in the data font.

### Breaking
- Bare icon classes draw nothing (owner, #277 and #557). `plx-icon plx-icon--<name>` without the Icon component is no longer drawn by the stylesheet. Use `<Icon name>`, or `iconMarkup(icon)` where a page writes HTML.
- `icons-all.css` is no longer published (#557).
- The icon drawing settings `--plx-comp-icon-glyph-*`, their per-density aliases `--plx-comp-icon-auto-*`, and `--plx-sys-icon-forced-stroke` are removed (#557).
- The rich-text, chart and PDF engines load through a separate script, `plenix-engines.js` (owner, #456 to #458). A page that shows one of them must load it after `plenix.js`. Details are under Changed.
- Four circle sizes are renamed from `-radius` to `-size`, so the corner rule (2 to 6px) covers only real corners (owner, dot-radius-names-34). Each still holds the circle's radius (SVG `r`), so nothing on screen changes. A theme or page that set an old name must use the new one:
  - `--plx-comp-chart-interaction-focus-mark-radius` → `--plx-comp-chart-interaction-focus-mark-size`
  - `--plx-comp-network-graph-node-radius` → `--plx-comp-network-graph-node-size`
  - `--plx-sys-focus-order-badge-radius` → `--plx-sys-focus-order-badge-size`
  - `--plx-comp-tree-chart-node-radius` → `--plx-comp-tree-chart-node-size` (TreeChart, 4px)
  - The native names follow: iOS `chartInteractionFocusMarkRadius` → `chartInteractionFocusMarkSize`; Android `chartInteractionFocusMarkRadius` → `chartInteractionFocusMarkSize` and `plx_component_chart_interaction_focus_mark_radius` → `plx_component_chart_interaction_focus_mark_size`.

### Added
- Isolate (owner, ctm-needs-34; #413 batch 3): keeps an ID, a case number, an email, a URL, a phone number or code in its own writing direction inside text of the other direction, so "20261020-01" no longer reads "01-20261020" in an Arabic sentence. `<Isolate>` is a `<bdi>` with `dir="ltr"` by default (`"rtl"`, `"auto"`) and the class `plx-isolate` (`unicode-bidi: isolate`). Only the order is kept: when Arabic-Indic digits are on (#413 step 5), the digits inside an island change too (owner, arabic-ids-35).
- Automatic islands: DataGrid and Table cells of kind `id`, `email`, `url`, `phone` and `code` (left to right) and `data` (its own direction); DataPill with `data`; PropertyList.Item with `data`; Code, Kbd and CodeBlock (always left to right). Text was already `dir="auto"`.
- Arabic typefaces (owner, arabic-font-35; #413 batch 1): Readex Pro for titles and IBM Plex Sans Arabic for every other text, hosted with the Platform in `platform/fonts/` (SIL Open Font License 1.1) and served from the CDN, nothing fetched from Google. Each comes after DM Sans in its stack and covers only the Arabic letters (unicode-range), so Latin text keeps DM Sans and a page without Arabic downloads neither.
  - `--plx-ref-font-sans` adds "IBM Plex Sans Arabic"; the new `--plx-ref-font-sans-title` ("DM Sans", "Readex Pro", …) and `--plx-sys-typeface-sans-title` feed `--plx-sys-font-heading`, so every heading and title role (Heading, Text title, heading and display, dialog and panel titles) uses it.
- Plenix's built-in Arabic words (owner, arabic-batch4-36; the start of issue 427): `platform/i18n/ar.js`, used by LocaleProvider for an Arabic locale after the app's own catalog and before English. Pagination now takes its default words from the locale: in Arabic the range reads "31 إلى 60 من 120".
- Vote kit (owner, vote-live-36, vote-rules-36; #414): `vote-kit/`, an open-source (BSD-3-Clause) kit for a live vote in any app, with its own database. It holds the Postgres layout (Open Civic Data shape), the vote settings with a default each, the counting function, the HTTP contract, the server-sent-events live-update contract, and a small reference service. The VoteTally screen part comes separately.
- Button `tone="success" | "danger" | "neutral"` (owner, vote-screen-37): a toggle's chosen state (pressed or selected) fills green, red or gray; a choice not taken stays the plain button. Nine `--plx-comp-button-tone-*` tokens, each an existing feedback role. Existing buttons are unchanged.
- VoteTally (owner, vote-live-36, vote-screen-36/37): a live vote as a list of members, each with a picture or initials, the name and role, and three icon-only choices (Approve, Deny, Abstain) that fill green, red or gray only when chosen; a turned-off member's lock badge; the totals, the quorum and the result under the list. It takes the vote kit's shapes as they are.
- VoteTally: a row whose vote changes flashes once, its tint fading back; under reduced motion there is no flash (owner, vote-live-36).
- Plenix's built-in words in a catalog (owner, arabic-words-37; issue 427): `platform/i18n/en.js` holds every word a component shows or announces on its own, and `platform/i18n/ar.js` the same in Arabic. The new hook `useStrings(section, strings)` gives a component its words for the locale (the app's catalog, then Plenix's built-in language, then English), with its `strings` prop on top. A check (`check-system.rules/built-in-words.js`) keeps English out of the components.
- `iconMarkup(icon, { size, filled, label, className })`: the Icon component's markup as an HTML string, for code that writes HTML.

### Changed
- Select is drawn by Plenix, not the browser (owner, dropdown-look-36): a field and an open list in the Menu's look (the Menu's row height and text size, the chosen row blue and semibold, group headings, disabled rows skipped), built on a hidden native `<select>` that stays the source of truth. The API is unchanged (`options` or `<option>` children, `value`, `defaultValue`, `onChange(event)`, `size`, `width`, `block`, `joined`, `appearance`, `invalid`, `disabled`, `data`, `ref`), and a form still posts and resets. Keyboard: arrows, Home, End, type-ahead, Enter, Space, Escape, Tab. A `multiple` select or a numeric `size` above 1 keeps the browser's list box. The list opens in the browser's top layer, placed like a Menu (flips up near an edge, follows scroll and resize), so no dialog, drawer, table cell or scroll area clips it. New tokens: `--plx-comp-select-list-*`, `--plx-comp-select-option-*` and `--plx-comp-select-group-*`, aliases of the Menu's.
- Form arrows are one size (owner, combobox-arrow-36): the Select, Combobox and TreeSelect arrows move from 12px to the form-icon size, `--plx-sys-control-icon-inline` (16px at the compact density). Tokens: `--plx-comp-select-after-width|height`, `--plx-comp-combobox-chevron-width|height`, `--plx-comp-tree-select-chevron-size`. The Cascader's arrow was already 16px; DatePicker, TimePicker, CountrySelect, TimeZoneSelect and EntityPicker take the Combobox's.
- DataGrid and Table: with `cells="pill"`, every standard pill of a column is always as wide as that column's widest pill in the current view; there is no switch (owner, uniform-pills-always-35). Columns stay independent; custom cells, tags and badges keep their own widths. Table now does it too: it never received the switch.
- The design spec's Object / record page shows the owner's page-header study in full (owner, #244, "go ahead, in the guide and the apps"). The 30 capabilities' headers, each with its two section headers, appear in every layout of header style 1 (top row small, top row large, column small, column large, edge to edge) and in both views of header style 2 (detailed and compact): seven groups of examples to pick from, instead of two. The link to the study under "Reference studies" is gone, since the study is now part of the page; its files stay in `docs/page-headers/`. Spec only (a lane); the apps are not changed yet.
- Form pickers' lists open in the browser's top layer, placed against their field like a Menu (flip up near an edge, follow scroll and resize, 4px from the field, at least as wide as it; a mouse down on the list, such as its scrollbar, no longer closes it), so no dialog, drawer, table cell or scroll area cuts them off: Combobox (and CountrySelect, which uses it), TimeZoneSelect, EntityPicker and Cascader's popup. TreeSelect and DatePicker already used a Popover. No other visible change.
- Arabic digits (owner, arabic-digits-35, arabic-ids-35, arabic-digits-risk-36; #413 step 5): in Arabic every digit is Arabic-Indic (٠-٩), case numbers and IDs included; emails and web addresses keep Latin digits. English and other languages are unchanged.
  - `LocaleProvider` has `digits`: `"auto"` (default), `"latn"` or `"arab"`; `useDigits()`, `digitsOf()`, `numeralLocale()`, `localDigits()` and `toArabicIndic()` are public. Every format helper, Calendar, DatePicker, NumberInput, ProgressBar, ProgressCircle, NavList and SearchWorkspace follow it (`ar-u-nu-latn` keeps Latin).
  - Text, Isolate and DataGrid and Table cells write the digits of their text the same way; `Isolate` takes `kind="email" | "url"` to keep Latin.
  - A left-to-right island keeps the order of its characters with Arabic-Indic digits (`unicode-bidi: isolate-override` on `.plx-isolate[dir="ltr"]`).
- Calendar: in an Arabic locale the weekday headers are one letter each (owner, arabic-batch4-36); other locales are unchanged.
- EntityHeader: its notes say that in a right-to-left page an app wraps an ID or a case number in `<Isolate>` (owner, arabic-batch4-36).
- Arabic digits, the rest of step 5 (owner, arabic-digits-35, arabic-ids-35, arabic-digits-risk-36): chart time axes, HeatMap, Time, TimePicker and TimeZoneSelect write their digits Arabic-Indic in Arabic, as everything else does. A time typed in Arabic-Indic digits is read the same, and TimeZoneSelect finds zones by them. Offsets keep their order inside an `Isolate`.
- TimePicker: its list of times opens in the browser's top layer, placed like a Menu (flips up near an edge, 4px from the field, at least as wide as it), so no dialog, drawer or scroll area cuts it off. No other visible change.
- TimePicker: the rows of its list take the shared list row height (the Combobox's and Select's token, `--plx-comp-time-picker-option-min-height`; 28px at the standard density, where they were 32px), the times staying in the data font (owner, timepicker-rows-37).
- DatePicker: the date field is one box like the text field (owner, form-controls-37), with the 16px calendar icon button inside it at its end, for a single date, a range and a date with time alike; before, the calendar button was a separate piece joined to the field. The calendar opens 4px under the field. The keyboard (Alt+Down, the icon click) is unchanged. New tokens `--plx-comp-date-picker-box-padding-inline-end` and `--plx-comp-date-picker-control-margin-block`.
- Built-in words, my half (owner, arabic-words-37; #427): the components and patterns for overlays, data display, feedback and patterns, and every chart, read their words from Plenix's catalog (`useStrings`), so an Arabic page gets Arabic words without an app-supplied catalog; an app's `strings` still win. Plural words (items loaded, items counted, images added, the delete dialog's title) are plural messages with the Arabic forms. New keys for the labels that were default arguments (dialog, sheet, toast, loading, chat, action bar, autosave).
- Built-in words, the constants and code-built phrases (owner, arabic-words-37; #427): Card, Field's counter, SearchResult, SettingsLayout, ReviewFlow, the Sort, Group and Filter panels' reorder words, the Icon status words, drag and drop's announcements, the Commerce templates and DataGrid read their words from Plenix's catalog, so they speak Arabic without an app catalog. Phrases built by code ("{label} columns", "{title} column actions", "{label}, unread", Show more ({n}), the resize limits) are whole messages. `DND_STRINGS` is still exported, now the catalog's `dnd` section.
- Built-in words, shared constants (owner, arabic-words-37; #427): the workflow status labels and the filter model's words (operators, sort directions, "the past week", the date presets) come from Plenix's catalog, so the review queue, the filter, sort and group panels, the query builder and the quick filters speak Arabic. `WORKFLOW_STATUSES`, `OPERATORS`, `DIRECTIONS`, `WITHIN` and `DATE_PRESETS` keep their shape and English words; `fieldWords` gives the words for a locale. Chat "You", DateBadge "Today", ActivityList "Unread" and DataGrid's cell editor name are catalog words too.
- Plenix's own words in forms, navigation and pickers come from the catalog (owner, arabic-words-37; issue 427): 31 components and 11 patterns read them with `useStrings`, so they show in Arabic in an Arabic page and in English otherwise; an app's own words still win. Phrases that were built from English pieces (a rating's stars, a tag's Rename and Remove, the header's Pin and Unpin, a pane's name, the color names) are whole messages, with Arabic plural forms where they count.
- The rich-text, chart and PDF engines now load through a separate script, `plenix-engines.js` (owner, #456 to #458). `plenix.js` no longer holds an engine address, injects a script or prefetches pages. A page that shows a rich-text editor, a chart or a PDF loads `plenix-engines.js` after `plenix.js` (the CDN has it beside `plenix.js`, the npm package in `dist/`); without it those parts say plainly that the engines script is missing. The suite applications load it already, and the suite shell now owns the hover prefetch.
- Panes and columns can be dragged wider (owner, #463): the side panel, secondary pane, navigation pane and boxes you resize now go up to 1600px (was 960px for the panes). New size steps: 960, 1000, 1200, 1400 and 1600px. The default limits of each pane are unchanged.
- Panes and table columns can no longer be dragged wider than 90% of the window (owner, #463 option C, step 1). A pane stops at 90% of the window, a table column at 90% of its table, down to the 4px grid. A smaller limit the app or the component sets still applies. With the default limits nothing changes on screen: no pane reaches 90% of a window of 600px or more. The share is the token `--plx-sys-shell-pane-window-share`.
- Panes start wider on larger windows (owner, #463 option C, step 2). From a window 1440px wide the navigation pane starts at 272px, the secondary pane at 260px (small 220, large 320) and the side panel at 320px; from 1920px they start at 320px, 320px (small 260, large 400) and 400px. Under 1440px nothing changes (240px, 220px, 240px). A width a person dragged to, or an app set, still wins. The side panel no longer follows the navigation pane's width: its default and minimum are their own tokens.
- The secondary pane's narrowest drag is its own token, `--plx-comp-secondary-pane-width-min` (180px on every window), so the larger starting widths do not raise it. An app that overrode `--plx-sys-shell-nav-width` no longer changes the side panel's width: the side panel's default and minimum are their own tokens.
- The width a person drags the side panel or the navigation pane to is remembered per monitor (owner, #463 option C, step 3). Each monitor, named by its physical size (screen size times the pixel ratio, so browser zoom does not change it), keeps its own width, so a laptop and an external monitor no longer share one. A saved width is used only when it still fits the window (never more than 90%), and comes back when it fits again. The single width saved before carries over as the current monitor's. Stored in `plenix.paneWidths`; the old keys are left in place.
- A saved width outside the limits is no longer clamped: the default shows and the saved value is kept, so it comes back when it fits again.
- The single old value goes to the first monitor that opens, once; the other monitors start at the default.
- Two monitors with the same pixel count share one width, and a size within 10 pixels of a saved one counts as the same monitor (a fractional zoom step can round either way).
- 1366×768 and 1360×768 now share one width (their keys, 1370x770 and 1360x770, are 10 pixels apart); on a tie the smaller key always wins.
- A Select or Combobox that holds a number or a date shows its value in the data font, the same one as the numbers and dates around it (owner, #252, choice A). A chosen label that is wholly a number, a date, a time, a size, a version, a file name or an ID ("10", "Oct 25, 2026") takes it by itself; a word ("Compact", "15 minutes") keeps the interface font. `data` still forces it on, and `data={false}` keeps the interface font.
- `Tooltip` has a `describe` option (default true). With `describe={false}` the trigger is not described by the tooltip (no `aria-describedby`), for a trigger whose own name already says the same text. A cut section heading, a cut Field label and a cut PropertyList label use it, so a screen reader no longer reads the full text twice.
- The DatePicker reads its words from the language catalog, like the other parts (owner, arabic-words-37). English is unchanged and the `strings` prop still wins. On an Arabic page the button, the popup, the time field and the quick choices (Today, Tomorrow, Last 7 days and so on) now read in Arabic with the catalog's approved phrases; no new phrase was added. The catalog of built-in words in code is now empty.
- A toolbar and a page's footer buttons are one row at every width (owner, #477, stage 4). A Toolbar (and so a DataToolbar) never wraps: at a narrow width the Buttons that have an icon drop their words (the icon stays; the name shows in a tooltip and is the accessible name), then the least important Buttons move into one "More actions" (⋮) menu, each with its icon and words. The primary Button keeps its words longest and Delete folds last. An ActionBar (every form's and settings page's footer) also stays one row: the secondary actions move into More while the primary action and Cancel stay, and the labels never hide. In a window under 400px the primary button stacks first at full width and More sits on Cancel's row. Growing the window back shows every button again.
- `Button` takes `priority` ("high", "normal" or "low", default "normal"), read by a Toolbar or an ActionBar: low folds into More first, then normal, then high.
- A toolbar measures the fields inside Stack and Inline wrappers too. The Asset Manager's system settings toolbars (users, database, customizations) now fold their Buttons into More instead of overflowing.
- Fields in a toolbar, command bar, action bar or header size to their content between two limits, and a bar that runs out of room shrinks them instead of overflowing (owner, #558 and #554). A Select, Combobox, TreeSelect, DatePicker, TimePicker, Input or Search without a `width` takes the width of its longest choice, no narrower than `--plx-sys-fit-field-min-width` (100px) and no wider than `--plx-sys-fit-field-max-width` (320px). A `width` still means that exact width outside a bar.
- A bar folds its Buttons into More first. Only when every Button has folded do its fields shrink, down to 100px, and a field with the large `width` shrinks too. A menu button with an icon (Delete ▾) drops its words at the icon-only step, and an icon-only Button folds into More. The Asset Manager's System settings, Database, Records toolbar now fits at 480px, 360px and 320px, left to right and right to left. Below about 260px of bar a Search at its minimum can still make a bar overflow.
- A Select, TreeSelect, Combobox, DatePicker or TimePicker whose text is cut ends it with an ellipsis and shows the full text in a tooltip on hover and keyboard focus, only while it is cut. An Input or a Search does the same in a toolbar, command bar, action bar or header.
- New tokens `--plx-sys-fit-field-min-width` and `--plx-sys-fit-field-max-width`.
- Icon: icons come only from icon modules, never from the stylesheet (#557).
  - A name draws from its imported or registered module (an icon file such as `plenix-icons-plenix.js`, or a site's own `plenix-icons-<site>.js`).
  - A Plenix name with no module loads its file once from `icons/plenix/` beside `plenix.js`, and development warns that production should register it.
  - An icon drawn before the stylesheet arrived no longer stays empty.
- Icon: every icon that points along the reading direction carries `plx-icon--mirrored` (the same mirroring as before).
- `icon.css` holds only presentation: sizes, the optical size, the inline drawing and mirroring. `plenix.css` is about 550 KB smaller.

### Fixed
- Arabic in the data font (owner, arabic-font-35; #413): `--plx-ref-font-mono` adds "IBM Plex Sans Arabic" after Reddit Mono (Arabic letters only, from the existing @font-face), so Arabic in data text, data columns, PropertyList data values and chart axis labels is drawn joined, not letter by letter in a system monospace font. Latin is unchanged.
- Charts in a right-to-left page (owner, ctm-needs-34; #413 batch 4): labels drawn by ECharts no longer grow the wrong way from their point. The engine's own element is always left to right (`.plx-chart__engine`), and the chart reads the page's direction from the `dir` attribute (`:dir(rtl)`), so it still mirrors: TreeChart's labels now sit beside their dots instead of over them, and a line or bar chart's value labels sit outside the axis. TreeChart also keeps its root label's room on the root's side in right to left, so the root's name is no longer cut off. Left to right is unchanged.
- Every color sample in the design spec is a 120px bar (owner, #263, option A, 2026-10-28). The Color foundation page was fixed in #510; the color group pages (the light and dark swatch of each role), the token pages and every variant's token table still drew their samples 24px wide, and a token card's sample had no width of its own. They all use `--plx-ref-size-120px` now and cannot shrink in a flex row. Cause: a sample is an empty block with no content, so wherever its table cell or row sizes to its content it collapses to its border; only a width and `flex-shrink: 0` hold it open.
- `check-spec.js` has a new rule, `color-samples`: it fails when `.ds-swatch` or `.ds-vis--color` has no `inline-size: var(--plx-ref-size-120px)` or `flex-shrink: 0`, or when any rule for them says a smaller width. It proves itself on two fixtures (`tools/fixtures/spec-color-samples/`): the good one passes and the shrunk one fails.
- Avatar: a name with no Latin letter (an Arabic name) shows its initials instead of an empty box: each word's first letter, two Arabic initials kept apart so they do not join (owner, ctm-needs-34; #413 batch 4). Latin names are unchanged.
- Charts keep room under the axis for Arabic labels (owner, arabic-font-35): the bottoms of Arabic month and category names are no longer cut. Line and column charts measure Arabic labels only; English charts are unchanged.
- Section headings no longer end in "…" with no way to read them (owner, #502). Every CollapsibleSection heading (navigation groups, side-panel and settings sections) wraps to two evenly balanced lines, and only past two lines ends in "…", with the full text in a tooltip on hover and keyboard focus. A one-line heading stays 32px high and a two-line heading is 40px. At 192px "PROJECT COMMAND CENTER" reads in full on two lines. The accessible name is still the full text. A plain static NavList heading (`collapsible: false`) wraps the same way, but a cut one shows its full text on hover only (it is not focusable); a screen reader reads the whole heading.
- A hovered row and a selected row in a Table or DataGrid now show a top line equal to their bottom line (owner, #559): the same color token and the same width, in light and dark, compact and comfortable, left to right and right to left, beside frozen columns, and between two selected rows. The old line was drawn above the row, where the row's own clip cut it off. The row now casts it above itself with an outer shadow; the first row, which has no row above it, draws it inside its top edge (a new `--first` row class). Row heights do not change.
- Screen-reader texts no longer make a page scroll (#288): `.plx-visually-hidden` is the standard visually-hidden box, 1px, clipped and pulled back by its size on every side. This covers the announcer, LiveRegion, the drag-and-drop instructions and the clipboard's text. A page that fits the window no longer gets an extra scroll bar of about 20px, in left-to-right or right-to-left layouts.

### Deprecated
- DataGrid `uniformPillWidths`: accepted and ignored, since uniform widths are always on. Remove it from your pages; it goes in a later release.
- These are retired (owner, #277) and are being removed (#557):
  - bare icon classes (`plx-icon plx-icon--<name>` without the component)
  - the icon drawing settings (`--plx-comp-icon-glyph-*`)
  - `icons-all.css`
- Use `<Icon name>`, or `iconMarkup(icon)` where a page writes HTML. In development, the style audit warns about each bare class.

### Removed
- The retired icon parts are removed (owner, #277 and #557; deprecated in #561):
  - bare icon classes (`plx-icon plx-icon--<name>` without the Icon component): they draw nothing
  - the icon drawing settings (`--plx-comp-icon-glyph-*`), their per-density aliases (`--plx-comp-icon-auto-*`) and the per-name icon rules
  - `icons-all.css`: no longer published
- Use `<Icon name>` (or an imported module), and `iconMarkup(icon)` where a page writes HTML.
- The system token `--plx-sys-icon-forced-stroke` (#557). It drew a bare mask icon with its border in forced colors. Icons are inline svg now, painted in the text color, so nothing reads it.

## [0.73.0] - 2026-10-27

### Added
- SplitView settings: `--plx-comp-split-view-padding` (16px) and `--plx-comp-split-view-radius` (6px) (#375).
- `/cdn/<version>/source/`: the release's source as written, so the design spec can read each component's JSX and CSS from the release it documents (#341).
- TreeChart: one root and its branches, drawn on ECharts' tree (#377).
  - `orientation` is `"left-to-right"` (default) or `"top-to-bottom"`; the arrow keys follow it.
  - A click folds and opens a branch (`defaultFolded`, or `folded` with `onFoldedChange`); the path to the root stands out under the pointer or focus.
  - Labels never collide; on a phone, left to right shortens the middle names, and the full names stay in the live region and "Show the data".
- Stylelint is the main style checker for stylesheets (`npm run lint:css`), with a Plenix plugin for token tiers and logical properties (#362, #385, #389, #393, #394).
- `check-style.js`: the Plenix style check beside Stylelint, for the style rules Stylelint cannot check (#395).
- `check-common.js`: what the two checks share (#395).
- The token-definitions rule: no new colors (the reference palette is frozen, gray 250 included), everything on the 4px grid, corners 2 to 6px (#386, #396).
- Knip reports unused files and exports (report-only) (#364).

### Changed
- The design spec runs on the CDN. `platform/design-system/plenix-source.js` names the release (package.json's version), and `?plenix=local` previews unreleased Platform work (#341, plenix-design-system#5).
- Every Platform stylesheet is in a cascade layer, in one declared order: `plx.vendor, plx.reset, plx.tokens, plx.elements, plx.layout, plx.components, plx.patterns, plx.utilities` (#374).
  - CSS that is not in a layer now wins over every Platform layer; keep an application's own styles in its own layer when order matters.
- No Platform stylesheet uses `!important`: the utility classes lost all 413 (#376, #378, #379, #380), and the sign-in theme (`services/auth/brand.css`) wins by specificity (#383).
- Each style rule lives in exactly one of three checks: `npm run lint:css` (Stylelint) for stylesheets, `node check-style.js` for the style rules Stylelint cannot check, `node check-system.js` for everything that is not style (#392, #393, #394, #395, #396).
  - The ownership rule is retired; `selector-kinds` already rejects the same selectors (#392).
  - The palette, themeable, classes and tables rules moved into Stylelint (#393).
  - Token tiers and logical properties are Stylelint rules in the Plenix plugin (#394).
  - The raw-length rule catches negative lengths (#389).
  - The documentation names the checker for each rule (#396).
  - The corner rule reads every unit: a radius token is a token reference, 0, or 2 to 6px. The named exceptions are the spinner (`50%`, a circle) and four inner card corners (#398).
- The chart content guidance has the owner's six wording answers (#388).

### Changed (visual)
- Every corner above 6px is 6px, and the round shape is 6px too, so round marks and large surfaces get 6px corners (#391). Spinners stay round (#397).
  - `--plx-sys-shape-md`, `-lg`, `-xl` and `-pill` keep their names and now take `--plx-ref-radius-6px`.
  - Affected parts: cards, dialogs, menus, surfaces, the sign-in card, avatars (4px up to 24px, 6px above), pills, Slider track and thumb, Resizable divider handle, DataGrid scroll thumb, Diagram terminal shape, List, MetricCard split bar, Pictogram, Spotlight beacon, Timeline marker and FloatingActionButton.
  - Dots that are 12px or smaller stay circles, because 6px is half their size.
- The sign-in theme uses today's tokens (release 0.72.0): darker input borders, a stronger required-asterisk color, 4px corners on the fields and the Log in button, and a light blue focus ring in dark mode (#390).
- Split view and menu edge (#375):
  - SplitView has 16px of space around it, square corners where each panel meets the divider, and 6px outer corners on both panels; the corners turn when the panes stack.
  - The divider is a slim line with a grip; dragging settles on the 4px grid, and the navigation pane folds from its edge.
- DataGrid and Table: the outer frame is one step lighter (gray 300 in light, gray 800 in dark), and the edge after a frozen first column is a new gray 250 (#351).
- Line, Area, Bar and Pie draw their plot with Apache ECharts 6.1.0; names and props are unchanged (#358).
- Sparkline draws with ECharts: a line, area or bar with no axes, one live chart each (#367).
- TreeChart (new, see Added) is the chart for trees such as the St. John ministries (#377).

### Fixed
- The sign-in theme generator reads today's tokens again (#384, #390).

### Breaking
- The corner tokens are renamed to 6px names (#391). Use the new name in place of the old one:
  - `--plx-ref-radius-8px`, `--plx-ref-radius-12px`, `--plx-ref-radius-16px` and `--plx-ref-radius-pill` are removed: use `--plx-ref-radius-6px`, or the role `--plx-sys-shape-sm`.
  - `--plx-sys-radius-control-8px` and `-12px` are now `--plx-sys-radius-control-6px`.
  - `--plx-sys-radius-media-12px` is now `--plx-sys-radius-media-6px`.
  - `--plx-sys-radius-surface-8px` is now `--plx-sys-radius-surface-6px`.
  - `--plx-sys-radius-card-12px` is now `--plx-sys-radius-card-6px`.
  - `--plx-sys-radius-menu-8px` is now `--plx-sys-radius-menu-6px`.
  - `--plx-sys-radius-dialog-8px` is now `--plx-sys-radius-dialog-6px`.
  - `--plx-sys-radius-avatar-8px` and `-12px` are now `--plx-sys-radius-avatar-6px`.
  - The utility class `.plx-u-radius-surface-8px` is now `.plx-u-radius-surface-6px`.
  - A shape that must stay round sets its own value (a component setting), as the spinner does.
- The Resizable divider's handle tokens are removed (#375): `--plx-comp-resizable-divider-handle-color`, `-hover-color`, `-length`, `-radius` and `-thickness`. The divider is now a line: use `--plx-comp-resizable-divider-background`, `--plx-comp-resizable-divider-hover-background` and `--plx-comp-resizable-divider-grip-gap`.

## [0.72.0] - 2026-10-26

### Changed (visual)
- Buttons (#298):
  - the command bar has a 4px frame and items; its menu icon turns blue on hover (#319)
  - icon-only buttons show their name and shortcut as a tooltip (#323)
  - a loading button keeps its width and accessible name (#323)
  - touch layouts get 44pt and 48dp hit areas (#323)
  - Sort and Status buttons show the current choice (#323)
- DataGrid and Table:
  - every column header label starts at the start, number columns included; `headerAlign` no longer moves the label, while cell alignment is unchanged (#326, #330)
  - header titles stay in the vertical middle when another title wraps (#271, #293)
  - in a wrapped row, every cell starts at the top (#256, #331)
  - text cut by wrap shows an icon that opens the full text in a popover (#312)
  - unread works the Fluent way: unread rows in bold with a marker, "Unread" as a filter, and Mark as read/unread in the selection commands and the row menu. The row of text above the headers is gone (#287, #318). **What an app should check:** apps using `unreadKeys` find these commands in the command bar and the row menu.
  - with a CommandBar, "Filter by this field" opens the bar's Filter panel (#269, #295)
- SegmentedControl becomes a drop-down list when its options don't fit (#276, #320). The CommandBar's find side folds the same way (#274, #322).
- EntityHeader:
  - dates and numbers in fact values and the subtitle use the data font (#260, #328, #339)
  - a long summary title wraps inside its card on narrow screens (#340)
  - the apps' headers no longer repeat the summary as a fact (#328, #334)
- Checkbox: its label sets the baseline, so a date beside it lines up (#256, #329).

### Fixed
- In forced colors (Windows High Contrast), a pressed button shows Highlight with HighlightText (#325, #327).
- An empty Table or DataGrid is valid ARIA: the empty message is a row (#313, #315).
- DataGrid no longer throws when its document closes, for example a preview frame that is removed (#343). The same fix applies to the design spec's own script (plenix-design-system#4).

### Added
- Design spec guidance for buttons, the toolbar, action menus, the command bar, the sort panel and the quick filter (#298).
- The icon audit report (#278, #292).

## [0.71.0] - 2026-10-25

### Added
- Four icons in the Plenix set: `flip-vertical`, `git-branch`, `git-merge` and `git-pull-request` (#301).
- Lettered file icons with squared letters: `file-jpg`, `file-png`, `file-svg`, `file-pdf`, `file-psd` and `file-ai` (#301). Files and the Asset Manager use them.
- Icon rules as measurable guidance: `platform/standards/icons.md` (line weights, flat ends, keylines, padding, half-pixel grid), and the spec page Foundations › Iconography › Icon inventory (#301).
- The license list for 41 icon libraries (`platform/icons/inventory/libraries.json`) and the icon tools in `tools/icons/` (check, restyle, inventory, fetch) (#301). The Material Symbols set is unchanged.

### Fixed
- TypeScript declarations are generated by fixed rules (#170, #171):
  - DataGrid `columns` is typed as an array, and Tabs has `onChange(value)`
  - about 55 components get their documented props instead of bare HTML attributes
  - about 40 props keep their default choice
  - `DataTable` is typed as `typeof DataGrid`, and parts objects such as `Chat` are typed as their parts
  - **What an app should check:** a TypeScript app may now see errors that the loose types hid; the new types match the documented props.

## [0.70.1] - 2026-10-25

### Changed (visual)
- The suite apps' page headers use the Structured header style by default (#244, owner 2026-10-24): Projects, Contacts, Messages, Tasks, Notes and Files. Streamlined stays available through `headerStyle="streamlined"`, unchanged. The Platform library itself is unchanged.

## [0.70.0] - 2026-10-25

### Breaking
- DataGrid and Table options have Plenix names (#294); there are no aliases.
  - **Columns:** `hozAlign` → `align`, `headerHozAlign` → `headerAlign`, `headerSort` → `sortable`.
  - **Trees:** `dataTree`, `dataTreeChildField`, `dataTreeElementColumn` and `dataTreeStartExpanded` → `tree`, `childrenField`, `treeColumn` and `treeExpanded`.
  - **Children:** the children key defaults to `children` (was `_children`).
  - **Events:** the `on` map's `cellEdited` event is `cellEdit`; the `onCellEdit` prop is unchanged.
  - **What an app must do:** rename these options when it moves to 0.70.0. RedSave and CTM use them.

### Added
- `tokens.css`, the token set for shadow roots and pages Plenix doesn't own, at `/cdn/<version>/tokens.css`, plus `plenixTokens(url?)`, which returns an adoptable stylesheet (#158).
- DataGrid **Wrap text** (#256):
  - each column menu has "Wrap text"; the header's right-click menu has "Wrap all columns"
  - `columns[].wrap`, `kind: 'wrap'`, `wrapColumns` and `onWrapColumnsChange` set it from code, and the saved view keeps it
  - a wrapped column uses the row-height steps: 2 lines at Medium, 3 at Tall, then "…"; a Short grid moves to Medium
  - a row with a wrapped column starts every cell at the top
  - Table gets the same look through a column `wrap` prop
- DataGrid header targets the Windows Explorer way (#217):
  - the resize grab area is 12px, centered on the column line
  - the full-height options part is one target, at least 24px wide

### Changed (visual)
- Buttons follow the Fluent style (#298), through tokens only, from existing palette colors:
  - **Corners:** `radius-control` is 4px in every density (#299), for buttons, text fields, selects, comboboxes and navigation items
  - **Border:** the default border is gray-300 (gray-350 on hover), which also fixes the corner that looked cut at 125% and 150%
  - **Hover:** neutral, and a ghost button's icon turns blue
- DataGrid and Table lines (#305, #308):
  - the frame, the heading line and the edge after a frozen first column share one color, gray 400; inside lines stay lighter
  - the Table header is the header height (28px at Compact, like the grid)
  - the header's options part takes a hover one shade darker than the column hover
- EntityHeader:
  - the divider starts at 63% and moves toward the end when the title needs the room; the right side keeps at least 220px (`entity-header-aside-min-width`) (#297)
  - the status box has a gray-200 outline and a gray-75 background (#300)
- The design spec's wording is rewritten in plain language (#257).

### Fixed
- RichText cleans its `html` through the rich-text allow-list (#178).
- The resize cursor holds during a column drag and right on the column line (#308).
- Sample data uses a made-up person, Jordan Avery, instead of a real name (#236).
- The 30 capability headers are in the spec in both header styles (#244). Their icons use Plenix names.

### Removed
- The retired grid engine is gone from code, stylesheets, tests, tools and current docs.

## [0.69.5] - 2026-10-24

### Fixed
- DataGrid: every line is one screen pixel at any display scaling. The top line of a hovered or selected row, the lines
  between columns (rows, group rows, the header), the line after the checkbox column and the header hover edges were
  1px painted strips. At 125% or 150% scaling the browser rounded a strip to one or two screen pixels by its position, so
  a selected row's top line was thicker than its bottom line and the column lines differed from column to column.
  - **What changed:** those lines are borders on the same pseudo-elements, which the browser rounds like the row borders.
    Colors and positions are unchanged.
  - **Effect:** at 100% scaling nothing changes; at 125% and 150% all lines match.

## [0.69.4] - 2026-10-24

### Fixed
- The self-hosting archive (`/cdn/<version>/plenix-<version>.tgz`) carries the whole icon library (#59, a packaging fix for
  the 0.69.2 regression).
  - **What changed:** the files are under `icons/library/` (16,601 files; the archive is about 6 MB), and the archive's
    `icons-all.css` points at that copy.
  - **Effect:** served from the archive's own files (an extension, an offline app), every icon draws with no network:
    Plenix icons, other Material names and bare classes.
  - **Override:** `window.PlenixIconLibrary` (or `setIconLibrary(url)`) names the folder when a bundler renames the
    Plenix files. The CDN README explains it.
  - **What an app should check:** an extension built with a bundler sets `window.PlenixIconLibrary` to its copy of
    `icons/library/`.
  - The complete icon architecture (assets apart from CSS, one resolver, static modules, offline tests) is #277.

## [0.69.3] - 2026-10-24

### Added
- EntityHeader `headerStyle="streamlined"`: header style 2 of the owner's page-header study (#244). One line holds the
  media (48px), the title with its badges (status first) over the subtitle (`**names**` in bold), and at the end the
  people (AvatarGroup), an inline progress and the actions (icon buttons, labeled buttons, one primary). Under a divider
  the details strip shows a progress with fact tiles, tags, items, text and an end badge or link (`detail`). It hides in
  `view="compact"`. A section header shows its icon, title and summary badge with its actions. Built from Badge,
  AvatarGroup, ProgressBar, Tag, Link and Button; new tokens `--plx-comp-entity-header-streamlined-*`. The default
  (Structured) is unchanged. Review page: `docs/briefs/header-layouts/streamlined.html`.

## [0.69.2] - 2026-10-24

### Fixed
- Icon (#268): one way to draw an icon, inline SVG in the text color.
  - Every name goes through one resolver (resolveIcon): a Plenix name or its underscore spelling, or any Material
    Symbols name in dashes or underscores and any case.
  - Plenix icons draw at once: their drawings are read from icon.css, which already carries every file (one copy, no
    request, works from file://; glyphs.js holds only the names). Any other symbol loads
    its files once, on demand, from the library beside the bundle (the CDN's /cdn/material/<commit>/;
    setIconLibrary(url) points elsewhere).
  - An unknown name draws nothing, never a filled square (a bare class name neither), and warns once in the console
    with the closest names.
  - The drawings are the published paths, with their own transform where a file has one. Compared with the mask
    drawing at every size, outline and filled, Compact and Comfortable: 6 pixels of antialiasing differ in 64 sets.
  - Paint: scrolling a 600-row grid 6.2 s → 2.0 s, sorting 1.25 s → 0.61 s, select all 0.48 s → 0.15 s (CPU slowed
    four times).
  - What an app should check: nothing to change. icons-all.css is only needed for icons written as bare class names.
- Combobox as a tag picker (`multiple` without `marks`): the list offers only the tags not chosen yet, so Enter on a
  suggestion always adds one and never removes it; a tag is removed only by its remove button (or Backspace in the empty
  field). Before, typing part of a chosen tag and pressing Enter removed that tag, so tags seemed not to save (#261,
  RedSave P-57). The checkbox select (`marks="checkbox"`) still toggles. Test: `tests/combobox-tags.test.js`.

### Added
- resolveIcon(name) and setIconLibrary(url) in the public API.
- The design spec's Data grid page links its three studies (header, row hover, selected rows) as its sources, and the
  deploy publishes them under /Plenix/docs/ (#272).
- EntityHeader `layout`: the five layouts of the owner's page-header study (header style 1, #244): `top-small` (default,
  unchanged), `top-large` (a 72px image beside the title), `column-small` (a 44px image in its own column),
  `column-large` (a square spanning the title and the details, at least 112px) and `edge` (the image fills the card's
  start edge, at least 128px); section headers follow at 32, 48, 32, 64 and 80px. The stretched squares take the largest
  size token that fits their row (`data-plx-size`, system/steps.css), at most a quarter of the header's width. New
  tokens: `--plx-comp-entity-header-media-size-*`, `-media-icon-size-*`, `-split-gap`. The section header's media sizes
  are now the media's own classes (two parent-to-child rules fewer). Review page: `docs/briefs/header-layouts/`.

## [0.69.1] - 2026-10-24

### Changed
- DataGrid grouping runs on TanStack Table's grouped row model (owner, 2026-10-23), in its own table so selection,
  paging and counts keep the plain rows: each level's bucket (calendar periods in UTC, numeric ranges) is the column's
  grouping value, and group summaries are TanStack's aggregations (sum, mean, min, max, count) over each record once.
  A record of a multi-value column still shows in the group of each of its values (it enters TanStack once per
  value). Groups, their order, counts and summaries are unchanged (tools/agent/datagrid/group-check.js: six cases,
  identical to 0.68.0).
- DataGrid header: no sort arrow is drawn; a click on a title sorts (aria-sort carries the order).
- The design spec's Data grid and Table pages describe the 0.69 look and menus (silver header, options button,
  right-click column chooser, row hover and selection) and what TanStack does.

## [0.69.0] - 2026-10-24

### Changed
- DataGrid look (owner's studies, docs/grid-header-study, grid-row-hover-study, grid-row-selection-study):
  - The header is a silver band (gray 50 to gray 200) with a gray 400 line under it, 28px tall at Compact (32px
    Standard, 40px Comfortable), the titles unchanged. Hovered, every header line shows and the column under the
    pointer deepens (gray 100 to gray 300) with both edges in gray 400. The resize handle draws no blue mark (the
    resize cursor is the cue).
  - A hovered row tints gray 100 (was gray 200, the color of the lines) and its lines turn gray 300, so they stay
    visible. A selected row is blue 100 (was blue 200) with blue-gray 250 lines and a 3px blue 600 bar at its start;
    hovered it turns blue 200 (it used to turn gray).
  - What an app should check: screenshots of grids; the header is 8px shorter at Compact.
- DataGrid header menus (Windows Explorer and Airtable):
  - A click on a title sorts; the sort arrow follows the title. The options button sits at the header's end edge, its
    height, with a line before it, and always shows its chevron. An active filter shows a funnel after the title; the
    filter box stacks its field and Clear filter.
  - The column menu: the application's field actions (columnMenu), sort in the type's words, Filter by this field,
    Group / Don't group by this field. Width, order and visibility moved to the right-click menu.
  - Right-click on a header: Size column to fit, Size all columns to fit, every column with a check, More… (the Manage
    columns dialog).
  - What an app should check: an app that relied on Narrower, Wider, Move, Hide or Show all in the column menu finds
    them in the right-click menu (or the Manage columns dialog).
- DataGrid on TanStack Table: column pinning (getIsPinned, getStart), row selection (toggleSelected, single or
  multiple), filter-list values (faceted unique values) and column resizing (the header resize handler, Plenix's size
  steps kept) now use TanStack's own features. Grouping stays Plenix's (a record may belong to several groups).
### Added
- ManageColumnsDialog: open, onOpenChange and trigger={null}, so an owner can open it (the grid's More…).

## [0.68.1] - 2026-10-23

### Fixed
- DataGrid opens about twice as fast (600 rows: 4.4 s → 2.0 s; 5000 rows: 5.2 s → 2.6 s on a CPU slowed four times).
  Column measuring reads every length once, after its probe pills, instead of restyling the page for each read; a
  measured length is kept for the context it depends on, only from a grid on screen.
- DataGrid scrolling draws again only when the window of rows changes, not on every scroll event (TanStack Virtual,
  unmodified, driven through the grid's own adapter). No visual change: 229,556 computed values compared before and
  after across every grid of the applications and the spec, in every state.

## [0.68.0] - 2026-10-22

### Added
- DataGrid and Table `uniformPillWidths` (CTM): with `cells="pill"`, every standard pill of a column is as wide as that
  column's widest pill in the current view (filtered and sorted, the current page, every row of it, so scrolling a long
  list never changes it). Columns stay independent; custom cells are left alone; default false. The widths are rules in a
  stylesheet the grid owns, never style attributes.
- The icon naming contract: Plenix names use dashes; a Plenix name that is its Material symbol with dashes also answers
  to the underscore spelling (`mic_off`, `person_cancel`) without icons-all.css; the build fails when a name has no rule.
- `/cdn/<version>/examples/acceptance.html`: a standalone page on the release's own files (densities, pills, uniform
  widths, wrapped headers, resize, icon names, right to left).
### Fixed
- DataGrid: pill columns measure in the font the pill draws in (the mono font's size-adjust and spacing included), so
  dates and other data pills are no longer cut by a few pixels.
- DocumentViewer in a right-to-left interface: a PDF or image page is laid out left to right, centered when narrower
  than the viewer and opening at its top left when wider, and again at each page; text documents keep their direction.

## [0.67.0] - 2026-10-22

### Added
- The whole Material Symbols library on the CDN (owner, 2026-10-22): every symbol (outline and filled, optical sizes 20 and
  24, unedited) at `/cdn/material/737e33243058/`, and `/cdn/<version>/icons-all.css`, which gives each symbol its Material
  name as an Icon name: link it after `plenix.css` and use `<Icon name="person_cancel">`. Optional; a Material name that is
  already a Plenix name keeps the Plenix meaning (`check`, `home`).
- Icons `person-cancel`, `document-search`, `folder-eye`, `check-square` and `edit` in the Plenix set (CTM).

## [0.66.0] - 2026-10-22

### Changed
- DataGrid header hover: the type icon steps aside and, in a column with a menu, the sort direction shows in the menu
  button (the separate arrow shows at rest only). The hover controls take about 34px instead of 58px (owner, 2026-10-22).
- DataGrid: every column, set widths and resized ones included, is at least as wide as its heading needs at rest and on
  hover; a wrapped heading needs the narrowest width that holds it in two lines, never a word broken.
### Fixed
- DataGrid `wrapHeaders`: the header row stays the normal height and grows only as far as a wrapped heading needs (it was
  always taller, even when every heading fit on one line).

## [0.65.0] - 2026-10-22

### Added
- DataPill `size="md"`: 24px tall at every density, 6px before the icon and 10px after the value (owner, 2026-10-22).
  Without `size` a pill keeps the height of the text line it sits in.
- DataGrid and Table `density`: `"compact"` (default) | `"standard"` | `"comfortable"` | `"page"` (follow the page). Set on
  the grid itself, so its rows, header and pills follow it.
### Changed
- Table row heights: Compact 36px, Standard 40px, Comfortable 48px (were 28 / 32 / 40), and every DataGrid and Table
  starts in Compact (owner, 2026-10-22).
- DataGrid pills (`cells="pill"`) are size md, and carry a type icon only where it says something (a date, a number),
  never the generic text icon ("Tt").
### Fixed
- DataGrid: a pill column measures its text in the pill's medium weight, so names are not cut.

## [0.64.0] - 2026-10-22

### Added
- DataGrid `typeIcons`: the column type icon before each header title; on in a DataGrid, off in the static Table;
  `typeIcons={false}` hides them.
### Fixed
- DataGrid with `cells="pill"`: a column measures each pill with its padding, border and icon, so names are not cut.
- Table: columns fit their content like a DataGrid's (they took the minimum width and cut their headers).
- DataGrid: a content-sized column leaves room for the column menu button, so a hovered header is not cut.
### Changed
- Table: no column type icons (the "Tt" markers) by default.
- DataGrid: short content-sized columns are wider by the menu button's room; a grid scrolls inside itself sooner.

See docs/integration/data-grid.md for what the CDN does and what an application does (CTM, 2026-10-22).

## [0.63.1] - 2026-10-22

### Fixed
- CommandBar: no gray band. A bar at the top of a page has no background until content scrolls under it; only then it
  takes the page canvas (data-plx-stuck), so it no longer draws a gray strip on a white page (CTM, RedSave P-30, #162).

## [0.63.0] - 2026-10-22

### Added
- `Stack` `equal`: every child as wide as the widest, for stacked buttons (owner, 2026-10-22). The Stack shrinks to its
  widest child and each Button takes its whole width; with `align="end"` or `"center"` the Stack itself sits at the end
  or in the middle.
### Changed
- EntityHeader `actionsLayout="column"`: the stacked actions sit at the end and are each as wide as the widest action
  (they filled the aside's width).

## [0.62.0] - 2026-10-22

### Added
- EntityHeader `actionLabels="text"`: the actions as buttons with their icon and label (default `"icon"`: icon buttons
  with the label as tooltip). The More button takes its label too.
- EntityHeader `actionsLayout="column"`: the actions stacked, each as wide as the aside (default `"row"`: side by side).
- EntityHeader `control`: a control that sets the entity's state (a SegmentedControl for Draft · In session ·
  Adjourned, a Select), in the aside above the actions.
- Menu context hook `--plx-comp-menu-context-anchor-width` (a full-width trigger).
### Fixed
- EntityHeader: actions that do not fit now fold into More (the row never wrapped, so nothing folded).

## [0.61.0] - 2026-10-22

### Added
- `AppHeader.Account` `strings`: the account menu's words for another language (`trigger` with `{name}`, `menu`,
  `myAccount`, `settings`, `appSettings` with `{app}`, `app`, `density`, `compact`, `standard`, `comfortable`,
  `signOut`); English by default. Issue #245.
- Icons `mic`, `mic-off`, `audio`, `volume`, `volume-off`, `headphones` and `voice` (Material Symbols Sharp, unedited).
  Issue #246.
- `Stack` `gap="section"` and `--plx-sys-space-section` (24px): the space between unframed peer sections, each a
  heading over its content in `<Stack gap="sm">`; the same in a page or a split pane, at every density, in either
  reading direction and on phones. Issue #242.
### Changed
- Avatar in the dark theme: an avatar with no color of its own is gray-800 (the dark surface) with gray-300 initials in
  its gray border, as it is white with gray initials in light (was blue-300 with black initials). Issue #205.

## [0.60.3] - 2026-10-22

### Changed
- DataGrid: a column without a width fits its content up to 360px (`--plx-comp-data-grid-auto-max-width`); longer text
  ends in an ellipsis with the full text on hover, and the last such column takes the room left, so the grid fills its
  width instead of scrolling sideways. Column widths of existing grids change: the room that is left now goes to the
  last column instead of being shared (owner, 2026-10-22).
### Fixed
- DataGrid header: the column menu button and the sort arrow overlapped by 6px; they now have a 4px gap, and the title
  stops before the button (`--plx-comp-data-grid-popup-button-inset`, `--plx-comp-data-grid-title-reserve`).
- DataGrid: a content-sized column measures its header in the header's font with its type icon, so its title fits.

## [0.60.2] - 2026-10-22

### Fixed
- Input: a date or a time (`type` date, time, datetime-local, month, week) is never narrower than its value, whatever
  its `width` or column; `width="sm"` used to cut a date to "mm/d". Text and number fields keep their widths.
- Design spec: the SM text field no longer says it is for dates; a date or a time goes in a Field at full width, or
  `width="lg"`. Input's documentation says the same.

## [0.60.1] - 2026-10-22

### Changed
- Avatar: an avatar with no color of its own is white with gray-700 initials inside its 1px `border-default` gray
  border (was blue-600 with white initials), in the light theme (owner, issue #241). Avatars with `color`, `category` or
  `gender` keep their soft fills. The dark theme is unchanged until the dark-mode pass.

## [0.60.0] - 2026-10-22

### Added
- `Card` `icon`: an icon name or element before the title, like `Panel`'s (decorative; tokens
  `--plx-comp-card-icon-size`, `--plx-comp-card-icon-color`). Issue #240.
- `DocumentViewer` `onError({ reason, cause })`: `reason` is `engine` (PDF.js did not load), `access` (the document is
  missing, denied or blocked), `parse` (not a readable PDF) or `render` (a page could not be drawn). Issue #239.
- Size tokens `--plx-ref-size-260px`, `380px`, `420px`, `440px`, `460px`, `480px`, `520px`, `640px`, `760px`, `800px`,
  `860px`, and a spec check (`check-spec.js` `sizes`) that fails on a size token the spec names but does not define.
### Fixed
- `DocumentViewer` on the CDN: PDF.js 4.10.38 (module, worker, license) is published at `/cdn/<version>/vendor/pdfjs/`
  (hashed in the manifest) and in the npm package, and is found beside `plenix.js` instead of on the consuming app's
  server. Serve it as `text/javascript`; allow it in `script-src` and `worker-src`. Issue #238.
- `DocumentViewer`: one message per failure (never the document's address or the server's error); no "Page 1 / 0":
  the page counter, page buttons and zoom show once a document has pages. Issue #239.
- Design spec: the Object / record page previews (EntityHeader drew as a 41px strip) and about 250 other previews
  get the width they ask for. Issue #243.
### Changed
- Resizable panes and DataGrid column widths snap to the nearest size token, so drags and arrow-key steps now also
  stop at the new sizes (for example 420 and 440px between 400 and 480). Default sizes do not change.

Apps to check: a PDF viewer that set `pdfModuleUrl`/`pdfWorkerUrl` only to work around the CDN can drop them.

## [0.59.0] - 2026-10-22

Released on the owner's word before the Styling program's final checks; the full proof and the visual check of every
change run at the end of the program.

### Added
- Typography: text roles as typography tokens, declared text contracts and the text-contract check (Styling Standard,
  Phase 4). Every text part sets one whole role; Mono is a switch on every role.
- Zero overlap (Styling Standard 3.5): flat selectors, one declaration per property per element and condition, state
  variables, and context values (`--plx-comp-*-context-*`). New: the selector-kinds check, the strict clash audit and
  `--plx-sys-scrollbar-width`, `--plx-sys-touch-hidden`, `--plx-comp-button-context-min-height`.
- DataGrid: grouping across collection field types; collection-owned view state shared with the header actions.
- Design spec: the native guidance for collection view state; the Web page template check.

### Changed
- DataGrid and Table carry no overlapping rules (batches 1-7). Table is the engine's static mode: its base stylesheet
  is generated from the DataGrid's. No visual change, proved grid by grid in every state.
- Context hooks replace every rule that reached into another component (Styling Standard, Phase 2): Icon, Field,
  Button, Tag (Chip and the tag-input add button are Tag modifiers), joined controls, content that follows the
  surrounding text (`data-plx-text-follow`).
- Each component owns its motion and its selected icon; layout modes, theme, density, interaction, print, forced colors
  and more contrast are exclusive token blocks. `nesting.css` is retired.
- Design spec: plain, direct wording on every page by the owner's seven rules; the owner's 322 decisions on the open
  questions applied; rows that only say "Not applicable" are hidden. Merged pages: Audio player into Media player,
  Presence indicator into Availability indicator, Modal trigger into Dialog trigger (the old addresses open the home).
- The Table and DataGrid rule: a dynamic table (sort, filter, group, search) is the DataGrid; a static table is the
  Table, which looks the same.
- DataGrid performance: search predicates evaluated once per record; overlapping rows, custom cells and sort and width
  work reused; row menus built on demand; SplitView grids measured and bounded on their own.

### Fixed
- DataGrid: a custom cell's content (badges, icons, switches) sits in the middle of its cell; it sat 0.5 to 1.1px low
  (owner-approved visual change).
- DataGrid: the row-menu column is solid with a start line; the checkbox column ends in its own line.
- Text body and caption follow their context's weight and line height again.

Apps to check: CSS that set a component's internals from outside (now context hooks), and custom DataGrid cells.

## [0.58.0] - 2026-10-19

### Added
- `Resizable` `variant="divider"`: the edge is the whole gap to the next panel, with a line down its middle and a pill
  on it (`--plx-comp-resizable-divider-*`; its width is `--plx-comp-resizable-divider-size`, which a container may set
  on its own element). `Resizable` `fill`: the content is a column its children fill.
- `tests/compare-styles.js`: compares one component's elements, property by property, between two copies of the
  repository, for pages whose documentation changes with the stylesheet.
### Changed
- SplitView no longer styles Resizable's parts (Styling Standard, Phase 2): its first panel is
  `<Resizable variant="divider" fill>`, and it sets the divider's width to its gap. Tokens
  `--plx-comp-split-view-line-*`, `-handle-*` and `-active-color` are now `--plx-comp-resizable-divider-*`.
  No visual change: SplitView's and Resizable's examples are identical (tests/compare-styles.js against 0.57.4).
  Apps to check: CSS that set the old SplitView divider tokens.
- `tests/clash-audit.js --check` reads a differing design-system page once more on its own before reporting it.

## [0.57.4] - 2026-10-19

### Changed
- **Context hooks instead of selectors into children** (Styling Standard 4.1, Phase 2). A container sets a value on its
  own element and the child reads it; no rule selects the child any more:
  - Button reads `--plx-comp-button-context-height` and `--plx-comp-button-context-icon` before its size. Toolbar,
    AppHeader, FilterBar, the Dialog footer and NavList actions set them (were `.plx-toolbar .plx-button` and similar).
    Nothing declares them globally. Apps to check: CSS that set `--plx-comp-button-height` on a container should set
    `--plx-comp-button-context-height`.
  - Icon sizes in Button, Panel, EmptyState, InlineEdit, NavList, SearchField, TagInput and the app switcher are set on
    the slot that holds the icon (was `<slot> .plx-icon`).
  No visual change: the computed style of every element is unchanged on the 14 application pages and on 65
  design-system pages (233,874 elements); on 8 documentation pages only the listed CSS (and the tables, tab counts
  and panels holding it) differ.
### Added
- `tests/clash-audit.js --ds` covers 65 design-system pages, four tabs at once, each route loaded afresh; a page whose
  element count differs is compared before and after the differing stretch.

## [0.57.3] - 2026-10-19

### Fixed
- DataTable: going from one design-system page to another could crash the whole page ("Cannot read properties of
  undefined (reading 'name')", e.g. Color → Application header). For one render after its data changes, the table can
  still draw rows of the data it replaced; those rows no longer take the row-drag props or the move handle.

## [0.57.2] - 2026-10-19

### Changed
- **MediaCard has its own classes** (Styling Standard, Phase 2): `plx-media-card--interactive` (was Card's
  `plx-card--interactive`) and its title is its opener (`plx-media-card__title`, no longer also Card's
  `plx-card__opener`). Card's motion, hover shadow and target tokens are reused, not its classes. No visual change
  (`tests/clash-audit.js --check`: no element changed, 8 clashes gone; the media card, card and file list design-system
  pages are pixel-identical). Apps to check: CSS or scripts that select `.plx-media-card.plx-card--interactive` or
  `.plx-media-card .plx-card__opener`.
- The design system's Media card page shows the "Opens (interactive)" card.

## [0.57.1] - 2026-10-19

### Changed
- **Table is the DataTable's static variant in one stylesheet** (Styling Standard, Phase 2). Table's rules moved from
  `components/Table/table.css` into `components/DataTableNext/data-table-static.css`, under the DataTable's own
  modifier `plx-data-table--static` (was the class `plx-table`), with the same specificity and cascade position;
  its generated steps are `data-table-static-steps.css`. No visual change: the computed style of every element is
  unchanged on the 14 application pages and on 12 design-system pages full of tables (52,805 elements; only the documentation text naming the renamed file and the removed class differs).
  156 cross-component clashes are gone; 80 of them are now the static variant repeating a DataTable value, removed
  with the redundancy pass (Phase 3). Apps to check: CSS or scripts that select `.plx-table` should use
  `.plx-data-table--static`.
### Removed
- Three rules for `plx-table--fill`, a class nothing sets.
### Added
- `tests/clash-audit.js --ds`: the computed-style proof on design-system pages (`tests/baselines/computed-ds.json`).

## [0.57.0] - 2026-10-19

### Added
- `Toolbar` `variant="bar"`: one row that never wraps, with fixed gaps that density does not change
  (`--plx-comp-toolbar-bar-group-gap`, `--plx-comp-toolbar-bar-control-gap`).
### Changed
- CommandBar no longer restyles Toolbar from outside (Styling Standard, Phase 2): its rows are `Toolbar variant="bar"`,
  and its own rule keeps only the row's flex sizing. No visual change (`tests/clash-audit.js --check`: no element
  changed, 5 clashes gone). Tokens `--plx-comp-command-bar-side-gap` and `--plx-comp-command-bar-group-gap` are now
  the Toolbar bar tokens above. Apps to check: CSS that set either old token.

## [0.56.1] - 2026-10-19

### Fixed
- The design system shows ActivityList's `titleLines` variant ("Title lines: Two lines") on the Activity stream page.

## [0.56.0] - 2026-10-19

### Added
- `ActivityList` `titleLines`: `2` lets the title wrap onto two lines, in regular weight (unread titles stay semibold).
### Changed
- NotificationList no longer restyles ActivityList's title from outside (Styling Standard, Phase 2): it passes
  `titleLines={2}`. No visual change (`tests/clash-audit.js --check`: no element changed, 7 clashes gone).
  Token `--plx-comp-notification-list-activity-list-title-font-weight` is now
  `--plx-comp-activity-list-title-2-font-weight`; `--plx-comp-notification-list-activity-list-item-unread-title-font-weight`
  is removed (it repeated ActivityList's own unread weight). Apps to check: CSS that set either old token.
- `tests/clash-audit.js --check` lists a new overlap of an owner's own variant or state over its base (approved by the
  standard) and fails only on unapproved ones.

## [0.55.2] - 2026-10-19

### Changed
- **App Header sizes come from the components' own props** (owner, 2026-10-18; Styling Standard, Phase 1). The account
  avatar is `Avatar size="md"` (32px, initials 12px, was 11px inside a 32px box). The header's icons are
  `Icon size="lg"` (24px): `AppHeader.Item` gives an Icon without a size `lg`. The header no longer sizes the Avatar
  and Icon from outside (`.plx-app-header__item .plx-avatar`, `.plx-app-header__item .plx-icon` removed).
  Apps to check: an icon given to `AppHeader.Item` as something other than an `Icon` sizes itself.
### Removed
- Token `--plx-comp-app-header-avatar-size` (the avatar's own md size replaces it).

## [0.55.1] - 2026-10-19

### Changed
- **App Header, one owner per property** (Styling Standard, Phase 1). No visual change: the computed style of all
  7,215 elements on the 14 application pages is identical (`tests/clash-audit.js --check`).
  - The application switcher is the brand with a modifier: `plx-app-header__brand plx-app-header__brand--switch`
    (was `plx-app-header__switch`). The brand's rules are one rule; the modifier sets only what a button adds.
    Apps to check: CSS that targets `.plx-app-header__switch` should target `.plx-app-header__brand--switch`.
  - The account item's hover and current backgrounds are set by value (`--_app-header-item-hover-background`,
    `--_app-header-item-current-background` on `plx-app-header__item--account`), not by 0,3,0 selectors.
  - The switch chevron keeps the icon's own no-shrink; the main region's minimum sizes belong to AppShell
    (`.plx-shell-main` keeps only its container).
### Removed
- Tokens `--plx-comp-app-header-brand-padding-inline-start`, `-brand-padding-inline-end` and
  `--plx-comp-app-header-switch-gap`: always overridden, never shown.
- `tests/baselines/clashes.json`: 11 clashes fewer (728 → 717).

## [0.55.0] - 2026-10-19

### Added
- **The Plenix Styling Standard** (`platform/standards/styling.md`, owner approved 2026-10-18): one owner per property,
  how a parent changes a child (props, slots, published hooks), text contracts, the state matrix, cascade layers
  without `!important`, the specificity ceiling, the `className` policy, the composition levels (pages are a template
  filled with patterns) and the recipes for a component and a page. Shown in full on 14 › Engineering guidance ›
  CSS architecture.
- check-system rule `ownership`: fails on a new selector that reaches into another component and on a new
  `!important`. Today's backlog (301 selectors in 65 files, 464 `!important` in 6 files) is listed in
  `check-system.exceptions.json`, which only shrinks (`node check-system.rules/ownership.js --shrink`).
- `tests/clash-audit.js`: the clash inventory and computed-style baseline of the 14 application pages
  (`tests/baselines/clashes.json`: 7,215 elements, 728 distinct clashes, classified; `computed.json`); `--check`
  proves a repair changed no element.
- `List.Item` `variant`: the nested list's variant (`bullets` for points under a statement).

## [0.54.3] - 2026-10-18

### Removed
- The role classes `plx-font-data` and `plx-font-code` (owner: no unnecessary classes). Their few uses take the data
  font from what already exists: a grouped table's count and summary from their own elements and the table's data-font
  token; a data column's group value from its kind (`data-plx-kind="data"`, both table engines); the Asset Manager's
  extensions field from the field's own option. Apps to check: an app that used either class should use Text
  variant="data", a field's `data` option, or a component's data kind.
### Added
- `Textarea` `data`: technical text in the data font, as `Input` `data` (the existing `plx-input--data` class).

## [0.54.2] - 2026-10-18

### Removed
- The font utility classes `plx-u-font-body`, `-code`, `-data`, `-mono`, `-sans` (owner: inconsistent; fonts come by
  role from components and text styles, never from a class added on the spot). No app or component used them. Apps to
  check: a page that used one should use the component or role it means (Text variant="data", code, the role classes
  plx-font-data / plx-font-code).

## [0.54.1] - 2026-10-18

### Fixed
- Fonts are consistent everywhere (audited on all 11 apps and the design system's token and type pages): only DM Sans
  and Reddit Mono render; every Reddit Mono text has the fitted word spacing and no DM Sans text inherits it.
  - Every rule that sets DM Sans now also sets `word-spacing: normal` (126 rules): a DM Sans tag inside a Reddit Mono
    cell had inherited the monospace spacing. check-system rule `mono-spacing` now covers both fonts.
  - The `plx-u-font-mono` utility lacked the monospace word spacing (its token is a typeface token).
  - The design system's font samples (the typography page) take their font's word spacing, also at each line's own size.
  - The TanStack table measures data columns with the data font and its word spacing (auto widths and Fit to content;
    the fit had measured every column in DM Sans).
### Removed
- DM Mono: its font files, license, @font-face rules, the old DM Mono study page (docs/font-study opens the playground).
### Changed
- The font utilities (`plx-u-font-*`) no longer use `!important`.

## [0.54.0] - 2026-10-18

### Changed
- **The code and data font is Reddit Mono** (owner, 2026-10-18; docs/font-study/playground: the closest monospace match
  to DM Sans, 98.8%). DM Sans never changes and every element keeps its px size: Reddit Mono's @font-face has
  `size-adjust: 97.1%`, so at the same font-size its x-height, capitals and figures match DM Sans's (99–100% on a 1.5×
  screen), and its stroke matches at Regular (99.8%; 92–94% at Medium and Semibold). Reddit Mono is variable (200–900),
  so no weight is faked. Self-hosted in platform/fonts (OFL 1.1).
- Every rule that sets the monospace font also sets `word-spacing: var(--plx-sys-font-data-word-spacing)` (−0.279em,
  `--plx-ref-word-spacing-mono-fit`): a space as wide as DM Sans's. check-system rule `mono-spacing` keeps it so.
- `--plx-ref-font-mono` starts with "Reddit Mono"; the docs, standards, native design data and tests name it. DM Mono
  stays declared only for the font study. Apps to check: an app that names "DM Mono" itself should use the token.

## [0.53.9] - 2026-10-18

### Changed
- Font playground: each Fit button says what it changed ("Size: 13px → 12.625px", or "already the closest"), announced
  politely; before, a fit that changed nothing looked like it did nothing.

## [0.53.8] - 2026-10-18

### Fixed
- Font playground: the overlay is sharp text again (owner: no pixelation), with the owner's line "This is a nice test,
  7373652891", four times larger. Each font is sized so its letters are four times as tall as they really draw at the
  chosen size on the viewer's screen, so the overlay matches the side by side.

## [0.53.7] - 2026-10-18

### Fixed
- Font playground: the overlay now shows the real pixels (owner: it did not reflect the side by side). Both fonts are
  drawn at their real size on the viewer's screen, on one baseline, and enlarged six times pixel for pixel; before, they
  were drawn at six times the size, where the fonts' small-size pixel snapping no longer applies.

## [0.53.6] - 2026-10-18

### Fixed
- The published study pages (the font playground and study, composition, reading pane) showed unstyled: platform.css's
  two hundred imports tripped the server's request limit (429). On the server they now load the one bundled stylesheet,
  as the design system does.

## [0.53.5] - 2026-10-17

### Changed
- Font playground: word spacing (owner). A Word spacing slider, a "Space between words" row in the match, and Fit word
  spacing (the space made exactly as wide as DM Sans's); Fit now sets size, weight and word spacing together. DM Mono
  fitted at DM Sans 13px/400 on a 1.5× screen: 12.375px, 400, word spacing −0.319em, 96.5% (lines 90.9% as wide).

## [0.53.4] - 2026-10-17

### Fixed
- The study pages are published: docs/font-study (the font study and the playground), docs/composition and
  docs/reading-pane-study, at /Plenix/docs/<study>/ (deploy.sh did not include docs/).

## [0.53.3] - 2026-10-17

### Added
- docs/font-study/playground.html: the font playground (owner). DM Sans is the reference (choose its size and weight);
  pick one of 18 monospace fonts and move its size (1/8px steps), weight, width and spacing; heights, stroke and width
  are measured live on the viewer's own screen (its pixel ratio, so hinting shows as it draws), with a match percentage
  and Fit buttons. On a 1.5× screen at DM Sans 13px/400: Iosevka 12.375px/500 matches 98.7%, Reddit Mono 95.4%,
  Geist Mono 95.0%, DM Mono 93.7%.
### Fixed
- The design system's lab and spec stylesheets referenced a letter-spacing token that was never released (swept into
  0.53.1 by mistake); the references are gone and the files are as they were in 0.53.0. No visible change.

## [0.53.2] - 2026-10-17

### Changed
- docs/font-study: the two DM Mono options side by side with DM Sans, measured live on 17 technical values: option 1
  (−0.07em, spaces 0.3em) is 2% narrower than DM Sans overall, w, W and % touch; option 2 (−0.02em, spaces 0.3em) is 6%
  wider, nothing touches; a 48px close-up of the touching letters. Nothing in the Platform changes yet.

## [0.53.1] - 2026-10-17

### Added
- docs/font-study: DM Sans and DM Mono measured at the same size (owner). The letters already match (x-height 0.496,
  capitals 0.700, figures 0.711, stems 0.084 of the size); DM Mono is wider (0.60 em per character: 13% wider than
  DM Sans figures, 26% wider than its words). Four options on one line, for the owner to choose.

## [0.53.0] - 2026-10-17

### Changed
- The static `Table` runs on the TanStack renderer (#142): every row drawn, nothing interactive, and it never scrolls
  (owner): as tall as its rows, wrapped text grows its row, the columns share the width they are given.
- AuditLog, FileList, ImportWizard, PermissionsEditor, RenditionList, ReviewFlow and the Account and page templates use
  the TanStack `DataTable` with the Plenix callbacks; the design system's own tables (DS.grid, the labs' matrices) too.
  No page of the design system loads the legacy grid now; only `LegacyDataTable` (the existing apps) does, on demand.

## [0.52.0] - 2026-10-17

### Changed
- Filled fields (`appearance="filled"`) have the outline field's border and corners on a gray fill, the value in dark
  gray (`--plx-comp-input-filled-text`); before, only a line under the value.
- An invalid field has a 2px danger border (its border and a line inside it, so the value does not move) on the
  lightest red fill (`--plx-comp-input-invalid-background`, `--plx-comp-input-invalid-inner-width`).
- Switches have the text field's corners (`--plx-comp-switch-track-radius` → `--plx-sys-radius-control`, the knob
  `--plx-sys-shape-xs`); before, pill-shaped.
### Removed
- The underline field appearance (`appearance="underline"`, `.plx-input--underline`, the `input-underline-*` and
  `input-filled-end-radius` tokens). Apps to check: a field with `appearance="underline"` now draws as an outline field.

## [0.51.3] - 2026-10-17

### Fixed
- The design system's "All …" variant pages draw again (Illustration, Button and every component lab): the static
  Table in a lab's frame showed its header and no rows, because the legacy grid in the frame rejected an empty-state
  placeholder made in the page's document and stopped drawing. The placeholder is now made in the grid's own document.

## [0.51.2] - 2026-10-17

### Changed
- The design spec reads in bullet points (owner, 2026-10-16): any text of two or more sentences is a bulleted list, one
  sentence each, whatever its length (notes included); in a Name / Value table, once one value is a list every value is
  (Behavior: Mouse and touch, Density, Motion, Loading, Error now match Responsive); lists of parts and rules have bullet
  markers. A sentence may start with a file or token name (build-tokens.js, platform/tokens/…).

## [0.51.1] - 2026-10-17

### Fixed
- The header's menus (the app menu, the account menu) always draw above the page: the header sits on the menu layer
  (`--plx-comp-app-header-z-index` → `--plx-sys-layer-menu`), above every sticky bar of the page (the command bar, a
  toolbar), still below overlays, dialogs and toasts. Before, a sticky command bar later in the page covered the open
  app menu (Files).

## [0.51.0] - 2026-10-16

### Changed
- **`DataTable` is the TanStack table** (owner, 2026-10-16: the legacy grid performed badly; the design spec documents only
  the TanStack table, and new applications are built on it). Same props and look; Plenix callbacks
  (`onRowClick(record, event)`, `onRowDoubleClick`, `onCellEdit(record, change)`), `tree`/`treeColumn`/`treeExpanded`,
  `groupBy`, `sort`, `movableRows`/`movableColumns` as props. `DataTable.useActions` and `DataTable.preload` stay.
- The design spec no longer documents the legacy grid: the Data table page, its guidelines, the Table page and the layout lab
  describe the TanStack table; every example uses the Plenix props.
### Deprecated
- `LegacyDataTable`: the legacy grid table, kept only for the existing applications until they move (they import it
  under their local name DataTable; nothing changes for them). Apps to check: an app that imports `DataTable` and
  passes the legacy grid `options`, `on` or `onReady` should import `LegacyDataTable` until it moves to the Plenix props.

## [0.50.0] - 2026-10-16

### Added
- The TanStack table is complete (#128, #140): `DataTableNext` has every DataTable capability (nested and multi-value
  grouping with summaries, tree rows, editing, moving rows and columns, load-more, copy, print, the floating
  scrollbars, every cell kind), its own `plx-data-table__*` markup and stylesheet (`data-table-next.css`, on the
  existing data-table tokens, the same look), and Plenix callbacks (`onRowClick(row, event)`, `onRowDoubleClick`,
  `onCellEdit`). On 600 rich rows it opens in 24–92 ms (the legacy grid 90–159 ms).
- `DataTable engine="next"` renders the TanStack table with the same props (opt in per table; the default is unchanged).

## [0.49.0] - 2026-10-16

### Added
- `DataTableNext` (#128, phase 1): the table on TanStack Table and TanStack Virtual (MIT, bundled into platform.js):
  the same props and look as DataTable, with rendering, virtual scrolling, sort, filter, selection (hidden selection
  too), column order, visibility and widths, pages, the narrow list, menus, keyboard and saved views. Measured on 600
  rich rows it opens in 24–45 ms (the legacy grid 100–206 ms) and sorts and filters 2–4× faster. The design system shows it
  beside DataTable with `?engine=next`. Phase 2 (grouping, tree rows, editing, moving, load-more, copy, print) follows.
### Changed
- DataTable (the legacy grid, #126 option B): the view is built into the table at creation (order, hidden columns, sort,
  filters), later view changes redraw once, and the geometry patches are gone; frozen columns fixed. The runtime style
  audit accepts inline sizes that equal a token on the grid and 1px lines equal to the border-width token.

## [0.48.0] - 2026-10-16

### Changed
- The palette is 70 colors (the owner's revised chart, #124): 70 canonical colors in 12 families, every family darker
  by number; the 13 retired colors are aliases for one release. No new hex values.
- Light `status-away` is brown-600 #765600 (3:1 kept).
- The Brown category is retired: Orange is the one category (19 categories); `category-brown*` are aliases of
  `category-orange*` for one release. Lime and the Blue category stay.
- A category border never equals its base: light and dark cyan and pink borders take their family's 700, light
  lavender purple-500. docs/palette.md and docs/pills-and-colors.md regenerated.

## [0.47.0] - 2026-10-16

### Added
- TypeScript declarations on the CDN (#130): every version ships `plenix.d.ts` beside `plenix.esm.js`, listed in
  `bundle-manifest.json` and included in the tgz; the build fails when a public export has no declaration.
- QuickFilter `required` for single-choice filters (#131): no All option and no clear; the first option is the value
  when none is set, and a saved view restores it.
- The command bar folds its quick filters (with their counts) and end controls into More as it narrows (#132).
- MediaCard `aspect` "9/16" and "3/4" (#133); mixed shapes in a grid keep their footers aligned.
- MediaViewer shows video items; MediaPlayer `audio` plays a separate sound track in sync with the video (#134).

## [0.46.0] - 2026-10-16

### Added
- Range selection in card grids (#51): `MediaCard.onSelectChange(checked, event)` now passes the click, so a grid can
  hand it to `useSelection().choose(key, event)`: a click toggles a card, Shift extends from the last one picked, Ctrl
  or ⌘ toggles one. FileBrowser's grid and the Asset Manager's search grid use it.
### Changed
- FileBrowser's grid selection runs on `useSelection` (the shared selection model). RowButton (a native button) and Tree
  (its own roving tree focus, the ARIA tree pattern) already follow the shared focus rules and keep their code.

## [0.45.1] - 2026-10-16

### Fixed
- NavList: a static group heading (`collapsible: false`) has the collapsible heading's geometry: 32px tall (the
  prominent control height), its text centered, 8px under it (#49; it was 25px with nothing under it). Tokens
  `--plx-comp-nav-list-heading-min-height`, `--plx-comp-nav-list-heading-margin-block-end`.

## [0.45.0] - 2026-10-16

### Changed
- `SplitWorkspace` is built on `SplitView` (it was MasterDetailPage under another name): the list and the chosen item
  share the page, side by side or stacked, with the divider between them. The list is `rows` and `columns` (a
  DataTable) or `pane` (framed as a ReadingPane titled `paneTitle`); the item is `children` in a ReadingPane while
  `detailOpen` (now default true), else `empty` (default: an EmptyState, "Nothing selected"); new props `actions` (the
  reading pane's actions row), `toolbar` (a CommandBar above both), `orientation`, `defaultSize`, `size`,
  `onSizeChange`. Apps to check: `onBack` is no longer used (both panels show at once; under 900px they stack).

## [0.44.0] - 2026-10-16

### Added
- `Heading` (GitHub #56): the title of a page (`level={1}`, 20px bold) or a section of it (levels 2–4: 18, 15, 13px
  semibold; 5 and 6 draw like 4), in the heading font. The level is the outline (it renders h1–h6); `size` changes only
  the look. Tokens `--plx-comp-heading-*`; classes `plx-heading`, `plx-heading--size-1…4`. The design system's Heading
  page shows it beside SectionHeading (the small uppercase group label).

## [0.43.0] - 2026-10-16

### Added
- The composition standard (owner, 2026-10-16, GitHub #55), in platform/standards/layout.json: each kind of page lists
  its regions in order, each region the patterns it is built from, the "what is this region?" guide, and the fields
  rule. Published as `PAGE_REGIONS`, `COMPOSITION_GUIDE`, `FIELD_RULES` (and `PAGE_LAYOUTS[kind].regions`); drawn live
  at docs/composition/ with a reference screen (Posts: one command bar instead of a stack of selects).
- check-system rule `composition`: a field (Input, Select, Combobox, SearchField, the pickers …) outside a pattern that
  sizes it is an error. It follows a screen's own helpers (a Row that wraps a SettingsRow, a component that returns a
  field, a dialog's step components).
- Field `hideLabel`: the label stays for screen readers and still labels the control, but is not drawn.
### Changed
- Fields are layout-neutral: `.plx-input` and `.plx-select` take their natural width; in a "stretch" pattern (Form,
  Field, a fieldset, a settings row, a dialog, a sheet, a side panel, a popover, an inline edit, a find panel, a wizard)
  they fill their column; in a "content" pattern (CommandBar, Toolbar, DataToolbar, FilterBar, ActionBar, AppHeader) they
  keep their natural width; an Input's own `width` wins. Apps to check: a field placed loose in a page now shows its
  natural width (check-system names each one). In Plenix's own apps every field already sits in a pattern; the notes
  text, the search page, two Asset Manager title fields and its category filter are now in a Field (hidden label), with
  the same look.

## [0.42.1] - 2026-10-16

### Fixed
- Task priority in the Dashboard and Tasks: the word is the row's 12px secondary text (it was 13px beside 12px titles and
  dates) and sits on the row's baseline (it was 3.75px off); the icon is centered on the word. Found by Codex.
### Added
- Utility plx-u-self-center (align-self: center), beside plx-u-self-start and plx-u-self-stretch.

## [0.42.0] - 2026-10-16

### Added
- By Codex (PRs #119–#123; CI blocked by billing, checked by the integrator):
  - Wave 14 A: PromptInput, StreamingText, AIChat, AssistantPanel (on the wave 14 B and C AI parts; no AI color).
  - Wave 15 A: page templates, analytics (opt-in, no network by default), the Angular and Figma packages.
  - RedSave fixes: one self-hosting bundle per version on the CDN, `size="sm"` on Combobox, Select, Input and
    SearchField, Toolbar spacing and focus with wrapped children, muted navigation items in the muted color, the
    "select or create" docs.
  - DataTable, the rest of RedSave's list: grouping by a multi-value field, faceted quick-filter counts, `narrowAt`,
    `empty` and the deleted look, `type: "bytes"`, undo on destructive actions, built-in avatar/tags/badge cells, widths
    as CSS lengths or size tokens, checkbox labels kept through view changes.
- Codex task #126: the DataTable on the legacy grid the normal way (option B), after the owner's choice.
### Fixed
- The Vue package's ESM declarations and the lint package's source dependency (#121).

## [0.41.1] - 2026-10-16

### Fixed
- The applications' page bundles carry the status-dot change of 0.40.1 (bookmarks, calendar, contacts, files, messages,
  notes, projects and settings had kept their earlier bundles).
### Added
- Codex task #124: the palette to 70 colors (the owner's revised proposal, docs/color-consolidation/).

## [0.41.0] - 2026-10-16

### Added
- SplitView and ReadingPane (02 Page structures › Split workspace; owner, 2026-10-16): two panels that share their room,
  `orientation="side-by-side"` (default) or `"stacked"`, both the full height (or width) of the page, each scrolling on
  its own; the divider between is the whole gap (a thin line down its middle and a pill centered on it, the resize
  pointer anywhere along it; arrow keys, Home and End); side by side stacks under 900px of its own width. ReadingPane:
  the data table's frame, an actions row with a thin line under it that stops short of the edges, the item below.
  Tokens: platform/tokens/components/split-view.tokens.json. Design system: Split view, with Side by side and Stacked.
- docs/reading-pane-study: the Outlook-style demo on SplitView, two pages and no switches (index.html side by side,
  stacked.html stacked).
### Removed
- The size menu (Narrower, Wider, Reset, Collapse) on Resizable and PanelSplitter, also for touch (owner, 2026-10-16):
  edges are dragged or moved with the keyboard. Its tokens (resizable-menu-*, panel-splitter-menu-*) are gone;
  PanelSplitter's `defaultValue` prop is no longer used. Apps to check: none used the menu directly.

## [0.40.8] - 2026-10-16

### Fixed
- docs/reading-pane-study: the divider's pill sits on the middle line of the gap (it took the offset of Resizable's own
  hover line and sat against the reading pane's border).

## [0.40.7] - 2026-10-16

### Changed
- docs/reading-pane-study: the divider follows reui.io's Resizable (owner's examples, 2026-10-16): a 1px line the full
  length of the gap and an 8 x 32px rounded pill centered on it, in the table's border color; the whole gap is the
  target with the resize cursor; the pill darkens on hover; line and pill take the focus color when focused or dragged.

## [0.40.6] - 2026-10-16

### Changed
- docs/reading-pane-study: the divider is the whole gap between the panes (owner, 2026-10-16, option B): the resize
  cursor anywhere along it, and a grip of three solid 4px dots in its middle, the strong border color at rest and the
  focus color while hovered, focused or dragged.

## [0.40.5] - 2026-10-16

### Fixed
- docs/reading-pane-study: the thin line under the reading pane's actions shows (it took a border-width role that does
  not exist, so it was 0px); it uses the table's border width and stops 16px short of each edge.
- The local preview server no longer stops after 15 minutes (.claude/launch.json lifts the test time limit for it).

## [0.40.4] - 2026-10-16

### Changed
- docs/reading-pane-study (owner, 2026-10-16): the divider is a handlebar, after prototypr's "Handlebars in UI design": a
  pill in the middle of the gutter, no line; only the handle grabs (16 × 48), the drag then follows along the axis, and
  the list snaps to set widths (360–720px) or heights (200–500px); the handle darkens on hover and takes the focus color
  when focused. The reading pane's actions sit in their own row with a thin line under them, inset from the pane's
  edges.

## [0.40.3] - 2026-10-16

### Changed
- docs/reading-pane-study, after the owner's review (2026-10-16): the table and the reading pane fill the window's height
  and match it, each scrolling on its own; a divider between them resizes (a line with a grip, the focus color on hover
  and focus; drag, arrow keys or the size menu); stacked, both are the full width; the reading pane takes the table's
  frame (its border, corners and width tokens); the command bar spans both panes, as Outlook's ribbon does.

## [0.40.2] - 2026-10-16

### Added
- docs/reading-pane-study: an Outlook-style layout drawn live with Platform components (owner, 2026-10-16): the header
  row, the navigation pane, a table, and the selected item's reading pane, with Outlook's switches (reading pane
  right, bottom or off; one-line or two-line rows) and the pane going under the list when there is no room. A study for
  the owner, not a Platform part yet.

## [0.40.1] - 2026-10-16

### Changed
- No status dots left in the applications (owner, 2026-10-14: a status is never a dot). By its place: the Asset
  Manager's status bar says "Library online" with the success icon; the current version in the inspector has a
  "Current version" badge with its icon; task priority (Tasks, Dashboard) is its icon and a short word ("High",
  "Medium", "Low"); a project's status in the navigation pane is its status icon with the status spoken. Shapes on
  avatars (presence) stay.

## [0.40.0] - 2026-10-16

### Added
- By Codex (PRs #113–#116; CI blocked by billing, checked by the integrator):
  - Wave 15 B: content lint, browser support, implementation records, the ActionBar extension; packages
    `@plenix-ds/vue` (typed bridges) and `@plenix-ds/lint` (ESLint and Stylelint adapters with the Plenix rules).
  - Wave 15 C: i18n (LocaleProvider, useLocale, createTranslator; dates no longer read as UTC), content guides,
    performance budgets; packages `@plenix-ds/web-components` (custom elements) and `@plenix-ds/mcp` (a read-only MCP
    server over the tokens and records).
  - Command bar (RedSave #20, #21, #23, #24): `actions[].loading`, `actions[].tooltip`, `sticky="auto"` by default (sticky
    only as a direct child of the page content), `actions[].panel` (a small form in a popover).
  - Developer experience (RedSave #13, #17, #18, #19): a development warning for unknown variant, tone and size values;
    the changelog, per-record docs and tokens.json on the CDN; platform/dev/token-check.js.
### Changed
- CommandBar: `sticky` defaults to "auto". A bar inside a card no longer sticks to the page; a page-level bar still does.

## [0.39.0] - 2026-10-16

### Added
- Card and Panel: `surface` ("flat" default, "glow", "inset") and `elevation` ("outline" default, "halo", "lifted",
  "floating"), in any combination (owner, 2026-10-15, the card builder). Halo, Lifted and Floating have no visible
  border and an even shadow with no offset; Glow fades the surface to a rim one step off it; Inset draws a soft 12px
  inner edge. New theme roles: shadow-halo, shadow-floating, card-surface-rim (gray-100; dark gray-900).
- Design system: the card builder on the Card page (choose a surface and an elevation; the card states its makeup,
  "Surface: Glow, Elevation: Halo"), every surface, every elevation, and all twelve combinations; Panel shows its
  surfaces and elevations.

## [0.38.0] - 2026-10-16

### Added
- Library wave 13, lane A (Claude): ProductCard and ProductPrice, ProductOptions (sizes, color swatches, quantity), and
  the Commerce templates (discovery, listing, detail, cart, checkout, payment form UI only, confirmation, orders,
  subscriptions, returns), each claiming its page kind.
- By Codex (PRs #102–#106, #109–#112, checked by the integrator; CI blocked by billing):
  - Wave 12 B: AssetGallery, DownloadManager, MediaPlayer, MetadataEditor, RelatedAssets.
  - Wave 12 C: AttachmentPicker, FilePicker, RenditionList, DocumentViewer, VersionHistory.
  - Wave 13 B: Comment, CommentThread, ImageAnnotation, PresenceBar.
  - Wave 13 C: MentionInput, Announcement, AuditLog, ApprovalWorkflow.
  - Wave 14 B and C (AI parts, existing roles and the sparkle icon only, no AI color): AILabel, GeneratedContent,
    PromptHistory, Citation, SuggestedAction, AISearch, Recommendation, AIButton, AIDisclaimer, ConfidenceIndicator,
    AIExplanation, PromptSuggestions, SuggestedEdit, RefineMenu, Thinking states.
  - DataTable (RedSave DT-1, 2, 3, 4, 9, 11, 17): a default sort, a visible row menu button, documented row-menu items,
    remembered views, text direction per cell, hidden selection counted, clicks on controls inside rows ignored.
- Native designs for all of them.
### Changed
- The other applications use the command bar (Codex, #110); the Asset Manager's Search workspace moved off BulkActions,
  which is deprecated (use CommandBar's selection state) and stays exported for one release (#109).

## [0.37.0] - 2026-10-16

### Added
- Library wave 12, lane A (files): FileList (list, table, sortable; rename, delete, drag onto folders with a Move to
  menu as the way without dragging), FileBrowser (breadcrumbs, the command bar, a tree in a resizable pane, list or
  grid, drop files from the computer to upload), UploadManager and useUploadQueue (type and size checked first, a few
  at a time, per-file progress and Cancel, Try again; panel, docked or dialog), VersionCompare and diffLines (side by
  side, slider, text diff with Previous and Next change).
- MediaCard: `type` and `typeIcon` (the format), `status` (a Badge with its icon), `stack` and `count` (a collection).
  Without them a MediaCard is unchanged.
- Native designs: iOS Outline views and Split views; Android Tree and Data table.

## [0.36.0] - 2026-10-16

### Added
- Library wave 11, lane B (built by Codex, #31, PR #99): ShareDialog (people, link, roles, Web Share), PermissionsEditor
  (roles × capabilities, per person), Tour (steps, skip, resume), Checklist, Onboarding (welcome, setup checklist),
  FeatureIntro (new badge, what's new), HelpPanel (search, articles).
- Library wave 11, lane C (built by Codex, #32, PR #100): ImportDialog, ImportWizard, ExportDialog, AccessRequest,
  TrialUpgrade, Offboarding, ShortcutsDialog (on the existing hotkey list).
- Native designs for both lanes.

## [0.35.0] - 2026-10-16

### Added
- Library wave 10, lane C (built by Codex, the pilot's first pull request, #4): Wizard and WizardDialog (linear or free
  steps, a summary step), FormFlow (create and edit in a dialog, a page, in place or a drawer, with the unsaved-changes
  guard), Autosave, SaveStatus and useAutosave (one write at a time; offline retry), DraftState, SaveAs, ArchiveRestore.
- Native designs: iOS Feedback; Android Step flow, Form, App state; Archive and Restore added to Android Confirmation.
### Changed
- Native designs merge by adding variants to a page that exists, never replacing another task's (tools/agent/native/merge.js).
- Codex's next tasks: tools/agent/tasks/31-w11b.md and 32-w11c.md.

## [0.34.0] - 2026-10-16

### Added
- Library wave 11, lane A (accounts and files): File (file or folder, as a line or a chip, by type icon, with size; a long
  name is cut before its extension), FileRow and FileRowList (selected, progress, actions; rename and delete through
  RenameAction and DeleteFlow), Auth (SignInForm, SignUpForm, PasswordResetForm, MfaChallenge, SsoButtons,
  AccountRecovery), SessionTimeout and useSessionTimeout (an alert dialog; the time left said at 60, 30 and 10 seconds),
  RoleManager (roles list and detail; the owner role keeps its last member), ConnectedAccounts (connect lists the scopes
  first; disconnect asks).
- Native designs: iOS Managing accounts and File management; Android Sign-in and account.
### Fixed
- Design system: "All roleses" — a title already in the plural (Roles) keeps its plural.

## [0.33.1] - 2026-10-16

### Changed
- AppHeader: the pinned-app links leave the header when the header itself is narrower than Wide (840px), not the
  screen (owner, 2026-10-15, GitHub #27). In a split view, an embedded page or a panel the header no longer crowds;
  search spans the bar. Apps to check: none need changes; the class `plx-app-header--compact` marks the state.
- docs/touch-options records the two decisions (the pane's size menu with touch: no change).

## [0.33.0] - 2026-10-16

### Added
- Library wave 9, lane C: Sparkline, Metric card, LollipopChart, ScatterChart (and bubbles), FunnelChart, Treemap,
  GanttChart, GeoMap (and choropleth); the chart accessibility rules (`summarizeSeries`, `ChartPatterns` textures).
- `useChartPoints`: the standard chart interaction for charts of separate marks (steps, tiles, regions, points): one
  Tab stop on the plot, the arrow keys, each value said; every chart now reads the same way with the keyboard.
- Native designs: the new chart kinds on the iOS and Android Charts pages.
- docs/touch-options: the two open touch decisions drawn as options (the pane's size menu with touch; the AppHeader's
  links in a narrow header), for the owner.

## [0.32.0] - 2026-10-16

### Added
- Library wave 10, lane A (drag and drop): the dnd engine (`useSortable`, `useDraggable`, `useDropTarget`,
  `useReposition`; pointer, pen, touch and keyboard: Space/Enter picks up, arrows move, Space/Enter drops, Escape
  cancels; every move announced; auto-scroll near edges), DragHandle, SortableList (vertical, grid, handles, move
  buttons, between lists), DropZone data drops (`onDropItem`, `accepts`, a refusing state), Resizable (with a size menu
  for resizing without dragging; PanelSplitter moved here, still exported from AppShell), RenameAction (inline and
  dialog; F2; selects the name before the extension).
- Library wave 10, lane B (record flows): DeleteFlow (confirm, type to confirm, undo, move to trash), DuplicateAction
  (copy at once with Undo, then rename), Publish (draft, scheduled, published; schedule; unpublish with Undo),
  ReviewFlow and ReviewQueue (approve, request changes, reject with a reason; human review), AssignControl (assign,
  reassign, delegate with dates), WorkflowStatus.
- Native designs: iOS Drag and drop, iOS Undo and redo, Android Gestures (drag), Android Confirmation.
### Changed
- Versions follow semver from this release on (owner, 2026-10-15, RedSave #27): new or rewritten components raise the
  minor version, fixes the patch version; a rewrite is listed here under "Changed" with what an application must check.
- Agents find their task briefs in tools/agent/tasks/ (AGENTS.md › Finding your work); the plan of record is pinned
  issue #3 on GitHub, one issue per task.

## [0.31.74] - 2026-10-15

### Added
- The Claude + Codex pilot (owner, 2026-10-15): several coding agents each own one task, coordinated through GitHub
  (one issue, one branch, one pull request). AGENTS.md holds the rules every agent reads; the issue form "Agent task"
  and the labels agent:codex, agent:claude, agent-task and needs-owner assign the work.
- tools/agent/generated.js: the one list of generated files. CI fails a pull request that commits one (they are rebuilt
  at merge, so parallel pull requests never conflict on them).
- tools/agent/lane-overlay.js: a branch keeps its design-system files under lanes/<task>/design-system/; the overlay
  copies them into the design system for the build, the checks and CI.
- tools/agent/take-pr.js: the integrator's merge of a pull request (source files only, design-system files into the
  design system's repository, files changed in main reported).
### Changed
- The pull request template asks for the files, the checks, what was left undone and what needs the owner.
- The test runner's changed mode counts a lane's design-system files where the overlay copies them.

## [0.31.73] - 2026-10-15

### Changed
- The palette consolidation (owner, 2026-10-15; docs/color-consolidation/): one canonical palette of 83 colors in 12
  families named by their tokens (Gray, Red, Pink, Magenta, Orange, Brown, Yellow, Green, Teal, Cyan, Blue, Purple).
  27 canonical colors added (among them green-150 #bfef45 and yellow-175 #ffe119); 162 theme references moved to their
  canonical tokens.
- Categories keep their names and roles (`--plx-sys-category-<name>`, `-soft`, `-soft-border`, `-on-soft`); every role
  now points to a canonical token, and some categories share soft shades. A component reads a color by its token name.
- Design system: the Color page groups the canonical palette in the 12 families; the Tag page's category table reads
  each role's token from the theme; a bulleted list card on the List page.
- docs/palette.md and docs/pills-and-colors.md regenerated from the tokens.
### Deprecated
- The 83 retired palette tokens (the `--plx-ref-color-category-*` primitives and the near-duplicate shades) stay one
  release as aliases of their canonical destination; docs/palette.md lists each one's replacement.

## [0.31.72] - 2026-10-15

### Added
- Library wave 9, lanes A and B (24 leaves): chart interaction (one Tab stop per chart, arrows between points, the value
  in the tooltip and the live region, crosshair, brush to zoom, Reset zoom), LineChart (step), AreaChart (stacked,
  percent), Gauge, HeatMap (matrix, calendar), WaterfallChart, WordCloud, NetworkGraph, Diagram, BarChart (column,
  stacked, percent, histogram), ComboChart, PieChart (donut), BulletChart, BoxPlot, RadarChart, SankeyDiagram,
  TimelineChart, ComparisonView (Compare). Every chart keeps "Show the data".
- Command bar, the Fluent model (owner, 2026-10-15): `actions[].toggle` (a pressed button; folded, a checked item),
  `actions[].choices` (shows the current choice; folded, a submenu of radio items), `status` (beside the count),
  `quickFilters` (fold into More after the commands, each a submenu of checkable values). Fit order: labels become
  icons first; then the search becomes its icon and the count and status step out; then commands fold into More, then
  quick filters. Sort, Filter, Group, Columns and View never fold.
- List `variant="bullets"`: a 4px gray-400 square before each statement, the text justified.
- docs/palette.md: every palette color by family.
### Changed
- Form fields: a gray-400 border all round and a #fcfcfc fill (new palette gray-50), the same when focused (roles
  field-border, field-background; owner, 2026-10-15).
- Menus, lists and popovers that open: no border and the Lifted shadow (new roles shadow-lifted, overlay-border; new
  palette blacks at 20% and 12%).
- The Asset Manager and Files pass their quick filters as `quickFilters`; Save search is a command.
- Design system: long texts of several sentences read as bullet points; the pill material moved from Color to the
  Badge and Tag pages; the Color palette groups every color by what it looks like (11 families; category colors in
  their families, dark warm shades in Brown); the duplicate "New scales" section is gone.

## [0.31.71] - 2026-10-15

### Added
- Icon `star` (outline and filled), from the vendored Material Symbols Sharp library, unedited.
- check-system rule `icon-names`: an unknown literal icon name fails the check.
### Fixed
- TypeScript definitions (@plenix-ds/react) are valid TypeScript: renamed exports typed by their public name, part
  props on their own export, interfaces extend `Omit<HTMLAttributes, own props>`; 364 exports, matching window.Plenix.
- The npm package finds its vendor files (the legacy grid, Tiptap) in `dist/vendor/`; the idle the legacy grid prefetch runs only
  on the Platform's own origin (an app no longer downloads the legacy grid on pages without a table).
- Unknown icon names fixed in Icon, Thumbnail, CollapsibleSection and the navigation-list examples.
- Touch targets (coarse 18 → 9): the combobox field's whole height is its target; the field info button reaches 44px
  with touch; DataTable's selection checkboxes fill their 44px cell with touch (a tap beside the box toggles that row).
- The design system's layout lab loads production React.

## [0.31.70] - 2026-10-15

### Added
- Library wave 8 (26 leaves):
  - Chart parts (platform/charts/parts): Axis, GridLines, ChartLegend (under, beside, interactive), ChartTooltip
    (single, shared), DataLabel, ReferenceLine (and thresholds), ChartAnnotation (point, range); ChartFrame `legend`.
  - FeatureCard and UserCard (Profile card).
  - VirtualList (fixed, variable, grouped rows; sticky headers; load on reaching the end).
  - Carousel (one or several per view, dots, arrows; autoplay off by default, with Pause, paused under reduced motion).
  - PeopleGroup (Team, Group) and PermissionSummary.
  - QueryBuilder (rules, and/or groups up to 3 deep, a text view), on the Filter panel's condition model.
  - RoleLabel (the Tag look; never a status color), SearchResult and SearchResultGroup (`highlightMatches`),
    ResourceList (Object list), Timeline, and Card `expandable`.
- Each has its spec page, an "All" lab, a page per variant, and its native counterparts (new designs: Android Carousel,
  Search screen, Activity feed, Label; iOS Searching; chart parts in the Charts designs).
### Changed
- The Filter panel no longer claims the Query builder leaf (QueryBuilder has its own page).

## [0.31.69] - 2026-10-15

### Changed
- The command bar swaps on a selection (owner, 2026-10-15; Microsoft 365): one bar of one height, the table never moves.
  With rows selected, the page's actions, the search and the filters give way to the selection's commands (Delete
  last); Sort, Group, Columns and View stay where they are; the bar ends with "× N selected", which clears the
  selection (Escape in the bar does too). The swap is announced. The count stays in the bar.
  New: `CommandBar selection={{ count, actions, onClear, noun, plural, label }}`. **Breaking:** `layout="split"` (a
  separate action bar) is retired and draws one bar (many actions fold into More); the selection bar under the bar
  (BulkActions as `selection`) is replaced by the swap.
- BulkActions is for pages without a command bar.
- The Asset Manager's home page uses the swap (categories, a category's assets).
- DataTable: floating scrollbars. The table body's scrollbars float over the rows and take no room, so the legacy grid no
  longer writes a margin on the header row (the off-grid 10px). Thin thumbs (the Platform's scrollbar color), shown
  while the pointer is over the table or focus is in it; drag a thumb or press its track. Browsers without
  scroll-driven animations and anchor positioning keep the thin native bars.
### Fixed
- DataTable: the select-all checkbox no longer moves on hover. The header's hover reserved room for a filter or menu
  button in every column; the select column has none, so its checkbox shifted and shrank. It now reserves nothing.
- DataTable selected rows (light theme): blue-200; a selected row under the pointer: gray-100 (owner, 2026-10-15). No
  border around selected rows (fill only, as the standard systems do; the outline stays the focus indicator).

## [0.31.68] - 2026-10-15

### Added
- Library wave 7 (29 leaves):
  - Calendar: month or two months, a range highlight, week numbers, unavailable dates, min and max; a one-Tab-stop
    grid with arrows, Home and End, Page Up and Page Down.
  - DatePicker: one date, a range, date and time, presets; typed dates or the calendar in a popover (Alt + Arrow Down).
  - CountrySelect: countries, locales and languages, named by the browser (Intl.DisplayNames); flags are optional.
  - ProgressSteps: the stepper, horizontal or vertical, clickable, with complete, current and error steps, and a
    compact bar.
  - Tabs `orientation="vertical"`.
  - AppHeader `back` and `title`: the mobile app bar.
  - MillerColumns: columns, a preview column, resizable, checkboxes.
  - Cascader: built on MillerColumns; click, hover, search, multiple.
  - EntityPicker: people, teams and records, one or many.
  - TimePicker: a list or segments, 12- or 24-hour, any step.
  - RelativeDateInput: past and future presets and "n units".
  - LoadMore: a button or infinite (as the end comes into view).
  - ImageUpload with ImageCrop, and AvatarUpload.
  - Chart foundations (platform/charts): scales (linear, log, band, time; niceTicks; seriesColor on the data-viz scales)
    and ChartFrame (title and description as the chart's name, measured size, a "Show the data" table). The base for
    the chart waves.
  - TimeZoneSelect (by region or offset; offsets in DM Mono), TreeSelect (one or many, tri-state branches, search; a
    bottom sheet when narrow), TransferList (two lists, search, ordered target, virtualized), BottomSheetNav.
  - Spec records for NavPane's mobile forms: bottom navigation, mobile tab bar, mobile drawer and menu, navigation drawer,
    adaptive navigation.
- Each has its spec page, an "All" lab, a page per variant, and its native counterparts (new iOS designs: Column views,
  Image wells, Token fields, Charts; Android: File and photo pickers, Charts).
- build-exports.js publishes platform/charts/ (scripts and stylesheets).

## [0.31.67] - 2026-10-15

### Changed
- The Asset Manager's home page (categories, collections and a category's assets) and the Files screen are on the
  command bar: the page's action at the start; search, Filter and the app's quick filters (Category, Type, Tags);
  Sort, Group, Columns and View; the count at the end; the selection bar under it. The old toolbar's filter dialogs,
  Sort menu, view switch and card-size switch are replaced by the panels and the View menu.
- Badges use the six status variants by name everywhere (neutral, success, active, waiting, action-required,
  negative); "In progress" is active and "Not started" and "Archived" are neutral.
- Badge `icon`: a status icon inside the badge, before the text. EntityHeader's live state is a small status badge with
  its icon instead of a dot (`live: { tone, icon, label }`); Notes shows "Saved" with a check and "Unsaved changes"
  with a pencil. The Asset Manager's status choices are badges with icons.
### Removed
- Token `entity-header-live-status-dot-margin-inline-end`.

## [0.31.66] - 2026-10-15

### Changed
- Count: the pill is soft, as every pill (shade 100 background, shade 300 border, dark text, 4px corners). Its tones
  point to the status pill roles: neutral, info (active), success, warning (waiting) and danger (negative).
- Tabs `variant="segmented"` takes SegmentedControl look A: joined segments at the button control height, the selected
  tab in the selected-state blue tint with blue text. The gray track and the raised segment are gone.
  Tokens: `tabs-segmented-list-background`, `-list-radius`, `-list-padding-block`, `-list-padding-inline` and
  `-tab-selected-shadow` are removed; `tabs-segmented-tab-*` follow the `segmented-*` tokens.

## [0.31.65] - 2026-10-15

### Added
- CommandBar (owner's command bar standard): one white framed bar fixed at the top of the content; layouts `one`
  (actions left, find and view right), `split` (many actions: an action bar over the find bar) and `view` (no actions).
  Ghost buttons; icon and label when the bar fits, icons only with tooltips when it does not, then actions fold into
  More actions from the end (danger last). Sort, Filter, Group, Columns and View are never merged.
- Find panels: FilterPanel (Where / and / or, operators by field type, condition groups), SortPanel, GroupPanel
  (subgroups, collapse and expand all), ColumnsMenu and ManageColumnsDialog (reorder, show and hide, first column),
  ViewMenu (layout, card size, row height), QuickFilter (searchable checklist, date presets and range).
- utils/fields.js and hooks/useCollectionView.js turn the panels' state into DataTable props.
- DataTable props `filter`, `sort`, `groupBy`, `columnOrder`, `hiddenColumns`; a header chevron opens the column menu.
- SearchField `width="bar"` (240px) and `width="fill"`; `collapsed` turns it into an icon that opens across the bar.
### Changed
- BulkActions is the selection bar under the command bar: actions, Select all, Clear, and "N selected" at the far end;
  every action always shows, disabled with a reason until it applies (`actions[].disabled`, `actions[].why`).
  **Breaking:** `strings.selected` is now the template `'{n} selected'`.
- Button caret: the thin chevron (expand_more) in the muted color.
- DataTable: no view button by default; row height comes from the View menu.
- Group-by icon: view_agenda.

## [0.31.64] - 2026-10-15

### Added
- Yellow (waiting, paused) and orange (action or correction required) reference scales, and soft 100/300/700 shades
  for the 20 category colors (owner's approved values; docs/pills-and-colors.md).
### Changed
- Pills (owner): every pill is soft, a shade-100 background, a 1px shade-300 border, dark text of the same family and
  4px corners. Badge has six status variants: neutral, success, active, waiting, action required, negative (info,
  warning and danger still work as active, waiting and negative). Tags and categories use their own soft category
  colors, never the status variants.
- Warnings are orange and "away" is yellow; brown is no longer used for any status.
- SegmentedControl: a bordered group of joined segments; the chosen one takes the selected tint.
- Projects: Active, Paused, Completed and Archived use the active, waiting, success and neutral variants.

## [0.31.63] - 2026-10-14

### Added
- DataTable (owner, studied from Airtable):
  - Row height per table: Short (the density's row), Medium 56, Tall 88, Extra tall 128; record rows only; equal minimum
    padding; top-aligned and clamped in tall rows, middle in Short rows; wrap columns clamp instead of growing rows.
  - Airtable-style grouping: a 48px group header (chevron, the grouped-by field as an eyebrow, the value drawn as its
    column draws it, the count in Mono), a 24px gap, sticky headers, nested groups, the grouped column tinted gray,
    treegrid keyboard; summaries and an add row per group, off by default. Grouped tables stay virtual.
  - Column headers: a type icon (hidden in Compact), Wrap headers as an option.
  - The column menu in sections: app field actions, sort by type (A → Z, 1 → 9, Oldest → newest), Filter by and Group by
    this field, width and position, Hide.
  - New size tokens 88px and 128px; 7 icons from Material Symbols Sharp, unedited.

## [0.31.62] - 2026-10-14

### Added
- RichTextEditor has every Tiptap format (owner): headings 1–6, quote, code block, horizontal rule; bold, italic,
  underline, strikethrough, inline code, subscript, superscript; font family and size, text color and highlight (any
  color: the person's content is their own); alignment; bulleted, numbered and task lists; links, images and tables;
  smart typography. Tiptap's own keyboard (Tab nests list items and moves between table cells; Esc then Tab leaves). 16
  icons from Material Symbols Sharp, unedited. Saved HTML keeps only color, highlight, font, size and alignment styles.
### Changed
- Text fields are white (owner): the search field takes the control background like every field; read-only fields
  stay gray, the "filled" appearance stays an option, and the search in the blue header stays blue. A new check
  (check-system.rules/field-background.js) fails any other text field background.
- The style checks exempt only the user-format properties inside rich-text content (plx-user-content).

## [0.31.61] - 2026-10-14

### Changed
- RichTextEditor runs on Tiptap 3.31.3 (MIT; StarterKit, Link, Mention), vendored as one file
  (platform/vendor/tiptap, 132 KB gzipped, licenses recorded) and loaded only when an editor is on the page. The API,
  toolbar, shortcuts, Markdown shortcuts, plain-text paste, links, mentions and states are unchanged; the Backspace
  marker is gone. Later: tables, editing together (Yjs) and embeds.

## [0.31.60] - 2026-10-14

### Added
- DataTable modes for many rows (owner): `mode="fill"` (the default: the table fills the space left on screen and
  draws only the rows in view; a table without a height is fast too), `"pages"` (25, 50 or 100 rows per page with a
  footer: range in Mono, rows per page, Pagination) and `"load-more"` (more rows near the bottom, a Load more button,
  announced). Pages and load-more also work with server data through `fetchRows({ page, size, sort, filters, search })`.
  5,000 rows: first rows in 0.28–0.34 s (was 1.8 s), 50–80 rows drawn (was 5,000).
### Changed
- SearchField recent searches have a remove button on each row (the WAI-ARIA combobox with a grid popup): arrows move
  between the term and its remove button; Delete still removes; Clear all stays.

## [0.31.59] - 2026-10-14

### Changed
- Owner decisions (2026-10-14):
  - DataTable re-measures its column widths when the density changes (columns only; widths stay on the grid);
  - Back to top uses the up arrow (new icon arrow-up);
  - the rich text toolbar is icons (bold, italic, link, numbered list, heading, quote, code; new from Material Symbols
    Sharp, unedited), each with its shortcut in a tooltip;
  - one Backspace after a Markdown shortcut or inline code removes the character (undo still works);
  - the kept choices of waves 5 and 6 are written as rules in their docs.

## [0.31.58] - 2026-10-14

### Added
- The complete library, wave 6, lane C (8 inventory items) — wave 6 complete:
  - Toggle button pages (every variant, on and off);
  - Combobox: async loading (spinner, results announced, stale answers dropped) and checkbox or radio marks;
  - Slider: a range with two thumbs that never cross, and tick marks;
  - Inline edit (text, text area, select; Enter saves, Escape cancels; never link-styled);
  - Rich text editor (basic or full toolbar, Markdown and keyboard shortcuts, plain-text paste, links, mentions; no
    new dependency).

## [0.31.57] - 2026-10-14

### Added
- The complete library, wave 6, lane A (11 inventory items):
  - Fieldset: a row layout and a hidden legend (field group, legend pages);
  - Error summary (focus on appear, a link per error to its field);
  - Input group (prefix, suffix, icon, joined buttons or selects in one field border);
  - Number input (locale parsing, currency, percent and unit formats, steppers, a quantity selector, full keyboard);
  - File input (the native picker drawn as a button, a file list with sizes and Remove);
  - Code editor (coloring, line numbers, Tab indents, Escape then Tab leaves; no new dependency).

## [0.31.56] - 2026-10-14

### Added
- The complete library, wave 6, lane B (12 inventory items):
  - Form (one or two columns, named sections, sticky actions);
  - Field: a character counter ("42/60", invalid past the limit, announced);
  - Input, Textarea and Select appearances: outline, filled, underline; a Textarea that grows to 10 lines; the
    read-only field page;
  - One-time code input (typing, Backspace, arrows, paste and the device's code autofill);
  - SearchField suggestions (the match in bold, announced) and recent searches (useSearchHistory).
### Fixed
- Sidebar group labels of titles already in -es ("All recent searches").

## [0.31.55] - 2026-10-14

### Changed
- CI runs the labs in three parallel parts, so a change to a shared component no longer runs out of time (0.31.52).

## [0.31.54] - 2026-10-14

### Added
- The complete library, wave 5, lane C (12 inventory items):
  - Command menu (a filterable list of commands, groups, nested pages, shortcuts shown) and the Command palette (Ctrl K);
  - Download button (format and size, progress while downloading) and Back to top (floating or inline);
  - Dialog: non-modal (no veil, F6 between dialog and opener), the Prompt dialog (one field, validated on submit) and the
    full-screen dialog page;
  - Tooltip: rich tooltips (a title, the popover surface) and toggletips (an action, opened by click), a start
    placement; tooltips are placed by CSS anchor positioning.

## [0.31.53] - 2026-10-14

### Added
- The complete library, wave 5, lane B (11 inventory items):
  - Split button, Floating action button (sm, md, lg; extended), Copy button (icon, label, in a field);
  - Menu: radio items, submenus, and the context menu (right-click, long press, Shift+F10 or the Menu key);
  - Details (native disclosure), Print (print.css and usePrint), Spotlight (dim the rest, the target stays usable).
### Changed
- Teaching bubble (owner): filled with the brand blue, with on-brand text and actions; it spotlights its target by
  default.

## [0.31.52] - 2026-10-14

### Changed
- DataTable geometry (owner): row height and cell padding come only from the density (never measured); the legacy grid
  measures column widths from the content, rounded up to the 4px grid; columns resize with the legacy grid's handle (also by
  keyboard, in size steps) and the widths are kept in the saved view; pinned columns keep Plenix classes.
- Large tables are fast: the wasted full redraw is gone, grids with a height draw only the rows in view (virtual
  rendering; the space for the others comes from classes; aria-rowcount and aria-rowindex; focus kept; printing draws
  every row), and Avatar, MediaCard and Thumbnail images load lazily. 560 rows with avatars: 2.1 s frozen → 0.23 s;
  5,000 rows with a height: did not finish → 0.24 s.
- Every cell's content has vertical alignment: middle, in every density, header and body (horizontal alignment
  unchanged).
- Inline styles (owner): never in HTML or markup; JavaScript (React's style prop included) may adjust on the spot only
  with values from tokens or defined styles, and every length it writes sits on the grid (utils/grid.js: snapToGrid,
  gridPx). check-system rejects hard-coded values in style-writing code; the style audit reports off-grid lengths.

## [0.31.51] - 2026-10-13

### Added
- The complete library, wave 5, lane A (12 inventory items):
  - Popover: a non-modal anchored dialog in the top layer, placed by CSS anchor positioning; click, hover (the hover
    card) or manual; title, close, footer, arrow, sizes; a bottom sheet at Narrow; popup and inline dialog pages;
  - Contextual help (an info button with a small popover, or an inline tip) and contextual education;
  - Teaching bubble (picture, title, step count, actions) and coach marks;
  - Popconfirm (a question with Cancel and the verb; focus starts on Cancel);
  - Mega menu (a disclosure of link columns; an accordion at Narrow).

## [0.31.50] - 2026-10-13

### Changed
- Wave 4 decisions (owner):
  - Barcode is black on white in both themes, as the QR code, so scanners read it;
  - new icons from the set: wifi-off and cloud-off (the offline and degraded states), remove and do-not-disturb;
  - Do not disturb is a fifth presence state (the busy red, told apart by shape): online a check, away a clock, busy a
    solid dot, do not disturb a minus, offline a cross;
  - the retry waits (2 s doubling to 30 s) and the state tones stay as built.
- Sidebar group labels keep acronyms and real plurals ("All QR codes", "All retries", "All presence").

## [0.31.49] - 2026-10-13

### Added
- The complete library, wave 4, lane C (10 inventory items):
  - Status icon (info, success, warning, danger, neutral) and Banner (page or pane, five tones, actions, dismiss);
  - Color swatch with its name, and the Swatch picker with a custom set from the palette;
  - Scrim (modal, light, inverse; contained or over the window) and Loading overlay (spinner or progress, a message,
    cancel; the covered region is busy and inert);
  - Time: timestamp, relative time and date label in Mono, with the full date in a tooltip;
  - the Undo pattern: Toast actions and useUndo.

## [0.31.48] - 2026-10-13

### Added
- The complete library, wave 4, lanes A and B (23 inventory items):
  - Barcode (Code 128, EAN-13, UPC-A) and QR code (levels L to H, versions 1 to 40), each with its own encoder;
  - Section message (Notice with a title, actions and dismiss); error, warning, success, offline, degraded,
    permission-denied, not-found, maintenance and completion states (EmptyState kinds);
  - the Retry pattern (manual or automatic with a growing wait, the attempt count);
  - availability indicator (online, away, busy, offline, each with its own shape), presence on Avatar, Avatar group,
    Profile summary (Persona), Circular progress and Version label.

## [0.31.47] - 2026-10-13

### Fixed
- The data-table test opens collapsed settings cards before it checks their tables (Settings › Documentation, DAM
  Properties); the DAM Transcoding table sits in a static card. 25 of 25 table views pass.

## [0.31.46] - 2026-10-13

### Changed
- Tests run only what changed (owner): `npm test` maps the changed files to the pages, records and labs they affect;
  a change with nothing relevant passes in seconds. `npm run test:full` runs everything. Every test has a hard time
  limit and names the step where it stopped.
- CI on every push runs the quick checks and the changed-only browser tests in six parallel jobs. The full suite is a
  manual workflow, the final gate once everything is complete.

## [0.31.45] - 2026-10-13

### Changed
- Settings pages are built from cards (owner): every section is a SettingsSection card, either static or
  collapsible (Enter, Space or a click; the open state is kept per page). Plenix Settings, DAM System settings and DAM
  My account follow it, and every control matches its design-system page (labeled fields, Select for the header
  color, Sign out as a danger button, data values in Mono). A new check rejects non-card sections, native fields and
  unlabeled controls on settings pages.
- Color groups (owner): Brand, Accent, Semantic, Surface, Text, Border, Interactive and Status roles are defined, all
  pointing at existing palette colors. In dark, the brand is blue-300 with gray-950 on it, and status offline and
  not-started are gray-400.
- Group pages state "Chosen with" in one short line.
- The component labs test runs one size and variant per browser call, so a large lab no longer times out.
### Added
- Every covered library item opens its own page: 21 open their variant page and 208 have their own page with text, a
  live example and code. Ten items not in Plenix yet are listed as needs building.

## [0.31.44] - 2026-10-13

### Changed
- Contrast (owner): every theme pair now passes WCAG AA; the contrast test checks 76 pairs with none pending. Roles
  were remapped to existing palette colors, and no palette value changed:
  - field borders are gray-500 in light and gray-400 in dark;
  - the warning badge is brown-800 and the danger badge red-700, both with white text;
  - in dark, the focus ring and the status marks are their light tints with dark text.
- Links are never buttons (owner):
  - the link-styled button and the "Link button" item are gone;
  - actions use buttons and navigation uses Link;
  - a new check rejects a button styled as a link and a link used as an action;
  - visited links take the standard visited color: #551A8B in light and #d7aefb in dark.
- Section headings take their size from the type scale by level: h2 13px, h3 11px, h4 10px. Settings titles are h2
  headings.
- The design system's page headers draw their icon on a white tile (a new "surface" option of EntityHeader).
- "Open in Figma" (beside Edit) and "New theme in Figma" (Themes page) show where themes authored in Figma will start,
  in a future release.
### Added
- The complete library, wave 3 (33 inventory items):
  - IconTile, Pictogram, Image, Figure, Illustration (empty-state and error drawings), Sticky and Fixed regions;
  - the Brand mark's logo, wordmark and product marks, with the brand rules and their test;
  - Center, Bleed and reorder for stacks;
  - Show and Hide by window class;
  - aspect ratios on Preview;
  - masonry and justified grids, and collapsing columns;
  - theme zones;
  - the one-column and full-screen layouts.

## [0.31.43] - 2026-10-13

### Added
- The complete library, wave 2 (33 inventory items):
  - Link (inline, standalone, external, back), Code, Blockquote, RichText, ordered lists;
  - type styles (display, lead, label, caption, truncation and line clamps, tabular figures);
  - forced colors and more contrast, loading motion;
  - press, focus and selection hooks, gestures, read-only regions;
  - a focus-order overlay, a direction provider;
  - the logical-properties and semantic HTML rules.
- On this page shows one section at a time: choosing a section shows only that section, and "View all", the default,
  shows the whole page.
- New tests: high contrast and reduced motion, focus order, and landmarks and heading order.
### Fixed
- An indeterminate progress bar stays visible when the person asks for less motion.
- The contained Tabs panel's first corner mirrors in right-to-left pages.
- The design-system pages no longer break on states written inside :where() or :is().

## [0.31.42] - 2026-10-12

### Added
- The complete library, wave 1: the foundations and utilities (32 inventory items, 27 new records).
  - Formats: numbers and units, dates and times, currency and percentages, names, addresses and phone numbers
    (utils/format.js, the Formats standard).
  - Live regions (LiveRegion, announce), clipboard (copyText, useClipboard), hotkeys (useHotkey and a registry), and a
    virtualizer that writes no styles (useVirtualizer).
  - The aspect-ratio scale, interaction states (hover, focus, pressed, selected, dragged, disabled; with a lab),
    floating positioning (useFloating), Portal, and an intersection observer hook.
  - Data visualization colors, contrast rules (utils/contrast.js), the layout grid and keylines (with developer
    overlays), scroll lock, accessible descriptions (useDescribedBy), and use of color, which a new system rule checks.
- New tests: contrast of the theme roles (13 pairs pending, may only go down), formats and utilities.

## [0.31.41] - 2026-10-11

### Added
- The complete library, wave 0: every Web inventory item will exist as a real part of Plenix (owner).
  - 49 items another component already answers get their own pages, linked to the main one (records 132 → 181).
  - Parallel lanes now have their own part files: records, labs, docs and sample styles (build-spec-parts.js);
    exports (build-exports.js); a token file per component (platform/tokens/components/); and a native map per lane
    (web-native-map.d). So three writers can build at once without editing the same file.

## [0.31.40] - 2026-10-11

### Changed
- Typography follows the owner's rule everywhere, tables and property lists included: DM Sans for all interface text;
  DM Mono only for code (code, token names, hex values, logs) and technical values (IDs, file names and paths,
  versions, dates and times, sizes, counts, durations, measured percentages, coordinates). The data role is the only
  way to get Mono. It always takes its neighbors' size and line height, so Mono and Sans share a baseline (measured:
  at most 0.41px apart). Data cells in tables, data values in property lists, file names, dates and times across the
  apps now follow it.
- DataTable and Table columns can have two kinds (["name", "data"]) for a row named by its file name.
### Added
- tests/typography.test.js on every app page and 66 design-system pages, light and dark. It fails the build when Mono
  holds prose, data is not Mono, a date, size, version, file name or ID stands outside Mono, or the two typefaces
  miss a shared baseline.
- The table test requires Mono for data cells. The native checker requires the data role to use DM Mono on iOS and
  Android.

## [0.31.39] - 2026-10-11

### Added
- Tabs that do not fit move into a More menu outside the tab list; the selected tab always shows; arrow keys still
  reach every tab.
- The full-screen search at Narrow shows recent searches and results in every app and the asset manager.
- The calendar's view and date, and the asset manager's refined searches, have their own addresses.
- services/registry: the Plenix package registry (Verdaccio) configuration and scripts. Not deployed yet.
### Changed
- At Narrow there is one back control: the shell's parent row returns from a detail to its list.
- The bulk actions bar wraps at narrow widths instead of cutting off its actions.
- Touch targets reach 44 by 44 without changing the look on breadcrumbs, standalone table links, segmented controls
  and unlabeled switches. Undersized targets with touch fell from 365 to 23, and with a mouse from 13 to 0. Reflow
  findings at 320px fell from 15 to 0.
- On iOS and Android, sizes and layout follow the platform's guidelines when they differ from the web's (owner): the
  iOS alert keeps Apple's width. The slider's and the progress indicator's values on iOS are DM Mono, the data role,
  as on the web and Android.

## [0.31.38] - 2026-10-11

### Added
- Every screen in the apps has its own address and history entry (Platforms Standard 4.3): a note, a thread, a
  contact, a file, a task, a bookmark, an event, a project, a settings section, a search. Back and Forward work, deep
  links open the screen, and the parent control goes to the parent (useScreenLocation, navigate, goToParent).
- An unsaved-changes guard (useUnsavedGuard) asks with the Platform's dialog before leaving a screen, a dialog or the
  page with unsaved work. It is wired into the image editor, the account and system settings, notes, messages, the
  new-project dialog, uploads, metadata and capture.
- List-detail at Narrow: Notes, Messages and Contacts show one pane at a time, with a Back bar that returns to the list.
- View restoration: each app reopens its last screen and list position (useViewState).
- Sheet: a bottom sheet at Narrow (medium and large heights, grabber, Cancel and Done), a drawer at Medium and a dialog
  at Wide; one at a time. The inspector (SidePanel) opens as a sheet at Narrow.
- Full-screen search at Narrow in the application header, closed by Cancel, Escape or Back.
- Touch targets reach 44 by 44 without changing the look: header items, tag and chip buttons, color swatches, card
  titles and checkboxes. Undersized targets with touch fell from 907 to 366, and with a mouse from 29 to 13.
### Changed
- 137 component tokens named from selector fragments now say what they style, for example data-table-background-2 is
  data-table-header-background and pagination-page-hover-not-disabled-not-aria-current-background is
  pagination-page-hover-background. Values are unchanged.
- The target test honors WCAG's "Equivalent" exception: the pane splitters and the table's resize grips have
  full-size menu equivalents.

## [0.31.37] - 2026-10-11

### Fixed
- The release build copies folders inside the native outputs (the Android plenix_dimens.xml under res/values), so the
  CDN has every native file; 0.31.36 stopped before it was published. (batch 342)

## [0.31.36] - 2026-10-11

### Added
- The Plenix design for 49 more native components, following the iOS Buttons model.
  - iOS (24): Toggles, Sliders, Steppers, Segmented controls, Text fields, Pickers, Pop-up buttons, Color wells,
    Search fields, Page controls, Alerts, Action sheets, Sheets, Popovers, Activity views, Menus, Context menus, Edit
    menus, Toolbars, Notifications, Tab bars, Sidebars, Lists and tables, Progress indicators and Windows.
  - Android (24), with Jetpack Compose and Android Views: Button, Icon button, Menu, OutlinedTextField, Switch,
    Checkbox, Radio group, Slider, Search bar, Exposed dropdown menu, DatePicker and TimePicker, Top app bar,
    NavigationBar, NavigationRail, Tabs and segmented buttons, Badge, List, Card, Progress indicators, Snackbar,
    AlertDialog, ModalBottomSheet, Tooltip and Avatar.
  - Each page has its variants (with their Web pages and tokens), states, anatomy, every attribute from the Plenix
    token to the code that sets it, and the Plenix code.
  - Web pages show the Plenix design of their iOS and Android counterparts under Across platforms.
- The native token files name every value the native code uses: border widths, icon sizes, shapes, shell sizes,
  opacities, durations, and the component values the native designs name. Android also gets plenix_dimens.xml for
  Views XML.
- Web, Plenix Platforms Standard:
  - DataTable: rows move without dragging (a handle menu, the row menu, Alt+Arrow keys); columns move and resize from
    the header menu and the keyboard; a narrow table becomes a list of its key columns; an error state with Retry;
    a kept view (sort, widths, order, hidden columns) under a storage key.
  - The pane splitters and the dashboard grid have menus to resize and move without dragging.
  - EmptyState has an error tone with one recovery action.
  - Tooltips open on a long press on touch screens.
  - The appearance follows the system by default; Settings and My account offer System, Light and Dark, applied live
    across the open apps.
  - Inputs bring the right keyboard, autofill and Enter key hints.
  - Scrolling areas with an action bar keep the focused element in view.
  - New tests: 320px reflow and touch and pointer target sizes, with their known findings as baselines.
- A lightweight Plenix sign-in service (services/login), with an accounts command, tests and the steps to switch
  from Authentik. It is not deployed: switching is the owner's decision.
### Changed
- Toasts take how long they stay from a token (--plx-comp-toast-duration).

## [0.31.35] - 2026-10-11

### Fixed
- The build no longer fails when the design system is not checked out (CI): the native guidance step now looks for
  the design system itself, not only its folder, before checking the images it shows. (batch 337)

## [0.31.34] - 2026-10-11

### Added
- The Plenix iOS design, starting with Buttons (the model for every native component). The iOS Buttons page now
  shows what the guidance becomes as a real control:
  - Variants: Apple's kit default beside the same kit component styled with the Plenix variables, in light and dark,
    for Primary, Secondary, Ghost, Danger and Danger secondary. Each variant gets its Apple kit style, its Web page,
    its background, content and border tokens, and its SwiftUI, UIKit and AppKit form.
  - States: default, pressed, disabled, focused and loading, with their tokens and where SwiftUI, UIKit and AppKit
    report each.
  - Anatomy: a lettered drawing (container, label, symbol), and every attribute from the Plenix token to the Plenix
    iOS value, Apple's default, the guideline it follows, and the SwiftUI, UIKit and AppKit attribute that sets it.
  - Development and API: Plenix code in SwiftUI (a PlenixButtonStyle on the generated tokens), UIKit and AppKit.
- In the Figma copy of the iOS and iPadOS 27 kit: Plenix Light and Plenix Dark variable collections (the Plenix
  values) and the comparison and anatomy drawings, on the kit's Buttons page.
- The data is platform/standards/native-design.json. The build checks every page, image, token and guideline it
  names, and the API serves it at /api/v1/native-design.

## [0.31.33] - 2026-10-11

### Changed
- iOS has the same 14 sections as the Web (01 Foundations to 14 Implementation & Governance). Each Apple Human
  Interface Guidelines page sits in the section it belongs to, under the Web's subcategory name (Buttons, Menus and
  commands, Text input, Dialogs and so on), or Apple's group name where the Web has none (Media, System experiences,
  Technologies, Inputs). Every page keeps its Apple name and link. Plenix's own iOS pages are under 14 Implementation &
  Governance. Android's sections 11 and 13 take the Web titles (Page Structures & Templates; Interaction,
  Accessibility & Utilities).
- iOS and Android pages use the Web page's section names, in the Web order, listing only the sections they have:
  Overview and Purpose, Usage, Across platforms, Figma, Platform specification, Development and API, Implementation
  and Source-system mappings. The References panel is split: the SwiftUI, UIKit and AppKit documentation is under
  Development and API, and the Human Interface Guidelines outline under Source-system mappings.
- "API and usage" on Web pages is now "Development and API".

### Removed
- The Designing for macOS, tvOS, visionOS, watchOS and games pages, with their guidance and references.

## [0.31.32] - 2026-10-11

### Added
- The Figma kit "iOS and iPadOS 27" (Apple Design Resources) is mapped to the design system: its 141 public
  components, across 36 kit pages, each under the iOS page it draws (Buttons, Toggles, Tab bars, Sheets and so on).
  Every iOS page with kit components has a Figma section: each component, its kit page, its variant count and its
  variant properties, linked to its node in the Plenix copy of the file. Web and Android pages show the components of
  the iOS pages they map to. The map is data (platform/standards/figma-map.json), checked by the build, and served by
  the API at /api/v1/figma-map.

## [0.31.31] - 2026-10-11

### Added
- Every variant is its own page, as the owner asked: the last 33 components get the Button treatment. Data display:
  metric, interactive list, activity stream, card, selectable card, calendar view and media card. Forms and more:
  color swatch, drop zone, rating, combobox, search input, empty state, preview, chat and bulk action bar. Content:
  text, heading, list, code block, keyboard hint, avatar, property list, thumbnail and icon. Layout: stack, divider,
  dashboard grid, responsive grid, columns, secondary pane, inspector region and record page. Each has an "All" lab
  with every value's component token, and a page per variant: 125 new pages. All 58 components with variants are now
  done, with none left. The lab test passes 57 of 57 labs and the pages test 946 of 946.
- Icons, the list's icon and the avatar's theme colors read their own component tokens (icon-size-xs..xl,
  list-icon-size, avatar-background, avatar-content; same values as before), so their labs edit component tokens.

### Fixed
- A variant page that names only a size, a state or content (Large metric, Large spinner) now opens the lab on it;
  it showed the default before. (batch 333)

## [0.31.30] - 2026-10-11

### Added
- Every built Web item maps to iOS and Android, as the owner asked: all 128 components, patterns, foundations, page
  structures, templates and utilities. Most come from the iOS guidance (an iOS page names its Web and Android pages).
  The rest are in platform/standards/web-native-map.json, where foundations, page structures and utilities map to
  their nearest iOS (HIG or Plenix for iOS) and Android pages. The build stops when a built Web item has no iOS or no
  Android counterpart. 340 Web pages are mapped in all.
- "Across platforms" on every page with a counterpart: Web pages list their iOS and Android pages and the iOS guidance
  mapped to them; Android pages list their Web and iOS pages (also where the standard has no part yet); iOS pages list
  every Web page mapped to them. (batch 332)

## [0.31.29] - 2026-10-11

### Changed
- Every Web component and pattern stylesheet now takes its values from Plenix component tokens, as the owner asked:
  58 stylesheets, 1,311 new component tokens (3,202 tokens in all), each pointing to the same theme or reference token
  as before, so nothing changes on screen (the visual, theme, density and layout tests are unchanged). No stylesheet
  is left that uses a theme value directly, except the generated step rules.
- The data table reference demo (docs/data-table-reference.html) takes the owner's merged dark colors (gray-900 and
  gray-800 for the header and borders, blue-900 for the selected-row hover, blue-300 for the accent); the reference test
  matches again (186/186). (batch 331)

## [0.31.28] - 2026-10-11

### Added
- Plenix guidance for every page of the Apple Human Interface Guidelines: 158 pages and 1,322 rules, written in Plenix's
  own words (never Apple's text) and true to the guidelines. Each rule says Must or Should and links to the HIG
  section it follows. Components and inputs carry a cross-platform property table: 416 rows naming each setting in iOS
  (SwiftUI / UIKit), Android (Jetpack Compose) and Web (Plenix). Each page maps to its matching Web and Android pages.
- The guidance is part of the design system's data: platform/standards/native-guidance.json, built by
  build-native-guidance.js (a missing mapped page stops the build). It is also served at /api/v1/native-guidance. iOS
  pages show it first, under "Plenix guidance". Web and Android pages show the iOS pages mapped to them, with their
  property tables, under "Across platforms".
- build-platforms and build-native-guidance skip their output when the design system is not checked out. (batch 330)

## [0.31.27] - 2026-10-11

### Changed
- Every iOS page gathers Apple's references in one References panel, as the owner asked. It holds the Human Interface
  Guidelines page with its outline and resources; the developer documentation; the SwiftUI topics; and the frameworks.
- The developer documentation now covers UIKit and AppKit as well as SwiftUI. For each page, the types and classes that
  build it (for example TextField, SecureField, UITextField, NSTextField and NSSecureTextField for Text fields) show with
  their availability and every attribute, grouped by Apple's topics, each linked: 241 types and classes, 6,156
  attributes, across 91 pages. The page reads them from apple-api.json when it opens. (batch 328)

## [0.31.26] - 2026-10-11

### Changed
- The iOS view is generated from the Apple Human Interface Guidelines' own index, as the owner asked ("ensure
  everything is taken from" the HIG). It has all six groups and Components' eight groups, with every page in Apple's
  order: 158 pages, including Designing for iPhone Duo and the pages for other Apple platforms, previously left out.
  Plenix's own pages (how to build, token mapping, generated files, sources and levels, conformance) are a seventh
  section, 07 Plenix for iOS.
- Every HIG page shows its outline from the Guidelines: each section and subsection, linked to its place on Apple's
  page (581 sections), and Apple's resources for it: related pages, developer documentation and videos. These are
  names and links; Apple's guidance is read on Apple's site. The SwiftUI symbols, frameworks and Plenix Platforms
  Standard parts stay on their pages.
- A breadcrumb no longer shows an empty step for a page that sits directly under its section. (batch 327)

## [0.31.25] - 2026-10-10

### Added
- The iOS pages carry Apple's references, as the owner asked ("all the details" of developer.apple.com/documentation/swiftui
  and developer.apple.com/documentation). Apple's documentation text is Apple's, so it is linked, never copied. Each
  page has:
  - its Human Interface Guidelines page: 129 pages, each checked to exist;
  - a SwiftUI panel: every symbol of the SwiftUI topics that build it, by name, kind and link, under Apple's own topic
    groups (for example, Controls and indicators › Choosing from a set of options). That is 276 topics and 1,409
    symbols across the pages;
  - the Apple frameworks it uses (HealthKit, MapKit, WidgetKit, StoreKit, PencilKit and others), linked to their
    documentation.
  A page not yet in the Plenix Platforms Standard is no longer a placeholder: it shows these references under the
  status "Apple references". (batch 326)

## [0.31.24] - 2026-10-10

### Changed
- The iOS view follows the Apple Human Interface Guidelines' navigation, as the owner asked. Getting started, Foundations,
  Patterns, Inputs and Technologies list their pages directly, as the HIG does. Components has the HIG's eight groups:
  Content; Layout and organization; Menus and actions; Navigation and search; Presentation; Selection and input; Status;
  System experiences. The pages carry the HIG's names (Toggles, Sheets, Tab bars, Pop-up buttons, Virtual keyboards).
  Only pages that apply to iPhone and iPad are listed. Plenix's own pages (how to build, token mapping, generated files,
  sources and levels, conformance) are in Getting started. 134 pages; 62 show their parts of the Plenix Platforms
  Standard, the rest are placeholders. Android keeps its Web-shaped hierarchy.
- The design system's navigation supports a section whose pages sit directly under it; check-spec reads such sections
  from STANDARD.md. (batch 325)

## [0.31.23] - 2026-10-10

### Changed
- iOS and Android follow the Web design system's hierarchy, as the owner asked. Under level 0 (the Platform dropdown),
  each platform has the same 14 sections as Web: Foundations, Layout & Composition, Content & Identity, Actions &
  Commands, Forms & Data Entry, Navigation & Discovery, Data Display & Visualization, Feedback & System State, Overlays &
  Disclosure, Patterns & Workflows, Screen Structures & Templates, Specialized Experiences, Interaction & Accessibility,
  and Implementation & Governance. The groups inside follow purpose (Text fields & text areas; Sheets & bottom sheets;
  Tab bars & navigation bars), and the pages are named as each platform names its controls: Toggle on iOS and Switch on
  Android, Sheet with detents and ModalBottomSheet, TabView and NavigationBar, NavigationStack and Back stack.
- 302 pages (151 per platform). 226 show their parts of the Plenix Platforms Standard for that platform: whole
  subsections, the rows of a table that apply, or a 6.5 functional equivalent. The rest are placeholders, as on Web. The
  old "15 Platform – iOS" and "16 Platform – Android" are gone; their pages are now 01 Foundations › Overview, 14
  Implementation & Governance › How to build, Token mapping and Generated files, and the standard's sections in their
  purpose groups. (batch 324)

## [0.31.22] - 2026-10-10

### Changed
- Blue is consolidated as the owner asked: blue-850 is merged into blue-900 (#1f2a3a) and blue-350 into blue-300
  (#a2c0e3); both are removed. The final scale is 900, 700, 650, 600, 400, 300, 250, 200, 100, 50. The dark table's
  selected-row hover is now the selected-row color (blue-900), and the selected-row text and table accent use blue-300.
  Contrast stays well above the minimums: text on the selected row 7.71:1, accent on the table 8.78:1, avatar 11.19:1,
  code keyword 5.19:1.
- The design system shows every component sample on a checkered background: variant previews, example and card stages,
  and the labs' anatomy stage and matrix cells. It uses 8px squares of the hover state on the default surface, in light
  and dark. The toast, confirmation dialog, side drawer and header labs get wider matrix columns, so their samples fit.
  (batch 323)

## [0.31.21] - 2026-10-10

### Changed
- The owner's approved reds, exactly: red-800 #990000, red-700 #b70000, red-500 #f60000, red-300 #e96060,
  red-200 #f8aca2, red-100 #fde7e7.
- Roles that carry text move off red-500 (#f60000 is 4.27:1 with white text, 3.61:1 on the soft fill). Danger buttons
  and solid danger badges and counts use red-700 (6.97:1 with white text), with hover and pressed on red-800 (8.92:1).
  Light-theme danger text, the table's danger icon and code strings use red-700 (6.97:1). red-500 stays for the data
  color, status dots, progress fills and the toast edge.
- Dark theme, checked separately. The danger borders (secondary danger button, invalid field) follow the danger text
  color, red-200 (5.29:1); on red-700 they were 1.40:1. A new role, --plx-sys-feedback-danger-soft-content, holds danger
  text on the soft danger fill: red-700 in light (5.89:1), red-100 in dark (6.01:1; red-200 was 3.86:1). Soft danger
  badges and danger notices use it. Dark code strings use red-200 (5.29:1). Every text and border pairing passes in both
  themes; the a11y test passes without new exceptions. (batch 322)

## [0.31.20] - 2026-10-10

### Changed
- The owner undid the blue merge for the dark tables. blue-850 (#26354a) is back for the selected-row hover, so a selected
  row changes color on hover again. blue-350 (#8fb0d9) is back for the selected-row text and the table accent. Every other
  role stays on blue-900 and blue-300.
- Purple uses move to the corresponding blue shade, dark to dark and light to light. The purple data color is now
  blue-650 (distinct from the blue data color, blue-400); its soft fill is blue-100 and its text on that fill blue-900.
  Code attributes use blue-600 in light and blue-200 in dark. The purple reference colors (purple-800, -600, -500, -200,
  -100) are removed. The category palette's own purple is unchanged. (batch 321)

## [0.31.19] - 2026-10-10

### Changed
- Green is the owner's approved five-step scale: green-700 #1b5e0c, green-500 #107c10, green-300 #58ad58 (was #83c483),
  green-200 #9bd39b (was #bde8bd), green-100 #dff6dd. green-900, green-800 and green-600 are removed. green-900 and
  green-600 had no references. Every role on green-800 now uses green-700: light success text, light code numbers, and
  the green data color's text on its soft fill (light and dark). That text has 7.9:1 contrast on white and 6.9:1 on
  green-100.
- Gray merges by the owner: gray-925 into gray-900 (#34363b), which is the dark table header background; gray-850 into
  gray-800 (#444444), which is the dark soft-feedback borders and table borders. gray-925 and gray-850 are removed. No
  references to the removed tokens remain, and no token is left unresolved. (batch 320)

## [0.31.18] - 2026-10-10

### Changed
- The owner merged two blues: every role on blue-850 (#26354a) now uses blue-900 (#1f2a3a). That is the dark theme's
  selected-row hover in tables. Every role on blue-350 (#8fb0d9) now uses blue-300 (#a2c0e3): the light theme's accent
  border, accent field border and accent field placeholder; the dark theme's avatar background, code keyword, header
  card media content, selected-row text and table accent. --plx-ref-color-blue-850 and --plx-ref-color-blue-350 are
  removed; Blue has 10 shades.
- The design system's color group "Other" is now "Alpha or transparent" (the two black alpha colors).
- Purple is kept: it is in use (data color purple, the light theme's code attribute, category and project colors).
  (batch 319)

## [0.31.17] - 2026-10-10

### Added
- Every Variant, Navigation: Tabs, Application header, Product switcher, Navigation rail and Action menu get the Button
  treatment. Their values are component tokens: tabs.css 56, app-header.css 91 plus the header's three tones (24) and
  its own sizes (8) as tokens, tool-rail.css 25, menu.css 39. Each has an "All" lab with each value's token. Each variant
  has its own page: 14 pages (3 tab styles, 3 header tones, 2 switcher names, 2 rail label modes, 4 menu placements).

### Changed
- The reds, by the owner: red-800 #990000, red-700 #cc0000, red-500 #d60000, red-300 #ff8585, red-200 #ffc2c2. The owner
  asked for #ff0000 for red-500, then chose to darken it to pass WCAG AA. #d60000 is the brightest red with 4.5:1 for white
  text on it (5.4:1) and for red text on the soft danger fill (4.6:1). (batch 318)

## [0.31.16] - 2026-10-10

### Fixed
- The design system's token tables show their colors again. In the Rendering column, a token's sample now fills its
  table cell; the cell is a flex row, so a color swatch with no width of its own had collapsed to its border. The swatch
  is 24px tall in the 44px row. (batch 317)

## [0.31.15] - 2026-10-10

### Added
- Every Variant, Overlays: Dialog, Confirmation dialog, Side drawer and Toast get the Button treatment. Their values are
  component tokens (dialog.css: 44 plus the two footer action heights; toast.css: 30). Each has an "All" lab that draws
  every size, intent, side and tone in place, with each value's token. Each variant has its own page: 16 pages (dialog
  SM to FULL, Confirm and Destructive, drawer SM, MD and LG at the end or the start, toast Info, Success, Warning and
  Danger).

### Changed
- The dialog footer's gap between actions uses --plx-comp-dialog-action-gap, which is 12px on touch (Platforms Standard
  3.2). (batch 316)

## [0.31.14] - 2026-10-10

### Changed
- Pages written by the Plenix Platforms Standard get their own header in place of the placeholder's "Not written
  yet". This covers 15 Platform – iOS, 16 Platform – Android, and Platforms standard, Mobile web and Desktop under
  14. The header shows the phone icon, the section and group, a "Platforms Standard" status and a one-line
  description of the page. Their navigation rows are no longer muted. (batch 315)

## [0.31.13] - 2026-10-10

### Changed
- The design system's navigation has a level 0: a Platform dropdown (Web, iOS, Android) at the very top of the
  navigation pane switches the pane to that platform's sections. Web is 01–14, iOS is 15 Platform – iOS and Android is
  16 Platform – Android. The pane follows the page you open, the choice is remembered, and the footer counts the
  sections on the chosen platform.
- iOS and Android left 14 › Platforms, which keeps Platforms standard, Web, Mobile web and Desktop. Each native section
  has Build (How to build, Token mapping, Generated files) and Standard for iOS or Android, with Overview and one page
  per section of the Platforms Standard for that platform. The standard's pages, guidance and checks follow
  (888 leaves). (batch 314)

## [0.31.12] - 2026-10-10

### Added
- The token data holds the native values. In tokens.index.json, the @plenix-ds/tokens tokens.json and the API
  (/api/v1/tokens), each web token carries its iOS and Android values under platforms.ios and platforms.android,
  with their sources (26 tokens). platformOnly lists the native values with no web token (59).
- A new endpoint, /api/v1/platforms, serves the Plenix Platforms Standard (every section) and its token mapping
  (80 names). (batch 313)

## [0.31.11] - 2026-10-10

### Fixed
- build-tokens.js writes the native outputs only from the whole token set (component tokens included); the theme
  test's partial copy builds the stylesheets alone, so CI passes again. (batch 312)

## [0.31.10] - 2026-10-10

### Changed
- The iOS and Android token sets now use the existing web token names (Platforms Standard 7.1: "one set of token
  names, with values per platform"). For example: control-target-min, button-cluster-gap, dialog-action-gap,
  button-height, button-icon, button-icon-label-gap, input-min-height, switch-track-width and -height,
  switch-min-height, shell-header-height, shell-phone-below, shell-rail-below, nav-bar-height and nav-bar-icon-size.
  Text roles keep the web role names (title, heading, body and the others). Every value records the web token it maps
  to in $extensions.plenix.web, or platformOnly when the web has no such role. Its source now also names the version
  and the Plenix value where Plenix differs.
- The build stops if a platform value maps to a token that does not exist. build-tokens.js now writes the Swift,
  Kotlin and Dart outputs (7.2). Their constants carry the web names (controlTargetMin, textTitleSize, ...) and a
  comment naming the web token. The typefaces come from --plx-sys-typeface-sans and -mono.
- The web values the standard cites carry their source: the target minimums (WCAG 2.2 SC 2.5.8 and 2.5.5), the 12px
  coarse-pointer gaps, the 600 and 840 window classes, and the safe areas.
- The iOS and Android pages show the token mapping (80 names: 38 map to web tokens, 42 are platform only). (batch 312)

## [0.31.9] - 2026-10-10

### Changed
- Window classes follow the Plenix Platforms Standard (3.3): Narrow under 600px, Medium 600–839px, Wide from 840px
  (new --plx-ref-breakpoint-840px; --plx-sys-shell-rail-below is now 840px). data-plx-main-size reads narrow, medium
  or wide. Interaction "mobile" means a coarse pointer in a Narrow window, and any coarse pointer counts as touch (1.1).
- Navigation by window class (4.1, 6.4), never a drawer at Narrow. Wide keeps the pane, and Medium the rail with its
  expanded rail over the main region. At Narrow, a page with two or more rail destinations gets a bottom navigation
  bar: up to four destinations and Browse, always labeled, 44px targets. Browse opens the pane as a screen of its own.
  A page without rail destinations gets a parent row ("<- title") that opens the pane as the first screen of the stack.
  Choosing an item shows the main region again. New tokens: --plx-comp-nav-bar-*.
- Safe areas (3.5): every app page sets viewport-fit=cover, and the shell keeps its content inside
  --plx-sys-safe-area-top, -bottom, -start and -end (env(safe-area-inset-*)).
- The header's links leave it below Wide (840px), not at 768px. (batch 311)

## [0.31.8] - 2026-10-10

### Added
- The Plenix Platforms Standard in full: platform/standards/platforms.md is the source, and build-platforms.js reads
  every section, list and table of it into the design system with nothing lost. 14 › Platforms › Platforms standard
  shows the whole standard. Web, Mobile web, Desktop, iOS and Android each show it for their platform, headed by
  "How to build" (implementations, themes and the implementation section). Foundations, patterns and components show
  the parts they follow.
- Native token outputs (standard 7.1 and 7.2): platform-ios.tokens.json and platform-android.tokens.json, with every
  value's source. build-mobile.js generates SwiftUI (PlenixTokens.swift), Jetpack Compose (PlenixTokens.kt) and
  Flutter (plenix_tokens.dart) tokens from the theme and these sets. They are linked from the iOS and Android pages
  and published on the CDN under mobile/. (batch 310)

## [0.31.7] - 2026-10-10

### Changed
- Platforms pages, second review pass: platform interaction now ranks above the Plenix look in the precedence; field
  focus also needs 3:1 contrast against the unfocused border, in light and dark; the web's header control is the
  parent control, a separate operation from Back; Android 16 rules added (no edge-to-edge opt-out for apps targeting
  API 36; onBackPressed and KEYCODE_BACK no longer delivered) and Google Play's API 36 target requirement from August
  31, 2026. (batch 309)

## [0.31.6] - 2026-10-10

### Changed
- Platforms pages corrected against their sources after an outside review: accessibility requirements and
  OS-enforced behavior come first in the precedence; SwiftUI and Compose rows name native controls, while Flutter rows
  say Flutter draws its own Cupertino and Material widgets; field focus keeps the border-color rule with a 3:1 contrast
  requirement, errors carry text as well as color, and focus indicators the OS draws are never suppressed; Reflow
  states the 400% zoom and two-dimensional exemptions; Android edge-to-edge is an OS requirement (SDK 35 on Android
  15); back follows the real history, and the parent control, deep links and guards are separate rules. (batch 308)

## [0.31.5] - 2026-10-10

### Fixed
- The search field's clear button no longer drops out of the field when pressed (owner: "this is still not fixed"). Root
  cause: it was centered with transform: translateY(-50%), and the press feedback (motion.css) sets transform: scale(…)
  while it is held, replacing the translate, so the X fell by half its height. It is now centered by its insets and
  auto margins. The narrow header's search keeps the same margin on its right as on its left. (batch 307)

## [0.31.4] - 2026-10-10

### Changed
- The design system's Platforms pages follow the Plenix Platforms Standard (owner: "an authoritative document that
  spells the details"): every value reads as a rule with its source, without decision labels. New Type roles table on
  Mobile web, iOS and Android: each Plenix text role with its iOS text style at Apple's Dynamic Type size (title →
  Large Title 34, body → Body 17, secondary → Footnote 13…) and its Material 3 type role (body → Body large 16sp…).
  (batch 306)

## [0.31.3] - 2026-10-10

### Fixed
- Tabs' outer border is the same on every side (owner: "do a deep search why this is and fix it"). Root cause: the contained
  panel and the open tab drew their edges as inset box-shadows, the only frame in the system to do so; shadows are not
  snapped to device pixels, so at 150% a 1px line covered 1.5 device pixels, blurred over two and heavier than every
  other frame, and at 125% the four sides differed by up to 20 shades. They now draw real borders like Panel and Card;
  measured at 125% and 150% over ten sub-pixel positions, Tabs now render exactly as Panel does. (batch 305)

## [0.31.2] - 2026-10-10

### Fixed
- Top-level navigation on phones (decision N1, owner: "just fix n1"): a narrow window always uses a bottom bar with 3–5
  destinations and never a drawer, because Material 3 no longer recommends the navigation drawer (May 2025) and says
  compact windows always use a navigation bar, and Apple advises against overflow tabs. Areas beyond 5 go on a
  destination that lists them or in the top bar's menu; Medium windows use a navigation rail (3–7); other apps are
  reached through the header's app switcher. Updated in the design system's Platforms data and STANDARD.md decision 11.
  (batch 304)

## [0.31.1] - 2026-10-10

### Changed
- The design system has one look for each kind of information (owner: "there is many inconsistency in how things are
  presented... i need a unified look"):
  - every list of names (classes, tokens, states, ARIA attributes, aliases, "Also answers", a variant's class) is pills:
    a name with a page is a chip that opens it, any other name a tag; an empty list or value is "—";
  - every status is a soft badge whose tone says what it means;
  - inline technical values are the data text; links are text links; sub-titles inside a card are labels;
  - one icon per kind of section, none shared; a foundation's own parts (Typefaces, Typography: sizes, Color: Blue…)
    carry the foundation's icon, and Typography's icon is the text "T". (batch 303)

## [0.31.0] - 2026-10-10

### Fixed
- The dropdown arrow of every menu button (FilterBar filters, More menus, any Button with caret) was a dot (owner: "find the
  root cause"): the caret is the arrow_drop_down glyph, whose square includes the icon set's own padding, drawn into a 10x6
  box, so the whole 20px square shrank to 6px and the triangle to about 3x1.5px. The caret is now a 12px square, like the
  Select and Combobox chevrons (--plx-comp-button-caret-width/-height). (batch 302)
- Cards in the design system no longer scroll: the sample stages, variant previews, live samples and code set
  overflow-x:auto, which also turned overflow-y to auto, so a tooltip below its button scrolled the card; they now grow
  with their content. (batch 302)

### Removed
- The header search's separate Close button (owner: "why is there 2 x"): the field's own clear button is the only X;
  Escape closes search, and an empty field closes when focus leaves it. It also wrapped out of place in a narrow header.
  (batch 302)
- The numeric icon sizes (plx-icon--size-12/14/16/20/24) and every legacy or compatibility mention in the design system
  and the component docs (owner: "there should be no reference to the legacy at all"); Tabs' Segmented is "a compact
  switch". (batch 302)

### Changed
- The document icon is reserved for what is not in Plenix yet (owner): Product icons, Dashboard grid, Action bar, Metric,
  Selectable card, Calendar view, Table and Progress bar have their own icons (new names chart = bar_chart, progress =
  linear_scale); the Notes application, notes panels, the file panel and empty states use doc-text. (batch 302)

## [0.30.0] - 2026-10-10

### Removed
- Tabs variant="underline" (owner: "this is wrong.. remove this variant"). (batch 301)
- The tab focus outline (owner: "there is no blue focus on any tabs... remove"): arrow keys move and select and only the
  selected tab is in the Tab order, so keyboard focus is always on the selected tab, which its own look marks. (batch 301)

### Added
- Palette shades --plx-ref-color-brown-950 (#4a2400) and --plx-ref-color-red-800 (#8a1e13): two shades darker than the
  warning and danger fills in the same hue. Notice tokens notice-border-width and notice-<tone>-border. (batch 301)

### Changed
- Contained and folder tabs: the open tab's edges are drawn exactly like the panel's (inset lines, no border width), so
  tab and panel meet in one line of one weight and color at any display scale (owner: "the border outline is not same
  as the tab outlines"). Every Tabs in the design system and the applications. (batch 301)
- Notices have an edge two shades darker than their fill (the feedback soft-border roles), drawn inside so the content
  stays on the grid. Solid badges' warning and danger edges now use the new same-hue shades (were brown-900, one shade,
  and the plum red-700). (batch 301)
- NavList muted rows (incomplete places, such as the design system's entries not in Plenix yet and Settings' unstarted
  capabilities) show their text in the danger content color (owner: "give the node text a red color"). (batch 301)
- Design system: every table keeps its border (the Implementation tabs are the folder variant; variant groups and the
  sub-sections inside Guidelines cards are unframed titled sections, so no table sits three frames deep: 148 pages,
  1,440 tables, none borderless); each card shows its "On this page" icon before its title; the section pages' chips are
  all plain (no selected look). (batch 301)

## [0.29.0] - 2026-10-09

### Changed
- One table, one set of tokens (owner: "they should all be in" the Data table; "i need them to be using these tokens"):
  the static Table is now the DataTable with its interaction off. It draws with the DataTable's classes (.plx-data-table)
  and tokens (--plx-sys-data-table-*, --plx-comp-data-table-*), so every table in the Platform, the design system and the
  applications shares one look from one source. table.css and the --plx-sys-table-* tokens no longer draw anything.
  (batch 300)
- Name/value lists of reference facts are tables again, now with a header row: the design system's details on every page
  (Intent, the section pages' "Its own page / Answered on another page", Implementation, Design assets…), each component
  lab's property details, and the Settings and Capture facts. This replaces 0.28.4's property lists. (batch 300)

## [0.28.4] - 2026-10-09

### Changed
- Name/value pairs are never a two-column table (owner: "get rid of old legacy tables like this"): the design system's
  details on every page (Implementation, Design assets and every other key/value list), each component lab's property
  details, and the Settings and Capture facts are PropertyLists (label beside value, no grid frame or shaded column).
  Tables stay for records compared across columns. PropertyList passes other props (aria-label) to its list.

## [0.28.3] - 2026-10-09

### Fixed
- Tables with wrapping text (owner: "whats wrong with this table?!"): when one cell wraps onto more lines, every other
  cell in its row now grows with it, so the row label's shade, the cell fills and the column lines run the full row
  height. Cells keep the row height as their minimum (Table and DataTable). (batch 299)

## [0.28.2] - 2026-10-09

### Changed
- Every table, DataTable and data grid has full inside borders (owner: "for inside borders i want you to use full
  borders... update everywhere"): the column lines run the full height of each cell and of the header, in the Platform,
  the design system and every application. --plx-comp-data-table-column-line-inset, -header-line-inset and the Table's
  two are 0 (were 6px and 8px). The reference page (docs/data-table-reference.html) follows. (batch 298)

## [0.28.1] - 2026-10-09

### Changed
- The design system's own pages use EntityHeader (owner: "this needs to be updated to reflect the new headers"): every
  item, variant, variants overview, token and section page and the UI Inventory home. The item's level is the context
  line, its lifecycle status the status area, its icon the tinted media. (batch 297)
- EntityHeader draws no action area when it has neither actions nor moreActions (no lone ⋯). (batch 297)

## [0.28.0] - 2026-10-09

### Added
- EntityHeader (patterns/EntityHeader), the header of a page that shows one entity, as decided with the owner in the page
  header study (docs/page-header-study.html): a card; 48px media with a 1px border (an Avatar, or a generic icon for the
  entity's kind tinted in a data color); an optional context line (a placeholder such as the category, not a breadcrumb)
  and the status area (a soft Badge) on the top line; the title, 18px bold, wrapping; the entity's own actions as 16px
  icon buttons (Compact) side by side with the ⋯ menu last, folding from the end when the row is narrow; one line of
  facts under a full-width line, every item in the same font, size, weight and color (live state first, with its dot).
  Token --plx-comp-entity-header-tint. (batch 296)
- Settings › Appearance: "Page header background" (None, Gray, Blue, Warm, Green, Purple, Red; default Blue) and "Page
  header tint" (Fade, Flat; default Fade), applied as data-plx-header-tint and data-plx-header-tint-style on the page
  root. (batch 296)

### Changed
- Every application's entity pages use EntityHeader: Contacts (Call, Email, Message, Edit, Delete, Share), a project's
  home, Tasks, Notes and Files views, Messages (the open conversation), Notes, and the Tasks, Files and Bookmarks
  screens; their "Add" buttons sit under the header (capability actions stay out of it). The spec documents it under
  Object / record page. (batch 296)

## [0.27.3] - 2026-10-09

### Fixed
- CI (Checks and Release) failed on every push since 0.23.0: progress-bar.css still read --plx-comp-progress-bar-value,
  which nothing in the Platform sets since a known amount is drawn on <progress>. The fill (only the unknown-amount
  state uses it now) has no width variable; the design system's progress lab sets its sample width itself.

## [0.27.2] - 2026-10-09

### Changed
- PropertyList data values (sizes, dates, counts beside a label) are DM Sans at the label's size with equal-width digits
  (owner's choice, batch 294): measured, DM Mono matched DM Sans in x-height (0.50 em), cap height (0.70) and stroke
  (8.4%) but read 30% wider, so it looked bigger than its label.

### Note
- 0.26.2 (batch 292, the property list wrap) was released after 0.27.0 and 0.27.1 from another session by mistake;
  its content is included in every later release.

## [0.26.2] - 2026-10-09

### Fixed
- PropertyList (columns): the value column shrinks with its pane instead of keeping a field-width minimum, so in a
  narrow pane values wrap and are never cut off at the pane's edge ("Jul 3, 202").

## [0.27.1] - 2026-10-09

### Added
- Icons for entity actions (owner: "include the common email actions, forward, reply, delete"; contacts need Email):
  archive, flag, forward, mail, mark-unread, reply, reply-all, snooze, stop. Material Symbols Sharp from the vendored
  library, unedited. (batch 293)

## [0.27.0] - 2026-10-09

### Added
- Palette shades for pill borders (owner: "all pills must have a border that is 2 shades darker than the current color...
  if these shades are not in the tokens... they need to be added"): --plx-ref-color-blue-300 #a2c0e3, green-300 #83c483,
  brown-300 #dfaa7c (each between its hue's 200 and the next shade) and green-700 #1b5e0c (between green-600 and 800).
- Token roles --plx-sys-feedback-<tone>-soft-border and -solid-border (neutral, info, success, warning, danger) and
  --plx-sys-action-primary-border: two shades darker than the fill. Soft, light: gray-300, blue-300, green-300,
  brown-300, red-300; dark: gray-850 (the soft fills are gray-700). Solid: gray-800, blue-600, green-700, brown-900 (the
  darkest brown; the warning fill is brown-800), red-700. Primary: blue-600. (batch 292)

### Changed
- Every pill has a 1px border two shades darker than its fill, inside its height: Badge (solid and soft), the Count pill
  and Chip (plain: fill-neutral-border, as Tag; selected: action-primary-border). Tag already had it (batch 260). (batch 292)

## [0.26.1] - 2026-10-09

### Changed
- Color swatches are squares with 2px corners (--plx-sys-shape-2xs; owner: "use square with 2px radius for swatches"),
  everywhere: pickers, category lists, previews. shape="round" keeps a circle; the old 4px borderless "square inside a
  button" variant is gone (shape="square" is now the default).

## [0.26.0] - 2026-10-09

### Added
- Category colors, their own palette (owner: "use sashamaps.net/resources/20-colors"): Trubetskoy's 20 simple,
  distinct colors with his exact values, in his convenient order (take the first n for n categories). Their own tokens,
  separate from the theme and the same in every theme: --plx-ref-color-category-<name>, --plx-sys-category-<name> and
  -<name>-on (black or white text, the stronger contrast; every one at least 4.5:1). CATEGORY_COLORS lists them
  (generated); [data-plx-category] applies one. ColorSwatch.category, Avatar.category, ColorPicker palette="category".
- Categories use it: Settings' categories and their editor, the Asset Manager's category color (details pane, new
  category, upload). Archive's gray is the palette's grey.

### Changed
- ColorPicker is one row: the colors that do not fit are in a More menu at its end ("+n", or the chosen color when it is
  one of them), each with its swatch and name.

## [0.25.3] - 2026-10-09

### Changed
- The application switcher has no motion: no hover fade and no press shrink (owner: "remove the motion from this").

## [0.25.2] - 2026-10-09

### Added
- Every Variant: Tag and Chip get the Button treatment: their values as component tokens (tag.css, 42 tokens, same
  values), a lab each ("All tags": plain, removable, renamable in every state; "All chips": selected or not, plain or
  removable, in every state) with each value's token and the Edit dialog, and a page per variant in the navigation.
  15 labs pass tests/labs.test.js.

## [0.25.1] - 2026-10-09

### Changed
- The design system's tables are handed to the Platform Table as rows (Strict DS 6c): DS.grid(heads, rows, opts) draws
  them (no <table> markup is built anywhere: the component labs' matrix, property and attributes tables, the token
  family tables, the opacity, radius and layout tables). DS.table remains only for a table that arrives as markup.
  Cells a builder fills in later stay live (opts.live): the radius roles' and layout offsets' "Used by" counts now show
  (they were lost when the old markup was converted).

## [0.25.0] - 2026-10-09

### Changed (breaking)
- the legacy grid is drawn by Plenix (Strict DS 6b): no style attribute anywhere, the tables included. the legacy grid runs in
  strict mode (components/DataTable/strict.js, applied once per window as it loads): its geometry writes are off (cell
  and column widths, heights and alignment, row heights, header alignment, body sizing, virtual padding, the
  frozen-rows holder), pinned columns are classes (sticky at the widths before them, data-plx-sticky), tree rows a
  level class (the tree cell indented by the stylesheet) and popups (menus, the header filter) open in the top layer,
  placed by CSS anchor positioning against what opened them.
- DataTable and Table columns: width is a size token class (__w-<size>; a number snaps to the nearest token; the icon
  and checkbox columns __w-lead); a column without one shares the room left (__w-fill, never under 80px or its
  minWidth token). maxWidth is gone. align and headerAlign become classes. height is a size token (the body
  scrolls inside it) or "100%" (fills its container). Rows render all at once (no virtual scrolling).
- Moving rows (options.movableRows with a rowHandle column) and columns (options.movableColumns) is native drag and
  drop with a drop line; a header's resize grip and Fit to content snap its width to the size tokens. The "input" and
  "number" editors are a Plenix input. Events rowMoved and columnMoved reach on.
- The header, rows and columns are flex rows (data-table.css, table.css); their per-size rules are generated beside
  them (data-table-steps.css, table-steps.css, build-steps.js). tests/pages.test.js fails any style attribute, the legacy grid
  included (722 pages: none).

## [0.24.0] - 2026-10-09

### Changed
- No style attribute anywhere outside the legacy grid (Strict DS steps 6 and 7; owner: "strictly follow the DS.. no
  exceptions"). The design system's own samples (a token's swatch, radius, shadow, opacity, icon size, type, a demo box's
  width, a wireframe's grid) take their value as a generated class: DS.varClass(doc, name, value) writes one rule per
  property and value into the page's constructed sample sheet (document.adoptedStyleSheets: no element), DS.setVar and
  DS.sample use it, React samples use DS.sampleClass. The sample properties are named --ds-sample-<property>.
- check-system rejects every style object, style.setProperty and style write, custom properties included (until now an
  object of --plx- custom properties was allowed).
- tests/pages.test.js fails any page or frame with an element that has a style attribute (722 pages: none). the legacy grid's
  own writes (Strict DS 6b, next) are counted apart until DataTable draws without them.

## [0.23.2] - 2026-10-09

### Changed
- The image editor draws only from steps (Strict DS step 5): its presets, crop ratios, fonts, slider ranges, zoom steps
  and overlay steps live in platform/patterns/ImageEditor/image-editor.steps.json; build-steps.js turns them into one
  rule per step (system/steps.css) and a module the page reads (IMAGE_EDITOR_STEPS). The picture takes attributes:
  zoom (1.25 to the step), brightness, contrast, saturation (with vibrance), hue and blur in their steps, the preset,
  the crop ratio, rotation in quarter turns and flips; a text its font, its top on a 5% grid and a data color (the text
  color is a ColorPicker); an overlay its opacity (5%) and scale (10%). No value is written in a style attribute.

## [0.23.1] - 2026-10-09

### Changed
- Panes snap to the size tokens (Strict DS step 4): dragging the navigation pane, a secondary pane (Files) or the side
  panel (Details) snaps to the nearest --plx-ref-size-* token within its limits, and the arrow keys step to the next
  one. The width reaches the stylesheet as data-plx-width (one generated rule per size); no width is written in a style
  attribute. PlenixWorkspace.setPanelWidth keeps a panel's width as an attribute on the page root, snapped the same way.
- SIZE_STEPS, snapSize and stepSize (utils/sizeSteps.js) are generated from the tokens by build-steps.js.

## [0.23.0] - 2026-10-09

### Changed (breaking)
- Data colors are hue names (Strict DS step 2; owner: "data colors from existing hues"): blue, green, purple, red, brown,
  gray, each a solid, a soft fill and the text on it (--plx-sys-data-color-<hue>, -soft, -on-soft, pointing at the
  palette colors the data already used; no new colors). A component sets data-plx-color and system/steps.css (generated
  from the tokens) applies the hue: Avatar.color (its soft fill and text; Avatar.background is gone), Card.accent,
  ColorSwatch.color, EventChip.color, ProgressBar.color. No color value is written in a style attribute any more.
- ProgressBar draws a known amount on the browser's own <progress value max> (Strict DS step 3): the function reports
  the amount and the design system styles it; no width is written. Unknown amounts keep the running fill.

### Added
- ColorPicker (with ColorSwatch): the data colors as swatch buttons, one pressed. DATA_COLORS lists the hues
  (generated from the tokens). ColorSwatch.tone previews a system surface (accent, surface, frost).
- The utility plx-u-bg-data (the data hue as a background); plx-u-bg-var (a style attribute) is gone.

### Changed
- The apps' data colors are hue names: projects, calendars, events, contacts and threads (avatars), categories, feature
  areas. The category color fields (Settings' category editor, the Asset Manager's new category, upload and details pane)
  and the accent choice are ColorPickers. Project color black became gray (no black data hue).
- Dead color helpers removed from the suite (TINTS, tint, hexOf, PROJ_COLORS, unused bg fields).

## [0.22.7] - 2026-10-09

### Changed
- The header brand starts at the header's own inset, the same distance from the window's edge as the utilities at the
  other end (owner: the distance from the page edge to the logo is universal); the switcher has no inset of its own.
- The mark is as tall as the two rows beside it: "Plenix" on a 20px label line and the application on a 16px one, the
  mark their sum (36px); the sign-in page's mark the same.
- The application switcher has no hover fill: it opens on a click, its chevron marks it as a menu (focus ring kept).
- Every card shows its icon before the heading in Tasks and Projects too (owner, batch 272).
- The design system's spec shows the recent changes: the card's icon, the color field, the account menu with the
  application's settings and Sign out. (batch 279)

## [0.22.6] - 2026-10-09

### Added
- The Plenix brand (owner's brand kit, unedited) in platform/brand/, with brand.json naming what each file is for
  (mark, mark on a blue background, favicon, logos, spec). build-brand.js (run by build-app.js) generates the mark's
  stylesheet (components/Brand/brand.css: a mask in the current text color) and brand/favicon.svg; nothing else names a
  brand file, so updating the brand is replacing the files and building (owner: "easy to update.. nothing hard coded").
  (batch 278)
- BrandMark: the mark, colored by the tokens; spec record "Brand mark" (Iconography > Product icons). (batch 278)
- The browser icon on every page (the apps, the asset manager pages, the design system). (batch 278)

### Changed
- The application switcher shows the mark before "Plenix" and the application's name; the header name is 200px
  (--plx-ref-size-200px; was 160px) so the names keep their room. (batch 278)
- The sign-in page's header shows the mark (brand.json markOnAccent) before the brand name, both read from
  platform/brand by services/auth/brand-css.js. (batch 278)

## [0.22.5] - 2026-10-09

### Changed
- BulkActions is always shown (owner: "make the menu always visible but grayed out until selection happens"): with
  nothing selected the bar is neutral (sunken surface, neutral border), reads "No assets selected" (strings.none),
  offers Select all, and every action, menu button and More is disabled; selecting enables them. (batch 277)
- The application switcher's inset is the same on both sides (12px); the brand's 4px start inset left its fill uneven.
  (batch 277)

## [0.22.4] - 2026-10-09

### Added
- ShowMore (with CollapsibleSection): "Show more (n)" / "Show less" under a list that shows only its first rows, with
  a chevron after the label, down to show more and up to show less (owner: "show more/show less needs an icon");
  aria-expanded. The DAM's category, collection and metadata-filter lists use it. Icon chevron-up (expand_less).
  (batch 276)

## [0.22.3] - 2026-10-09

### Changed
- Input type="color" is a square swatch the field's height with the compact corners, no border, padding or frame around
  the color (owner: "just a square swatch no outline container around it"); a focus ring on keyboard focus. The DAM's
  color fields drop their size utilities. (batch 275)

## [0.22.2] - 2026-10-09

### Changed
- The account menu no longer has Change picture: the picture is changed under My account (Settings > Account > Profile)
  (owner: "i never said to add change picture here... this is under my account"). (batch 274)

## [0.22.1] - 2026-10-09

### Added
- The full icon library: every Material Symbols Sharp symbol (4,150), weight 300, optical sizes 20 and 24, outline and
  filled, unedited, from the pinned commit, hosted with Plenix at /Plenix/platform/icons/library/ (index.json lists
  them; owner: "download all material svg icons.. i want them all hosted on plenix"). build-icons.js takes a symbol from
  the library when the working set has none, so adding an icon is one line in map.json. (batch 273)
- Icons drag (drag_indicator) and sign-out (logout). (batch 273)

### Changed
- The dashboard's move handle uses the drag icon; Sign out (the account menu, Settings > Account) has the sign-out icon.
  (batch 273)

## [0.22.0] - 2026-10-09

### Added
- Panel.icon: a card's icon before its heading (owner: "in all cards... ALWAYS the icon that represents the card is
  always on the left side before the heading"); the dashboard's seven cards show their applications' icons. (batch 272)
- The account menu (AppHeader.Account): My account, Change picture, Plenix settings, <app> settings (appSettings: the
  application's own settings, "Notes settings", "Asset Manager settings"), a divider, Sign out (signOut, default the
  sign-in proxy's /outpost.goauthentik.io/sign_out); a divider under the name and email. The person's picture is set
  with choosePicture() and useSession().setPicture (a 128px square, kept in this browser until the back end stores
  it); Settings > Account > Profile has Picture with Change and Remove, and its Sign out signs out. (batch 272)
- A selectable MediaCard selects on a click anywhere but its title, box and actions (owner: "clicking the card selects
  it"); its title or a double-click opens it. (batch 272)

### Changed
- TagInput's + is a chip: the tags' 20px height, border, corners and fill, a 24px target. (batch 272)
- A navigation row's actions (the saved searches' x) show on hover and keyboard focus only, always on touch; the pin
  keeps its own rules. (batch 272)
- The side panel's footer actions sit at its end, the primary last (Cancel, then Save). Tabs in a side panel use the
  Folder variant. (batch 272)
- AppHeader.Action (Upload, Capture) is an icon item with its label as the tooltip. (batch 272)
- The dashboard's move handle icon is the next size up (md). (batch 272)

### Fixed
- The header's account picture showed a fill on the browser's own hover (the 0.16 rule covered only the scripted
  hover). (batch 272)
- The design-system docs called Table "retired" (Codex M-02); the work log is backfilled for batches 235-264 (M-05).
  (batch 272)

## [0.21.2] - 2026-10-09

### Added
- Platforms in the design system (owner: "respect the platform native interactions"): Plenix runs on the web, iOS
  and Android. The theme owns the look on every platform (color, DM Sans, radius, motion, the focus rule); each platform
  owns sizes, targets and behavior from its published standard (Apple HIG, Material 3, WCAG 2.2), and platform minimums
  beat theme and density. Every interactive component page has a Platforms section after Behavior; Button, Text field,
  Switch and Side navigation are filled in, every value with its source type (rule, token, system, reference, Plenix)
  and a link to its source. Device behavior, Control heights, Breakpoints, Bottom navigation and 14 › Mobile web,
  Desktop, iOS and Android have a Platform specification: the model, how values are sourced, touch targets, spacing
  between targets, the window classes Narrow (under 600), Medium (600–839) and Wide (840 and up), type, screen and
  keyboard, navigation and back. Plenix decision 11 in STANDARD.md; check-spec.js checks the section order. (batch 273)

## [0.21.1] - 2026-10-09

### Fixed
- Menus open on top of everything (owner: "the correct standard for any menu is to always be on top"): a Menu opens in
  the browser's top layer (popover="manual"), placed beside its trigger by CSS anchor positioning (anchor-scope on the
  wrapper, anchor-name on the trigger, position-area per placement, flipping at the window's edges); no card,
  checkbox, pane or scroll area covers or clips it, and nothing is written inline. Browsers without anchor positioning
  keep the previous placement. Verified in Chrome and Firefox 157. (batch 272)

### Changed
- Menus, the combobox list and the app switcher take the lowest radius role, --plx-sys-radius-surface-4px (owner: "the
  lowest size in the existing DS"; --plx-ref-radius-2px is a reference value, which stylesheets may not use for a
  themeable radius). (batch 272)

## [0.21.0] - 2026-10-09

### Changed
- TagInput is a + button (owner: "it should be a + and clicking that plus exposes the textfield"): pressing it reveals
  the field, focused; Enter adds the tag and keeps the field open for the next; Escape, or leaving it empty, closes it
  and returns focus to the +. New props label (default "Add a tag") and collapsible (default true). (batch 271)
- Lists align with their section (owner: "the alignment of the list should align with the alignment of the header
  underline"): ActivityList rows have no inline inset, so a row's content starts and ends at the list's edges; a row
  that opens keeps a small inset for its hover fill, pulled back by the same token. (batch 271)
- Drag and drop shows the grab cursor on a handle and grabbing while dragging (DataTable row handles, WidgetGrid
  handles). (batch 271)

### Fixed
- A thin line under the open tab at fractional display scales (125%, 110%): the tab list clipped the open tab's joint
  with the panel; the list now reaches one thin line further and gives it back, and the open tab draws its own joint.
  Clean at 100-200%. (batch 271)

## [0.20.2] - 2026-10-09

### Changed
- Inline fields stay side by side (owner: side by side takes less height; "the side by side is utilizing a very wide
  width for the fields... no reason to"; "use tooltip to show the label"): in a group the control column runs from
  --plx-sys-field-width-md to --plx-sys-field-width-lg, packed to the start, so controls never stretch; when space is
  short the control keeps its minimum and the label shortens with an ellipsis, its full text in a Tooltip; the label
  moves above only below 180px (the value of --plx-ref-size-180px). PropertyList's columns do the same. (batch 270)

### Added
- Tooltip disabled: neither shows nor describes its trigger (for a label that only needs it when cut short).
  useTruncated(ref) in utils/overflow.js tells when a one-line text is cut short. (batch 270)

## [0.20.1] - 2026-10-09

### Fixed
- Narrow panels (owner: "the text is going outside the lines!! This needs to be responsive", option A, no new tokens): a
  Stack of inline Fields shares one label column as wide as its longest label (at most --plx-ref-size-160px), so there
  is no dead space between short labels and their fields; below 320px of width (the value of --plx-ref-size-320px; a
  container condition cannot read a custom property) every label moves above its control. PropertyList's columns do the
  same, and its values wrap between words only ("1.4 GB" and "Jul 3, 2026" stay whole). Rating's stars close their gap
  in a narrow group. The Asset Manager's color and hex wrap together. (batch 269)

## [0.20.0] - 2026-10-09

### Changed
- TagInput is a text field like every other input control (owner: "make it consistent with the rest of the UI"): it
  takes .plx-input's border, hover, focus (border color only) and disabled states and height; in a tag list it fills
  the rest of the row. New prop onAdd(text): Enter adds the trimmed text and clears the field (the application ignores
  a tag it has). The Asset Manager's Tags and the add-asset dialog use it. A tag being renamed is a small field with
  the input's focused border (it was a blue underline shadow). (batch 268)
- "DataGrid" / "data grid" is gone from every active file (owner: "nowhere"): the reference file is
  docs/data-table-reference.html (was datagrid-legacy-grid-demo.html), the Data table alias and the orphan "Data grid"
  guidance entry are removed, guidance says "data table", and the two Fluent 2 mapping rows that named its
  "Data grid" are dropped. Only the changelog and the work log keep the old name. (batch 268)

### Fixed
- The design system's usage.js said 0.19.0 in git after the 0.19.1 release (the deploy regenerated it). (batch 268)

## [0.19.1] - 2026-10-09

### Changed
- Strict design system, step 1 (owner: "strictly follow the DS.. no exceptions": no value in a style attribute, not even
  a custom property). Values from the data now arrive as attributes, and the new generated stylesheet
  platform/system/steps.css (build-steps.js, run by build-app.js) has one rule per allowed step: Tree indents from
  aria-level, MediaCard and Preview shapes from data-plx-aspect, Skeleton sizes from size-token names (width="200px"),
  and TimeGrid's hours, days and events (quarter hours, at least 30 minutes). The suite's icon takes its container's
  size by a class (.plx-u-icon-box replaces the -var pair). Every measured position and size is unchanged. (batch 267)

## [0.19.0] - 2026-10-09

### Changed
- Design system: every variant card is a tabbed card (owner decision, "option D: tabs", with the Folder tabs). The
  header keeps the variant's name and "Its page ›"; under it the Platform Tabs (variant="folder"): Preview (the live
  sample alone, centered with generous padding on the plain surface, its edge a thin border-default line; no gray
  stage, batch 156), Props and class (the prop that selects it, its class, the attributes the class sets) and Code (the
  usage, colored, with Copy). "Show code" left the header. The per-variant pages show the same tabs. Examples that are
  not variant cards and Base cards are unchanged. The old side-by-side layout (Split, .ds-split) is gone. The Preview
  has no frame of its own: the card sits in its group's panel, so a frame would be a third container (the nesting
  rule). (batch 265)
- Design system: the States section draws the states side by side (owner: "side by side with vertical line divider in
  between... autosize so it does not wrap"): each column as wide as its sample, a thin divider between columns,
  continuing on the next line when the panel is full. Button keeps a card per state, as does any component with a
  sample wider than the panel (tables, dialogs, headers). (batch 266)

## [0.18.0] - 2026-10-09

### Added
- The Button treatment for Counter, Status dot, Notice, Spinner and Progress bar (owner: "every variant for every
  component"): component tokens (count, status-dot, notice, spinner, skeleton, progress-bar), a lab for each that draws
  every variant with each value's token and an Edit dialog (display-labs.js), and a page for each of their 28 variants
  in the navigation. Progress bar's tones are now tokens (--plx-comp-progress-bar-{tone}-fill). Nothing changes on
  screen. (batch 264)
- The component lab passes the chosen content to a lab's token lookup, for parts some content leaves out (a progress
  bar of unknown amount has no value text). (batch 264)

## [0.17.0] - 2026-10-09

### Added
- Badge has the Button treatment (owner: "every variant for every component to have navigation and design specs just
  like we did for the buttons"; the first of 49 components): 29 component tokens (--plx-comp-badge-*), a lab that draws
  every tone, style and size with each value's token and an Edit dialog (display-labs.js), and a page for each of its
  nine variants in the navigation. Nothing changes on screen. (batch 263)

### Fixed
- tokenize-component.js rewrote a stylesheet's comment when it held a brace (".plx-badge--{tone}"); comments are now set
  aside before the rules are read. (batch 263)

## [0.16.2] - 2026-10-09

### Added
- The spec's Edit dialog saves (owner, items 10/11): it shows who is signed in (Authentik), and Save opens a pull request
  with the changed tokens after the save service rebuilds them and runs the system check. Signed out, a Sign in link that
  returns to the same page; a Viewer, why Save is off; a conflict, a failed check, an unconfigured server or a page
  without the service, its own message and the changes to copy. (batch 262)

## [0.16.1] - 2026-10-09

### Fixed
- The design-system spec failed to load in 0.16.0 (a quote in a variant card caption); 0.16.0 was never deployed. Same
  changes as 0.16.0. (batch 261)

## [0.16.0] - 2026-10-09

### Added
- Preview `aspect` (owner: "this preview area should be based on standard image proportions"): "4/3" (default), "3/2",
  "1/1" or "16/9", as MediaCard's. It was a 140px-high strip (about 2:1). (batch 261)
- Token --plx-comp-side-panel-width-default: the navigation pane's width. (batch 261)

### Changed
- SidePanel opens as wide as the navigation pane (owner: "the right pane default size should be the same size as the left
  pane"), and can be dragged down to it (min was 280px). (batch 261)
- Card and MediaCard, selected (owner: "use the primary token color 1px border"): a 1px border in
  --plx-sys-action-primary-background, without the ring. (batch 261)
- The header's account picture gets no fill around it on hover or while its menu is open (owner: "no need to make this
  enlarge when hovered"). (batch 261)

### Fixed
- MediaCard clipped everything inside it, so its actions menu was cut off at the card's edge (it looked like a layering
  fault; the menu's layer token was right). The picture now clips itself to the card's inner corners and the menu shows in
  full. (batch 261)

## [0.15.0] - 2026-10-09

### Added
- ActivityList `stacked` (owner: "put the '## files…' on a second line in the smallest font available in the tokens"):
  the meta sits on its own line under the title in --plx-ref-font-size-09, the smallest type token. The Asset Manager's
  Downloads lists use it, and the "Download by File Type" heading is now sentence case. (batch 260)
- Token role --plx-sys-fill-neutral-border: gray-300 in light, gray-900 in dark, two shades darker than
  --plx-sys-fill-neutral. (batch 260)

### Changed
- Tag (owner: "add a border 2 shades darker than the color of the bg"): a thin solid border in
  --plx-sys-fill-neutral-border. Chips are unchanged. (batch 260)
- The spec now has variant cards for ActivityList "Stacked" and SidePanel "Resizable"; check-spec treats
  plx-side-panel--resized as a state the panel sets, not a variant. (batch 260)

## [0.14.0] - 2026-10-09

### Added
- SidePanel `resizable` (owner: "the right pane also needs the ability to resize"): its start edge is dragged or moved with
  the arrow keys between --plx-comp-side-panel-width-min (280px) and -max (560px); Home and End jump to them; the width is
  remembered. The Asset Manager's details panel uses it. (batch 259)
- SecondaryPane `onClose` (owner: "resize, expand/collapse and close… the close is based on the application"): a standard
  Close button ends the header row, given only by an application whose pane can close. The Asset Manager's Files pane now
  resizes, folds to a rail and closes. (batch 259)
- Tabs `variant="folder"` is a documented variant, "Folder" (owner: "just the header part of the tabs… give it a name"):
  the tab strip alone over a baseline, the open tab joined to it, the content unframed. (batch 259)

### Fixed
- Tabs, contained: the panel's side edges were inset shadows and its top and bottom real borders, which render differently
  at fractional display scales (the left edge looked heavier). All four edges are drawn alike now, inside the panel.
  (batch 259)

## [0.13.2] - 2026-10-09

### Changed
- Sentence case (owner, item 5; the design system's content standard): UI labels, actions and document headings across
  the suite were Title Case ("All Tasks", "New Project", "Project Title", "My Account", "The Problem"). 82 strings now
  read in sentence case ("All tasks", "New project", "Project title", "My account"). Names stay: people, companies,
  products and apps (Google Drive, Asset Manager, Dashboard), sample records, and the product spec's entity, feature and
  module names. AppHeader's account menu says "My account". (batch 257)

### Added
- Design system: the Field lab (batch 256): "All fields" (stacked, inline, row × default, info hover, info focus, info open,
  invalid, required; the default or small label column) and five variant pages (Stacked, Inline, Row, a small label column,
  with an error), the anatomy and the Edit dialog on the field tokens: the label, required mark, description, error, the (i)
  button and its hit area, the info text and every layout gap (888 checks, 43 tokens). DS.table takes a minimum column
  width, so wide specimens scroll instead of overlapping. The form controls now have the Button treatment.
- tests/labs.test.js (npm test, CI): every component lab, at every size, variant, state and content: each Edit dialog
  field's token must move the property it names (3,910 checks over seven labs).

### Added
- Design system: the Checkbox, Radio group and Switch labs (batch 255). "All checkboxes" (unchecked, checked, partly checked
  × default, focus, disabled), "All radio groups" (column, row) and "All switches" (off, on), and nine variant pages, each
  with the lettered anatomy and the Edit dialog on the check, radio-group and switch tokens: the box, focus outline, label,
  description and spacing; the legend; the track and its knob (.plx-switch__track::after, its travel when on). Mapping
  proof: 120, 89 and 101 checks. The shared lab measures inner parts (p.part), draws its legend from a component's parts
  (spec.anchors: each letter points at its part) and runs spec.after for what markup cannot say (indeterminate). The
  "All" pages read "switches", "checkboxes".

### Added
- Design system: the Text area and Native select labs (batch 254). Each gets "All text areas" / "All native selects" and
  seven state pages (Empty, Filled, Focused, Read-only, Disabled, Invalid, Required) with the lettered anatomy and the Edit
  dialog: the input tokens plus the text area's own type, height and block padding, and the select's end padding, width
  and chevron (read from .plx-select::after). Mapping proof: 156 and 192 checks, every field moves exactly its property.
  The three input-family labs share one builder (form-labs.js); the shared lab reads a wrapper's properties (host:
  parent), and the anatomy lists left and right padding apart when they differ.

### Added
- Design system: the Text field lab (form-labs.js; batch 253). Text field · Base gains "All text fields" (every style in
  every state, at each width) and 13 variant pages: XS, SM, MD and LG; Data and Emphasis; Empty, Filled, Focused, Read-only,
  Disabled, Invalid and Required. Each lab page has the lettered anatomy, the attributes and the Edit dialog, one
  --plx-comp-input-* token per field (the placeholder color too). Mapping proof: setting each token moves exactly its
  property in every width, style, state and content (2,364 checks, 24 tokens). The shared lab reads pseudo-elements and
  knows widths and line heights; the All page opens the page of the state clicked.

### Changed
- Design system: the Button lab is now the shared component lab (component-lab.js; batch 252). A component registers a
  description of itself (sizes, variants, states, content, its property-to-token map, its markup) with DS.registerLab(id,
  spec), and the item pages draw any registered component's matrix, variant anatomy and Edit dialog (spec.js looks the lab
  up by the item's id; it called the Button lab by name). button-lab.js is the Button's description. The Button pages
  (base, All buttons, five variant pages, the Edit dialog) are pixel-identical before and after. First step of the form
  controls' labs (owner: one shared lab; every page).

## [0.13.1] - 2026-10-09

### Fixed
- @plenix-ds/react: a DataTable in an app built with a bundler (Vite, webpack) never drew: it looked for the legacy grid next to a
  Plenix script the page does not have (404 on /platform/vendor/). The npm build now falls back to the release's CDN copy,
  https://design-system.lighthouseway.org/cdn/<version>/vendor/ (versioned, never changes); window.PlenixVendorBase still
  overrides it. Found while building the starter template (plenix-ds/plenix-starter). (batch 251)

## [0.13.0] - 2026-10-09

### Added
- Nesting rule (owner: "never 3 containers nested… 2 is okay but never 3"): platform/system/nesting.css. Panel, Card, a
  contained Tabs panel, CodeBlock, Notice, Fieldset, DropZone, Table and DataTable nest two deep; a third inside those two
  draws no frame (transparent border, no shadow; nothing moves). An audit found 55 triple nests (Panel > Panel > Table,
  Panel > Tabs panel > Table, Panel > Panel > DataTable); none remain. tests/pages.test.js now fails any of its 631 pages
  with three framed boxes nested (anything framed on three sides or by a shadow; design-system specimens exempt), and
  STANDARD.md §02 states the rule. (batch 250)

## [0.12.1] - 2026-10-09

### Fixed
- Tabs, contained (owner: "the left corner of the tab container is not consistent with other corners"): the panel's top-left
  corner was always square; it is rounded like the others and square only while the first tab is open, where that tab
  meets it. (batch 249)

## [0.12.0] - 2026-10-09

### Changed (visual)
- Table and DataTable (owner: "compare the two… the tabular is accurate"): a row label (rowLabel, the shaded first column)
  is the row's name, so it takes the name column's medium weight (--plx-comp-[data-]table-name-font-weight), also for links
  and Text inside it. Reference tables (props, tokens, classes) now read like the DataTable. (batch 248)

## [0.11.0] - 2026-10-09

### Changed (visual)
- One typography in every table (owner: "it's extremely frustrating to see typography not consistent"). An audit of all
  text in 212 tables (apps and design system) found DM Mono at 11–12px from Text variant="data" and token/class links
  inside cells, and List items at 13px in 12px tables. Now any Text, code or List inside a Table or DataTable cell takes
  the cell's font and size (color and weight stay), and the design system's token and class links use .ds-code-link
  (the data font in prose, the table's font in a cell) instead of the !important utility. Result: every body text is
  DM Sans at the table size (12px Compact, 13px Standard), regular, with names medium; badges, tags, chips and buttons
  keep their component sizes. tests/data-table.test.js now fails on any other font or size in a table and covers the
  design system's reference tables (25 views). (batch 247)

## [0.10.0] - 2026-10-09

### Fixed
- DataTable (owner: "uncheckbox does not really work"): a checked row checkbox could not be unchecked: in the "click" range
  mode the rows use, the legacy grid's checkbox read a plain click as "only this row", and an extra cell handler toggled again.
  The row checkbox now toggles its row (Shift and Ctrl/Cmd keep range and add); the cell around it acts as a row click.
  (batch 246)

### Changed (visual)
- Table and DataTable (owner: "this typography is not consistent"): kind "data" cells no longer use the muted color; they
  take the row's color (also a selected row's), so every cell reads alike: one font, size, color and baseline. (batch 246)

## [0.9.0] - 2026-10-09

### Changed (visual)
- Table and DataTable typography (owner: "if it's problematic, simply use DM Sans"): kind "data" cells were DM Mono at
  12px beside DM Sans at the table size (13px at Standard), so a row's cells sat on different baselines and code-like
  values looked smaller. They now use the table's DM Sans and size (--plx-comp-table-data-font-family and
  --plx-comp-data-table-data-font-family -> typeface-sans; the data font sizes -> the table font size), still muted.
  (batch 245)

## [0.8.5] - 2026-10-09

### Changed (visual)
- Table and DataTable (owner: "the border right should be solid without any space top and bottom"): a row header (rowLabel)
  ends in one solid line, top to bottom of each row and the header; the next column's short line gives way. Table now
  has the solid edge the DataTable already had. (batch 244)

## [0.8.4] - 2026-10-09

### Changed (visual)
- App switcher (owner: "should not have any scrolling… it can be wider… whatever is pinned should not be repeated"):
  600px wide with five applications to a row and no height limit or scrolling (a phone-sized viewport keeps 320px and
  three to a row); each application shows once: pinned ones under "Pinned to the header", the rest under "More
  applications" ("All applications" when nothing is pinned; hidden when everything is). (batch 243)

## [0.8.3] - 2026-10-09

### Changed (visual)
- NavList (owner: "in categories, also show the open folder when selected"): the current item's "folder" icon shows as
  "folder-open" (filled, like every current icon); the Asset Manager's categories follow. (batch 242)

## [0.8.2] - 2026-10-09

### Fixed
- Tree (owner: "this selected folder should be in open state"): the selected item shows its open icon, filled (a selected
  folder is an open folder), also when it has no children. (batch 241)

## [0.8.1] - 2026-10-09

### Fixed
- Tree (owner: "only the open icons should be fully shaded"): a selected item filled the icons of every item inside it,
  because the icon set fills icons under any selected element and a tree item holds its subtree. A tree row's icon now
  follows its own item only: outline while closed, filled while open (also at Comfortable density's 24px). (batch 240)

## [0.8.0] - 2026-10-09

### Added
- Tree (owner: "use open folder in the tree when a folder is opened"): an open item shows its open icon: a "folder" item
  opens as "folder-open" (Material Symbols folder_open, already in the set), and nodes[].openIcon names any other pair.
  The Asset Manager's folder trees follow. (batch 239)

## [0.7.0] - 2026-10-09

### Added
- Badge: variant="soft" (owner: yes to a soft Badge): the tone's text on its pale fill, the pair Notice uses
  (--plx-sys-feedback-{tone}-soft and -content), quieter for many statuses in a dense list. Every tone passes AA in both
  themes (lowest: danger in dark, 4.58:1). Class plx-badge--soft; design system: Badge › Variant. (batch 238)
- Pressed colors (owner: yes to a darker pressed fill): new roles --plx-sys-state-pressed, -state-selected-pressed,
  -fill-neutral-pressed, -action-primary-background-pressed and -action-danger-background-pressed (light: gray-200,
  blue-200, gray-300, blue-700, red-700; dark: gray-600, gray-600, gray-600, blue-700, red-700; existing palette colors).
  Button: 13 tokens (--plx-comp-button-size-{s}-pressed-background, --plx-comp-button-{variant}-pressed-background and
  -border) and :active rules, .is-pointer-down to draw it; the Button lab has a Pressed state, and the design system's
  States panels read :active as "Pressed (held)" (a state inside :not(…) no longer counts as that state). On the accent
  header, secondary buttons use --plx-sys-accent-state-pressed (light blue-700, dark gray-700). Menu items, tree rows, row
  buttons, activity items, nav items, tool rail items, pagination and chips take the pressed fill while held; selected
  and current items keep theirs. Danger has no darker red in the palette, so its pressed role is red-700 like hover for
  now. (batch 238)

### Changed (visual)
- Tree (owner): the open control is a + box on a closed row and a − box on an open row (Material Symbols add_box and
  indeterminate_check_box, unedited, the 16px square; icon names square-plus, square-minus) instead of the turning
  chevron. (batch 238)

### Fixed
- Badge and Count: the warning tone failed WCAG AA contrast (white text on brown-500, 4.46:1). New semantic roles
  `--plx-sys-feedback-{tone}-solid-label` (light and dark) are the fill behind text: warning points to brown-800 (8.34:1),
  the other tones to the same colors as `-solid`. Badge and Count's pill use them; StatusDot, ProgressBar and Toast keep
  `-solid`. Warning badges and counts are darker brown; every tone and size passes in both modes. (batch 228)

## [0.6.0] - 2026-10-09

### Changed (visual)
- Feel (owner: "I want it very snappy… responds instantly… crisp animations"): every control answers at once. Hover colors
  and edges fade in over 80ms instead of switching; buttons, chips, segmented items, tiles and small icon controls shrink
  to 98% while pressed (rows, tabs and menu items keep their hover fill); menus, combobox lists and dialogs pop in (fade
  and grow from 96%) in 120ms from their anchor corner, and the modal backdrop fades in. Drawers and toasts keep their
  slides. New tokens: --plx-ref-motion-duration-instant (0.08s), --plx-ref-motion-ease-out, --plx-ref-motion-scale-98 and
  -96; theme roles --plx-sys-motion-duration-instant, --plx-sys-motion-ease-enter, --plx-sys-motion-press-scale,
  --plx-sys-motion-enter-scale. The rules are in system/motion.css with zero specificity (:where), so a component's own
  transition still wins; reduced motion still turns all of it off. (batch 236)

### Added
- Loading: DataTable.preload() and Table.preload() start loading the legacy grid before the first grid mounts; the Asset
  Manager and Files call it as they start. Every other page prefetches the legacy grid into the cache once idle after load.
  (batch 237)
- Next page ready before the click: in Chromium browsers a same-site link is prerendered when the pointer rests on it
  (speculation rules, moderate eagerness), so switching apps shows the finished page at once; other browsers fetch the
  page on hover. Links with target, download, data-plx-no-prefetch or a same-page anchor are skipped; nothing runs from
  file://. (platform/utils/prefetch.js, batch 237)
- Deploy: live app pages drop the development audits (radius-audit.js, style-audit.js) and preconnect to the CDN; the
  hosted design system loads one bundled stylesheet (platform/dist/platform.bundle.css) instead of platform.css and its
  imports: 12 stylesheet requests instead of 107, computed styles identical. (batch 237)

## [0.5.0] - 2026-10-09

### Changed (visual)
- Tables (owner: "data grid should be merged into data table… Table should have the same UI as data table except it is purely
  static"): DataGrid is DataTable (components/DataTable, plx-data-table, --plx-sys-data-table-*, --plx-comp-data-table-*;
  no "grid" name left), and Table is back as the static table: the same the legacy grid engine and look (its own tokens
  --plx-sys-table-*, --plx-comp-table-*, equal to the DataTable's: computed styles identical in light and dark at each
  density) with no hover, sorting, filters, menus, selection, resizing, moving or editing. Reference tables use Table: the
  design system's props, attributes, states, classes and token tables, Settings' documentation and fact tables,
  Capture; record lists stay DataTables. Design system: Table and Data table items (#/data-display/table,
  #/data-display/data-table), the group is Tables, Data grid merged into Data table (STANDARD.md §3 updated). Tests
  renamed tests/data-table.test.js and tests/data-table-reference.js (180/180). (batch 234)
- Light-theme shadows: shadow-sm, -md, -lg, -card, -raised and -menu were opaque gray (gray-100/200/300), which glowed
  white over the blue header. They are now layered black at 14% (--plx-ref-color-black-alpha-14), an outer blur and a tight
  inner one, equal on every side (no offset), over the same 1px gray-200 edge; e.g. menus 0 0 40px + 0 0 8px. Dark theme
  unchanged. (batch 235)

## [0.4.0] - 2026-10-08

### Fixed
- Regional density for component tokens: a Button inside a compact or comfortable region (data-plx-density on part of a
  page) kept the page's size since 0.2.0, because component tokens were declared only on :root (a custom property is
  computed where it is declared). Component tokens are now written on :root and on every density and interaction
  context. No app page used a density region, so nothing changed on screen; tests/density.test.js guards it. (batch 221)

### Added
- ActionBar (new pattern): a page's or a form's buttons on the right, the primary last, in a bar that sticks to the
  bottom of the scrolling page (owner: buttons on the right, in a bar that sticks to the bottom of long pages and all pages
  with actions). SettingsSection's actions are drawn in one; the Asset Manager's system settings and My account use it,
  with a destructive action first and the primary last. Tokens --plx-comp-action-bar-*; a scrolling area sets
  --plx-comp-action-bar-stick to minus its bottom padding so the stuck bar is flush. Design system: Action bar
  (#/actions/page-actions). Dialog, panel and side panel footers were already on the right. (batch 231)
- DataGrid: every table in Plenix is a legacy grid grid (6.6.1, MIT, vendored in platform/vendor/legacy-grid, loaded the
  first time a grid renders) in the owner's grid style (docs/datagrid-legacy-grid-demo.html), drawn with tokens only
  (components/DataGrid/data-grid.css). Columns are the legacy grid's own definitions plus Plenix kinds (name, data, icon,
  center, actions), React cells (render), filters, a row header; header menu, row menu, filter popup, groups, tree rows,
  editing, selection. New tokens: grid color roles (--plx-sys-grid-*, light and dark), --plx-sys-grid-row-height
  (28 / 32 / 40; 44 on touch and mobile) and --plx-sys-grid-font-size (12 / 13 / 13), 48 --plx-comp-data-grid-*
  tokens; palette colors for the grid's dark look (gray-350, -400, -850, -900, -925, -950, blue-850, -900, green-900,
  brown-900, black-alpha-14, -50) and space-6px, space-10px, size-18px, motion-duration-quick (0.12s), opacity-45.
  Icons added from Material Symbols (unedited): sort-ascending, sort-descending, filter-off, visibility, visibility-off,
  attachment, more, open, select. tests/grid-reference.js compares every part of the grid with the reference: 180 of
  180 match (light and dark, each density). The pages move to DataGrid next; Table stays until then. (batch 226)
- Form controls on component tokens: Input, Textarea, Select, Checkbox, Radio group, Choice card, Switch and Field
  take their look from 149 new `--plx-comp-input-*`, `-select-*`, `-textarea-*`, `-check-*`, `-radio-group-*`,
  `-choice-*`, `-switch-*` and `-field-*` tokens in components.tokens.json, each pointing to the same role as before. A
  new tool, tokenize-component.js, does this for any stylesheet (the Button treatment of batch 207 as a tool);
  tests/style-compare.js compares the computed styles of two copies element by element. No visual change: 129,485
  values on the 14 app pages and 20,069 on the form controls are identical, the pixel comparison is identical.
  tests/density.test.js now also checks Select, Checkbox and Switch in each density region (18 of 18). (batch 223)
- Foundations belong to the theme: each theme has a foundations file (theme-<name>.tokens.json) with its typefaces,
  font weights, letter spacing, shape (radius scale), border widths and styles, motion (durations, easing, stagger),
  opacity levels and focus ring, as `--plx-sys-typeface-*`, `-font-weight-*`, `-letter-spacing-*`, `-shape-*`,
  `-border-width-*`, `-border-style-*`, `-motion-*`, `-opacity-*`, `-focus-ring-*`. The radius and font roles point to
  them; every component and pattern uses them (816 uses converted). Spacing, control heights, density, grid,
  breakpoints and layers stay shared by every theme. check-system rule `themeable` rejects a reference scale in a
  stylesheet; build-tokens rejects a theme that leaves out a foundation. The default theme keeps today's exact values
  (no visual change: the Button snapshot and every app page are identical). (batch 220)
- Themes, defined in the design system (platform/standards/themes.json): a theme is a full set of semantic roles,
  light and dark, pointing to the shared palette. The current look is the "default" theme (was "plenix"; files
  theme-default.*.tokens.json, system/themes/default.css). build-tokens.js makes one stylesheet per theme and rejects a
  theme that writes a color literal or leaves out a role; build-standards.js makes the theme list (providers/themes.js,
  THEMES) and system/themes/index.css. Switching: data-plx-theme on <html>, PlenixWorkspace.setTheme / clearTheme
  (remembered for every page), `useTheme()`; Settings › Appearance has Theme and Mode. tests/theme.test.js (10 checks)
  builds a sample theme in a temporary copy and switches to it. (batch 219)
- The layout standard, defined in the design system (platform/standards/layout.json): the five layout modes (widths,
  alignment, what they hide) and which kind of page gets which mode. build-standards.js generates the code the apps run
  (providers/pageLayouts.js, system/layout-modes.css); check-system rejects a hand edit (rule generated) and an app that
  sets a layout itself (rule page-layout). Apps say what a page is: `<AppShell page="settings">`, `mountSuite(app,
  render, { page })`; SettingsLayout is a settings page by itself. (batch 218)
- The five layout modes, built (batch 217; since batch 218 a page gets its mode only through the layout standard): contained centers the content
  at the 960px form width; hybrid caps paragraphs at 760px and forms at 960px; multi-pane makes each pane scroll on its
  own; focus hides the navigation and the inspector. The suite apps are fluid, the image editor is focus (no visual
  change). tests/layout.test.js (12 checks) runs in `npm test` and CI. (batch 217)

### Removed
- Every name/value table is a DataGrid (owner: "everything must be tabular"): PropertyList's table variant, its stylesheet
  rules and --plx-comp-property-list-label-width are removed; the design spec's fact tables (props(), prop and class),
  Settings (baseline operations, functionality, enablers, UI, the product vision's tables, the mapped example) and
  Capture draw DataGrids (names as the row header, values wrap, no header row). The app grids drop the old Table's
  habits: Files and Projects lose the shaded name column, Type is a technical value (no chip) in Files, Projects and
  Search, sizes align to the end. check-system rule tables also rejects the PropertyList table variant. (batch 229)
- The Table component (components/Table), system/table.css (.plx-data-table) and the 33 table tokens
  (--plx-sys-table-*, --plx-comp-table-*): every table is a DataGrid. PropertyList (variant "table") and ActivityList take
  the grid tokens (row height, lines, header shade); PropertyList gets --plx-comp-property-list-label-width. check-system
  rule tables rejects a <table>, a table element made in code, an import of Table and the retired table classes;
  tests/pages.test.js fails any page that shows a <table>. The design system's Data table item is now Data grid
  (#/data-display/data-grid): how to apply it, every part of its style with its tokens, one live grid. (batch 226)

### Changed (visual)
- Dark navigation borders are visible: --plx-sys-state-hover-border and --plx-sys-state-selected-border in dark are
  gray-500 (two shades lighter than the gray-700 fill; was gray-850). Large cards use two stacked cards (view_agenda;
  crop_square removed). Design system: the Action bar leaf is the ActionBar's home, Data toolbar moves to Action panel.
  (batch 233)
- Menus have a shadow again (owner): --plx-sys-elevation-menu points to --plx-sys-shadow-menu (was none, decision D9), so
  the Menu, the Combobox list and the app switcher float with the same soft shadow and border. Property table and
  Comparison table now lead to the Data grid page. (batch 232)
- Navigation rows (NavList, Tree): hover and the current row fill the whole row, pin included, with an inset border two
  shades darker in the same color family: new roles --plx-sys-state-hover-border (light gray-300, dark gray-850) and
  --plx-sys-state-selected-border (light blue-250, dark gray-850). The app switcher panel takes the Menu's real border
  (its inset border was hidden under its tiles). The Asset Manager's View and Card size controls show icons (grid,
  table rows; small, medium, large cards: Material Symbols added unedited). (batch 230)
- Button labels no longer cut letters that reach below the line (the g in "Tagging"): the Button's line height is
  1.3 (--plx-comp-button-line-height = line-height-tight, was 1); button heights are unchanged. (batch 227)
- Fonts are hosted with the Platform: DM Sans (variable 300–700, italic) and DM Mono (300, 400, 500, italic) in
  platform/fonts with platform/system/fonts.css (SIL Open Font License); every page preloads DM Sans and no page calls
  Google. The styles package and the CDN carry the font files beside fonts.css. check-system rule fonts rejects a call
  to Google Fonts. The package build's default theme path (renamed in batch 219) is fixed. (batch 227)
- Every table in the apps is a DataGrid (the legacy grid, the owner's grid style): Files, Projects (files), the suite's
  Search workspace (every source), Settings (scenarios, fields, product vision, terminology, data model: 7 kinds of
  table), the Asset Manager's categories, collections and asset results, its system settings (enabled for, actions,
  view and edit all folders, fields, conversion presets, users, email templates, database, customizations, scheduled
  tasks) and its field dialogs. Columns are written as the legacy grid column definitions; sorting is the legacy grid's (sorter
  functions for counts, sizes and dates); dialogs reorder rows by their handle (movableRows). DataGrid adds: selected /
  onSelectionChange, Enter opens a row that has rowClick, the wrap kind (long text grows the row), a grid built while
  hidden is drawn when shown, rows equal to the ones shown change nothing. tests/grid.test.js (in npm test and CI)
  opens all 22 grid views and checks each grid is built, axe-clean, free of inline styles and on the grid row height.
  (batch 226)
- Checkbox in compact density: no top and bottom padding, so a single-line Checkbox, Radio or row is 24px (the
  compact control role, on the 4px grid) instead of 26px. Standard and comfortable are unchanged. Token: a compact
  value for --plx-comp-check-padding-block. On the app pages only the 10 checkboxes of Asset Manager › System settings
  change (their padding; their rows keep their height). (batch 224)
- Settings pages follow the standard (settings → contained): the Settings app and the Asset Manager's settings are one
  centered column at the 960px form width. SettingsLayout's own 900px limit is removed. (batch 218)
- Design system: lists of token and class links stand 12px apart (a 26px pitch), so each is a 24px touch target;
  accessibility issues 3 → 0. (batch 218)
- Asset Manager: interface labels in sentence case (299 labels, e.g. "Save changes", "GPS latitude", "Move assets"); content keeps its capitals (asset titles, people, category, collection, group and preset names). "New category" uses the add icon instead of a typed "+". (batch 216)

## [0.3.0] - 2026-10-08

### Added
- `strings` props on 14 components for their words and announcements (CodeBlock, Count `moreThan`, Button, Card,
  WidgetGrid, BulkActions, NotificationList, MediaViewer, SearchWorkspace, NavList, FilterBar, AppShell, SecondaryPane,
  Pagination); `locale` where numbers are formatted (they follow the page language). English output is unchanged.
- Chat.Thread `follow`: opens at the newest message and keeps it in view as messages arrive.
- tests/keyboard.test.js (in `npm test` and CI) and tests/compare.js (before/after pixel comparison of two copies).

### Fixed
- Keyboard: Toolbar and ToolRail are one Tab stop (roving focus); Rating moves focus to the chosen star; the application
  switcher closes when focus leaves it; focus rings on Panel and SectionHeading toggles, DropZone, Rating and Pagination;
  the chat thread is reachable by keyboard. (batch 213)
- Screen readers: CodeBlock announces Copied or Could not copy; a capped Count says "More than 99"; a selected Card is
  aria-current. (batch 213)
- Right to left: arrow keys follow reading order (Toolbar, Tabs, SegmentedControl, Rating, Tree, MediaViewer, WidgetGrid,
  splitters); ButtonGroup joins, the Switch knob, the toast and the indeterminate progress mirror; directional icons
  (chevrons, arrows, panel open and close, undo and redo) mirror. (batch 214)
- Thumbnail and Avatar fall back to the icon or initials when their image fails to load. (batch 215)
- Font sizes are rem (the same at the default 16px), so text follows the person's font-size setting (WCAG 1.4.4). (batch 215)
- Object / record page: the aside stacks under the body below 1024px. (batch 215)
- Accessibility (axe-core, WCAG 2.2 AA): 418 issues to 3 on 140 pages. The calendar month is a labeled group of day
  buttons named by full date (no broken grid roles); WidgetGrid's live region sits beside its list; a Table (and a
  design system table) that scrolls is a named region in the Tab order, with the focus ring; design system state
  samples set ARIA states only where the role allows them. (batches 211, 212)

### Changed (visual)
- The drawer slides in from its edge (motion tokens; none with reduced motion). A Preview button shows a hover fill.
- SearchWorkspace's result count uses the item noun ("8 assets", not "8 results").
- Sentence case: "Add event", "Add task", "Save as", "Zoom in", "Zoom out". (batch 215)
- Link text (`--plx-sys-content-link`, light theme) is blue-600 instead of blue-400: 6.04:1 on the canvas (was 4.46).
  Primary buttons and the header keep blue-400. (batch 212)
- Subtle text (`--plx-sys-content-subtle`, light theme) is gray-700 instead of gray-600, as `content-muted`. (batch 212)
- The app name in the header is full white at 11px (was 70% white at 10px); the time on your own chat messages is full
  white. (batch 212)
- Suite data: tinted avatars use the tone's darker shade for initials (blue-700, brown-800). (batch 212)

## [0.2.0] - 2026-10-08

### Added
- TypeScript definitions for `@plenix-ds/react` (`index.d.ts`), generated from each component's header comment: prop
  unions (`variant`, `size`, `tone`…), booleans, handlers and React nodes, with the header text and defaults as docs.
- API: `/api/v1/components` items carry their written sections (`purpose`, `anatomy`, `behavior`, `a11y`, `content`)
  and `sec`, `plenix`, `src`. The tokens endpoint lists the new Button tokens (630 tokens).
- `VERSIONING.md` (what is public, what each version part means) and this changelog; release notes come from it.
- Checks on every push: build, system and spec checks, release build, the Button visual snapshot, every page, and an
  accessibility scan (axe-core) whose known issues may only go down.
- 115 Button component tokens (`--plx-comp-button-*`): per size, per variant and state, focus ring, shape and type. Every
  Button value is now a token; the design system's Edit dialog edits one token per field. (batch 207)
- Design system: purpose, anatomy, behavior, accessibility and content guidance for all 125 built items; template
  references (which apps use each item); related items for the foundations. (batch 208)

### Changed
- `button.css` uses only Button tokens; each size sets all of its own values. No visual change: 218,118 computed values
  compared, 0 differences. (batch 207)
- Design system: "Use in code" names the packages (`@plenix-ds/react`, `@plenix-ds/styles`). (batch 208)

## [0.1.0] - 2026-10-08

### Added
- The first release: `@plenix-ds/tokens` (515 tokens), `@plenix-ds/icons` (104 icons), `@plenix-ds/styles`
  (`plenix.css`, fonts, theme boot) and `@plenix-ds/react` (112 exports) on GitHub Packages.
- The CDN at https://design-system.lighthouseway.org/cdn/0.1.0/ and the JSON API at /api/v1/ (tokens, components,
  exports, taxonomy, guidance, icons). (batch 206)
