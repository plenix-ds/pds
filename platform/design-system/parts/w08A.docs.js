/* Plenix design system · library part w08A: the written sections of the chart parts (ChartLegend, ChartTooltip, DataLabel,
   Axis, GridLines, ReferenceLine; Threshold shows the reference line's, docsFrom), ChartAnnotation, FeatureCard and
   UserCard (Profile card shows its sections, docsFrom), moved from the common-ground guidance into Plenix's words. */
DSParts.docs.push({
  'user-card': {
    purpose: 'Lets people recognize a person and reach them, by message, call or their profile, without leaving the page they are on.',
    anatomy: ['Card — the surface and padding (Card) (required)', 'Cover — a 21:9 picture across the top, decorative (with cover)', 'Avatar — the picture or initials, with the presence dot (required)',
      'Name — the card’s heading; a link to the profile with href (required)', 'Line — the title, team or email under the name', 'Role — a neutral badge (Owner, Admin)',
      'Details — an icon list of ways to reach them; phone numbers and times in the data font', 'Actions — buttons for this person at the foot, or the row’s end (compact)'],
    behavior: { pointer: 'The card itself is not a target: the name (with href) and each action are.', keyboard: 'Tab reaches the name link, then each action, in reading order.', focus: 'Each link and button shows its own focus.', responsive: 'The default card fills its grid cell and wraps long names; the compact row cuts the name and line with an ellipsis, the full text on hover.', motion: 'None.', loading: 'Show the card with a Skeleton in place of the details while they load; never an empty card.', error: 'When the person cannot be loaded, say so in the card’s place with a way to try again.' },
    a11y: { name: 'The name is a heading (headingLevel), so a page of cards can be read by headings.', announce: 'The presence is read after the name (“Maya Chen, Online”); the avatar and the cover are decorative.', focus: 'Only the name link and the actions take focus; the card does not trap it.', contrast: 'The line and the details are secondary text at its contrast; on avatars 40px and larger the presence dot also shows a shape (a check, a clock, a minus), so it never relies on color alone.', motion: 'Nothing to reduce.' },
    content: { labels: 'The display name the person chose; one line with their title or team; details only when they help reach them.', actions: 'Verbs: Message, Call, Follow; two or three at most.', errors: 'Say what could not be loaded.', localization: 'Presence words come from strings; phone numbers and times follow the reader’s locale (formatPhone, formatTime).' }
  },
  'feature-card': {
    purpose: 'Helps people discover what they can do next, on a home, empty or onboarding page, with one clear target per feature.',
    anatomy: ['Card — the surface, one link or button over the whole card (Card’s opener) (required)', 'Media — an icon tile, or a picture across the top (image) or a square before the text (horizontal), decorative (required)',
      'Name — the heading and the target’s text (required)', 'Description — one sentence on the benefit (Card’s meta line)'],
    behavior: { pointer: 'The whole card opens the feature; hover raises it.', keyboard: 'One Tab stop per card; Enter opens it (a link), or Enter and Space (a button).', focus: 'The card shows the focus outline around it.', responsive: 'In a ContentGrid the cards keep one width and wrap to the next row; horizontal cards fill narrow columns.', motion: 'The hover lift is the card’s short shadow transition; reduced motion removes it.', loading: 'Pictures keep their 16:9 frame before they load.', error: 'A picture that cannot load shows the image fallback; the card still opens.' },
    a11y: { name: 'The name is a heading and the target’s text, so the link says where it goes.', announce: 'The description is read after the name; the icon and the picture are decorative.', focus: 'One stop per card, in the grid’s order.', contrast: 'The name and the description keep the text contrast; icon tiles are decorative.', motion: 'Hover motion follows reduced motion.' },
    content: { labels: 'Name the feature, or start with the task’s verb (“Share a folder”); never “Learn more”.', actions: 'The card is the action.', errors: 'Not applicable.', localization: 'Every word is the caller’s; descriptions grow in other languages, keep them short.' }
  },
  'chart-legend': {
    purpose: 'Tells people which marks belong to which series when the marks cannot be labeled directly, and lets them compare a few series at a time.',
    anatomy: ['List — the series in the chart’s order (required)', 'Swatch — the series’ data-viz color: a square (bars, areas) or a line (lines) (required)', 'Name — the series’ name (required)', 'Value — an optional total or share, the data font', 'Toggle — the button around each item (interactive)'],
    behavior: { pointer: 'Interactive: clicking an item shows or hides its series; hover tints it.', keyboard: 'Interactive: Tab moves between toggles, Enter or Space toggles one.', focus: 'A focused toggle’s border takes the focus color (no outer ring).', responsive: 'A row of series wraps; beside the plot the legend keeps the longest name’s width up to 200px and names wrap.', motion: 'None.', loading: 'The legend appears with the chart.', error: 'Not applicable.' },
    a11y: { name: 'The list is named Legend (strings.legend); the names are real text, outside the chart image.', announce: 'Each toggle says its state with aria-pressed (pressed = shown).', focus: 'The last series shown cannot be hidden, so the chart never goes empty.', contrast: 'Swatches keep 3:1 against the surface (the data-viz scales); a hidden series keeps its outline and a muted name.', motion: 'Nothing to reduce.' },
    content: { labels: 'Plain series names in sentence case, no acronyms.', actions: 'Not applicable: the toggle is the item.', errors: 'Not applicable.', localization: 'The legend’s name comes from strings; values follow the reader’s locale.' }
  },
  'chart-tooltip': {
    purpose: 'Gives the exact values at one place on a chart on demand, without crowding the chart with labels.',
    anatomy: ['Heading — the point’s category or date (data font for dates and numbers)', 'Values — swatch, series name and value for each series (required)', 'Crosshair — a line down the plot at the x position (shared)', 'Surface — the popover’s: overlay surface, border, menu radius and shadow'],
    behavior: { pointer: 'Shown where the pointer is; it does not take the pointer, so the marks under it stay reachable.', keyboard: 'Moved by the chart interaction (keyboard focus on the data), with the same values said in a live region.', focus: 'It never takes focus.', responsive: 'It goes after the point in the first half of the plot and before it in the second; above a point, or under it near the top.', motion: 'None: it moves with the pointer at once.', loading: 'Not applicable.', error: 'Not applicable.' },
    a11y: { name: 'Part of the chart image, hidden from assistive technology with the plot.', announce: 'The chart interaction announces the focused point’s values; the data grid carries every value.', focus: 'Nothing in it is focusable: no actions or links.', contrast: 'Text on the overlay surface at the text contrast; swatches at 3:1.', motion: 'Nothing to reduce.' },
    content: { labels: 'The axis’s format with full precision; series in the legend’s order.', actions: 'None.', errors: 'Not applicable.', localization: 'Values and dates in the reader’s locale (formatNumber, formatDate).' }
  },
  'chart-data-label': {
    purpose: 'Shows the exact values of the marks people compare, right where they look.',
    anatomy: ['Value — the formatted number, the data font (required)', 'Position — above a column, after a bar, or centered on a point (required)', 'Halo — a stroke in the surface color under centered text'],
    behavior: { pointer: 'None.', keyboard: 'None.', focus: 'None.', responsive: 'On a narrow chart keep fewer labels: the last and the highest.', motion: 'None.', loading: 'Drawn with the marks.', error: 'Not applicable.' },
    a11y: { name: 'Part of the chart image; the data grid carries the values.', announce: 'Nothing.', focus: 'Not focusable.', contrast: 'Text in the content color on the surface, or on its halo over a mark.', motion: 'Nothing to reduce.' },
    content: { labels: 'The axis’s format and precision; abbreviate large numbers the same way everywhere (formatCompact).', actions: 'None.', errors: 'Not applicable.', localization: 'Numbers in the reader’s locale.' }
  },
  'chart-axis': {
    purpose: 'Lets people read the size, time or category of each mark.',
    anatomy: ['Axis line — the baseline (bottom and top by default)', 'Tick labels — values, dates or categories at the scale’s ticks, the data font (required)', 'Axis title — the measure and its unit, at the margin’s edge'],
    behavior: { pointer: 'None.', keyboard: 'None.', focus: 'None.', responsive: 'Fewer ticks on a narrow chart (ticks); labels are never rotated or cut.', motion: 'None.', loading: 'Drawn with the chart.', error: 'Not applicable.' },
    a11y: { name: 'Part of the chart image; the table’s column titles name the same measures.', announce: 'Nothing.', focus: 'Not focusable.', contrast: 'Tick labels and titles are secondary text at its contrast.', motion: 'Nothing to reduce.' },
    content: { labels: 'The title is the measure with its unit (Revenue (USD)); tick labels in even steps.', actions: 'None.', errors: 'Not applicable.', localization: 'Numbers and dates from the scales’ format in the reader’s locale.' }
  },
  'chart-grid-line': {
    purpose: 'Helps people line marks up with the axis values without drawing the eye away from the data.',
    anatomy: ['Lines — at the ticks of one scale, behind the marks (required)'],
    behavior: { pointer: 'None.', keyboard: 'None.', focus: 'None.', responsive: 'They follow the axis’s ticks at every width.', motion: 'None.', loading: 'Drawn with the chart.', error: 'Not applicable.' },
    a11y: { name: 'Decorative; hidden with the plot.', announce: 'Nothing.', focus: 'Not focusable.', contrast: 'The subtle border color: lighter than the axis line and the marks.', motion: 'Nothing to reduce.' },
    content: { labels: 'Grid lines carry no text: the axis labels them.', actions: 'None.', errors: 'Not applicable.', localization: 'Not applicable.' }
  },
  'chart-reference-line': {
    purpose: 'Gives the data a value to be read against, a target, an average, a limit or a date, without being mistaken for a series.',
    anatomy: ['Line — dashed, across the plot at the value (required)', 'Name — what the line is (Average, Target, Limit)', 'Value — the value in the data font', 'Color — the subtle content color, or an alert color for a threshold'],
    behavior: { pointer: 'None.', keyboard: 'None.', focus: 'None.', responsive: 'The label stays at the line’s end at every width.', motion: 'None.', loading: 'Drawn with the chart; a derived value (an average) is worked out again when filters change.', error: 'A value outside the scale draws nothing: widen the domain.' },
    a11y: { name: 'Part of the chart image: say the reference in the description (“The target is 250”).', announce: 'Nothing.', focus: 'Not focusable.', contrast: 'The name and value are text at its contrast; the line has its name, so its color is not the only cue.', motion: 'Nothing to reduce.' },
    content: { labels: 'Name it by its meaning (Average, SLA 99.9%, Budget) and say how a derived value is worked out (30-day average).', actions: 'None.', errors: 'Not applicable.', localization: 'The value in the scale’s format, or the line’s own format setting, in the reader’s locale.' }
  },
  'chart-annotation': {
    purpose: 'Explains spikes, dips and events on a chart, so people do not have to guess what happened.',
    anatomy: ['Ring — around the annotated point (point)', 'Leader — a short line from the ring to the note (point)', 'Band — a shaded span of the plot behind the marks (range)', 'Note — a few words, sentence case (required)'],
    behavior: { pointer: 'None.', keyboard: 'None.', focus: 'None.', responsive: 'The note stays at its point or range; keep it short so it fits at a narrow width.', motion: 'None.', loading: 'Drawn with the chart.', error: 'Not applicable.' },
    a11y: { name: 'Part of the chart image: put the same note in the description or the data grid.', announce: 'Nothing.', focus: 'Not focusable.', contrast: 'The note is text at its contrast; the band is the sunken surface, behind the marks.', motion: 'Nothing to reduce.' },
    content: { labels: 'One short phrase naming the cause (Outage in EU region); the date when the axis does not show it.', actions: 'None.', errors: 'Not applicable.', localization: 'Notes are the caller’s words.' }
  }
});
