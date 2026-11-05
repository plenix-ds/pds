/* Plenix design system · library part w09C: the written sections of chart accessibility, Sparkline, Metric card,
   LollipopChart, ScatterChart (Scatter plot) and its Bubble chart, FunnelChart (Funnel), Treemap, GanttChart, GeoMap (Map)
   and its Choropleth map, moved from the common-ground guidance into Plenix's words. */
DSParts.docs.push({
  'chart-accessibility': {
    purpose: 'Makes the information in every chart available to everyone: people who use a screen reader, a keyboard or magnification, and people who do not tell colors apart.',
    anatomy: ['Name — the chart’s title, the SVG’s accessible name (ChartFrame) (required)', 'Summary — the description: the finding in one or two sentences (summarizeSeries for a trend) (required)',
      'Data grid — the same values under the chart, behind “Show the data” (ChartFrame table) (required)', 'Second cue — textures (ChartPatterns), direct labels or markers, so series differ by more than color',
      'Keyboard path — one Tab stop on the plot (ChartFrame’s chart interaction, useChartPoints), the arrow keys through its points, each spoken'],
    behavior: { pointer: 'The pointer over a point shows its tooltip and its ring; it never is the only way to a value.', keyboard: 'Tab reaches the chart once; the arrow keys move through its points in data order (Home and End: the first and the last; Escape leaves), each read with its values; Tab moves on to “Show the data”.',
      focus: 'The chart’s frame shows focus by its border color; the active point shows a ring and the tooltip.', responsive: 'The table and the description do not depend on the chart’s width; on a narrow screen the table is the better view.',
      motion: 'Charts draw once, with no animation; a chart that adds motion drops it under reduced motion.', loading: 'Keep the frame with its title while the data loads (a Skeleton in the plot); say “No data” in the description when there is none.', error: 'When the data cannot be loaded, say so in the chart’s place, with a way to try again; never an empty plot.' },
    a11y: { name: 'The title names the chart; the plot is one image (role img) named by it and described by the summary.', announce: 'Each point read with the keyboard is spoken through the page’s live region: its name and its values in the axis’s format.',
      focus: 'One Tab stop per chart: the wrapper, not each mark; the data grid and its rows keep their own keys.', contrast: 'Marks keep 3:1 against the chart surface, text 4.5:1; the textures and the ring are in the surface and content colors.', motion: 'No motion to reduce.' },
    content: { labels: 'The title names what is measured (“Downloads per week”); the description states the finding (“Up 60% since week 1, highest in week 11”); axes name the measure and its unit.', errors: 'Say what could not be shown and why, in plain words.',
      localization: 'Numbers and dates follow the reader’s locale (formatNumber, formatDate); summaries and the keyboard hint come from strings.' }
  },
  'sparkline': {
    purpose: 'Adds the shape of a trend next to a number, in a card, a table cell or a sentence, without the room of a chart.',
    anatomy: ['Line — the trend across the box (line, area)', 'Area — a light fill of the line’s color under it (area)', 'Bars — one small column per value, from zero (bar)', 'Last point — a dot on the latest value (showLast)'],
    behavior: { pointer: 'None: it is a picture of the trend; link the number or the card to the full chart.', keyboard: 'None: it takes no focus.', focus: 'None.', responsive: 'Inline keeps its word size; fill takes its container’s width and redraws when it resizes.',
      motion: 'None.', loading: 'Leave the box empty (or a Skeleton of its size) until the values arrive.', error: 'Show nothing in its place; the number beside it says the data is missing (a dash).' },
    a11y: { name: 'One image named by its label and a summary of the trend (“Downloads per week: up 60% from 40 to 64; lowest 39, highest 66.”).', announce: 'Nothing is announced; it is read in place.',
      focus: 'It takes no focus.', contrast: 'The line and bars are data-viz colors at 3:1 against the surface.', motion: 'Nothing to reduce.' },
    content: { labels: 'Label it with what is measured and the period (“Downloads per week”); decorative when the text beside it already says the trend.', errors: 'A dash beside it for missing data, never 0.', localization: 'The summary’s numbers follow the reader’s locale; its words come from strings.' }
  },
  'metric-card': {
    purpose: 'Lets people read a key measure’s current state at a glance on a dashboard, with its change and the one visual its type draws, and reach its details.',
    anatomy: ['Frame — Panel’s frame in one of five styles (`appearance`): plain, edge, soft, filled or gradient (required)', 'Header — the icon, the title (a link to the details with href), info, the card’s own period filter and More, then a context line with the scope or the period (required; the tile and icon-start layouts have none)',
      'Value — the figure with its unit or target, the largest text in the card, never colored (required)', 'Status — a status badge with its icon at the end of the value row', 'Change — the change since the last period with its arrow; its color says good or bad (goodWhen)', 'Visual — the one visual the type draws (12 types: value, trend, progress, gauge, breakdown, comparison, list, summary, person, week, month, table)', 'Footer — one line: a status message, the source, when it was updated'],
    behavior: { pointer: 'With href the whole card opens the details; info, the filter and More stay their own targets.', keyboard: 'Tab reaches the title link (with href), then info, the filter and More.', focus: 'Each control shows its own focus ring.', responsive: 'Five layouts: stacked, beside (two columns wide), inline, tile and icon-start. Cards in a row share the type, the layout, the size and the style, so they line up; in a ContentGrid they keep one width and wrap.',
      motion: 'None.', loading: 'The header stays; placeholders stand in for the value and the visual.', error: 'The header stays, with the message and Try again. With no data the value shows “–” and the no-data line; out-of-date data gets an Out of date badge.' },
    a11y: { name: 'The title is a heading (level 3 by default); the value, the status, the change and the visual are read in that order under it.', announce: 'The visual is read as its label and its summary.', focus: 'The title link (with href), info, the filter and More take focus.', contrast: 'Colors are the data colors only. The change’s colors are text colors at 4.5:1 and its arrow carries the direction too; filled and gradient turn every text white.', motion: 'Nothing to reduce.' },
    content: { labels: 'The title is a short noun phrase for what is measured; the context line says the scope or the period, the same on every card of a row. Info says in one to three sentences how the figure is calculated.', actions: 'More holds secondary actions (open the details, export), never the card’s main action.', errors: 'Leave the value out for missing data: the card shows “–”, never 0.', localization: 'Format the figure and the change in the reader’s locale before passing them (formatNumber, formatCompact); the card’s own words come from strings.' }
  },
  'lollipop-chart': {
    purpose: 'Compares many categories with less ink than bars, so close values and the ranking read clearly.',
    anatomy: ['Stem — a thin line from zero to the value (required)', 'Dot — the value’s marker (required)', 'Category axis — the names (down the side, or along the bottom)', 'Value axis — from zero, with grid lines across', 'Values — optional labels at the dots (showValues)'],
    behavior: { pointer: 'Hovering a category shows its tooltip and rings its dot.', keyboard: 'Tab reaches the chart; the arrow keys move through the categories, each read with its value.', focus: 'The chart’s frame changes its border color; the active dot is ringed.',
      responsive: 'The plot fills its container’s width; with many categories use the horizontal form.', motion: 'None.', loading: 'Keep the frame and its title; a Skeleton in the plot.', error: 'Say what could not be loaded in the chart’s place.' },
    a11y: { name: 'The title names the chart; its description says the finding.', announce: 'Each category is read with its value as the keyboard reaches it.', focus: 'One Tab stop; arrow keys inside.', contrast: 'Stems and dots are data-viz colors at 3:1; dots carry a ring in the surface color.', motion: 'Nothing to reduce.' },
    content: { labels: 'Short category names; valueTitle names the measure with its unit.', errors: 'Say what could not be shown.', localization: 'Values follow the reader’s locale (format).' }
  },
  'scatter-chart': {
    purpose: 'Shows how two measures relate across many items: a correlation, clusters and outliers.',
    anatomy: ['Points — one per item (required)', 'Two value axes — each titled with its measure and unit (required)', 'Legend — when points are grouped by color', 'Trend line — an optional dashed fit per group'],
    behavior: { pointer: 'Hovering a point shows its name and both values, and rings it.', keyboard: 'Tab reaches the chart; the arrow keys move through the points by group, then left to right.', focus: 'The frame’s border shows focus; the active point is ringed.',
      responsive: 'The plot fills its container’s width; both axes refit to the data.', motion: 'None.', loading: 'Keep the frame and its title; a Skeleton in the plot.', error: 'Say what could not be loaded in the chart’s place.' },
    a11y: { name: 'The title and the description name the two measures and the finding.', announce: 'Each point is read with its group, name and both values.', focus: 'One Tab stop; arrow keys inside.', contrast: 'Points keep 3:1 with their outline in their own color; groups also differ in the legend’s names.', motion: 'Nothing to reduce.' },
    content: { labels: 'Axis titles with units (“Size (MB)”); item names in the tooltip and the table.', errors: 'Say what could not be shown.', localization: 'Numbers follow the reader’s locale (xFormat, yFormat).' }
  },
  'bubble-chart': {
    purpose: 'Compares items on three related measures at once: two by position, the third by the bubble’s area.',
    anatomy: ['Bubbles — position by two measures, area by the third (required)', 'Two value axes — titled with measures and units (required)', 'Legend — when bubbles are grouped', 'Size measure — named by sizeTitle in the tooltip and the table'],
    behavior: { pointer: 'Hovering a bubble shows its three values and rings it.', keyboard: 'Tab reaches the chart; the arrow keys move through the bubbles, each read with its three values.', focus: 'The frame’s border shows focus; the active bubble is ringed.',
      responsive: 'Bubble sizes stay in pixels while the axes refit to the width.', motion: 'None.', loading: 'Keep the frame and its title; a Skeleton in the plot.', error: 'Say what could not be loaded in the chart’s place.' },
    a11y: { name: 'The description names the three measures and the finding.', announce: 'Each bubble is read with its two positions and its size.', focus: 'One Tab stop; arrow keys inside.', contrast: 'Bubbles are half transparent with an outline in their color, so overlaps stay readable.', motion: 'Nothing to reduce.' },
    content: { labels: 'sizeTitle with its unit (“Storage (GB)”).', errors: 'Say what could not be shown.', localization: 'Numbers follow the reader’s locale.' }
  },
  'funnel-chart': {
    purpose: 'Shows where items drop out between the steps of an ordered process, such as a sign-up flow.',
    anatomy: ['Stages — one bar per step, in order, on a zero baseline (required)', 'Drop — the stage before’s length behind each bar', 'Count — each stage’s value (required)', 'Share — the share kept from the stage before'],
    behavior: { pointer: 'Hovering a stage shows its count, the share kept and the share of the first stage.', keyboard: 'Tab reaches the chart; the arrow keys move through the stages.', focus: 'The frame’s border shows focus; the active bar is ringed.',
      responsive: 'The plot fills its container’s width; long stage names call for the vertical form.', motion: 'None.', loading: 'Keep the frame and its title; a Skeleton in the plot.', error: 'Say what could not be loaded in the chart’s place.' },
    a11y: { name: 'The description names the step with the largest drop.', announce: 'Each stage is read with its count and the share kept.', focus: 'One Tab stop; arrow keys inside.', contrast: 'Bars are a data-viz color at 3:1; the drop is the sunken surface, the labels say the numbers.', motion: 'Nothing to reduce.' },
    content: { labels: 'Stage names as short verbs or states (“Signed up”); valueTitle names who is counted.', errors: 'Say what could not be shown.', localization: 'Counts and shares follow the reader’s locale.' }
  },
  'treemap': {
    purpose: 'Shows how a whole divides into many parts, and parts into groups, in little room.',
    anatomy: ['Tiles — rectangles sized by value, largest first (required)', 'Labels — name and value on tiles big enough for them', 'Groups — framed and named above their tiles (nested)', 'Gaps — in the surface color between tiles'],
    behavior: { pointer: 'Hovering a tile shows its name, value and share, and rings it.', keyboard: 'Tab reaches the chart; the arrow keys move through the tiles by group, largest first.', focus: 'The frame’s border shows focus; the active tile is ringed.',
      responsive: 'The layout is redone at every width; small tiles drop their labels (the tooltip and table keep them).', motion: 'None.', loading: 'Keep the frame and its title; a Skeleton in the plot.', error: 'Say what could not be loaded in the chart’s place.' },
    a11y: { name: 'The description names the largest parts.', announce: 'Each tile is read with its group, name, value and share.', focus: 'One Tab stop; arrow keys inside.', contrast: 'Tile names sit on a halo in the surface color, so they read on any data color.', motion: 'Nothing to reduce.' },
    content: { labels: 'Short part names; valueTitle names the measure with its unit.', errors: 'Say what could not be shown.', localization: 'Values and shares follow the reader’s locale.' }
  },
  'gantt-chart': {
    purpose: 'Helps people plan and follow a schedule: when tasks start and end, what waits on what, and what is late today.',
    anatomy: ['Task names — the rows, before the plot (required)', 'Time axis — calendar ticks under the plot (required)', 'Task bars — start to end, the part not done textured, the share done after (required)',
      'Milestones — diamonds at a date', 'Dependencies — arrows from a task to the tasks that wait for it', 'Today line — a dashed line at today'],
    behavior: { pointer: 'Hovering a row shows its dates and progress, and rings its bar.', keyboard: 'Tab reaches the chart; the arrow keys move through the tasks, each read with its dates, progress, status and what it waits for.', focus: 'The frame’s border shows focus; the active bar is ringed.',
      responsive: 'The time axis fits the width; on narrow screens the table is the better view.', motion: 'None.', loading: 'Keep the frame and its title; a Skeleton in the plot.', error: 'Say what could not be loaded in the chart’s place.' },
    a11y: { name: 'The description says what matters in the plan (what is late, what waits on what).', announce: 'Each task is read with its dates, progress, status and dependencies.', focus: 'One Tab stop; arrow keys inside.', contrast: 'Progress is a texture, status is words: neither is told by color alone.', motion: 'Nothing to reduce.' },
    content: { labels: 'Task names as short nouns or verbs; status in words (“Late”, “Done”).', errors: 'Say what could not be shown.', localization: 'Dates follow the reader’s locale (formatDate); the words come from strings.' }
  },
  'geo-map': {
    purpose: 'Shows where things are and how places relate in space, from the app’s own geography.',
    anatomy: ['Regions — land from GeoJSON, outlined (required)', 'Markers — dots at places', 'Zoom buttons — zoom in, zoom out, show the whole map', 'Data grid — the regions or places as a table'],
    behavior: { pointer: 'Hovering a region or a marker shows its name; when zoomed in, dragging moves the map; the wheel never zooms.', keyboard: 'Tab reaches the zoom buttons, then the map; the arrow keys move through the places (or regions), each read by name.',
      focus: 'The map’s frame shows focus by its border color; the active region or marker is ringed.', responsive: 'The shapes are fitted to the frame at every width; lines keep their width when zoomed.', motion: 'None.', loading: 'Keep the frame and its title while the shapes load.', error: 'Say what could not be loaded in the map’s place.' },
    a11y: { name: 'The title names the map; the description says what it shows.', announce: 'Each place or region is read by name as the keyboard reaches it.', focus: 'One Tab stop for the map, one per zoom button.', contrast: 'Markers carry a ring in the surface color, so they stand off the land.', motion: 'Nothing to reduce.' },
    content: { labels: 'Places by their names; coordinates in the table in the data font.', errors: 'Say what could not be shown.', localization: 'Names come from the app’s data; the buttons’ words from strings.' }
  },
  'choropleth-map': {
    purpose: 'Shows how a measure varies across regions, such as the share of active users by region.',
    anatomy: ['Regions — shaded by their value’s step (required)', 'Legend — the steps with their ranges (required)', 'No data — a texture on regions without a value', 'Data grid — every region with its value'],
    behavior: { pointer: 'Hovering a region shows its name and value, and rings it.', keyboard: 'Tab reaches the map; the arrow keys move through the regions with a value, each read with it.', focus: 'The map’s frame shows focus by its border color.',
      responsive: 'The shapes are fitted to the frame; the legend wraps under the map.', motion: 'None.', loading: 'Keep the frame and its title while the values load.', error: 'Say what could not be loaded in the map’s place.' },
    a11y: { name: 'The description names the highest and lowest regions.', announce: 'Each region is read with its value.', focus: 'One Tab stop for the map.', contrast: 'The sequential and diverging steps are the data-viz scales; no data is a texture, not a color.', motion: 'Nothing to reduce.' },
    content: { labels: 'valueTitle names the measure; values are normalized (rates, shares), never raw counts.', errors: 'Say what could not be shown.', localization: 'Values follow the reader’s locale (format).' }
  }
});
