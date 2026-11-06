# #682: proposed text for docs/i18n/arabic.md (D-0078, D-0079)

`docs/i18n/arabic.md` is protected: agents cannot edit it, so this is the exact replacement, for a person to apply.

**Replace** the section "How a new Arabic word ships" (steps 1 to 4) **with:**

```markdown
## How a new Arabic word ships

1. A Developer adds the English word to `platform/i18n/en.json` and `en.js` (they mirror each other; check-system checks it).
2. Look the word up in the standards, in this order, and use the first that has it (D-0078, D-0079): 1. Microsoft (the Microsoft Language Portal and its style guide); 2. IBM; 3. any of Adobe, SAP, GitHub, Atlassian or ISO, of equal rank. A word from them is pre-approved: it goes into `ar.js` with its source cited in the pull request and in its batch in `tools/checks/locale/approved-ar.json`.
3. Only a word none of them has goes to the owner as a proposal on a GitHub issue labelled `i18n-proposal` (D-0015), with the file under `docs/pds1/slices/<id>/`. It gives the key, where the word shows, the English, the proposed Arabic and the Arabic already used for the same English elsewhere.
4. Only the owner's answer, or a term from the standards under step 2, is written into `ar.js`, with its batch in `approved-ar.json`. No other Arabic ships. The owner's own decisions win over every standard.
5. A part's own `strings` prop still wins over the catalog, so an app can always pass its own words.
```

**What changes:**
- **Step 2 is new:** D-0078 and D-0079: terms from Microsoft, then IBM, then Adobe, SAP, GitHub, Atlassian or ISO are pre-approved, with the source cited.
- **Step 3:** proposals move from `~/handoff/i18n/` to GitHub issues and slice files (D-0015, GitHub is the only channel).
- **Step 4:** names the approval record the locale check reads (`tools/checks/locale/approved-ar.json`, D-0075).
- **Step 5:** was step 4, unchanged.
