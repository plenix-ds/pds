### Changed

- TypeScript wave 2 (#618, ADR 0011): `BoxPlot` and `BulletChart` are now `.tsx` with exported prop types (`BoxPlotProps` and `BoxPlotGroup`, `BulletChartProps` and `BulletItem`). No `any` in a public prop; the chart frame's own props are reused. No behavior change.
