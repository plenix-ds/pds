### Changed

- TypeScript wave 2 (#618, ADR 0011): `BoxPlot`, `BulletChart`, `FunnelChart`, `LollipopChart` and `PieChart` are now `.tsx` with exported prop types (`BoxPlotProps` and `BoxPlotGroup`, `BulletChartProps` and `BulletItem`, `FunnelChartProps` and `FunnelStage`, `LollipopChartProps` and `LollipopPoint`, `PieChartProps` and `PieSlice`). No `any` in a public prop; the chart frame's own props are reused. No behavior change.
