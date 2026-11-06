# archive/

What PDS 1.0 no longer builds, tests or publishes, kept whole with its history (`git log --follow archive/<item>/…`). Nothing in CI, the build, Knip, ESLint or Stylelint reads this folder (#706).

| Item | Moved | Why |
|---|---|---|
| `vote-kit/` | 2026-11-06 (#706) | The open-source vote kit (`package.json`, the event contract, the OpenAPI file, the SQL schema, the reference server). No build, CI, test, CDN page or package reads it in this repo, and Knip ignored it. VoteTally keeps its own types; its comment points here. |
