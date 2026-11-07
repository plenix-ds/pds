### Fixed

- TypeScript (RedSave P-67, #893): `@plenix-ds/react`'s published types accept correct app code again, as they did before 0.92. No runtime change.
  - **DataGrid columns:** a column's `field` can be any string, as well as a row key, so a computed or action column ("Keep") compiles. `headerAlign` is back as an optional, `@deprecated` field. It's ignored (D-0087) and removed in 2.0.0.
  - **`useCollectionView`** takes the app's row type again (`useCollectionView<Row>(…)`). Its outputs spread into FilterPanel, SortPanel, GroupPanel, ColumnsMenu, ViewMenu, QuickFilter and DataGrid without errors, because the hook and the components now share one type each: the field, the filter, the level, the view, the quick value and the group.
    - DataGrid's `sort` levels take an optional `dir`, and `groupBy` accepts `false`.
    - FilterPanel's `request` accepts `null`, and QuickFilter's `counts` and `value` take numbers.
  - **Tabs** `onChange` accepts a handler typed for the app's own value (`(value: string) => …`).
  - **Four type names were exported twice and couldn't be imported:** `SortLevel`, `ChartDate`, `Catalog` and `TimelineItem`. Each now resolves to one type. TimelineChart's item is `TimelineChartItem`; `TimelineItem` is the Timeline component's.
- `tests/types.test.js`'s RedSave fixture imports the built package again. Its path still pointed at `packages/react`, from before the build moved to `release/packages/` (#223), so it had stopped checking.
- **Three type names 0.90.1 published are exported again:** `CollectionField`, `CollectionFilter` and `CollectionView` (#894). `useCollectionView.ts` now exports them itself, and the stale hand-written `useCollectionView.types.d.ts` is gone. A new check (`tools/checks/published-names.mjs`, run by `tests/types.test.js`) fails the build if any name a past release exported goes missing; 0.90.1's 957 names are recorded in `tests/fixtures/published-names-0.90.1.txt`.
