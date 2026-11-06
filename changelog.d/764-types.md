### Fixed

- TypeScript: `copyName(name, taken?, strings?)` takes `readonly string[]` for `taken` (it was `never[]`, so a call with names failed to compile), and `useAutosave<T>(value, onSave, options?)` is generic and returns the exported `AutosaveResult` (it was `any`) (#764).
