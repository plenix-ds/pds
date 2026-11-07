### Changed

- `@plenix-ds/react`'s `index.d.ts` now comes straight from `tsc` (`tools/publish/react-types.js`; ADR 0011 wave 5, #889). `build-types.js` and its header-comment reader are retired. The published names are unchanged: 606 exports, 379 `*Props` types, 732 type names in all, and the bridges read the same props. The ten data exports from JavaScript files (`DATA_COLORS`, `CATEGORY_COLORS`, `THEMES`, `DEFAULT_THEME`, `PAGE_LAYOUTS`, `pageLayout`, `PAGE_REGIONS`, `COMPOSITION_GUIDE`, `FIELD_RULES`, `IMAGE_EDITOR_STEPS`) now carry tsc's inferred types instead of `any`.
