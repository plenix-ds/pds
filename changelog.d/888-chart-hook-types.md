### Changed

- Types (#888, #61): `useChartInteraction` returns `ChartInteraction` (with `ChartGeometry`, `ChartKeyEvent`), `useChartPoints` returns `ChartPoints`, `useGraphView().wrap` and `zoomBy`, `boxStats`, `waterfallSteps`, `niceTicks` and `binValues` have real types, the lazy charts' `displayName` is a string, and `DataGridEngine` takes `DataGridEngineProps`. No `any` is left in the published types. Compile time only; no behavior change.
