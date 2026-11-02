### Changed
- The gray category color is named "gray" (#882): `CATEGORY_COLORS` lists `gray`, and the English color word is "Gray". It looks the same. DataPill writes exactly the tone it is given; with no tone it still writes `grey` in this release (CTM's stylesheet selects it), and the default becomes `gray` in a later release.

### Deprecated
- The category name "grey" and its tokens, the British spelling (#882). Use "gray": `tone="gray"`, `category="gray"`, `data-plx-category="gray"`, and `--plx-sys-category-gray`, `-gray-on`, `-gray-soft`, `-gray-soft-border` and `-gray-on-soft`. "grey" and the `--plx-sys-category-grey*` tokens keep working, as aliases of the gray ones, until the next minor release.
