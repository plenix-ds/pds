# archive/

What PDS 1.0 no longer builds, tests or publishes, kept whole with its history (`git log --follow archive/<item>/…`). Nothing in CI, the build, Knip, ESLint or Stylelint reads this folder (#706).

| Item | Moved | Why |
|---|---|---|
| `vote-kit/` | 2026-11-06 (#706) | The open-source vote kit (`package.json`, the event contract, the OpenAPI file, the SQL schema, the reference server). No build, CI, test, CDN page or package reads it in this repo, and Knip ignored it. VoteTally keeps its own types; its comment points here. |
| `docs/handoff/` | 2026-11-06 (#706) | Two 0.x hand-off notes of 2026-10-15 (the CommandBar swap, which ADR 0018 replaced with "add"; the owner decisions of that day, now in `decisions.yaml`). `docs/ARCHIVE.md` kept it because CLAUDE.md named it; CLAUDE.md no longer does, and nothing else reads it. |
| `docs/briefs/commandbar-find-fold/`, `header-labels-start/`, `segmented-fold/` | 2026-11-06 (#706) | The three briefs `docs/ARCHIVE.md` marked for "the next clean-up" once their tests stopped opening them; no test, tool or doc reads them now. |
