### Changed

- TypeScript wave 2 (#618, ADR 0011): `HeatMap`, `RadarChart`, `ScatterChart`, `Treemap` and `WaterfallChart` are now `.tsx` with exported prop types (`HeatMapProps` and `HeatMapDay`, `RadarChartProps`, `RadarAxis` and `RadarSeries`, `ScatterChartProps`, `ScatterSeries` and `ScatterPoint`, `TreemapProps` and `TreemapNode`, `WaterfallChartProps` and `WaterfallStep`). No `any` in a public prop; the chart frame's own props are reused. No behavior change.
