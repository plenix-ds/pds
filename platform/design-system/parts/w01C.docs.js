/* Plenix design system · library part w01C: the written sections of the color, grid and accessibility foundations */
DSParts.docs.push({
  'dataviz-colors': {
    purpose: 'Gives each kind of chart data its own colors, in a fixed order, apart from the interface’s status colors: series stay distinct, values read reliably, a series looks the same in every chart, and a red bar never reads as an error by accident.',
    anatomy: [
      'Categorical scale — six hues for unrelated series, the data colors in order: --plx-sys-dataviz-categorical-1 to -6 (required)',
      'Sequential scale — seven steps of one hue, lightest for the lowest value: --plx-sys-dataviz-sequential-1 to -7 (optional)',
      'Diverging scale — seven steps of two hues around a neutral midpoint (step 4): --plx-sys-dataviz-diverging-1 to -7 (optional)',
      'Status colors — positive, caution, negative, informative, neutral, only for data that is a status (optional)',
      'Alert colors — warning and critical, for thresholds and alerts on a point (optional)',
      'Grid and labels — --plx-sys-dataviz-grid-line and --plx-sys-dataviz-label for the chart’s axes and legend (optional)',
      'data-plx-dataviz — the attribute that makes a step an element’s data color (--plx-comp-data-color) (required)'
    ],
    behavior: {
      pointer: 'Not applicable: colors are values. A chart that highlights a hovered series keeps its color and changes another property (weight, the other series’ opacity).',
      keyboard: 'Not applicable: colors are values.',
      focus: 'Not applicable: the chart’s focus indicator is the theme’s focus color, never a data color.',
      responsive: 'The same at every window size and in light and dark mode.',
      motion: 'None of their own.',
      loading: 'Not applicable: a chart that is loading shows the skeleton colors, not data colors.',
      error: 'Not applicable: an error in a chart is shown with a message, not with the alert colors.'
    },
    a11y: {
      name: 'Not applicable: colors carry no name; each series is named in words (a direct label or the legend).',
      announce: 'Nothing: the data is read from the chart’s text alternative or its table.',
      focus: 'Not applicable.',
      contrast: 'Chart marks keep 3:1 against the chart surface (Contrast rules, non-text); light sequential steps are for fills next to darker marks, not for thin lines.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Name series in the legend and in direct labels by what they are (“Returns”), never by their color.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Diverging scales read low to high in the reading direction; mirror the axis, not the colors, in right-to-left layouts.'
    }
  },
  'contrast-rules': {
    purpose: 'Keeps text, icons and control edges readable for people with low vision, on dim screens and in sunlight. The contrast rules set the minimum difference between what is read and what is behind it; the theme’s role pairs are measured against them, so every component that uses the roles is readable in light and dark.',
    anatomy: [
      'Text rule — 4.5:1 for normal text (WCAG 2.2, 1.4.3) (required)',
      'Large-text rule — 3:1 for text of 24px and larger, or 18.66px bold and larger (required)',
      'Enhanced rule — 7:1 for dense small text where it can be reached (1.4.6) (optional)',
      'Non-text rule — 3:1 for icons that carry meaning, control edges, focus indicators and chart marks (1.4.11) (required)',
      'Role pairs — CONTRAST_PAIRS: a foreground role on its background role and the rule it must meet (required)',
      'Measure — contrastRatio(fg, bg) and meetsContrast(ratio, rule) (platform/utils/contrast.ts) (required)',
      'Test — tests/contrast.test.js: every pair in every theme and mode (required)'
    ],
    behavior: {
      pointer: 'Not applicable: rules, not elements. Hover and pressed colors are checked like the rest state.',
      keyboard: 'Not applicable.',
      focus: 'The focus color meets 3:1 against the surfaces it is drawn on.',
      responsive: 'The same at every window size and density.',
      motion: 'Not applicable.',
      loading: 'Not applicable.',
      error: 'A pair below its rule fails tests/contrast.test.js. A pair a theme does not meet yet is listed as pending in the test until its role points to another palette color in that theme and mode; remove a pending pair from the list once it passes.'
    },
    a11y: {
      name: 'Not applicable.',
      announce: 'Not applicable.',
      focus: 'Focus indicators are non-text content: 3:1 against what is around them.',
      contrast: 'WCAG 2.2 AA (1.4.3, 1.4.11) is the baseline for every page; it is never loosened. Disabled controls and pure decoration are exempt.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Placeholder and helper text keep text contrast: people must read them.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Not applicable: contrast does not change with language.'
    }
  },
  'keylines': {
    purpose: 'Makes icons of different shapes look the same size, and lines up the icons and text of a view.',
    anatomy: [
      'Icon square — the icon file’s 24-unit grid (the icon size names the whole square) (required)',
      'Live area — 20 units, inside 2 units of padding on every side (required)',
      'Circle — 20 units: round shapes fill the live area (required)',
      'Square — 18 units, so a square shape looks as large as the circle (required)',
      'Portrait and landscape — 16 by 20 and 20 by 16 units (required)',
      'Content start — the inset where every row’s content begins (required)',
      'Text start — the inset, the icon and the gap: where the text after a leading icon begins (required)'
    ],
    behavior: {
      pointer: 'Not applicable.',
      keyboard: 'Not applicable. Ctrl+Shift+K turns the keylines overlay on and off on a page that loads platform/dev/keylines.js.',
      focus: 'Not applicable.',
      responsive: 'The icon keylines scale with the icon size; the content keylines follow the inset and gap roles, so they move with the density.',
      motion: 'None.',
      loading: 'Not applicable.',
      error: 'Not applicable.'
    },
    a11y: {
      name: 'Not applicable: keylines are drawn only in documentation and in the dev overlay, hidden from assistive technology.',
      announce: 'Nothing.',
      focus: 'Not applicable.',
      contrast: 'Not applicable.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Text that starts on one keyline scans as one column: keep labels and values on their lines.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Content keylines are measured from the start edge, so they mirror in right-to-left layouts.'
    }
  },
  'scroll-lock': {
    purpose: 'When a modal layer covers the page, the page behind it should not move: people keep their place, and scrolling inside the modal never scrolls what is behind it.',
    anatomy: [
      'Target — the page (the html element) or one scroll container (required)',
      'Lock — lockScroll and useScrollLock set data-plx-scroll-lock="locked" on the page or a scroll container while it holds a lock, a modal layer (a dialog) takes the same lock on <html> (required)',
      'Counter — locks are counted per target; the last release unlocks it (required)',
      'Scrollbar space — scrollbar-gutter: stable keeps the bar’s space, so nothing shifts (required)',
      'Release — the function lockScroll returns; useScrollLock releases when it is no longer active or the component unmounts (required)'
    ],
    behavior: {
      pointer: 'The wheel and touch scrolling do nothing on the locked target; scrolling at the edge of the modal does not reach it (overscroll contained).',
      keyboard: 'Arrow, Page and Space keys do not scroll the locked target; they scroll the modal’s own content.',
      focus: 'Not applicable: focus is kept by the modal’s focus trap (useLayer).',
      responsive: 'The same at every window size.',
      motion: 'None.',
      loading: 'Not applicable.',
      error: 'A release called twice does nothing the second time, so an overlay cannot release another overlay’s lock.'
    },
    a11y: {
      name: 'Not applicable: behavior only.',
      announce: 'Nothing.',
      focus: 'Pair it with the modal’s focus trap and aria-modal, so assistive technology also stays inside.',
      contrast: 'Not applicable.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Not applicable: no text.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Not applicable.'
    }
  },
  'accessible-descriptions': {
    purpose: 'People using a screen reader get the same hints, formats and errors that others read next to a control when that text is tied to the control as its description.',
    anatomy: [
      'Name — what the element is: its label (required)',
      'Description — the text tied to it with aria-describedby, read after the name and role (optional)',
      'Error — the error message, tied the same way while the value is invalid (optional)',
      'Ids — joinIds keeps the owner’s ids first, then the component’s, without empty or repeated ids (required)',
      'Hidden description — VisuallyHidden text with the id, for what sighted people read from the layout (optional)'
    ],
    behavior: {
      pointer: 'Not applicable: descriptions are read, not pressed.',
      keyboard: 'Not applicable.',
      focus: 'The description is read when its element takes focus.',
      responsive: 'Not applicable.',
      motion: 'Not applicable.',
      loading: 'Not applicable.',
      error: 'When the value becomes invalid the error’s id joins the description; when it is fixed the id leaves it.'
    },
    a11y: {
      name: 'The description adds to the name and never repeats it.',
      announce: 'Read after the name and role when the element takes focus; an error that appears is also announced by its own role="alert" (Field).',
      focus: 'Not applicable.',
      contrast: 'Visible descriptions keep text contrast.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'One short sentence or a format: “Letters, numbers and dashes”.',
      actions: 'Not applicable.',
      errors: 'Say what is wrong and how to fix it: “Remove the spaces”.',
      localization: 'Descriptions are strings like every other word: they come from the strings prop.'
    }
  },
  'use-of-color': {
    purpose: 'People who see colors differently, use a monochrome or forced-colors display, or cannot see the screen still get every meaning when color is never the only way it is given.',
    anatomy: [
      'Color — a reinforcing signal (optional)',
      'Words — the state, the error or the series in text: a badge’s text, a dot’s label, a message (required)',
      'Second cue — an icon, a shape, a weight, an underline or a pattern (optional)',
      'Rule — check-system.rules/use-of-color.js: a status dot in a tone has its label or text beside it (required)'
    ],
    behavior: {
      pointer: 'Hover and selection add a non-color cue (a border, a weight, a filled icon) as well as a color change.',
      keyboard: 'Not applicable.',
      focus: 'The focus indicator is a 2px ring on controls and a border color change on fields; both meet 3:1 and never depend on hue alone.',
      responsive: 'Not applicable.',
      motion: 'Not applicable.',
      loading: 'Not applicable.',
      error: 'An invalid field has a message and the danger border, never the border alone.'
    },
    a11y: {
      name: 'A status shown in a tone has its words in its accessible name (StatusDot label, Badge text).',
      announce: 'Not applicable.',
      focus: 'Not applicable.',
      contrast: 'Colors that carry meaning also meet the Contrast rules.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Name states in words (“Paid”, “Overdue”); never refer to an element by its color (“the green button”).',
      actions: 'Not applicable.',
      errors: 'Errors say what is wrong in words, next to the field.',
      localization: 'Color meanings differ between cultures; the words carry the meaning everywhere.'
    }
  }
});
