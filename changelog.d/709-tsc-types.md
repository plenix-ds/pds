### Changed

- `@plenix-ds/react` and the CDN: the TypeScript types of every part written in TypeScript now come from its source (tsc declarations in `types/`), not from its header comment; the published `any` props drop from 334 to 131, all in parts still in JavaScript (#709, #61, ADR 0011).
