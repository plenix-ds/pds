# ADR 0026: Choice controls are generic over their option values

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on RedSave's fix request P-71 (#925, triaged from #922). Decision D-0098 (owner may switch).
- **Issue:** #925 (S3)

## Context

- On 0.93.0, SegmentedControl and RadioTiles call `onChange(value: string | number)`, Tabs `onChange(value: TabValue)`, NavList `onSelect(id: string)`, MenuRadioGroup `onChange(value: unknown)`, and Combobox `onChange(value: ComboValue | ComboValue[])` for both single and multiple.
- Apps whose options are a union (`'light' | 'dark'`) cast every value back.
- These are handler types: a change can break a handler that compiles today.

## Options

| Option | For | Against |
|---|---|---|
| **A. A value type parameter `V` on each, defaulting to today's type; `V` is read from the options and `value`, never from the handler** | Handlers get the app's own type. With no `V`, the types are exactly today's. | Two deferred-inference helpers (Tabs, useCollectionView). |
| B. Make every handler a strict property and infer from it too | Simpler types | Tabs' `onChange` is a method today, so a wider handler (`(value: string) => …`) compiles; a property would break it. |
| C. Leave the types; apps cast | No work | The request. |

## Decision

**Option A** (D-0098; reply B on #925 to switch).

- **SegmentedControl, RadioTiles:** `<V extends string | number = string | number>`; `options: { value: V }[]`, `value?: V`, `onChange(value: V)`. `SegmentedOption<V>`, `RadioTileOption<V>`, `SegmentedControlProps<V>`, `RadioTilesProps<V>`.
- **Tabs:** `<V extends TabValue = TabValue>`; `TabItem<V>`, `TabsProps<V>`, `value`/`defaultValue?: V`. `onChange` stays a method, so a handler typed more widely still compiles, and `V` is not inferred from it.
- **NavList:** `<V extends string = string>`; `NavItem<V>` (`id: V`, `children`, `onPin(id: V)`), `NavGroup<V>`, `NavListProps<V>` (`value?: V`, `onSelect(id: V)`).
- **MenuRadioGroup:** `<V = unknown>`; `MenuRadioGroupProps<V>` (`value?: V`, `onChange(value: V)`). Its items' `value` stays `unknown`.
- **Combobox:** `<V extends ComboValue = ComboValue>`; `ComboOption<V>`, `loadOptions` returns `ComboOption<V>[]`, `value?: V | '' | null`, `values?: V[]`.
  - `ComboboxProps<V>` is a union on `multiple`. Single (no `multiple`, or `false`): `onChange(value: V | '')` (`''` when cleared, as today). `multiple` (`true`): `onChange(values: V[])`.
  - `multiple` from a boolean variable compiles with a handler that takes either shape, as today.
  - `CountrySelectProps` keeps its 0.93 `onChange(value: ComboValue | ComboValue[])`.
- **No runtime change.** No new export names.

## Consequences

- **Semver: MINOR** (VERSIONING.md: additive). Each `V` defaults to the old type, so code that compiled on 0.93 still compiles.
- **Combobox's `onChange` is narrower per mode.** A handler for the old union still fits both modes. A handler that only accepts an array now fails on a single Combobox, which was always a bug (a single Combobox never sends an array).
- **Wrappers** that `Omit<ComboboxProps, …>` should also omit `onChange` and declare their own, as CountrySelect does.

## Check

- `tests/types.test.js` compiles `tests/fixtures/redsave-types.tsx` strictly against the generated `plenix.d.ts`. The #925 block: each control with a `'light' | 'dark'` option type and `setTheme`, Combobox single and multiple, `multiple={flag}` with an either-shape handler; two `@ts-expect-error` cases prove a wrong value type fails.
- `tsc --noEmit` (CI "new problems" job).
