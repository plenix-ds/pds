/* Plenix design system · library part w02B: the written sections of the type styles (Text's display, lead, body, label
   and caption, its overflow and tabular figures), the loading motion and high contrast. The type styles' duplicate
   leaves (Truncate / expand, Truncate, Clamp) show these through docsFrom. */
DSParts.docs.push({
  'type-styles': {
    purpose: 'Gives every run of text a style from one short scale, so a page reads in a clear order and long text keeps the layout steady without hiding what people need.',
    anatomy: ['Style — the variant of Text: display, lead, body (default), secondary (12px), label or caption; each sets its font, size, weight, color and line height from the --plx-comp-text-* tokens (required)',
      'Element — the HTML element (as): the heading level or paragraph the text is, whatever its style (required)',
      'Overflow — none (the text wraps), truncate (one line and an ellipsis) or lines 2, 3 or 4 (the line clamp, --plx-comp-text-lines-*) (optional)',
      'Show more — with expandable, the smallest button under a clamped text while it is cut; it reads Show less while unfolded (optional)',
      'Figures — proportional by default; tabular (font-variant-numeric: tabular-nums) for numbers that line up (optional)'],
    behavior: { pointer: 'Text is static; the Show more button is a button (it unfolds and folds the text on click).', keyboard: 'Show more takes focus in the reading order and works with Enter and Space; focus stays on it as the text unfolds, so Show less is one press away.',
      focus: 'Only the Show more button takes focus; the text never does.', responsive: 'Truncation and the clamp follow the width of their box: a narrower column cuts sooner. The Show more button appears and goes as the width changes, since the text is measured again.',
      motion: 'None: the text unfolds at once.', loading: 'While text loads, a skeleton line of the style’s height holds its place.', error: 'Not applicable: an error message is never truncated or clamped.' },
    a11y: { name: 'Not applicable to the text. Show more is named by its label; aria-expanded tells whether the text is unfolded and aria-controls points at the text.',
      announce: 'The whole text is in the page even when it is cut, so screen readers read all of it; the ellipsis is drawn, not written.',
      focus: 'The Show more button shows the focus ring.', contrast: 'Body, lead, label and display use the default content color (4.5:1 and more); caption and secondary use the subtle and muted roles, which keep 4.5:1. More contrast (prefers-contrast) brings them to the default color.',
      motion: 'Nothing to reduce.' },
    content: { labels: 'Sentence case for every style. Display: a short phrase or a number with its unit, no period. Label: short, no ending punctuation.',
      actions: 'Show more and Show less, never “Read more…”.', errors: 'Errors and instructions wrap; they are never cut.',
      localization: 'Text grows in other languages: let it wrap, and leave room where it is clamped. Tabular figures and the clamp work in every script; the ellipsis sits at the end of the line in right-to-left pages.' }
  },
  'loading-motion': {
    purpose: 'Tells people the system is working on their request, so they wait instead of trying again, with motion calm enough to watch and still for those who ask for less motion.',
    anatomy: ['Spin — plx-motion-spin: one even turn per --plx-sys-motion-loading-spin-duration (the spinner) (optional)',
      'Shimmer — plx-motion-shimmer: the skeleton’s gradient sweeps across it every --plx-sys-motion-loading-shimmer-duration (optional)',
      'Indeterminate run — plx-motion-progress: a third of the track runs from its start to its end every --plx-sys-motion-loading-progress-duration (optional)',
      'Delay — plx-motion-delayed on the wrapper: nothing shows for --plx-sys-motion-loading-delay (optional)',
      'Label — the task in words, next to the indicator or as its accessible name (required)'],
    behavior: { pointer: 'Not applicable: loading motion is not operated.', keyboard: 'Not applicable.', focus: 'An indicator takes no focus; focus stays where it was while the region loads.',
      responsive: 'The same motion at every width; a skeleton keeps the layout of what is coming, so nothing moves when it arrives.',
      motion: 'Steady loops: the spinner at an even speed, the shimmer and the run with the standard easing. Reduced motion: each stands still (the ring, the flat skeleton, the fill at the start of its track) and the label says what is happening.',
      loading: 'The indicator shows after the loading delay and goes when the content arrives; a determinate progress bar replaces the run as soon as the amount is known.',
      error: 'When loading fails the indicator goes and the region shows the error with a way to try again.' },
    a11y: { name: 'The indicator has a name (“Loading assets”) or sits next to a label; a progress bar uses role="progressbar".',
      announce: 'The start and the end of a long load are announced politely (a live region); the motion itself is not.',
      focus: 'Not applicable.', contrast: 'The spinner’s ring and the progress fill keep 3:1 against their background.',
      motion: 'prefers-reduced-motion stops every loading animation; none flashes more than three times a second (WCAG 2.3.1).' },
    content: { labels: 'Name the task: “Uploading 3 files”, “Loading assets”.', actions: 'A long load offers Cancel where the task can stop.', errors: 'Say what failed and offer Try again.',
      localization: 'The run and the shimmer go toward the end of the line: right to left in right-to-left pages.' }
  },
  'forced-colors': {
    purpose: 'Keeps every page usable for people who need their own colors (Windows contrast themes) or more contrast: what shows a state or a boundary is still there when the palette is replaced or strengthened.',
    anatomy: ['Forced-colors rules — system/forced-colors.css inside @media (forced-colors: active): focus, selection, disabled, boundaries, icons, on and off, data color (required)',
      'System colors — Canvas, CanvasText, Highlight, HighlightText and GrayText, chosen by the person: the only colors those rules use (required)',
      'More-contrast roles — inside @media (prefers-contrast: more): the border roles take the strong border and muted and subtle text the default text color (required)',
      'Kept colors — forced-color-adjust: none on color swatches, where the color is the content (optional)'],
    behavior: { pointer: 'Unchanged: hover and pressed fills disappear in forced colors, so nothing depends on them alone.', keyboard: 'Unchanged.',
      focus: 'The focus ring takes Highlight; a focused field, whose border is its only sign, takes a Highlight border.',
      responsive: 'The same rules at every width and in every density.', motion: 'Unchanged; reduced motion is its own setting.', loading: 'A spinner keeps its gap and a progress fill takes Highlight, so progress still shows.',
      error: 'An invalid field keeps a border; its message says what is wrong in words, never only in red.' },
    a11y: { name: 'Not applicable: no names change.', announce: 'Not applicable.', focus: 'The focus indicator stays visible in forced colors (WCAG 2.4.7, 2.4.11).',
      contrast: 'Forced colors use the person’s own contrast; more contrast raises borders and secondary text above the AA baseline (WCAG 1.4.3, 1.4.11).', motion: 'Not applicable.' },
    content: { labels: 'Never refer to a color in instructions (“the blue button”): name the control.', actions: 'Not applicable.', errors: 'Say what is wrong in words; a red border alone disappears in forced colors.',
      localization: 'Not applicable: the system colors follow the person’s settings, not the language.' }
  }
});
