# Spec wording, batch 10: Implementation (27 questions)

Issue #120. Each question of the Implementation group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 10 of the 27 questions are already answered by text written after the questions were asked.
- 17 had the same cause: an Implementation page is guidance, not a UI part, but it showed the Behavior, Accessibility and Content rows of another page (React, CSS architecture, Testing, Component lifecycle, Contribution model, Dialog). These pages now show only their own text, use and avoid lines and examples (`parts/w00B.records.js`, `parts/w15B.records.js`: the thin records of the Implementation section no longer borrow another page's write-up).
- Three pages also described the 0.x process and now describe the one in use (`parts/w00B.records.js`, `inventory.js`, `inventory-docs.js`):
  - **Changelog:** each change writes a fragment in `changelog.d/`, collected into `CHANGELOG.md` at release; the anatomy no longer names `Plenix - DAM/audit/batches/`.
  - **Code review and Release process:** the changelog fragment replaces "the work is logged as a batch" and "entries under Unreleased as the work is done".
  - **Roadmap:** it is the open issues of the `plenix-ds/pds` repository and the delivery plan (`docs/pds1/plan.md`), not `TODO.md`, which no longer exists.
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| React | "Both applications" | Reads "more than one application". | React avoid line. |
| Testing | Still current? | Yes: Stylelint, `check-style.js` and `check-system.js` hold the rules; `npm test` and `check-spec.js` check each change. No "both applications". | Testing text. |
| Changelog | CHANGELOG.md or batch folder? | CHANGELOG.md, written from fragments in `changelog.d/`. Changed in this batch. | Changelog record and docs. |
| Theming | Is ThemeProvider required? | Optional: the theme stylesheets and `theme-boot.js` do the theming; ThemeProvider gives React the theme, density and interaction context. | Theming text. |
| Component API, Code libraries, Composition patterns, Web | Show the React write-up | Changed: own text only. | Records. |
| Code libraries | Four packages? | Four core packages (tokens, icons, styles, react) and six more (vue, web-components, angular, mcp, lint, figma). | Code libraries text. |
| CSS reset, Styling API, HTML and CSS | Show the CSS architecture write-up | Changed: own text only. | Records. |
| Code review | Shows the Testing write-up; the overview lists the checks | Changed: own text only; the overview lists build-app, the checks, `npm test` and the changelog fragment. | Record. |
| Design review | Purpose copied from Testing | Own purpose: the owner approves every visible change before it is released. | Record purpose. |
| Versioning, Deprecation, Migration | Show the lifecycle write-up | Changed: own text only. | Records. |
| Adoption guidance, Release process, Roadmap | Show the Contribution model write-up | Changed: own text only. | Records. |
| Roadmap | "Not on the roadmap or approved" | Reads: "Work the owner has not approved; being on the roadmap is not approval." | Roadmap avoid line. |
| Angular package | Status note under Localization | The localization row reads "Pass strings as inputs." | Angular docs. |
| Analytics instrumentation | Data rule under Localization | The localization row reads "Event names stay the same in every language."; the allowlist rule is under Error messages. | Analytics docs. |
| Platforms standard | What is restored? | The last screen, the side pane width and the scroll position. | Desktop variant. |
| Platforms standard, Browser support, Vue, Lint tooling | Same generic sections | Changed: own text only. | `w15B.records.js`. |
| Browser support | "Proposed" targets | The purpose now says "the browser targets (the last two versions of Chrome, Edge, Firefox, Safari and iOS Safari)". | Browser support purpose. |
| Performance budget, Web components, MCP tooling | Generic UI rows | Changed: no borrowed rows. | Records. |

## Decision card

- **Applied:** the changes above; everything else stays.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 11 is the Patterns group (17 questions), then Interaction (24), Foundations (24) and the two extra lists, one group per pull request.
