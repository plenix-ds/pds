### Changed

- TypeScript wave 3, EntityHeader (#753, ADR 0011): `EntityHeader` is now `.tsx` with exported prop types: `EntityHeaderProps`, `EntityHeaderMedia`, `EntityHeaderStatus`, `EntityHeaderFact`, `EntityHeaderAction`, `EntityHeaderMoreAction`, `EntityHeaderStates`, `EntityHeaderDetail` and `EntityHeaderTone`. No `any` in a public prop (the streamlined `detail` strip is `EntityHeaderDetail`). No behavior change.
