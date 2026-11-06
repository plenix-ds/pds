# Spec wording: questions for the owner

Strings left exactly as they were, because changing them needs a decision. Answer any you like; the rest stay.

## layout (15 questions)

### grid

- **rec.text / docs.anatomy:** The overview names the page grid class `.plx-layout-grid` (12 columns at most, contained at 1200px), but the Anatomy lists `.plx-page-grid` (up to 16 columns) and gives different breakpoints (600, 1024, 1440px instead of 600 and 840px). Are these two different grids that both belong on this page, or is one of them outdated?
- **rec.text:** The contained grid stops at 1200px here, but the One-column layout and Panel pages say the contained layout is 960px wide. Are these two different "contained" widths on purpose?
- **rec.text:** This page says Columns collapse to one column on narrow windows, but the Two-column layout page says its columns "stay side by side at every width" and "do not stack", while the Collapse page describes collapseBelow. Which is right for Columns today?

### dashboard-grid

- **rec.text / docs.behavior:** The overview says a click on the handle opens a menu (Move earlier, Move later, Move to the start, Move to the end), but the Behavior and Anatomy sections describe only dragging and arrow keys. Does the handle menu exist, and should Behavior mention it?
- **rec.purpose:** The page purpose describes the whole dashboard page (several applications in one workspace), while the written Purpose describes only the widget grid (arranging widgets). Which purpose should this page carry?
- **rec.variantPages[4].avoid[0]:** "Every widget: the grid becomes one column, use fewer columns" is hard to follow. Does it mean: do not make every widget wide; if all widgets need to be wide, choose fewer columns instead?

### panel

- **rec.text:** The Panel page overview describes PageContent and Center (the page content container), not Panel. Should Panel get its own overview, and does the PageContent text belong on another page?
- **rec.purpose:** The Panel purpose also contains the Stack purpose and the Grid purpose, copied from those pages. Should those two sentences be removed from Panel?
- **docs.a11y.focus:** "The toggle has no focus style of its own in card.css; it relies on the browser's default ring." Is this still true, or does the collapse toggle now use the Plenix focus ring like other buttons?

### columns

- **rec.text / rec.purpose:** The Two-column layout overview describes the two-pane list-and-detail workspace (SecondaryPane), and its purpose describes the application shell, while the written Purpose describes Columns (two or three equal groups side by side). Which text belongs on this page?
- **rec.use[1]:** "Lists whose items are read one at a time (notes, messages)" describes a list-and-detail screen (Split pane), not equal columns. Should it move to the Split pane page?

### layout-spacer

- **rec.purpose / docs:** The Spacer page shows the Stack purpose and the full Stack write-up (anatomy, behavior, accessibility). Should Spacer show only its own text (push and Toolbar.Spacer) and point to Stack for the rest?

### layout-inset

- **rec.purpose / docs:** The Inset page shows the Stack purpose and the full Stack write-up. Should Inset show only its own text (inset tokens and Bleed) and point to Stack for the rest?

### layout-full-screen-workspace

- **rec.variantPages[0]:** The "Full-screen experience" variant has placeholder text ("composed from existing Platform controls", use for "The matching page purpose", avoid "Unrelated workflows"). What should this variant say, or should it be removed?

### sticky

- **rec.text:** The overview says the region "shows a shadow only while it is stuck", but there is also an "Always" variant where the shadow shows at all times. Should the overview say "by default" (only while stuck, or always with the Always option)?

## forms (21 questions)

### color-swatch

- **rec.text / docs.anatomy[1]:** The overview and the "Square (default)" variant say a swatch is square with 2px corners by default, but the anatomy says "round (default) or square". Which shape is the default? Both strings are left unchanged until you decide.

### creatable-select

- **rec.text / docs.anatomy[2] / docs.a11y.focus:** The overview says the add-a-tag field is "a text field like every other (owner, batch 268)", but the anatomy calls it a borderless text field and the focus row says it shows an underline focus shadow (fields elsewhere change only their border on focus). Is the anatomy and focus text out of date? Left unchanged.

### search-input

- **docs.behavior.responsive / docs.a11y.contrast:** The width rule ends "White, outlined, the height of the buttons beside it", but the contrast row says it uses the neutral fill (fill-neutral) on page surfaces. Is the field white or the neutral fill? The long width rule was not rewritten until this is settled.

### radio-group

- **rec.avoid / variantPages:** The pages give different option counts for when to switch controls: Radio group says more than about seven options means a select; the Radio page says two to five options; Select says up to about ten; Combobox says fewer than seven means a select; Segmented control says two to five. Which numbers should every page use? Left unchanged.

### forms-required-indicator

- **rec.avoid[0]:** This page says "Marking optional fields instead" is something to avoid, but the Text field, Text area and Native select "Required" variants say to mark the optional fields instead when most fields are required. Which rule is right? Left unchanged.

### forms-form

- **rec.purpose / docs:** The Form page (and Label, Help text, Required indicator, Validation message) shows the Field page's purpose and write-up word for word. For Form in particular the purpose describes one field, not a whole form. Should Form get its own purpose (and these pages their own write-ups), or is showing Field's text intended? Left unchanged. The Field rewrites above were also applied to these copies so they stay identical.

### forms-url-field

- **docs.content.errors:** The URL, Telephone and Password field pages show the Text field write-up, whose error example is "Enter a valid email address". Should these pages get an example that fits them, or is the shared Text field text intended? Left unchanged.

### drop-zone

- **docs.a11y.focus:** As a button the drop zone is reached with Tab, but the focus row says it has no focus style of its own. Is a focus ring missing in the component, or does the text need to say where the focus shows? Left unchanged.

### forms-toggle-button-group

- **rec.purpose / docs.purpose:** The purpose of the toggle button group also describes its look (bordered joined segments, the blue tint of the chosen one, your note "look A, owner, 2026-10-14", no gray track or white thumb). Most of that look is already in the Anatomy list. Should the look leave the purpose (keeping your note with it, for example in Anatomy or Details), so the purpose only says what the component is for?

### swatch-picker

- **rec.variantPages[0].text:** The data palette lists brown among its colors (blue, green, purple, red, brown, gray). Since the color consolidation retired Brown as a category color, is brown still one of the data colors, or should this list change?

### field-style-variants

- **docs.behavior.pointer, docs.behavior.focus, docs.behavior.error:** These rows say hover, focus and invalid change "the border or the line". "The line" refers to an underlined field style, but only two looks exist now (outline and filled, both with a border). Should "or the line" be removed from these three rows?

### number-input

- **docs.a11y.contrast:** "The field’s text and border contrast; the buttons are Buttons." is unclear: it does not say what the text and border meet (for example 4.5:1 for the text, 3:1 for the border, as other fields say). It is shared by the number input, stepper, currency, percentage and quantity pages. Which contrast figures should it state?

### forms-searchable-select

- **rec.purpose / docs.purpose:** The searchable select picks one value, but its page shows the shared Combobox purpose ("choose one or several values ... and optionally create a value"), and the shared anatomy lists Tags and the Create option. Is that fine for this page, or should the searchable select page get its own one-value purpose?

### date-range-picker

- **rec.purpose:** The date range picker shows the date picker’s purpose (“Takes a date as people prefer to give it…”), which speaks of one date. Should it get its own purpose about choosing a period (a start and an end), or is the shared purpose fine?

### date-time-picker

- **rec.purpose:** The date-time picker shows the date picker’s purpose, which speaks only of a date. Should it get its own purpose about choosing a moment (a date and a time), or is the shared purpose fine?

### attachment-picker

- **rec.text:** The overview says it attaches “local files”, but When to use says it is for files that come from more than one source. Which is right: device files only, or several sources (for example the device and the Files app)?
- **rec.variantPages[0].avoid[0]:** Both variant pages (Inline and Chips) list “Keep selection reversible and restore explicit.” under When not to use. It is a rule, not a case to avoid, and the wording is unclear. What should Inline and Chips each say not to use them for?
- **rec.variantPages[0].use[0]:** Both variant pages say only “Use this composition when it fits the task.” under When to use, and both have the same description. What is the difference between Inline and Chips, and when should people pick each?
- **docs.behavior.pointer:** The Mouse row repeats the variant description (“Validate types, per-file size and count…”), which is about checking files, not the mouse. What should the Mouse row say (for example drop files, press Choose, press Remove)?
- **docs.anatomy:** The parts list gives only names (Device FileInput, Selected FileRows or removable chips, Validation Notice) with no description or required/optional mark, unlike other pages. Should these be filled in? That needs facts about the component that the page does not give.
- **rec.purpose:** The purpose is word for word the overview (“Attach validated local files with a reversible selection.”). Should the purpose say why people use it (the need it serves) instead of repeating the overview?

## navigation (14 questions)

### navigation-menu

- **rec.purpose, rec.use[0], rec.use[1], docs:** This page mixes two things: the mega menu (a top navigation item with a big panel of links) and the side navigation list (NavList rows with counts, pins and folding groups). The purpose, the first two usage points and every written section describe the side list, not the mega menu. Should the side-list text move to its own page (or to Side navigation), leaving this page about the mega menu only?

### navigation-section-navigation

- **rec.purpose, docs:** Section navigation shows the navigation pane's purpose and write-up (title row, splitter, rail and so on) instead of text about sections, subpages, in-page links and tables of contents. Should it get its own purpose, or is showing the pane's write-up intended?

### navigation-saved-searches

- **rec.purpose, docs:** Saved searches shows the Search workspace's purpose and write-up (the whole advanced search page). Should it get its own purpose about keeping a named query and its filters, or is showing the search page's write-up intended?

### side-navigation

- **docs.purpose:** The written purpose says the pane is "shown as an overlay on small screens", but the rest of the page (and Bottom navigation) says that on a phone it is a bottom bar plus a full screen, never a drawer. Should this purpose be changed to match (the overview purpose already does)? The same text appears on Section navigation.
- **docs.behavior.focus:** Side navigation says focus is not moved into the overlay, but Bottom navigation says opening the overlay or the screen moves focus into the pane and returns it on close. Which one is right?

### product-navigation

- **docs.behavior.keyboard, docs.behavior.motion:** Product navigation says the pane's rows move with the arrow keys and the pane folds with the standard motion. The Navigation menu page says the list adds no arrow keys, and Side navigation says the pane has no motion of its own. Which is right?

### mobile-app-bar

- **docs.behavior.responsive:** This says the header links leave the bar "below the Narrow class", but the overview says the bar is the Narrow class itself, and Application header says the links leave below 840px (Medium and Narrow). Should it read "below 840px (Medium and Narrow)"?

### tabs

- **rec.use[0], rec.variantPages[0].avoid[0]:** Usage says peer views always use the contained tabs, yet the Contained variant says a page whose whole body switches should use Folder tabs, and Segmented tabs have their own uses. Should the usage line say "contained by default" instead of "always"?

### progress-steps

- **rec.text, rec.variantPages[4]:** The compact stepper is described as for sequences "without names", but it shows "Step 2 of 5 and the step's name". Does compact show the step's name or not?

### filter-bar

- **rec.text:** Filter bar says a search page shows the set filters as chips under the toolbar, while the Filter panel and Quick filters pages say never to put filter chips under the command bar. Are chips allowed only on the search page, and should the other pages say so?

### query-builder

- **docs.content.labels:** The page says operators should be in words, never symbols people must learn, but its read-back example uses a symbol: “Size (MB) > 40”. Should the example read “Size (MB) is more than 40”, or is the symbol meant to stay in the text view?
- **docs.a11y.name:** This line uses “Rule 2” both as the name of a rule and as an example control label (“Rule 2, Operator”). Is each control meant to be labeled with its rule number plus its role (for example “Rule 2 operator”)? I left it unchanged until you say.

### search-result

- **docs.behavior.responsive:** “The text wraps under the thumbnail’s column” can be read two ways: the text moves below the thumbnail on a narrow width, or it stays in its own column next to the thumbnail. Which one is meant? I left it unchanged.

### search-result-group

- **docs.a11y.contrast:** “The heading and count follow SectionHeading and the muted text” — does this mean the heading follows SectionHeading and the count uses muted text? I left it unchanged until you confirm.

## content (25 questions)

### text

- **rec.text:** The overview names seven text roles (body, secondary, caption, data, label, strong, title), but the component offers thirteen (also heading, eyebrow, accent, success, danger and link). Should the overview list all thirteen?
- **rec.variantPages[8].text:** The Data style is described here as 11px, but elsewhere on the page data text is "at the secondary size" (and Secondary is 12px). Which size is right for data text on its own?
- **rec.variantPages[8].avoid[0]:** This says values in a property list use the label font with equal-width digits, not the data font. The Property list page says technical values there use the data font (Reddit Mono). Which is right?
- **docs (all sections):** This write-up (purpose, parts, behavior, accessibility, content) appears word for word on seven pages: Body text, Paragraph, Label, Caption, Helper text, Secondary text and Truncated text. I left it unchanged so the copies stay identical. Should it be rewritten once and shown on all of them?

### heading

- **rec.use[0] / rec.use[2]:** Two usage points give different heading sizes: one says levels 2–4 are 18, 15 and 13px, the other says level 2 is 13px, level 3 11px, level 4 10px. Which sizes are right?
- **rec.purpose / docs.purpose:** The purpose describes only the small uppercase section label (SectionHeading), but the page also covers page and section headings (levels 1–4). Should the purpose cover both?

### code-block

- **rec.text:** The overview says the code sits "on the inverse surface", but the parts list says it sits on the default surface (--plx-sys-surface-default). Which is right?

### avatar

- **rec.use[1]:** The usage list names six sizes (xs to 2xl), but the behavior section also lists a 2xs size of 20px, and the Small avatar page points to "the 20px size". Should usage list 2xs too?
- **docs (all sections):** The Avatar write-up also appears word for word on the User identity page, so I left it unchanged to keep the copies the same. Rewrite it once for both?

### property-list

- **rec.use[1]:** Usage says a technical value sits "on the value’s baseline", but the parts list says "on the label’s baseline". Which is right?
- **docs.a11y.contrast:** This says "a name/value table is a DataGrid, not a PropertyList". Under the table rule you set (DataGrid for dynamic tables, Table for static ones), a static name/value table would be a Table. Should this say Table?
- **docs (all sections):** The Property list write-up appears word for word on four pages (Property list, Key-value pair, Attribute list, Description list), so I left it unchanged. Rewrite it once for all four?

### thumbnail

- **docs.behavior.error:** The behavior section says a broken picture is not replaced by the icon, but the Icon thumbnail page says the icon shows when there is no picture "or it fails to load". Which is right?

### content-skip-link

- **rec.purpose / docs:** The Skip link page shows the purpose and full write-up of the application frame (AppShell: header, navigation pane, main region, inspector, footer), not of the skip link. Should it get its own purpose ("lets keyboard users jump past the header and navigation to the main content")?

### content-paragraph

- **rec.text / rec.use[1]:** The Paragraph page uses a "lead" text style for the opening paragraph, but the Text component’s list of styles does not include "lead". Does the lead style exist, or should these mentions change?

### content-caption

- **rec.avoid[1]:** This page says a caption should not be longer than two lines; the Caption style on the Body text page says not longer than one line. Which limit is right?

### content-truncated-text

- **rec.text:** This page describes clamping to 2, 3 or 4 lines (lines) and a Show more option (expandable), but the Text parts list only shows one-line truncation. Do lines and expandable exist on Text, or belong to another component?

### content-online-status

- **rec.purpose / docs:** Online status shows availability in words, but its purpose and write-up are those of the presence dot on an avatar. Should it get its own purpose (for example, "shows a person’s availability in words where an avatar dot is too small or missing")?

### presence

- **docs (all sections):** The Presence write-up also appears word for word on the Online status page, so I left it unchanged. Rewrite it once for both?

### swatch

- **rec.avoid[2]:** The page says a swatch can be a button that picks a color (with a ring on the chosen one), but “When not to use” says to use the swatch picker (ColorPicker) for picking from a set. Is the button form only meant for use inside ColorPicker, or can pages use picking swatches on their own? The wording should say which.

### timestamp

- **docs.a11y.focus:** “Only relative times and date labels (and tooltip) are Tab stops” is unclear. Does it mean any timestamp that has the tooltip turned on (which is on by default for relative times and date labels) is a Tab stop?

### people-group

- **docs.behavior.responsive:** The Team page says the “source” is cut with an ellipsis, but a team has no source part (only the Group has “Synced from directory”). Should “source” be removed from the Team page?

### image-gallery

- **rec:** Image gallery’s text is a generic media-family text: “When to use” repeats the overview word for word, “When not to use” says “Keep sources and actions explicit.” (an instruction, not a case to avoid), and Behavior, Accessibility and Content talk about forms, FileRow, Carousel and “Save metadata”, which are not part of a gallery. Should this page get its own written text?

### video

- **rec:** Video’s text is shared word for word with Audio and the other media pages; “When to use” repeats the overview and “When not to use” is “Keep sources and actions explicit.” Should Video get its own text (for example when to use Video versus Audio)?

### audio

- **docs.anatomy:** The Audio page shows the Video text: its overview says “audio and video” and its parts include picture in picture, which audio does not have. Should Audio get its own text without the video-only parts?

## data-display (29 questions)

### data-grid

- **rec.use[1]:** The approved DataGrid sample moves "Reference tables in documentation and settings" out of When to use and corrects it to "Static facts, in documentation or settings: use Table" under When not to use. A text replacement cannot move a list item, so I left it. Should it be moved by hand (deleted from When to use, added to When not to use)?

### table

- **docs.anatomy[1]:** The Table says its header row can be hidden for a name/value table (options.headerVisible false), but the Property table page says every name/value list of reference facts is a Table with a header row. Which is right: may a name/value table hide its header row?
- **docs.a11y.announce:** The static Table is announced to screen readers as an interactive grid ("An ARIA grid"). A table with nothing to operate is normally announced as a plain table. Is the grid role intended here?

### tag

- **docs.a11y.focus:** It says TagInput and the rename field show a focus underline (--plx-sys-shadow-underline-focus). The field focus rule says focus recolors the border only, with no underline. Is this sentence outdated?

### counter

- **docs.anatomy[1]:** The Counter pill is a solid colored pill, while the pill rule says every pill is soft (light fill, border, dark text). Is the Counter an exception to the pill rule? Also, the Warning counter is called "amber" while the Badge calls the same family yellow: should it say yellow?

### metric

- **rec.avoid[0]:** "A count beside a label: use Count": there is no component named Count; the counting component is Counter. Should it say Counter?

### card

- **rec.purpose:** The Card purpose says it "opens" the object, but the Static card variant does not open. Should the purpose say the card usually opens its object (or can open it)?

### data-display-status-label

- **rec.text:** It says Active is success and Review is info, and that the soft variant suits a column of statuses. The Badge now has an Active variant (blue, for in progress), info is an old name for it, and every pill is soft. Which tone should Active and In review use here, and may the soft-variant remark go?

### data-display-lozenge

- **rec.text:** It says a lozenge is solid for emphasis or soft in lists, but every Badge is now soft (solid is ignored). Its When to use also says "a short state or category", while a category is a Tag, not a Badge. Should both be corrected to: always soft, and a status only?

### data-display-list

- **rec.text:** It says a List can be numbered (<ol>), but the List's parts describe only an unmarked <ul> with icons. Can a List be numbered? It also says rows people act on are "an interactive list or a table"; under the owner's rule that would be a DataGrid. May I change "a table" to "a DataGrid" once the numbering question is settled?

### data-display-responsive-table

- **rec.text:** This page says the DataGrid turns into a list under 600px wide, but the shared write-up below (Behavior, responsive) says the grid scrolls sideways inside its frame. Which is right? Also, narrow="table" is named as the static Table’s setting: is that correct, and is it the Table’s or the DataGrid’s option?

### data-display-expandable-table

- **rec.text:** This page says an expanding row gets a chevron in its name column, but the shared Anatomy describes the tree control as a 14px box with − or +. Which one does the product draw?

### data-display-compact-table

- **docs.purpose:** Every page in this group repeats the full DataGrid write-up word for word (purpose, anatomy, behavior, accessibility, content). Should these variant pages show only what is special about them and link to the DataGrid page for the rest?

### data-display-editable-table

- **rec.purpose, docs (all):** The Editable table and Tree table pages show the DataGrid’s own write-up (purpose, parts, behavior, accessibility, content), word for word. I left it unchanged here so it is rewritten once, on the DataGrid page, using the DataGrid sample you approved. Is that right?

### data-display-tree-table


### chart-foundations

- **docs.anatomy[8]:** Chart pages call the values view under each chart the “data grid” (Chart foundations, Chart tooltip, Data label, Annotation, Chart interaction, Line chart), but your rule makes it a static Table (Chart foundations itself says “the same values as a Table”). Should these pages say “data table” (or “the table”) instead, so no one reads it as a DataGrid? I left the wording as it is.

### chart-threshold

- **rec.purpose, docs (all):** The Threshold page shows the Reference line’s purpose and write-up. That purpose speaks of “a target, an average, a limit or a date”, while Threshold’s own “when not to use” sends averages to the Reference line. Should Threshold get its own purpose (a limit the data should stay under or above), or is the shared text fine? I did not change it.

### profile-card

- **docs.a11y.contrast:** “The presence dot carries a shape from 40px” is unclear. Does it mean the presence dot adds a shape (not only a color) on avatars 40px and larger? I did not change it.

### chart-reference-line

- **docs.content.localization:** “The value from the scale’s format or format” repeats a word. Does the second “format” mean the line’s own format setting (so: “the scale’s format, or the line’s format setting”)? It is shared with Threshold, so I did not change it.

### chart-accessibility

- **rec.text:** This page says the keyboard reading of values (one Tab stop, arrow keys through the points) is "the same on every chart". But the bar, combo, pie, bullet, box plot, radar, Sankey and timeline pages say nothing in their plot takes focus and the keyboard only reaches "Show the data". Which is right: should every chart be readable point by point with the keyboard, or only some? I left this page and those pages unchanged until you decide.
- **rec.use[1]:** Charts call their table of values the "data grid" (here and in the anatomy of almost every chart page). Under your rule, DataGrid is the dynamic table (sort, filter, group, search) and Table is the static one. A chart’s values table looks static, so should these pages call it the "data table" (a Table) instead of the "data grid"? The accessibility page also says "the data grid and its rows keep their own keys", which suggests something interactive. I changed none of these words.

### metric-card

- **rec.text:** The overview describes the new metric card (header with icon, title, info, period filter and More; 12 types, 5 layouts, 5 appearances; Panel’s frame; the whole card is the link with href). The written sections below describe the older card (a Card surface; only the title is a link and "the rest of the card is not a target"; title, period, value, change, trend). Which one is current? The written sections probably need rewriting from the new design, which is more than a wording change, so I left both unchanged.
- **rec.text:** The overview says "the appearance" (5), while the approved decision calls them "styles" (5 styles). Which word should the spec use?

### bubble-chart

- **rec.text:** "The largest 24px across its radius" is unclear: does the largest bubble have a 24px radius (48px wide), or is it 24px wide? I left the sentence as it is.

### box-plot

- **rec.variantPages[2].text:** The "With outliers" variant says the values beyond the whiskers show "as points of the frame". What does "of the frame" mean here? If it just means points on the plot, I can shorten it to "The values beyond the whiskers, as points."

### step-chart

- **rec.purpose:** The step chart’s purpose is the line chart’s general purpose ("lets people compare the trends of a few series"); it says nothing about values that hold and then jump. Should it get its own purpose, for example "Shows values that change at moments and hold in between, such as prices or limits"? I did not change it.

### waterfall-chart

- **rec.use[2]:** "Subtotals (total without a value) at natural breaks": does "total without a value" mean a data entry marked as a total and given no amount (the chart works the running total out)? If so I can write it that way; for now it stays as it is.

## feedback (16 questions)

### spinner

- **rec.text:** The Spinner overview says it comes "in two sizes", but the page shows three (Small 12px, Medium 16px, Large 24px). Should the overview say three sizes?

### empty-state

- **rec.use[1]:** The Empty state page tells people to use it for content that could not load (tone="error", with Retry), and it has an Error variant. But its Behavior and Content sections say "an error is not an empty state" and "do not use it for errors". Which is right? There is also a separate Error state page that covers the same case.
- **rec.text:** The Empty state overview only describes an application with nothing in it yet, shown in the main region. The page also covers the small version inside a list or panel, and the no-results case. Should the overview describe the component in general?

### skeleton

- **rec.avoid[0]:** Skeleton says not to use it for waits "under a second"; the Shimmer page says "under half a second". Which limit is right?

### toast

- **rec.variantPages[1].avoid[0]:** The Success toast says to show nothing for a save that always works, but the Snackbar page gives "Saved" as its main example, and the toast’s own writing guidance uses "Saved" as an example. Should a plain save show a toast or not?

### feedback-snackbar

- **rec.text:** The Snackbar overview says a toast "leaves on its own", but a danger toast stays until it is dismissed. Should the overview mention that exception?

### feedback-presence-indicator

- **docs:** Presence indicator and Availability indicator describe the same thing. Presence indicator shows the Status dot write-up, which says the dot is always 6px, uses the feedback colors, and gives examples like "active, paused, priority". The page itself says presence uses its own colors (never the feedback ones) and larger dots with shapes. Should Presence indicator show the Availability indicator write-up instead, or be merged with it?

### feedback-health-indicator

- **rec.text:** Your status display rule says statuses are shown as a status badge with an icon, never a dot. Health indicator, Severity indicator and Status dot all show a status as a dot with words. Do these pages still stand, or should they point to the status badge?

### feedback-severity-indicator

- **rec.avoid[0]:** Severity indicator names three levels (info, warning, danger) but says not to use "more levels than the four tones". Is the fourth level neutral, or should it say three?

### feedback-notification

- **rec.text:** The Notification page names a component "NotificationList", but the notification center is built from ActivityList. Which name is right?

### feedback-status-badge

- **rec.text:** The Status badge overview says the badge has an icon when color must not carry the meaning alone, but the Badge parts list has no icon. Does the badge carry an icon?

### banner

- **rec.purpose / docs.purpose:** The purpose says a banner offers “the one action” that resolves it, but the parts list and the “Banner with actions” page allow one or two actions. Should the purpose say “one or two actions”, or should banners have only one action?
- **rec.variantPages[7].text (Dismissible banner):** “The owner removes the banner when it is pressed”: “owner” here seems to mean the code that shows the banner, not a person. Can it read “pressing it removes the banner” (the app’s code does the removing)?

### loading-overlay

- **rec.variantPages[2].use[0] (With message):** The “With message” page says to use a message on every overlay, but the parts list calls the message optional. Is the message required on every overlay, or optional?
- **docs.behavior.motion:** “The spinner turns (still with reduced motion)” can be read two ways: that it keeps turning with reduced motion, or that it stands still. The Accessibility section says that with reduced motion the veil appears at once and the spinner stands still. Can Behavior say that plainly: “The veil fades in and the spinner turns; with reduced motion, neither moves”?

### undo-pattern

- **docs.behavior.motion:** “The toast slides in and out (still with reduced motion)” can be read as “it still slides with reduced motion”. The Accessibility section says that with reduced motion the toast appears at once. Can Behavior say: “The toast slides in and out; with reduced motion it appears at once”?

## overlays (25 questions)

### confirmation-dialog

- **rec.variantPages[0].text:** The page says a confirmation dialog is for destructive or irreversible actions, and that actions which can be undone should use a toast with Undo instead. But the "Confirm" variant says it is for "an action that can be undone or that others will see". Which is right: is the plain Confirm variant meant for undoable actions that others will see (publish, send, share), or only for irreversible ones?
- **rec.variantPages[1].text:** The Destructive variant mentions "larger actions". Does this mean larger buttons than the Confirm variant? If so, which size? The rest of the page says the dialog is always the small size.

### side-drawer

- **rec.text:** The overview says the drawer "slides from a side" and the "Drawer at the end" page says it "slides in from the end edge", but the Motion row says "it does not slide". Should the wording say "docked to a side" (no animation), or does the drawer now slide in?
- **rec.variantPages[3].avoid[0]:** The "Drawer at the end" page says navigation drawers come from the start edge, the "Drawer at the start" page says top-level navigation is never a drawer, and the Scrim page lists "a navigation drawer over a narrow window" as a use of the light scrim. Is a navigation drawer allowed (for example on narrow windows), or never?

### overlays-full-height-sheet

- **rec.text:** This page says that on Medium and Wide windows the same Sheet is a full-height side sheet. The Sheet write-up says that on Wide windows it becomes a dialog (unless a pane is shown). Which is right for Wide windows?

### overlays-inspector-drawer

- **rec.text:** This page says the inspector (SidePanel) opens as a drawer over the main region on narrow windows. The Bottom sheet page says that at Narrow the inspector opens as a bottom sheet. Which does the inspector become on a phone-width window: a drawer or a bottom sheet?
- **docs.behavior.focus:** Below 1024px the open panel lies over the page with a scrim, but it does not take or trap focus (a non-modal layer). The Scrim page says a scrim belongs behind modal layers only. Should the overlaid panel be modal (take and trap focus), or should it have no scrim?
- **docs.content.labels:** The title guidance says "Keep it to one line; long names wrap in the title." Should long titles wrap onto more lines, or stay on one line (cut off with an ellipsis)? The same text is on the Properties panel page.
- **docs.content.actions:** The panel footer puts the primary action first ("Save", "Cancel"), while dialogs put Cancel before the primary action. Is the different order on purpose? The same text is on the Properties panel page.

### overlays-dropdown-surface

- **rec.text:** The overview calls the menu surface "a raised panel ... with the menu radius and elevation", but the Contrast row says it has "no shadow drawn (border only)". Is the menu raised with a shadow, or flat with a border only?
- **docs.behavior.responsive:** The menu write-up says it "does not flip to fit the viewport", but the Floating positioning page says every anchored overlay, menus included, flips and shifts to stay in view. Which is current?

### overlays-show-more-less

- **rec.purpose:** Show more / less shows the Collapsible section write-up, whose purpose is about "a section of content under an accent uppercase title". Show more is a button under a list or a long text, with no such title. Should this page get its own purpose (and write-up), for example from ShowMore or Text? The Expand / collapse page has a similar mismatch (it also covers Panel and NavList group buttons).

### overlays-truncate-expand

- **rec.purpose:** Truncate / expand shows the Text write-up, whose purpose is about the type scale ("a style from one short scale ... one key figure, an opening paragraph"). Should this page get a purpose about cutting long text and showing more, or is the Text purpose intended here?

### scrim

- **docs.behavior.motion:** The Scrim says it "fades in with the layer above it (the fast duration)", but Dialog says it "appears and leaves without a transition" and has nothing to reduce. Does the dialog backdrop fade in or not?

### hover-card

- **docs.behavior.keyboard:** The Hover card page shows the Popover’s keyboard and focus write-up (Enter or Space opens it, Escape sends focus back to the trigger), but the Hover card’s own overview says keyboard focus opens it at once and Escape closes it without moving focus. Which is right for the hover card? Should the hover card get its own behavior write-up?

### overlays-popup

- **docs:** Popup, Inline dialog and Hover card show the Popover’s full write-up word for word. Is that intended (they are the Popover), or should each page link to the Popover page instead of repeating it?

### rich-tooltip

- **rec.text:** The overview says the rich tooltip has no arrow, but the placement variants on this page (Bottom, Top, Start) describe an arrow pointing at the trigger. Does the rich tooltip have an arrow or not?
- **rec.variantPages:** The four placement variants (Tooltip below, above, at the start, at the end) and the overview’s last sentence describe the plain tooltip, not the rich tooltip. Should these placements move to the Tooltip page, or do they apply to the rich tooltip too?

### teaching-bubble

- **docs.anatomy:** The anatomy lists the spotlight as part of the bubble, while the overview calls the Spotlight a separate component the bubble uses. Should the spotlight stay in the bubble’s anatomy?

### wizard-dialog

- **rec.variantPages:** The three size variants (Medium, Large, Full screen) all say the same thing (“uses the same controls and persistence contract”) and share generic use and avoid lines that say nothing about when to pick each size. What should each size be for?
- **docs.anatomy[2]:** The anatomy’s third part is “guarded close.” (lower case, with a period), and the anatomy names no step indicator or Back and Next buttons. What are the parts of a wizard dialog?
- **docs:** The wizard dialog’s behavior, accessibility and content text is generic (it mentions “Save copy, Resume draft, Archive and Restore” and status badges) and the content “guidance” row repeats the When-to-use lines. Should this page get a write-up of its own before it is reworded?

### help-panel

- **docs:** The help panel’s write-up talks about things that are not in a help panel: matrix checkboxes, permission summaries, tours, teaching bubbles and the actions “Share” and “Save permissions”. It looks copied from other pages. Should the help panel get its own write-up?
- **rec.variantPages:** The three variants (In the inspector, Search, Articles) share the same text, and their use and avoid lines (“Use this composition when it fits the task”, “Keep education optional and permissions explicit”) do not describe them. What does each variant show, and when should it be used?
- **rec.text:** The overview repeats the purpose word for word. Should the overview describe the panel’s parts (a heading, a search field, results, an article with Back) instead?

## specialized (36 questions)

### typing-indicator

- **rec.variantPages[0].text / rec.variantPages[1].text:** The variant pages say their messages sit “on the left” and mine “on the right”, but the write-up says mine sit on the end side and flip in right-to-left languages. Should the variant pages say “start side” and “end side” instead of left and right?

### specialized-asset-grid

- **rec.purpose / docs:** The Asset grid page shows the purpose and full write-up of the Asset browser template (“Shows how a data-management capability is put together…”), not of the grid itself. Should this page show the content grid’s own purpose and write-up?

### specialized-asset-browser

- **rec.purpose:** The purpose speaks about the template in general (“Shows how a data-management capability is put together in Plenix…”) while the overview says the asset browser is the Asset Manager. Is the template purpose the one you want on this page?

### specialized-thumbnail

- **rec.purpose / docs:** The Thumbnail page shows the asset card’s (MediaCard’s) purpose and write-up, including selecting several for bulk actions, which a thumbnail on its own does not do. Should Thumbnail get its own purpose and write-up, or show the Thumbnail component’s?

### specialized-notification-center

- **rec.text:** The overview says the notification center is “opened from the header’s bell”, but the purpose says it is a section of the page and the content guidance says “Do not add a bell or a header badge: notifications live in the page.” Which is right?

### share-dialog

- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines? On this page the avoid line (“Keep education optional and permissions explicit”) also talks about education, which is not about sharing.
- **docs.behavior.keyboard / docs.behavior.focus / docs.a11y.focus / docs.content.actions / docs.content.localization:** Several rows on the Sharing page mention tours, teaching bubbles, checklists and articles (“Resume tour, Dismiss checklist and Back to articles”), which belong to other pages. They are shared sentences, so I left them. Should the Sharing page get its own sentences here?

### asset-gallery

- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several media pages; they mention forms, FileRow, Carousel, metadata actions and MediaViewer even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### download-manager

- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several media pages; they mention forms, FileRow, Carousel, metadata actions and MediaViewer even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### media-player

- **rec.text / rec.purpose / docs.purpose:** The Video player and Audio player pages share one purpose sentence, written as a command (“Play authorized audio and video…”). Because it is shared I left it. Should each page get its own purpose, written as what it does for people?
- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several media pages; they mention forms, FileRow, Carousel, metadata actions and MediaViewer even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### metadata-editor

- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several media pages; they mention forms, FileRow, Carousel, metadata actions and MediaViewer even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### related-assets

- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several media pages; they mention forms, FileRow, Carousel, metadata actions and MediaViewer even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### audio-player

- **rec:** The Audio player page has no text of its own: its overview, purpose and mouse behavior are the Video player’s (“audio and video”), its When to use repeats the purpose and its When not to use is generic (“Keep sources and actions explicit.”). Is it a page of its own (then it needs its own text) or should it be the Audio variant of Video player?
- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several media pages; they mention forms, FileRow, Carousel, metadata actions and MediaViewer even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?

### file-picker

- **rec.avoid[0] / rec.text:** The overview says the picker chooses “files, assets or media” and it has an Assets variant, but When not to use says “Do not use it to choose managed assets with metadata; use Asset picker instead.” Which assets belong here and which in Asset picker? I left both unchanged.
- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several pages; they mention dialogs, tours, checklists, articles or version choices even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### rendition-list

- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several pages; they mention dialogs, tours, checklists, articles or version choices even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### document-viewer

- **rec.use[0]:** When to use mentions office files, but the overview and the variants cover only PDFs, image pages and text. Can the viewer show office files? I kept “office files” as written.
- **docs (shared rows):** This page’s Keyboard, Focus, Responsive, Motion, Loading and Error rows and its Accessibility and Content rows are shared sentences used on several pages; they mention dialogs, tours, checklists, articles or version choices even where those do not apply. I left them unchanged. Should each page get its own sentences for these rows?
- **rec.variantPages:** Every variant page here shows the same overview sentence (the page’s mouse behavior), and its When to use / When not to use either repeat the page’s purpose or say something generic (“Keep actions explicit”, “Use this composition when it fits the task”). They do not describe the variant. Should each variant get its own description and use/avoid lines?

### commerce

- **rec.text / rec.purpose:** This page is titled “Product discovery”, but its overview and purpose describe all ten shop pages (discovery, listing, detail, cart, checkout and so on). Should this page describe only product discovery, with the ten-page overview living on a family page?

### presence-bar

- **docs (anatomy, behavior.error, content.actions) and rec.variantPages[*].avoid:** Presence shows who is viewing or editing, but its write-up is the comments one: it talks about drafts, an error beside the composer, and the actions Edit, Resolve, Send reply and Add annotation; each variant says “Do not silently discard a failed draft.” None of that fits Presence. Should Presence get its own write-up?

### comment / comment-thread / image-annotation / presence-bar

- **rec.text, rec.purpose, rec.use[0], rec.variantPages[*].text / use:** On these four pages the overview, the purpose, the first “when to use” point and every variant’s overview and “when to use” are the same sentence, and all four share one general write-up (“Named content region”, “Identity and context”…). Should each page and variant get its own short description of what it shows?

### announcement / audit-log / approval-workflow / mention-input

- **docs.behavior, docs.a11y, docs.content:** These four pages share one write-up that mentions all of them together (mention suggestions, editors, announcement dismissal, approval stages; actions Add mention, Dismiss announcement, Approve, Reject, Request changes). On Audit history, for example, it talks about mention suggestions. Should each page keep only the parts that apply to it?

### version-history

- **docs.behavior.keyboard / docs.a11y.name / docs.a11y.focus / docs.content.actions:** Version history uses a write-up shared with the file pages: it mentions file choices, file rows, “Cancel preserves saved files” and the actions Choose, Download, Preview, Restore and Remove. Should Version history name only what applies to versions?

### ai-disclaimer

- **docs.behavior.pointer:** “…with no scripted dismissal or accuracy promise” is unclear: does it mean the reminder has no dismiss button at all, or only that a script must not hide it? I left this sentence unchanged until you decide.

### all pages in this part

- **rec.variantPages[*].use / avoid:** Most variant pages here say only “Use this composition when it fits the task.” (or “…for the named task.”) under when to use, and a general line such as “Keep actions explicit.” under when not to use. These say nothing about the variant. Should each variant get a real one-line use and avoid, or should these rows be hidden?

### prompt-input / ai-chat / streaming-text / assistant-panel

- **docs.a11y.focus / docs.behavior.responsive:** These AI pages share lines that fit only some of them, for example “Scrolling Chat threads are keyboard reachable and named.” on Prompt input, and “Sheet uses native-inspired responsive forms.” on Streaming response. Should each page keep only the lines that apply to it?

## page-structures (15 questions)

### application-shell

- **docs.content.localization:** This note says the "Skip to main content" text is fixed in the code and still needs translating, and that the arrow keys "should be checked" in right-to-left languages. These read as open to-do items rather than rules. Have they been done, or should they stay as written? (The same text is on the Footer and Three-pane workspace pages.)

### page-structures-footer

- **rec.purpose:** The Footer page shows the purpose and the full write-up of the whole application frame (header, navigation, inspector, footer), not of the footer itself. The separate Status region page already describes the status bar. Should the Footer page get its own footer-specific purpose, or be merged with Status region?
- **rec.use[0]:** The Footer page says the footer holds counts that apply to "the whole page", while the Status region page says "the whole application". Which is right?

### page-structures-three-pane-workspace

- **rec.text:** This page says the inspector becomes a bottom sheet on Narrow windows, but the shell's responsive rules only say it opens over the main region below 1024px. Is the bottom sheet still how it works?
- **rec.avoid[0]:** This says to avoid three columns "on Narrow and Medium windows", but the inspector already overlays below 1024px, which also covers windows from 840 to 1023px (wider than Medium). Should it say "below 1024px" instead?

### inspector-region

- **rec.variantPages[0].avoid[0]:** This says below 1024px the inspector opens over the "main area"; everywhere else it is called the "main region". OK to change it to "main region"?

### record-page

- **rec.text:** The overview describes a long page in cards with an "On this page" side list, but the rest of the page (purpose, parts, usage, examples) is about the header of a record page and the entity header. Which one is this page about, so the overview can match?
- **rec.variantPages[2].avoid[0]:** The live-state example is itself shown as a status badge, but its "when not to use" says to "use the status badge" for a state that does not change. Is the difference that a changing state goes in the facts and a fixed one goes elsewhere? Please confirm what to point people to.

### settings-page

- **rec.text:** The Settings page also carries the Create and Edit pages, with a sentence about them in its overview and generic usage lines ("Starting a page with an existing layout and behavior", "Copying a template to bypass shared controls"). Should Create and Edit move to a page of their own (for example a form page), so this page is only about settings?
- **rec.variantPages[2].use[0]:** The Create and Edit examples (and the Authentication, Error and Split workspace examples on Landing page) say only "The matching page purpose" and "Unrelated workflows". These say nothing about the page. Should they get real guidance?

### listing-page

- **docs:** The purpose and every written section of Listing page are generic placeholder text ("Provides a reusable implementation using existing Platform roles and controls.") that says nothing about a listing page. Should it get its own write-up, or show another page's (for example the DataGrid or the master-detail one)?

### content-template

- **docs:** Same as Listing page: the purpose and written sections are generic placeholder text, and the page title ("Content-management template") does not match its overview (a page of cards with a filter row). Should it get its own write-up, and which name is right?

### master-detail-workspace

- **rec.purpose:** This page's purpose is copied from the DAM template ("Shows how a data-management capability is put together…") plus a sentence about MasterDetailPage, while its written sections are generic placeholder text. Should it get its own purpose and write-up about the list-and-details layout?

### dam-template

- **rec.text:** The overview says to open the Asset Manager at "../../../Plenix - DAM/index.html", but the Asset Manager now lives in the dam/ folder of Plenix (the old folder keeps only its history). Should the link point to dam/index.html?

### landing-page

- **docs:** Landing page's purpose and written sections are generic placeholder text, and it carries Authentication, Error and Split workspace examples that are not landing pages. Should those move to their own pages, and should Landing page get its own write-up?

## implementation (27 questions)

### react

- **rec.avoid[0]:** "Components inside an application that both applications need" dates from when there were two applications; the suite now has eleven (ten suite applications and the Asset Manager). Should it read "that more than one application needs"?

### testing

- **rec.text:** The overview and anatomy say each change is verified with "the suites for both applications", and the purpose says "so both applications keep to one Platform". There are now more than two applications, and the test runner is npm test (see Code review). Is this page still current, and what should it say?

### changelog

- **rec.text:** This page says every change is logged as a numbered batch in "Plenix - DAM/audit/batches/", and sends package users to GitHub releases. Other pages (Code review, Release process, Deprecation, Migration) describe CHANGELOG.md with Unreleased, Breaking and Deprecated entries. Should this page also describe CHANGELOG.md, and is the batch folder still where batches are kept?

### implementation-theming

- **docs.anatomy[4]:** The overview says "Theming is ThemeProvider and the theme stylesheets", but the anatomy calls ThemeProvider optional and says it only gives React the density and interaction context. Which is right?

### implementation-component-api

- **rec.purpose:** This page shows the Purpose and the written sections (anatomy, behavior, accessibility, content) of the React page, word for word, so they describe component folders and builds rather than this topic. Should it get its own purpose and sections, or keep showing React's?

### implementation-code-libraries

- **rec.purpose:** This page shows the Purpose and the written sections (anatomy, behavior, accessibility, content) of the React page, word for word, so they describe component folders and builds rather than this topic. Should it get its own purpose and sections, or keep showing React's?
- **rec.text:** The overview says Plenix is "four packages" (tokens, icons, styles, react), and Versioning says the same; but other pages describe more packages (@plenix-ds/vue, @plenix-ds/web-components, @plenix-ds/mcp, Angular adapters, lint and Figma packages). Should the list and the count be updated?

### implementation-composition-patterns

- **rec.purpose:** This page shows the Purpose and the written sections (anatomy, behavior, accessibility, content) of the React page, word for word, so they describe component folders and builds rather than this topic. Should it get its own purpose and sections, or keep showing React's?

### implementation-web

- **rec.purpose:** This page shows the Purpose and the written sections (anatomy, behavior, accessibility, content) of the React page, word for word, so they describe component folders and builds rather than this topic. Should it get its own purpose and sections, or keep showing React's?

### implementation-css-reset

- **docs.anatomy:** This page shows the Purpose and the written sections of the CSS architecture page, word for word (for example "platform.css — the only stylesheet applications load"). Should it get its own purpose and sections, or keep showing CSS architecture's?

### implementation-styling-api

- **docs.anatomy:** This page shows the Purpose and the written sections of the CSS architecture page, word for word (for example "platform.css — the only stylesheet applications load"). Should it get its own purpose and sections, or keep showing CSS architecture's?

### implementation-html-css

- **rec.purpose:** This page shows the Purpose and the written sections of the CSS architecture page, word for word (for example "platform.css — the only stylesheet applications load"). Should it get its own purpose and sections, or keep showing CSS architecture's? The anatomy names platform.css, while this page names plenix.css.

### implementation-code-review

- **docs.anatomy:** This page shows the Purpose and the written sections of the Testing page, word for word (check-system rules, "both applications"). Should it get its own purpose and sections? The overview lists build-app, check-spec and npm test, which the copied sections do not mention.

### implementation-design-review

- **rec.purpose:** The purpose reads "Catches any change that breaks the system's rules before it is logged", copied from Testing, and the sections describe the check-system command. Design review is the owner's approval of visible changes. What should its purpose and sections say?

### implementation-versioning

- **rec.purpose:** This page shows the Purpose and the written sections of the Component lifecycle page, word for word (the seven statuses, owner, review date, and "An app's own screens" under When not to use). Should it get its own purpose and sections?

### implementation-deprecation

- **docs.anatomy:** This page shows the Purpose and the written sections of the Component lifecycle page, word for word (the seven statuses, owner, review date, and "An app's own screens" under When not to use). Should it get its own purpose and sections?

### implementation-migration

- **rec.purpose:** This page shows the Purpose and the written sections of the Component lifecycle page, word for word (the seven statuses, owner, review date, and "An app's own screens" under When not to use). Should it get its own purpose and sections?

### implementation-adoption-guidance

- **rec.purpose:** This page shows the Purpose and the written sections of the Contribution model page, word for word ("Keeps the inventory free of duplicates", the search/classify steps). That purpose does not fit this topic. Should it get its own purpose and sections?

### implementation-release-process

- **rec.purpose:** This page shows the Purpose and the written sections of the Contribution model page, word for word ("Keeps the inventory free of duplicates", the search/classify steps). That purpose does not fit this topic. Should it get its own purpose and sections?

### implementation-design-system-roadmap

- **rec.purpose:** This page shows the Purpose and the written sections of the Contribution model page, word for word ("Keeps the inventory free of duplicates", the search/classify steps). That purpose does not fit this topic. Should it get its own purpose and sections?
- **rec.avoid[0]:** "Work that is not on the roadmap or approved by the owner" can be read two ways: avoid work that is neither on the roadmap nor approved, or avoid work that is missing either one. Which is meant?

### angular-package

- **docs.content.localization:** "compiler-free/AOT-only distribution is an owner follow-up" is a status note, and it sits under Localization although it is about how the adapter is compiled. Should it stay here, move, or go to the to-do list?

### analytics-instrumentation

- **docs.content.localization:** "Only explicitly allowlisted boolean and finite numeric properties are delivered; strings are omitted" is a data rule, not a localization rule. Should it move (for example to Behavior or Error messages)?

### platform-implementation

- **rec.variantPages[1].text:** "Keep keyboard operation, resizable panes and restoration consistent…": restoration of what (window size, pane widths, the last view)? Please say what is restored so the sentence can be made clear.
- **docs.anatomy:** The written sections here (anatomy "Source standard or build entry point…", behavior, accessibility, content) are the same generic text on four pages (Platforms standard, Browser support policy, Vue, Lint tooling) and say little about this topic. Should each page get its own sections?

### browser-support

- **rec.purpose:** The purpose speaks of "the proposed browser target queries". Have the targets been approved, so "proposed" can go?

### performance-budget

- **docs.behavior:** The keyboard, focus, responsive, loading, error, accessibility and content rows on Performance, Web components and Design-system MCP tooling are the same generic UI text (Stack, Field, DataGrid, Badge, Notice) and do not describe a build check or a server. Also, Performance keeps its build behavior under Mouse (pointer). Should these pages get their own rows?

## patterns (17 questions)

### bulk-selection

- **docs.anatomy[2]:** The overview says the command bar swaps to the selection’s commands and the separate Bulk action bar is only for pages without a command bar. The parts list calls the Bulk action bar “required”, and Multi-selection, Select all and Bulk edit describe BulkActions “above the results”. Should the parts list and those pages say the bar is used only on pages without a command bar?

### patterns-multi-selection

- **rec.purpose:** Multi-selection, Select all and Bulk edit show the Bulk selection purpose and write-up word for word. Is that intended, or should Select all and Bulk edit each get a purpose of their own (for example, Bulk edit: change the same fields on many items at once)?

### patterns-saved-view

- **rec.purpose:** The Saved view page shows the purpose and write-up of the Filter and sort workflow (filter bar, toolbar, pagination), which is not what a saved view is (keeping a person’s sort, column widths, order and hidden columns). Should Saved view get its own purpose and write-up?

### filter-and-sort-workflow

- **docs:** The overview (owner, 2026-10-14) puts filtering and sorting in the command bar (Filter panel, Sort, Group, Columns and View buttons). The write-up below still describes the older layout: a separate filter row (FilterBar with More filters), a data toolbar, filter chips and pagination, and the Data-table workflow page says filter chips under the bar should be avoided. Should the write-up be rewritten for the command bar? Nothing in it was changed until you decide.

### search-workflow

- **docs.behavior.keyboard:** The overview says Enter in the header search opens the Search workspace everywhere; the keyboard row says this happens “in the asset app”. Does Enter open the workspace in every application, or only in the asset app?

### patterns-coach-mark

- **docs.a11y.contrast:** The contrast row is hard to read (“The color on the brand on the brand blue …”). Does it mean: the text and icons are the on-brand color on the brand blue (4.5:1 or more in light and dark); the primary action reverses that pair; the focus ring and step count are the on-brand color? I left it unchanged until you confirm.

### resizable

- **docs.purpose:** The overview says Resize has no size menu (owner, 2026-10-16), but the purpose still says people resize “by a menu”, and the responsive row says “the menu is always visible with touch”. Should both mentions of a menu be removed?

### unpublish

- **rec.avoid[0]:** The “when not to use” point “Delete when the content should be kept” can be read two ways. Does it mean “Don’t delete content that should be kept: unpublish it instead”? I left it unchanged until you say.
- **docs:** The Unpublish page shows the write-up for the whole publishing flow (Draft, Schedule, Publish, Unpublish), and its purpose speaks about publishing in general. Is that intended, or should Unpublish get its own purpose and sections?

### data-review-workflow

- **rec.text:** In the review panel, Reject comes first and Approve last. In the review queue’s command bar, Reject comes last (Approve, Request changes, Reject). Is the different order on purpose? I left the text unchanged.

### wizard

- **rec.variantPages[*].text:** The four variant pages of Wizard (and the variants of Create flow, Autosave, Draft state, Save as and Archive) only say “X uses the same controls and persistence contract as …”, with the same generic “when to use” and “when not to use” lines. They say nothing about each variant. Should each variant get its own short description? Writing them needs your decision on what each variant is for, so I left them.
- **docs.content.guidance:** The “Guidance” row repeats the “When to use” list word for word on Wizard, Create flow, Autosave, Draft state, Save as and Archive (and repeats the purpose on Lifecycle journeys). May these Guidance rows be removed so each fact is said once?

### permissions-editor

- **rec.variantPages[*]:** On Permissions, Product tour, Checklist, Onboarding, Feature introduction, Import workflow, Access request, Trial and upgrade and Offboarding, every variant page repeats the main page’s behavior sentence, and the “when not to use” line is a generic sentence (“Keep education optional and permissions explicit.” or “Keep scope and consequences explicit before submitting.”) that does not describe a case to avoid. Should each variant get its own description and its own when-to-use lines?
- **rec.text:** On Permissions, Product tour, Checklist, Onboarding, Feature introduction, Import workflow, Access request and Trial and upgrade (and Offboarding), the overview is the same sentence as the purpose. Should the overview describe what the pattern shows instead (as the sign-in pages do), so the purpose is not said twice?

### import-dialog-pattern

- **rec.use[0]:** Import and Export say “The same workflow as the action page.” under when to use, and “Duplicating import or export behavior.” under when not to use. Which “action page” is meant? Once you say, these lines can name it.

### multi-factor-authentication

- **docs.content.errors:** The “Error messages” row says “Say where the code went: to the phone ending 42.” That is not about errors (it repeats a when-to-use point). Connected accounts has the same issue (“List shared data in plain words…” sits under Error messages). Should these move to another row, or should the Error messages row say what the errors are?

### lifecycle-journeys

- **docs.behavior.focus:** Lifecycle journeys’ focus row says “Every scrollable code region has a keyboard target.” This page has no code region. Should that sentence be dropped from this page?

## interaction (24 questions)

### interaction-keyboard-support

- **rec.purpose / docs:** The Keyboard support page shows the Focus ring write-up and its purpose ("Shows keyboard users exactly where they are on the page"). The page is about operating everything from the keyboard, not about seeing focus. Should it get its own purpose and write-up, or point to Focus order and Hotkey instead?

### interaction-keyboard-navigation

- **rec.purpose / docs:** The Keyboard navigation page also shows the Focus ring write-up and purpose, but it is about the Tab order and roving focus. Should it show the Focus order write-up instead?

### interaction-accessible-names

- **rec.purpose / docs:** The Accessible names page shows the Visually hidden write-up (its parts are "a span" and "hidden text"). The page is about giving every control a name. Should it get its own write-up, or show Accessible descriptions instead?

### interaction-screen-reader-behavior

- **rec.purpose / docs:** The Screen-reader behavior page shows the Visually hidden write-up, but it is about announcing changes (announce(), role="alert"). Should it show the Live regions write-up instead?

### interaction-reduced-motion

- **rec.text:** The overview says that with reduced motion "transitions become instant or fade only", while the Motion write-up says every animation and transition "takes zero time". Is a fade still allowed with reduced motion, or does everything become instant?

### interaction-scroll-lock

- **docs.anatomy:** Two pages name the scroll lock differently: Overlay manager and Focus lock say the page gets the class is-scroll-locked on <html>; Scroll lock says the target gets data-plx-scroll-lock="locked". Which one is current? (Overlay manager anatomy, Focus lock overview and Scroll lock anatomy are left unchanged until you decide.)

### use-of-color

- **docs.behavior.focus:** This row says "The focus indicator is a border color change". The Focus ring page says controls show a 2px ring and only fields change their border color. Should this row say "a ring on controls, the border color on fields"?

### hotkey

- **docs.behavior.error:** For two bindings of the same keys "in the same scope", the row says "the innermost scope runs". If both are in the same scope, which one runs: the one registered last (the one that is listed)?

### interaction-truncate

- **rec.purpose:** Truncate and Clamp both show the purpose of the whole Text component (a type scale for the page’s reading order). Should they get a purpose of their own, such as "keeps long text from breaking the layout while the whole text stays in the page"?

### forced-colors

- **rec.text:** The overview says that with more contrast "muted text" takes the default text color; the anatomy says "muted and subtle text". Does subtle text change too? (The overview is left unchanged until you decide.)

### view-state

- **leaf:** This page is named "Scroll restoration", but it covers everything an application remembers between visits: the last screen, the side pane width and the scroll position. Should it be renamed (for example "View restoration")?

### gesture-interaction

- **docs.content.localization:** The localization note says a swipe toward the inline "end" archives, but the labels example says "Swipe left to archive" (in left-to-right text, left is the start, not the end). Which direction archives?

### semantic-html

- **rec.text:** The overview says "a table is a DataGrid", but Usage says DataGrid or Table for rows of fields (a static table is a Table). Should the overview say "a table is a DataGrid or a Table"? I left the overview as it is until you decide.
- **docs.behavior.error:** The error row lists only two of the things the checks reject (a clickable div or span, an anchor that acts without href), while the rule also covers p, li, td, section, article, img and i, and the links-not-buttons rule covers more. Should the row list all of them, or say "everything the overview lists"?

### shortcuts-dialog

- **rec.variantPages[0].use, rec.variantPages[0].avoid, rec.variantPages[1].use, rec.variantPages[1].avoid:** Both variants (Grouped and Searchable) have placeholder Usage text ("Use this composition when it fits the task.", "Keep scope and consequences explicit before submitting.") and the same overview text. What should each variant say about when to pick it?
- **docs.content.actions:** The content and accessibility rows (Import, Export, Request access, Upgrade, Delete account; review grids, permission summaries; wizard steps; plan terms and account names) seem copied from another family of pages and do not fit a keyboard shortcuts dialog. Should they be rewritten for this dialog?
- **docs.behavior.pointer:** The Mouse row describes the list updating and search matching, which is not about the pointer, and the same text is the overview of both variants. Where should this text live?

### captions-transcripts

- **rec.use[0], rec.avoid[0]:** Usage repeats the overview word for word, and When not to use says only "Keep sources and actions explicit." What are the real cases for and against this component?
- **docs.a11y, docs.content, docs.behavior:** Several rows speak about galleries, file lists, FileRow, MediaViewer, Save metadata and form errors, which belong to other media pages. Should they be rewritten for captions and transcripts (for example, naming the caption tracks and the transcript)?

### accessibility-testing

- **rec.avoid[1]:** "Do not rely on default-state snapshots for active technical values" is unclear. Does it mean: do not test only the resting state, also check states where technical values (such as code or numbers) are shown?
- **rec.use[1]:** Usage says to inspect states "in both themes", but dark-mode checks are on hold until the end. Keep "both themes" as the lasting rule?
- **docs.anatomy, docs.behavior, docs.a11y, docs.content:** The written sections ("Source standard or build entry point", "The guidance is readable in normal document order") read like a template for guidance pages, not about accessibility testing. Should they be rewritten for this page, or hidden?

### internationalization

- **docs.content.guidance:** The guidance row repeats the purpose word for word (the same happens on the WCAG guidance page). May it go?

### use-collection-view

- **docs.a11y.announce:** "Facet counts report matching records without filtering out their own selection" is unclear. Does it mean each filter's counts ignore that filter's own current choice, so its other options still show counts?

## foundations (24 questions)

### control-heights

- **rec.use[0]:** The usage list names the height roles "inline-action, toolbar, standard, page-action, dialog", but the parts list names them "inline, toolbar, standard, prominent, dialog, dialog-destructive". Which names are right, and is "page-action" the same as "prominent"?

### layers

- **rec.use[0]:** The usage list gives the stacking levels as "base, raised, sticky, overlay, popover, menu, modal, toast, critical"; the parts list gives "behind, base, raised, sticky, menu, overlay, modal, popover, toast, critical". The order of menu, overlay and popover differs, and "behind" is missing from usage. Which order is right?

### foundations-heading-hierarchy

- **rec.purpose / docs:** This page is about the order of headings on a page, but its purpose and written sections describe the SectionHeading component (a small uppercase group label that can show or hide its group). Should it get its own purpose and write-up, or point to the SectionHeading page?
- **docs.a11y.contrast:** The overview says level 3 (the default) is 11px and level 4 is 10px, but the contrast note says the label is "10px bold". Which size is the default label?

### foundations-font-size

- **docs.anatomy[2]:** The overview says the font-size scale is in rem (so text follows the person's font settings), but the shared typography parts list says "--plx-ref-font-size-09 to -20 in px". Which is right? The same parts list appears on Type scale and on every typography page.

### foundations-font-weight

- **rec.text:** "Weight shows the role of the text, never a color or a size change" is unclear. Does it mean weight must never stand in for a color or size change, or that a role must never be shown by color or size instead of weight?

### foundations-sizing-scale

- **rec.avoid[1]:** "Avoid a size written as a number in a component" sits next to the example Skeleton width="200px" and the overview rule that a number in a prop snaps to the nearest size token. Are numbers in props allowed (and snapped), or must props name a token too?

### icon

- **rec.text:** The overview says the optical size 24 files are optional "for the header and touch", but the responsive note and the Large icon page say "the app header and Comfortable density". Is it touch, Comfortable density, or both?

### foundations-semantic-tokens

- **rec.purpose / docs:** The five token pages (Semantic, Component, State, Theme, Responsive tokens) show the Design tokens purpose and write-up word for word; the six typography pages (Typefaces to Code typography) do the same with Type scale, and the four spacing pages with Spacing scale. These shared texts were left unchanged. Should each page get its own short purpose, or keep the parent page's text?

### foundations-content-widths

- **rec.purpose / docs.purpose:** This page shows the Spacing purpose and write-up ("Spacing shows how things relate…"), which is about gaps, not content widths. Should Content widths get its own purpose, or point to the Layout or Grid write-up instead?

### foundations-responsive-sizing

- **rec.purpose / docs.purpose:** This page shows the Spacing purpose and write-up, which is about gaps, not about how sizes respond to font size, density and touch. Should Responsive sizing get its own purpose, or show another page’s write-up (Control heights or Density)?
- **rec.text:** The overview says "Columns and the hierarchy never change with size", but the Breakpoints write-up says the grid has 4, 8, 12 or 16 columns depending on width. Is the sentence meant to say that the column count does not change with density or font size (only with width)? I left it as it is.

### foundations-icon-alignment

- **rec.purpose / docs.purpose:** This page shows the Spacing purpose and write-up, but it is about icons. Should it show the Icons write-up (like Icon sizes) instead?

### foundations-surface-fills

- **rec.purpose / docs.purpose:** This page shows the Shadows purpose and write-up ("Shadows show that a surface sits above the page…"), but it is about background fills. Should it show the Surface colors write-up instead?

### foundations-border-style

- **rec.text:** The overview names the style tokens --plx-sys-border-style-solid and -dashed, but the parts list names --plx-ref-border-style-*. Which name is right (or do both exist)? I left the overview as it is.

### foundations-border-color

- **rec.text / rec.use.0:** This page says the default border is for controls and frames, but the same page’s accessibility row says default and subtle borders are for separation only, and Border colors says a control’s edge is border-strong or the control edge. Which border should a control use? I left the text as it is.

### foundations-shape-treatment

- **rec.text:** The overview says badges use the pill shape, but the Badge rule gives every pill 4px corners. Should badges be fully round (pill) or have 4px corners? I left the text as it is.

### foundations-easing

- **docs.anatomy:** The shared Motion parts list names only the standard easing and the fast, base and slow durations, while Easing, Transitions and Entrance motion also name the enter easing, instant (0.08s), quick (0.12s) and the enter scale. Should the parts list add them? (Not changed: the list is shared by several pages.)

### color-status

- **rec.text / docs.anatomy:** The parts list includes a fifth presence role, status-dnd (do not disturb), but the overview names only online, away, busy and offline. Should the overview add do not disturb, or is status-dnd the same as busy? I did not add it.

### illustration

- **rec.use[3] / rec.avoid[1]:** Usage says to give an illustration a label "only when the drawing says something the text does not", but When not to use says to avoid "a drawing that carries information the text does not". Which one is right: may a drawing ever add information the text does not have?

### type-styles

- **docs.a11y.contrast:** The contrast row mentions a "secondary" text style next to caption, but the page lists only five styles (display, lead, body, label, caption). Is there a secondary style that the page should list, or should the word be removed?

### content-style

- **docs.anatomy, docs.behavior, docs.a11y:** The Parts list ("Source standard or build entry point", "Specific implementation instructions", "Existing checks and limitations") and most Behavior and Accessibility rows on this page are general sentences that say nothing about style and grammar. Should they be written for this page, or left for the later pass that hides empty rows? I did not change them.
- **rec.variantPages[*].use / avoid:** All five sub-pages (Capitalization, Inclusive language, Terminology, Action labels, Text alternatives) repeat the same two Usage points and the same two When-not-to-use points as the main page. Should each sub-page get its own guidance, or should the repeats go?

### design-principles

- **docs.content.guidance:** The "guidance" row repeats the page’s purpose word for word. Should it be removed, or should it say something else?


## Written since 2026-10-21 (11 questions)


### wizard-dialog

- **docs.anatomy[4]:** "Unsaved-changes check — closing asks before losing work" is the only anatomy entry without (required) or (optional). Which is it?

### interaction-accessible-names

- **rec.anatomy[2]:** "VisuallyHidden adds words a screen reader needs that the layout shows" reads backwards — should it be words the layout does *not* show?
- **rec.anatomy[1]:** The `label` part has no "(required)" or "(optional)" marker, unlike the other parts; which is it?

### tabs

- **rec.text / rec.use[0]:** The overview defines contained tabs as "folder tabs joined to a bordered panel", while use[0] names "Folder tabs" as a separate choice for when the whole page body switches. Are contained tabs a kind of folder tab, or are Contained and Folder two different variants (and which name should the overview use)?

### swatch-picker

- **variantPages[0].text:** It lists "brown (drawn in orange)" among the data hues; is brown still a data hue name, or should it read orange (the Brown category was retired in the color consolidation)?

### typing-indicator

- **variantPages[0].text, variantPages[1].text:** Both describe chat message bubbles (someone else's message on the start side; the person's own in the action color), not a typing indicator. Are these variant pages on the wrong item, or should the text describe the indicator?

### docs/back-to-top

- **docs.anatomy[1]:** The sentinel is called "a very thin strip" yet "one window tall"; which is right (thin strip, or a strip one window tall)?

### data-grid

- **docs.anatomy[25]:** The string ends "The row menu on a row's button or right-click:" followed only by tokens; the row menu's items seem to be missing. What does the row menu contain?
- **docs.content.labels:** It names `hozAlign "right"`, a Tabulator option, while the grid is now TanStack. Is `hozAlign` still the column prop, or should it name the TanStack-era prop?

### design-system-mcp

- **docs.behavior.error:** "Initialize first; arguments are checked." is too terse to simplify safely — does it mean a call before initialization is refused with an error, and invalid arguments are rejected? Which wording is right?

### document-viewer

- **docs.behavior.pointer:** The text describes loading PDF.js, cancelling outdated renders and exposing text/keyboard scrolling/errors — none of it is pointer behavior. Should it move to loading/a11y, and what is the pointer behavior?

## Guidance for items not built yet (19 questions)

### data-display: charts with no axes

- **Choropleth map, Donut chart, Pie chart, Gauge, Sankey diagram, Treemap, Word cloud (content[1]):** These pages carry the shared chart line "Label axes with the measure and its unit, and avoid acronyms.", but none of these charts has axes. Should each drop the line, or get its own rule (a choropleth labels its color scale legend; a donut or pie labels slices with the part name and share; a gauge labels the value with its unit and range; a Sankey labels nodes with totals; a treemap labels tiles; a word cloud explains size in a legend)?
- **Gantt chart (content[1]):** The Gantt axis is time, not a measure. Should it read "Label the time scale with its unit (days, weeks or months)"?
- **Radar chart (content[1]):** Radar spokes are axes that share one scale. Keep the shared line, or say "Label spokes with the measure name"?
- **Gauge (content[0]):** The shared title line ("the question the chart answers") may not fit a single-value meter. Keep it, or replace it with a gauge rule?

### data-display|Sparkline

- **content[0]:** The shared chart rule asks for a title written as a question or finding, but a sparkline is word-sized, sits next to the number it describes and has no title. Drop or replace this line for sparklines?
- **content[1]:** "Label axes with the measure and its unit" contradicts behavior[1] "Do not show axes, grid lines or legends." Which is right?

### data-display|Object list

- **commonGround:** "none names a distinct object list, and SAP Fiori is the main system that defines one" reads as a contradiction. Does "none" mean none of the compared systems, with SAP Fiori outside that set?

### content|Version label

- **use[1]:** use[1] names the qualifiers "Current" or "Draft"; anatomy[1] and content[1] say "Latest". Which qualifier is right?

### feedback|Circular progress

- **content[1]:** "Do not end the label with an ellipsis-only message." Does it ban a label that is only "…", or ending labels with an ellipsis?

### forms|Field style variants

- **anatomy[1]:** "Filled — tinted background with a bottom line" conflicts with the Plenix field rule (a filled field has a border; no underline). Which is right?
- **behavior[1]:** "Change only the border color on focus and error" conflicts with the Plenix invalid state (2px danger border plus the lightest red fill). Should focus recolor the border only, with error following the invalid rule?

### foundations|Text alternatives

- **behavior[1]:** "Provide data grids or summaries for charts": does "data grids" mean the DataGrid component, or a static Table as the chart's text alternative?

### foundations|Style and grammar

- **anatomy[0] / commonGround:** The anatomy lists "serial comma use" as a Plenix rule, but commonGround says systems differ and no string says whether Plenix uses the serial comma. Does it?

### foundations|Contrast rules

- **avoid[1]:** "Do not treat disabled controls as a reason to pass off unreadable active content." Does it mean active content never borrows the disabled-control contrast exemption?

### interaction|Portal

- **content[0]:** "Not applicable; content rules follow the overlay rendered inside." reads as placeholder text. Keep it, or drop it and keep only content[1]?

### interaction|Scroll lock

- **content[1]:** "Not applicable beyond the overlay's own text." reads as placeholder text. Keep it, or replace it with a content rule?

### navigation|Navigation bar

- **use[1]:** "At the bottom on compact screens; as a rail on wider ones" overlaps Bottom navigation, whose avoid[1] says not to use it on wide screens. Are these one item, or should the rail case be named differently?

### navigation|Previous / next navigation

- **behavior[0]:** The overview calls the parts links, but behavior says "Disable or hide the control" at the start and end; links cannot be disabled. Should the end state be "hide" only?

### patterns|Delete flow

- **text:** It says "permanently removing an object" but also "with recovery when possible", and use[1] prefers undo when the item can be restored. Is deletion permanent, or should "permanently" go?
