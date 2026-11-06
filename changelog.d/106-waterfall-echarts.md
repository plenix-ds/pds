### Changed

- WaterfallChart draws with Apache ECharts (owner decision 2026-10-26, #106) and loads on first use: same name, props, keyboard, live region, tooltip, legend and "Show the data"; totals stand on the baseline, changes float (and cross zero) between the running totals, with dashed connectors and the signed values at the bars. `waterfallSteps` stays in the first load. No change to the vendored engine.
