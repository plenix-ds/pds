---
name: pds1-debug
description: Root-cause debugging method for PDS 1.0. Use for any failing test, CI job, visual diff, wrong token value, broken story, build or release failure, or "works in the story, broken on the CDN" report - before proposing a fix. Stops after 3 failed fixes.
---

# PDS1 debugging method

Adapted from obra/superpowers `systematic-debugging` and `root-cause-tracing`
(MIT, (c) 2025 Jesse Vincent).

## Iron law

No fix without a confirmed root cause. A change that makes the symptom go away
without an explanation is a guess; guesses caused the old PDS's reversals.

## 1. Observe

- Read the whole error, stack trace and CI log. Reproduce with one command
  (`node tests/run.js <name>`, `npx vitest run <file>`, `npx playwright test <file>`).
- `git log --oneline -15 -- <files involved>`: what changed recently?
- **Classify the environment first.** Known ENV signatures are not product bugs:

  | Signature | Meaning | Action |
  |---|---|---|
  | `Executable doesn't exist at ...ms-playwright...` / `Could not find Chrome` | browser not installed | `npx playwright install chromium`; the run is a **FAIL**, never a skip |
  | `ENOENT` / `EPERM` / `EBUSY` on `C:\...`, `\` vs `/` in a glob, `spawn npx ENOENT` | Windows path, lock or `.cmd` shim issue | use `path.join`/`pathToFileURL`, `shell: true` for npm/npx, close the file holder |
  | passes on Windows, fails on Linux CI with "module not found" | import case mismatch | fix the import casing |
  | CRLF-only diff, snapshot off by one line | line endings | `.gitattributes`, not the test |
  | old file served after publish, `latest.json` stale | CDN or browser cache | `curl -sI` the URL: check `age`, `etag`, the version path; versions are immutable |

  Matching a signature: report `ENV` and fix the environment. "It's just
  Windows" without a matching signature is not a diagnosis.

## 2. Trace the layers

Find the first layer where the output is wrong:

```
story / docs page / consumer page (CTM)
  -> component (props, render, ARIA, i18n key)
  -> hook / provider (state, effects, locale, direction, density)
  -> tokens / CSS (DTCG json -> Style Dictionary -> CSS var -> computed style)
  -> build output (Vite bundle, packages/, .d.ts, release/cdn/<version>/)
  -> CDN file (cdn/<version>/..., index.json, latest.json, SHA256SUMS)
```

- Reproduce with the component's own story first; then add the consumer's props
  and data one at a time. If the story is right and the page is wrong, the bug
  is in the page or the build, not the component.
- For styling: read the computed style in the browser and walk back to the token
  that set it. Never patch with local CSS or `!important`.
- For CDN reports: diff the built file in `release/cdn/<version>/` against the
  served one before touching source.
- Walk backward from the bad value to its origin. Fix at the origin, then add a
  check at the layer that let it through.

## 3. One hypothesis

One sentence: "X happens because Y, shown by Z." Test it with the smallest
experiment. If wrong, go back to step 2 with what you learned; do not stack a
second change on the first.

## 4. Fix

1. Write down what the change touches (components, tokens, snapshots, CDN
   consumers such as CTM) and how to roll it back.
2. Failing regression test that reproduces the root cause (`pds1-tdd`): RED first.
3. One fix at the origin. Test green; whole relevant suite green.
4. Verify on the original case **and** one unrelated story, in light and dark;
   RTL only if direction or text code changed.

## Circuit breaker

After **3 failed fixes**, stop. The problem is likely an assumption or the
design. Report what you tried and what each attempt showed, and hand the open
question to the Delivery Lead or DS Architect. ENV failures do not count as attempts.

## Report

```
Status: ROOT CAUSE FOUND | ENV | BLOCKED
Symptom: ...
Root cause: <layer> <file:line> - explanation - evidence
Regression test: <test id> (RED output line)
Fix: <file:line> or "recommended owner: <role>"
Attempts: n/3
```
