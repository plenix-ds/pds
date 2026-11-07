# ADR 0024: useCollectionView, Table and SplitWorkspace are generic over the row

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on RedSave's fix request P-69 (#923, triaged from #922). Decision D-0096 (owner may switch).
- **Issue:** #923 (S2)

## Context

- **DataGrid is generic** over its row (`DataGrid<R>`, `DataGridColumn<R>`, `DataGridProps<R>`), so `render(record)` and `filter(record)` see the app's row type.
- **Three parts were not**, checked on 0.93.0:
  - `useCollectionView` typed its options over `R` (#893), but its `fields` took `Field` with `get(row: object)`, and `test(row)` and `count(rows)` took `Record<string, unknown>`.
  - `Table` typed `data`, `columns[].render(record)` and `unread(record)` as `Record<string, unknown>`.
  - `SplitWorkspace` typed `rows` as `Record<string, unknown>[]` and `columns` as `DataGridColumn[]`, so a `DataGridColumn<PersonRow>[]` could not be passed.
- **`CollectionField<R>`** took `R` but ignored it (`= Field`).

## Options

| Option | For | Against |
|---|---|---|
| **A. A row type parameter `R` on each, defaulting to `Record<string, unknown>`; `useCollectionView` reads `R` from `options.data` (or an explicit `<R>`), never from `fields`** | Same shape as DataGrid. Existing code compiles unchanged: no `R` means today's types. | One deferred-inference helper type inside the hook. |
| B. `R` inferred from `fields` as well | Fewer type arguments when only `get` is typed | A plain `Field[]` (the common case) makes `R` = `object`, so `text: (row) => row.title` stops compiling: a breaking change for 0.x apps (seen in `templates/Commerce/Storefront.tsx`). |
| C. Leave the types; apps cast | No work | RedSave's typed `get` and `render` lose the row type (the request). |

## Decision

**Option A** (D-0096; reply B on #923 to switch).

- **`Field<R extends object = object>`** (`utils/fields.ts`): `get?(row: R)`. `CollectionField<R>` is now `Field<R>`.
- **`useCollectionView<R extends object = Record<string, unknown>>(fields: Field<R>[], options: CollectionViewOptions<R>)`:**
  - `test(row: R)`, `count(rows: R[])`, and `tableProps.filter` is `(row: R) => boolean`, so it spreads onto `DataGrid<R>`.
  - `R` is inferred from `options.data`, or given (`useCollectionView<Row>(…)`). `fields` never decides it (a deferred-inference helper that also works before TypeScript 5.4's `NoInfer`).
  - The panels' props (`filterProps.fields` and the rest) stay `Field[]`; a `Field<R>` is assignable to them.
- **`Table<R = Record<string, unknown>>`, `TableProps<R>`:** `data?: R[]`; `columns[].field` is a key of `R` (suggested) or any string; `columns[].render(record: R)`; `unread(record: R)`.
- **`SplitWorkspace<R = Record<string, unknown>>`, `SplitWorkspaceProps<R>`:** `rows?: R[]`, `columns?: DataGridColumn<R>[]`, passed to its `DataGrid<R>`. `grid` stays `Record<string, unknown>`.
- **No runtime change.** No new export names.

## Consequences

- **Semver: MINOR** (VERSIONING.md: additive). Every new type parameter has a default equal to the old type, so code that compiled on 0.93 still compiles.
- **Stricter only where an app opts in:** passing typed `data` now checks `text(row)`, `get(row)`, `render(record)` and `unread(record)` against it. That's the point of the request.
- **ListingPage and SearchResultsPage** keep untyped rows. They can follow the same pattern when an app asks.

## Check

- `tests/types.test.js` compiles `tests/fixtures/redsave-types.tsx` strictly against the generated `plenix.d.ts`. The #923 block there covers a typed `CollectionField<PersonRow>[]` with `get`, `count`/`test` on `PersonRow`, `Table` with `render(record)` and `unread(record)`, and `SplitWorkspace` with `DataGridColumn<PersonRow>[]`; three `@ts-expect-error` cases prove a wrong row type fails.
- `tsc --noEmit` (CI "new problems" job) on the source.
