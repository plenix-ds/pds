# Plenix tests

Each Plenix test has a page here that says, in plain words, what it protects, why it exists, how it checks, what a failure means, when it runs and what it needs.

- The tests are in `tests/`. This folder only describes them (issue #748).
- The shared helpers, fixtures and baselines are described in [helpers.md](helpers.md).
- Tests never run on their own here: the owner starts them (see "How to start tests" below).

## How to start tests

Run each command from the repository folder.

- `npm test`: every automatic test, only for what changed since the last commit (changed mode).
- `npm run test:full`: every automatic test on every page. This is the final gate.
- `npm run test:on-demand`: the on-demand tests (accessibility, high contrast, color contrast, themes, density) for what changed. Add `:full` (`npm run test:on-demand:full`) for every page.
- `node tests/run.js --release`: the tests of the release build (perf, w15c-packages, icons-package-282, cdn-devx), after `node build-packages.js`. They are not in `npm test`, because they need the release build.
- `node tests/run.js <name> <name>`: only the tests named, for example `node tests/run.js pages typography`.
- `node tests/run.js keyboard:Toolbar,Tabs`: only some parts of one test (the parts are listed in `tests/parts.json`).
- `node tests/<name>.test.js`: one test file by itself. Only two tests run only this way: data-grid-perf and data-grid-next-perf, which measure time and depend on the machine's speed (issue #756).
- `npm run test:scope` (`node tests/changed.js`): prints what changed mode will check, without running anything.
- On GitHub:
  - "Checks" (`ci.yml`) runs the changed-mode tests on every pull request and on pushes to styling/phase-2 and main.
  - "Full suite" (`full.yml`) and "On-demand tests" (`on-demand.yml`) run only when started by hand: Actions, then the workflow, then Run workflow.

## Refreshing a baseline in your run

- Add the test name with its flag as one line of your run-tests issue, for example `- zero-overlap --record` or `- visual --update`. `tests/run.js` passes the flag to that test only and prints `flags: --record` under its heading.
- Only the allowed flags pass: `--update` for visual, typography, component-tokens, reflow, focus-order and a11y; `--record` for zero-overlap. Any other flag stops the run with a message, so a typo never records a baseline.
- The new baseline files appear in the run's clean copy. The Tech Lead brings them back as a pull request for QA.
- The lines for the baselines that are red today:
  - `- visual --update`
  - `- typography --update`
  - `- component-tokens --update`
  - `- reflow --update`
  - `- zero-overlap --record`

## The groups

Each line links to the test's page. A test that a group test starts is listed under what it protects, not under its group.

### Data grid and collections

- [collection-facets](collection-facets.md): The counts next to each quick filter choice (for example "Red 2") are right and update with the other filters and the table's data.
- [command-actions](command-actions.md): The buttons in a list's command bar (and the small forms they open) behave correctly with the mouse and the keyboard, including when they fold into "More actions" and while rows are ticked.
- [commandbar-find-fold-274](commandbar-find-fold-274.md): In a very narrow pane, the command bar's search folds into one "Find and view" button instead of sticking out of its card.
- [cut-popover](cut-popover.md): When text in a table cell is too long and gets cut off, a person can open it in full.
- [data-grid](data-grid.md): Every table and data grid in the Plenix apps and on the St. John test site opens, shows its rows, has a name, and lines its cells up evenly.
- [data-grid-cell-187](data-grid-cell-187.md): A large table stays quick because cells that did not change are not redrawn, while edits, ticks and row menus still work.
- [data-grid-group-165](data-grid-group-165.md): Grouping a table by any kind of field (text, yes/no, numbers, dates, tags) puts each record in the right group.
- [data-grid-group-browser-165](data-grid-group-browser-165.md): The Group by list offers every column that can be grouped, and grouping by a date period or a number range works in a real table.
- [data-grid-high](data-grid-high.md): The most important fixes to tables keep working: default sorts, remembered views, row menus, Arabic text direction, selection, and buttons inside rows.
- [data-grid-narrow-168](data-grid-narrow-168.md): A table switches between a full table and row cards by whether its columns fit its space, in a split view and on its own, never by a fixed width.
- [data-grid-next-capabilities](data-grid-next-capabilities.md): The table's independent renderer (DataGridEngine) can still do everything the grid offers: grouping, trees, editing, moving rows and columns, rows from a server, and more.
- [data-grid-next-independent](data-grid-next-independent.md): The table's independent renderer (DataGridEngine) works on its own, with none of the old grid code loaded.
- [data-grid-next-perf](data-grid-next-perf.md): Large tables (600 rows with rich cells) open, sort, filter and scroll within time limits.
- [data-grid-responsive-679](data-grid-responsive-679.md): A table shows as a full table while it fits its space and turns into readable row cards when it does not, so nobody has to scroll sideways to read or act on a row.
- [data-grid-pane-150](data-grid-pane-150.md): A table inside a pane shows its rows and fills its pane, even when the pane is further down the page than the window.
- [data-grid-perf](data-grid-perf.md): A 600-row table with rich cells opens, sorts, filters and scrolls quickly, with and without a saved view.
- [data-grid-rest](data-grid-rest.md): The rest of the table fixes keep working: file sizes, missing values, rich cells, column widths, the narrow switch, and undo for row actions.
- [data-grid-scroll-147](data-grid-scroll-147.md): When a table scrolls sideways, the column headers move with their columns and frozen columns stay in place, in English and in Arabic.
- [data-grid-search-149](data-grid-search-149.md): Typing in a search box above a large table stays smooth, and the filtered rows stay in order.
- [data-grid-select-167](data-grid-select-167.md): "Select all" on a large table is quick, and clicking, Ctrl-clicking and Ctrl+Shift-clicking rows selects what a person expects.
- [data-grid-setvalue-736](data-grid-setvalue-736.md): When an app changes a table cell from its own code, the change reaches the right record.
- [data-grid-sort-185](data-grid-sort-185.md): A table does not sort all its rows again when nothing about the sort changed, and a custom sort still follows the chosen direction.
- [data-grid-state-169](data-grid-state-169.md): A table's saved view cannot bring back columns that were removed, and an app's choice to clear the sort is respected.
- [data-grid-unread-164](data-grid-unread-164.md): New or unread records stand out in a list, as in Outlook, and stay marked correctly as a person opens them, sorts or scrolls.
- [data-grid-view-169](data-grid-view-169.md): A table has one remembered view: sorting, hiding, grouping or resizing from the column headers is saved in one place and comes back the same.
- [data-grid-window-184](data-grid-window-184.md): A long list inside a split view draws only the rows in view, so it stays fast.
- [data-phrase-260b-data](data-phrase-260b-data.md): In a phrase such as "40 pledges" under a metric, chart, record title, activity row or table cell, the number is in the data font and the words stay in the normal font.
- [data-phrase-260b-feedback](data-phrase-260b-feedback.md): In a phrase such as "40 days" in a banner, a field's hint or a checkbox's description, the number is in the data font and the words stay in the normal font.
- [data-phrase-260b-settings](data-phrase-260b-settings.md): In a settings description such as "469 members in 120 families", the numbers are in the data font and the words stay in the normal font.
- [filter-by-field-269](filter-by-field-269.md): "Filter by this field" in a column's menu opens the command bar's Filter panel on that field when the list has a command bar, and the column's own filter box when it does not.
- [listing-page-522](listing-page-522.md): A list page (ListingPage) fills the window with its table, scrolls only inside the table, and shows the chosen record beside it.
- [multi-groups](multi-groups.md): Grouping a table by a field with several values (such as tags) shows a record under each value, yet selecting, editing, counting or deleting it treats it as one record.
- [pill-padding-649](pill-padding-649.md): A pill (a small rounded label such as "Needs decision") in a table cell has the same space on both sides, and its text is centered.
- [remote-fill-522](remote-fill-522.md): A table whose rows come from a server loads more rows as the person scrolls, with no page buttons, and recovers when a page fails to load.
- [remote-fill-614](remote-fill-614.md): A table whose rows come from a server stops asking for more when the server runs out, starts over cleanly on a new search, and ignores a late page after a sort.
- [row-line-559](row-line-559.md): A hovered or selected row in a table has a line above it that matches the line below it.
- [select-data-font](select-data-font.md): A dropdown that shows a number or a date shows it in the data font, while one that shows words keeps the normal font.
- [splitworkspace-grid-681](splitworkspace-grid-681.md): In a list-and-detail screen (SplitWorkspace), clicking a row opens it beside the list, ticks select rows, and the row menu works.

### Accessibility and keyboard

- [a11y](a11y.md): This test keeps every Plenix page usable for people who rely on screen readers, keyboards and other assistive tools, by scanning for known accessibility mistakes.
- [announce-adoption](announce-adoption.md): This test makes sure that when a person reorders a dashboard widget, copies code, or hits a resize limit, a screen reader says so out loud, through Plenix's one shared announcer.
- [contrast](contrast.md): This test makes sure text and other important marks always stand out enough from their background to be read, in every Plenix theme, light and dark.
- [describedby-adoption](describedby-adoption.md): This test makes sure screen readers keep reading a form field's help text, error message and extra hints, in the right order, for six Plenix controls.
- [empty-table-a11y-313](empty-table-a11y-313.md): This test makes sure an empty table still has a correct structure for screen readers, with its "no data" message placed where assistive tools expect it.
- [focus-group-6a](focus-group-6a.md): This test makes sure the vertical tool rail (a column of tool buttons) is easy to use from the keyboard: one Tab to enter, arrows to move between tools, one Tab to leave.
- [focus-order](focus-order.md): This test makes sure that pressing Tab moves through each Plenix page in the order a person reads it, and that focus goes into a dialog and comes back when it closes.
- [header-labels-start-326](header-labels-start-326.md): This test makes sure every table column title lines up at the start (left) edge, number columns included, while the numbers in the cells stay right-aligned.
- [high-contrast](high-contrast.md): This test makes sure Plenix stays readable for people who turn on Windows high contrast, ask for more contrast, or ask for less motion.
- [keyboard](keyboard.md): This test makes sure people who use only a keyboard can move through and operate Plenix's toolbars, ratings, tabs, settings sections, search history, command bar, filter panel and selection bar.
- [keyboard-706](keyboard-706.md): This test makes sure the last group of Plenix controls that had no keyboard check (command menu, pickers, column browsers, rename, delete and draft prompts, filters and more) work fully from the keyboard.
- [keyboard-apg-691](keyboard-apg-691.md): This test makes sure menus, pickers, dialogs, sliders, calendars and other common controls work fully from the keyboard, the way people expect from the web's standard key patterns.
- [navigation](navigation.md): This test makes sure moving around the Plenix apps behaves the way people expect from the web: every screen has its own address, the browser's Back button works, unsaved work is protected, and the last screen comes back on reload.
- [one-primary](one-primary.md): This test makes sure each Plenix page shows at most one main (primary) button, so the main thing to do is always clear.
- [page-h1](page-h1.md): This test makes sure every Plenix app page has exactly one main title for screen readers, naming the page or the open item, even where the design shows no visible title.
- [pressing-adoption](pressing-adoption.md): This test makes sure a keyboard user can open a table column's menu with Enter or Space, not only with the mouse.
- [readonly-adoption](readonly-adoption.md): This test makes sure that when a form or field is set to read-only, a person cannot change its value by clicking, typing, using arrow keys or picking from a list.
- [section-headings-502](section-headings-502.md): This test makes sure long section and navigation group headings stay readable in narrow side panels: they wrap to a second line, and if still cut, show the full text in a tooltip.
- [semantic-html](semantic-html.md): This test makes sure every Plenix page has the structure that screen readers use to find their way: one header, one main area, named navigation, and headings in order.

### Languages and right to left

- [arabic-catalog-427](arabic-catalog-427.md): This test makes sure every word Plenix writes on its own (buttons, labels, messages) has an Arabic translation, so Arabic pages do not show stray English.
- [branch-loader-814](branch-loader-814.md): This test makes sure a big folder or category list opens at once, because each branch loads only when someone opens it, with a loading state and a retry after a failure.
- [entity-title-803](entity-title-803.md): This test makes sure the short title line for list rows and cards shows its parts, cuts a long title with "…", shows a loading placeholder and keeps rows on the 4px grid, in both reading directions.
- [splitview-resize-873](splitview-resize-873.md): This test makes sure any split view can be resized as far as its room allows, within 90% of the window, instead of stopping at 720 pixels.
- [control-cards-804](control-cards-804.md): This test makes sure the choice cards work with a radio, a checkbox or a switch: a click anywhere on a card changes it, with one control named by the card, in both reading directions.
- [tree-virtual-815](tree-virtual-815.md): This test makes sure a folder tree with thousands of items stays fast, drawing only the rows on screen, while the keys, the screen reader positions and right to left still work.
- [data-grid-card-chunks-809](data-grid-card-chunks-809.md): This test makes sure a data table with thousands of rows stays fast on a phone: its card form draws the first 100 cards, and more as the person scrolls.
- [narrow-fit-880](narrow-fit-880.md): This test makes sure a data toolbar's summary ends in "…" inside its row and the bottom navigation bar keeps all five destinations on a phone's width.
- [date-only](date-only.md): This test makes sure a date with no time, such as a due date of October 18, shows as October 18 for everyone, wherever they are in the world.
- [time-hook-order-885](time-hook-order-885.md): A date or time on the page does not crash when its value is empty at first and filled in later, or the other way around.
- [picker-timezone-813](picker-timezone-813.md): This test makes sure the date and time pickers show and save dates and times in the app's time zone, so a team in several countries sees the same thing.
- [formats](formats.md): This test makes sure numbers, dates, times, money, sizes, names, addresses and phone numbers are written the same correct way everywhere in Plenix, for American and German readers.
- [ids-rtl-606](ids-rtl-606.md): This test makes sure case numbers and other computed identifiers read in the owner's chosen order, 01-20261020, on Arabic (right-to-left) pages.
- [rtl-app-frame](rtl-app-frame.md): This test makes sure the frame around every Plenix app (header, navigation pane, side panel, tooltips, pop-up messages and command bar) is correctly mirrored on Arabic (right-to-left) pages.
- [rtl-charts](rtl-charts.md): This test makes sure charts read correctly on Arabic (right-to-left) pages: time always runs left to right, labels are not cut or overlapping, and the chart title still follows the page.
- [rtl-ctm-question](rtl-ctm-question.md): This test makes sure an Arabic question block inside an English page (and an English block inside an Arabic page) lays out in its own direction, as CTM's bilingual report questions need, using Plenix alone.
- [rtl-editing-time](rtl-editing-time.md): This test makes sure the text editor, date picker, week grid, carousel and document viewer work the right way round on Arabic (right-to-left) pages.
- [rtl-whole-page](rtl-whole-page.md): This test makes sure every Plenix app page still looks right when switched to Arabic (right to left): no sideways scrolling, titles starting at the right, and arrows pointing the right way.

### Pages and layout

- [field-sizing](field-sizing.md): Fields inside toolbars (drop-down lists, search boxes, text boxes) size to their content within sensible limits, give way only after buttons have folded, and show cut-off text in full in a tooltip.
- [fill-693](fill-693.md): Messages with blanks in them ("Go to page {n}") are filled in the same correct way everywhere in Plenix, and never show the words "undefined" or "null" to a person.
- [layout](layout.md): Plenix pages keep the right shape for their kind (full width, a centered column, panes, or a distraction-free editor), and split views, right-to-left rows and hidden screen-reader text behave on every page.
- [monitor-widths](monitor-widths.md): A side panel remembers the width a person dragged it to separately for each monitor, so moving between a laptop and a large screen keeps the right width on each.
- [navpane-fit-677](navpane-fit-677.md): Controls placed in the header of a side pane (a drop-down list, a button with long words) stay inside the pane instead of sticking out past its edge.
- [pages](pages.md): Every Plenix application page and every page of the St. John test site opens cleanly, with no errors, no plain tables, no boxes nested three deep and no inline styles the system forbids.
- [pane-defaults](pane-defaults.md): Side panes start wider on larger screens, so a big monitor gets roomier panes without anyone dragging them.
- [pane-limit](pane-limit.md): A side pane can never be dragged wider than 90% of the window, and a table column never wider than 90% of its table, so the rest of the screen always stays in view.
- [perf](perf.md): The Plenix packages that apps download stay under fixed size limits, so pages that use them do not get slow to load.
- [reflow](reflow.md): On a phone-width screen (or at 400% zoom), Plenix pages scroll in one direction only, and no text or control is cut off at the edge.
- [resize-caps](resize-caps.md): A resizable box or pane dragged or set past its largest size stops at that largest size (1600px), instead of jumping back to its starting size.
- [segmented-fold-276](segmented-fold-276.md): A row of segmented choices that no longer fits its space turns into a drop-down list with the same choice and the same behavior, and turns back when space returns.
- [site-coverage](site-coverage.md): The St. John test site really uses every part of Plenix, so the automatic tests that run on it reach every component.
- [toolbar-ladder](toolbar-ladder.md): Toolbars and footer button bars stay on one line as space runs out, folding buttons in a fixed order into a More menu, and unfold again when space comes back.
- [visual](visual.md): Every Plenix button keeps exactly its approved look (colors, borders, sizes, fonts, focus ring) in every variant, size and state.

### Components

- [avatar-ai-637](avatar-ai-637.md): An avatar for an AI assistant (Claude, Gemini and others) shows that provider's known logo, cleanly sized and colored, while people's avatars keep their initials.
- [button-610](button-610.md): Button labels sit exactly in the middle of the button, letters with tails are not cut off, and red Delete buttons visibly darken when pressed.
- [button-elevation-610](button-elevation-610.md): Action buttons look slightly raised at rest, lift on hover and go flat when pressed or disabled, exactly as the owner chose, in light and dark.
- [button-selected-645](button-selected-645.md): A button that is switched on (selected) stays readable in the dark theme, with its text and icon clearly standing out from its fill.
- [card-accent-621](card-accent-621.md): Cards no longer draw a colored edge, and the suite pages that used that edge still show each item's color in a clear new form.
- [chat-composer-s3](chat-composer-s3.md): The chat message box works as one clean outlined box: typing and sending, attaching files, the emoji button and speaking a message aloud (dictation), in English and Arabic.
- [chat-media-s5](chat-media-s5.md): Pictures, files and voice messages inside a chat bubble work: pictures open full size, files download, voice messages play one at a time, and a broken picture says so.
- [chat-s1-637](chat-s1-637.md): Chat bubbles use the owner's chosen colors, outlines and corners, and each sender's photo sits on the bubble's top edge without covering any text, in light, dark and right to left.
- [chat-s2-637](chat-s2-637.md): A chat conversation groups each person's messages, shows date and "New messages" lines, and tells the sender whether each message was sent, delivered or read, readably in light and dark and in Arabic.
- [chat-s4-637](chat-s4-637.md): People can react to, reply to, quote, copy, forward, edit and delete chat messages from a small action bar that appears only when wanted and never covers the text.
- [labs](labs.md): In the design spec, each component lab's Edit dialog changes the setting it says it changes, so a designer adjusting a color or size edits the right token.
- [messages-chat-s6](messages-chat-s6.md): The Messages app shows conversations with the shared chat parts (date lines, grouped messages, photos and sent/read status) and still sends replies, and the design spec's Chat page shows every part with the owner's rules.
- [project-notes-632](project-notes-632.md): In the Projects app, each project shows the notes that belong to it.
- [drawer-motion-912](drawer-motion-912.md): A side drawer slides in from its own edge, in both reading directions, instead of popping in like a dialog, and stands still with reduced motion.
- [gray-category-882](gray-category-882.md): The gray category color is spelled "gray", and pages that still write "grey" look exactly the same.

### Charts

- [charts-echarts-353](charts-echarts-353.md): Line, area, bar and pie charts draw with the chart engine Plenix chose (Apache ECharts), load it only once, and bar and pie charts can be explored with the keyboard.
- [line-ticks-593](line-ticks-593.md): Charts of whole days label their time axis with dates (Oct 1, Oct 2), never with meaningless times such as "12:00 AM" and "12:00 PM".
- [sparkline-echarts-353](sparkline-echarts-353.md): Small inline trend charts (sparklines) draw with ECharts, look exactly like the older version they replaced, stay accessible, and many of them still draw quickly.
- [treechart-echarts](treechart-echarts.md): Tree charts (such as an organization chart) draw left to right or top to bottom without overlapping labels, and can be explored and folded with the keyboard or a click.

### Tokens and style

- [baseline-scan-273](baseline-scan-273.md): The tool that lists what an application must change to follow the newest Plenix finds every problem, and never touches the application it reads.
- [brand-rules](brand-rules.md): The Plenix logo is never shown too small, too crowded or on a wrong background, because the brand rules and the logo's design settings agree.
- [component-tokens](component-tokens.md): Every design setting a component offers really changes what it says it changes, so adjusting a component's look in Plenix works.
- [density](density.md): A compact or comfortable area on a page (for example a compact table on a normal page) really shows its controls at that area's size.
- [selector-kinds](selector-kinds.md): The style checker that keeps Plenix's stylesheets in order judges each style rule correctly, so a badly written rule cannot slip into the product.
- [theme](theme.md): A new color theme can be added to Plenix, and people can switch to it and keep it.
- [typography](typography.md): Text in Plenix uses the right typeface: DM Sans for words, Reddit Mono for codes, dates, sizes and other technical values, and the two sit neatly on one line.
- [utilities](utilities.md): Long lists scroll smoothly, keyboard shortcuts work, and copying a value tells the person (and a screen reader) that it was copied.
- [zero-overlap](zero-overlap.md): Each part of the Plenix interface gets each style from exactly one rule, so changing one component's look never changes another by accident.

### Icons

- [icon-fetch-642](icon-fetch-642.md): A page with many icons loads them all without overwhelming the server, so no icon is left blank.
- [icon-module-url-284](icon-module-url-284.md): Icons still show when a website renames the Plenix files while bundling them.
- [icon-names-lazy-882](icon-names-lazy-882.md): An app built from the Plenix package loads the list of icon names only when it draws an icon by name, so small parts stay small.
- [icon-mv3-284](icon-mv3-284.md): Plenix icons work inside a Chrome extension, which may not load any code from the internet.
- [icon-offline-archive-284](icon-offline-archive-284.md): A website that hosts its own copy of Plenix shows every icon with no internet connection.
- [icon-package-assets-284](icon-package-assets-284.md): The downloadable Plenix package holds the files for every documented icon, so no icon is missing for a site that hosts Plenix itself.
- [icon-retry-283](icon-retry-283.md): An icon that fails to load once because of a network hiccup is tried again, so it still appears.
- [icon-safety](icon-safety.md): An icon file cannot be used to sneak harmful code into a Plenix page.
- [icons-package-282](icons-package-282.md): The Plenix icons package carries every Plenix icon as its own importable piece, so developers can load only the icons they use.
- [site-icons](site-icons.md): Each site and app loads a small file with exactly the icons it uses, and those files are safe and up to date.

### Build, packages and security

- [cdn-devx](cdn-devx.md): The files Plenix publishes for developers (change notes, token list, component documentation, the token checker) are complete and correct.
- [login](login.md): Signing in to Plenix is safe: only the right password works, sessions cannot be forged, and attackers are slowed down and cannot redirect people elsewhere.
- [rich-text-clean-689](rich-text-clean-689.md): Formatted text that people write (notes, comments, descriptions) cannot carry harmful code into Plenix, while bold, links, lists and tables still work.
- [rte-insert-image-884](rte-insert-image-884.md): The text editor's Insert image puts the picture in the text, on left-to-right and right-to-left pages.
- [types](types.md): Developers who write Plenix apps in TypeScript can write correct code without false errors from Plenix's type descriptions.
- [w15c-packages](w15c-packages.md): The Plenix add-on packages (the AI assistant connector, web components) work, stay within their size budgets, and dates show the same day in every time zone.
