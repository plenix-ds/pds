### Changed

- TypeScript: the 16 charts (`LineChart` to `Sparkline`) are published with their own props types (`LineChartProps` and the others). Before this, the lazy-loading wrapper published them as `(props: any)`. An app that passed a prop a chart doesn't have now gets a compile error (ADR 0011: stricter types are *Changed*). No runtime change.
- check-system's `js-source` list has no pending files left: every source under `platform/` is TypeScript except the allowed ones (ADR 0011, D-0089). CI's `types` check also catches a component declared as `(props: any)` in a const.
