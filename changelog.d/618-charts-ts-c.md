### Changed

- TypeScript wave 2 (#618, ADR 0011): `HeatMap`, `RadarChart` and `Treemap` are now `.tsx` with exported prop types (`HeatMapProps` and `HeatMapDay`, `RadarChartProps`, `RadarAxis` and `RadarSeries`, `TreemapProps` and `TreemapNode`). No `any` in a public prop; the chart frame's own props are reused. No behavior change.
