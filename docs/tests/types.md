# types

Developers who write Plenix apps in TypeScript can write correct code without false errors from Plenix's type descriptions.

- File: `tests/types.test.js`

## What it checks
- Correct application code compiles in strict mode against the generated TypeScript definitions (the type descriptions published as `plenix.d.ts`).
- The sample covers DataGrid columns, a row menu as a list or a function per row, Tabs `onChange(value)`, collection panels, MediaCard 4/3, Text as span or h2 to h4, MediaViewer and `useAppLayout`.

## Why it exists
- Issues #170, "P-31: The published TypeScript declarations type DataGrid columns and Tabs onChange wrongly", and #171, "P-43: Some components are typed any, others miss their own values" (in the file header).
- Added in commit c10f7488 "Types: fix the generator rules behind #170 and #171".

## How it checks
- Rebuilds the definitions into `packages/react/index.d.ts` with `tools/publish/react-types.js` (tsc).
- Compiles `tests/fixtures/redsave-types.tsx` (what the RedSave app writes) with TypeScript, strict, without writing output. No browser.

## What a failure means
- A developer using Plenix in TypeScript sees errors on code that is correct, or misses errors on code that is wrong.

## When it runs
- AUTOMATIC group in `tests/run.js`. It has no changed-mode filter: it always runs when started.
- CI (`ci.yml`): the "Build and checks" job, in the step "Tests without a browser", on every pull request and on pushes to styling/phase-2 and main.
- Full suite (`full.yml`): the build job.
- By hand: `node tests/types.test.js`, or `npm run test:types`.

## What it needs
- Node only (no browser, no server), with the installed packages (`typescript`, `@types/react`).
- `tools/publish/react-types.js` and the fixture `tests/fixtures/redsave-types.tsx`. It rewrites `packages/react/index.d.ts` when it runs.
