# ADR 0054: Dashboard chart cards: a Panel fills its WidgetGrid cell; charts show their data in a Dialog

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's request (via CTM3 - PM, #1229, CTM#323). G2 (`pds1-design-director`, PR #1231, D-0163) owns the stretch look, the button (ghost `sm`, `table_view` icon, `aria-haspopup="dialog"`) and the Dialog (`md`, no footer).
- **Issue:** #1229 (S2).

## Context

- A dashboard card is a `BarChart` or `PieChart` inside a `Panel` inside a `WidgetGrid` (`platform/patterns/WidgetGrid/WidgetGrid.tsx`).
  - `.plx-widget-grid` is a CSS grid, so its items already stretch to the row's height.
  - The Panel inside an item keeps its content height, so cards in one row end at different heights and their footers don't line up.
- The styling standard has no combinators (zero overlap), so WidgetGrid can't size the Panel inside it from its own CSS.
- Every chart draws in `ChartFrame` (`platform/charts/ChartFrame.tsx`). Its `table` is shown behind an inline `Details` ("Show the data") that expands a table inside the card. `Gauge` draws its own `Details`. Each chart passes a picked set of ChartFrame's props (`Pick<ChartFrameProps, …>`).
- The owner's rules: no action links, and actions are Fluent-style buttons.

## Options

| Option | For | Against |
|---|---|---|
| **A. Panel fills its cell by default when it is a WidgetGrid item's own content (React context from the item), with `fill` to override; charts get `dataView: "dialog" \| "inline"`, default `"dialog"`** | Equal heights with no app change (CTM sets nothing). The context reaches only the item's own Panel. The Dialog is the default the owner asked for, and inline is an opt-in. | One context. A default behavior change for chart data views (owner-asked). |
| B. `align-items: stretch` and a pinned footer on WidgetGrid alone | No Panel change | Can't reach the Panel without a combinator (zero overlap). |
| C. A `fill` prop that apps must set | Explicit | Every dashboard must remember it (CTM would need a change for each card). |

## Decision

**Option A.**

### Panel

- **`fill?: boolean`.** The Panel takes the full height of its cell (`block-size: 100%`), lays out as a column, lets the body grow, and pins the footer to the bottom. The class is `plx-panel--fill`.
  - **Default:** `true` when the Panel is the direct content of a WidgetGrid item, otherwise `false`.
    - "Direct content" means WidgetGrid's item provides a context, and the Panel reads it and then clears it for its own children, so a Panel nested deeper never fills.
  - `fill={false}` opts out inside a grid, and `fill` opts in elsewhere (any parent with a definite height).
  - A **collapsed** Panel never fills: it keeps its own height (G2, D-0163).
  - The extra height goes to the body. A chart in the body is never stretched: its plot keeps its `size` height, and its "Show the data" button sits on the card's bottom edge (the chart frame grows inside the body, and the button is its last row; G2 design 1229 §7).
- **WidgetGrid:** the item (`plx-widget-grid__item`) becomes a column flex box so its content can fill it. It stays a grid item (stretched by the row). There is no new WidgetGrid prop.

### Charts

- **`dataView?: "dialog" | "inline"`** on `ChartFrame` and on every chart that passes ChartFrame's props (added to each chart's `Pick<ChartFrameProps, …>`). The default is `"dialog"`.
  - **`"dialog"`:** a ghost (`variant="ghost"`, `sm`) Button "Show the data" (`strings.showData`, the same key) opens a Dialog. The Dialog's title is the chart's `title`, and its body is the same table, built on first open as today. Focus returns to the button on close.
  - **`"inline"`:** today's `Details` under the chart, unchanged.
  - `Gauge` takes the same prop, with the same behavior.
- **Strings:** `chart.chartFrame.showData` (the button) and `table` (the table's accessible name, "{title}: data") stay. The Dialog's close button uses the Dialog's own strings. No new string, unless G2 words a new one.
- **Class:** `plx-chart__data-button` (the button). The Dialog uses its own classes.

## Consequences

- **Semver: MINOR (1.7.0).**
  - Added: `Panel.fill`, `plx-panel--fill`, `dataView` on ChartFrame, every chart and Gauge, and `plx-chart__data-button`.
  - **Changed defaults (owner-asked):**
    - A Panel directly in a WidgetGrid fills its cell.
    - A chart's data opens in a Dialog. `dataView="inline"` gives the 1.6 behavior back.
  - Both are in the changelog. No deprecation.
- CTM gets equal heights and the Dialog from the CDN with no change.

## Enforced by

- G3 on the build PR: the API diff matches this entry, and `dataView` is on every chart's props (a type test lists them).
- Behavior tests (#1229):
  - in a WidgetGrid row, the Panels' computed heights are equal and the footers' bottoms align;
  - a Panel nested inside a widget's Panel doesn't fill, and neither does a collapsed one;
  - the plot keeps its size height in a stretched card;
  - `fill={false}` opts out;
  - "Show the data" is a button, opens a Dialog titled with the chart's title and holding the table, and focus returns to it on close;
  - `dataView="inline"` keeps the Details.
