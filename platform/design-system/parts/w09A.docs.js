/* Plenix design system · library part w09A: the written sections of the chart interaction and the charts of wave 9,
   lane A (LineChart, AreaChart, Gauge, HeatMap, WaterfallChart, WordCloud, NetworkGraph, Diagram; Step chart shows the
   line chart's, docsFrom), moved from the common-ground guidance into Plenix's words. */
DSParts.docs.push({
  'chart-interaction': {
    purpose: 'Lets people get the exact values and more detail from a chart, with the keyboard as well as the pointer, without crowding the chart’s default view.',
    anatomy: ['Plot — one Tab stop, its border the focus indicator (required)', 'Tooltip — the values at the active place (ChartTooltip) (required)', 'Crosshair — the line down the plot at the active x (lines and areas)',
      'Focus dot — a dot on each active value', 'Live region — says each value as it becomes active (required)', 'Legend toggles — show and hide series (ChartLegend interactive)', 'Brush — the range marked for a zoom', 'Reset zoom — the button above the plot while zoomed'],
    behavior: { pointer: 'Moving over the plot shows the nearest value; a click selects it (select); a drag across the plot marks a range and zooms to it (zoom).', keyboard: 'Tab reaches the plot once. ← → move along the values, ↑ ↓ between series or rows, Home and End to the ends; Enter or Space selects; Shift + ← → marks a range and Enter zooms; Escape clears.',
      focus: 'The plot’s border takes the focus color; the active value shows its dot and the tooltip; leaving the plot clears them.', responsive: 'Geometry is the chart’s: the interaction keeps indices, so the value in focus survives a resize or a zoom.',
      motion: 'Dimming fades in a short motion-token transition; reduced motion makes it instant.', loading: 'The plot takes focus only once it is drawn.', error: 'Not applicable: a chart with no values has nothing to move between.' },
    a11y: { name: 'The plot is a group named “<title>, interactive chart”, described by the keyboard hint; the SVG inside stays one image named by the title.', announce: 'Each move says the values at the active place in the polite live region, the same words the tooltip shows (chartTooltipText); zoom, reset and legend changes are said too.',
      focus: 'One stop per chart; keys never leave the plot except Tab.', contrast: 'The focus border uses the focus color; dimmed series keep their shape, only their opacity drops.', motion: 'Reduced motion removes the transitions.' },
    content: { labels: 'The tooltip and the legend use the same series names.', actions: 'Reset zoom, said plainly.', errors: 'Not applicable.', localization: 'Every word comes from strings; values follow the reader’s locale.' }
  },
  'line-chart': {
    purpose: 'Shows how values change over an ordered range, usually time, and lets people compare the trends of a few series.',
    anatomy: ['Lines — one per series, in the categorical colors (required)', 'Points — a dot on each value (points)', 'Axes and grid lines — x along the bottom, values on the start side (required)', 'Legend — series names, interactive toggles (two or more series)',
      'Crosshair and tooltip — the values at the active x', 'Data grid — the values behind Show the data (required)'],
    behavior: { pointer: 'Hover moves the crosshair to the nearest value; a click selects it (onSelect); a drag zooms (zoom).', keyboard: 'One Tab stop: ← → along the values, ↑ ↓ between the series, Home and End; Enter selects; Shift + ← → and Enter zoom.',
      focus: 'The plot’s border takes the focus color; the active values show their dots.', responsive: 'The plot takes the container’s width; x labels thin out on narrow charts.', motion: 'None but the dimming of the interaction.',
      loading: 'Draw the frame with its title once the data is there; never an empty plot without a word.', error: 'Say in the frame’s place that the data could not be loaded, with a way to try again.' },
    a11y: { name: 'The SVG is an image named by the title and described by the description; the plot group is named “<title>, interactive chart”.', announce: 'The live region says the values at each x (the series in focus first).',
      focus: 'One Tab stop.', contrast: 'Lines keep 3:1 against the surface (the data-viz scales); color is never the only cue: the legend, the tooltip and the table name the series.', motion: 'Nothing animates.' },
    content: { labels: 'A title that states the finding or the question; axis titles with the measure and its unit.', actions: 'Not applicable.', errors: 'Say that a value is missing in the description when it matters.', localization: 'Numbers and dates follow the reader’s locale (formatNumber, formatDate).' }
  },
  'area-chart': {
    purpose: 'Shows the size of a total over time, and how its parts add up to it or share it.',
    anatomy: ['Areas — filled down to the baseline or the series under them (required)', 'Lines — the top edge of each area (required)', 'Axes — the value axis from zero (required)', 'Legend — series names in stack order', 'Data grid (required)'],
    behavior: { pointer: 'As the line chart: the crosshair and the shared tooltip.', keyboard: 'As the line chart.', focus: 'As the line chart.', responsive: 'As the line chart.', motion: 'None.', loading: 'As the line chart.', error: 'As the line chart.' },
    a11y: { name: 'As the line chart.', announce: 'Percent stacks say the share and the value of each series.', focus: 'One Tab stop.', contrast: 'Stacked areas are nearly solid with their lines on top; overlapping areas are see-through.', motion: 'Nothing animates.' },
    content: { labels: 'Series in a stable order, the steadiest at the bottom of a stack.', actions: 'Not applicable.', errors: 'Not applicable.', localization: 'Percentages follow the reader’s locale (formatPercent).' }
  },
  'gauge': {
    purpose: 'Shows at a glance how far one value is within its possible range, and whether it has reached a limit.',
    anatomy: ['Track — the whole range (required)', 'Fill — up to the value (required)', 'Value — in the data font in the dial’s middle (required)', 'Label — its unit or whole, under the value', 'Ends — the minimum and maximum (required)',
      'Threshold ranges — warning and critical, outside the track', 'Status badge — names the range the value is in'],
    behavior: { pointer: 'None: a gauge is read, not used.', keyboard: 'No Tab stop; Show the data under it is a disclosure.', focus: 'Not applicable.', responsive: 'The dial keeps its size’s width and shrinks inside a narrower container.',
      motion: 'None.', loading: 'Show the gauge once the value is known; a Skeleton of its size before.', error: 'When the value cannot be read, say so in its place.' },
    a11y: { name: 'A meter named by the title, with aria-valuenow, aria-valuemin and aria-valuemax.', announce: 'The value text says the value, the label and the range’s name: “86%, of 100 GB, Nearly full”.', focus: 'Not focusable.',
      contrast: 'The fill keeps 3:1 against the track; the status is a badge with an icon and words, never color alone.', motion: 'Nothing animates.' },
    content: { labels: 'Title: what is measured. Label: the unit or the whole.', actions: 'Not applicable.', errors: 'Not applicable.', localization: 'Values follow the reader’s locale through format; badge words come from the thresholds.' }
  },
  'heat-map': {
    purpose: 'Shows patterns across two dimensions, such as hour by weekday, or activity day by day.',
    anatomy: ['Cells — colored by value (required)', 'Row and column labels (required)', 'Empty cells — a dashed edge for a missing value', 'Color scale — the lowest and highest values and the seven steps (required)', 'Tooltip — the active cell’s exact value', 'Data grid (required)'],
    behavior: { pointer: 'Hover shows a cell’s value; a click selects it (onSelect).', keyboard: '← → along a row (calendar: a week earlier or later), ↑ ↓ along a column (calendar: the day before or after), Home and End to the row’s ends; Enter selects.',
      focus: 'The plot’s border takes the focus color; the active cell takes a strong edge.', responsive: 'Matrix cells stretch with the plot; calendar cells stay square.', motion: 'None.', loading: 'As the line chart.', error: 'As the line chart.' },
    a11y: { name: 'As every chart: the SVG named by the title; the plot group interactive.', announce: 'Each move says “<row>, <column>: <value>” or “No data”.', focus: 'One Tab stop.',
      contrast: 'The sequential and diverging steps are even; the active cell is outlined; the exact values are in the tooltip and the table.', motion: 'Nothing animates.' },
    content: { labels: 'Short row and column names; valueLabel names what a value counts.', actions: 'Not applicable.', errors: 'Missing values say “No data”.', localization: 'Weekday and month names and dates follow the reader’s locale.' }
  },
  'waterfall-chart': {
    purpose: 'Explains what drove the change between two totals, step by step.',
    anatomy: ['Total columns — from zero (required)', 'Change columns — floating from the running total (required)', 'Connectors — dashed, from one step’s end to the next', 'Labels — signed changes and totals (required)', 'Legend — increase, decrease, total', 'Data grid (required)'],
    behavior: { pointer: 'Hover shows a step’s change and the running total; a click selects it (onSelect).', keyboard: '← → from step to step, Home and End; Enter selects.', focus: 'The plot’s border takes the focus color; the other steps step back.',
      responsive: 'The steps share the width; long step names thin out.', motion: 'None but the dimming.', loading: 'As the line chart.', error: 'As the line chart.' },
    a11y: { name: 'As every chart.', announce: 'Each step says its change and the running total.', focus: 'One Tab stop.', contrast: 'Increases and decreases differ by color and by the sign of their labels.', motion: 'Nothing animates.' },
    content: { labels: 'Step names that say the cause: “New customers”, “Churn”.', actions: 'Not applicable.', errors: 'Not applicable.', localization: 'The minus sign is typographic (−); amounts follow the reader’s locale.' }
  },
  'word-cloud': {
    purpose: 'Gives a quick impression of the main terms in a body of text, as an entry point to the items behind them.',
    anatomy: ['Words — sized by their count (required)', 'Colors — the group a word belongs to (groups)', 'Legend — the groups', 'Tooltip — a word’s count', 'Data grid — every term and its count, sorted (required)'],
    behavior: { pointer: 'Hover shows a word’s count and steps the others back; a click selects it (onSelect: filter a list).', keyboard: 'The arrow keys move to the nearest word that way, Home and End to the largest and the smallest; Enter selects.',
      focus: 'The plot’s border takes the focus color; the active word is underlined.', responsive: 'The words are placed again when the plot’s size changes; a word that does not fit is left out of the picture.', motion: 'None but the dimming.',
      loading: 'Words are measured once the fonts load, then placed.', error: 'With no words, say so in the description.' },
    a11y: { name: 'As every chart.', announce: 'Each word says its count.', focus: 'One Tab stop.', contrast: 'Words without a group use the body text color; the smallest size is the 12px step.', motion: 'Nothing animates.' },
    content: { labels: 'Terms as people wrote them, lowercased consistently.', actions: 'Not applicable.', errors: 'Not applicable.', localization: 'Words are the data’s; counts follow the reader’s locale.' }
  },
  'network-graph': {
    purpose: 'Shows how items connect, so people can follow dependencies, lineage and relationships.',
    anatomy: ['Nodes — a dot in the group’s color and a short label (required)', 'Edges — lines, an arrowhead when directed, a label for the relationship (required)', 'Zoom controls — Zoom in, Zoom out, Fit', 'Legend — the node groups', 'Tooltip — the active node’s group and connections', 'Data grid — nodes and their connections (required)'],
    behavior: { pointer: 'Hover highlights a node and its neighbors; a click selects it; a drag of the background pans; the buttons zoom.', keyboard: 'The arrow keys follow the edges to the node most in that direction; Home and End; Enter selects; + − zoom and 0 fits.',
      focus: 'The plot’s border takes the focus color; the active node takes a ring and its edges a strong line.', responsive: 'The layout is computed again for the plot’s size; the same data draws the same graph.', motion: 'No layout animation; the dimming follows reduced motion.',
      loading: 'Show the frame and its title, then the graph once the data is there.', error: 'As the line chart.' },
    a11y: { name: 'As every chart.', announce: 'Each node says its group and what it is connected to.', focus: 'One Tab stop; the zoom buttons are their own stops above the plot.', contrast: 'Edge kinds differ by dashes and labels, not color.', motion: 'Nothing animates.' },
    content: { labels: 'Short node labels; the full name in the table.', actions: 'Zoom in, Zoom out, Fit.', errors: 'Not applicable.', localization: 'Lists of connections follow the reader’s locale (formatList).' }
  },
  'diagram': {
    purpose: 'Explains how the parts of a process or a system fit together.',
    anatomy: ['Shapes — a step, a decision, a start or end, data; or boxes with a line (required)', 'Labels — wrapped inside the shapes (required)', 'Connectors — elbows with arrowheads, branch labels (required)', 'Groups — containers with a name (boxes and arrows)', 'Zoom controls (interactive)', 'Data grid — the steps and where they lead (required)'],
    behavior: { pointer: 'Hover highlights a shape and its connectors; a click selects it; a drag of the background pans.', keyboard: 'Down (or right) follows the flow, up (or left) goes back, the other arrows move across a layer; Enter selects; + − 0 zoom.',
      focus: 'The plot’s border takes the focus color; the active shape and its connectors take a strong outline.', responsive: 'The diagram is drawn at its own size and shrinks only to fit a narrower container; the plot is as tall as the diagram.', motion: 'None but the dimming.',
      loading: 'As the line chart.', error: 'As the line chart.' },
    a11y: { name: 'As every chart; read-only diagrams have no Tab stop.', announce: 'Each step says its kind and where it leads.', focus: 'One Tab stop when interactive.', contrast: 'Shapes and labels carry the meaning; no color does.', motion: 'Nothing animates.' },
    content: { labels: 'Steps start with a verb; decisions are questions; branch labels answer them (“Yes”, “No”).', actions: 'Zoom in, Zoom out, Fit.', errors: 'Not applicable.', localization: 'Every word is the caller’s; shapes keep their size, so keep labels short in every language.' }
  }
});
