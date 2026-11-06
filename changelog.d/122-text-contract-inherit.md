### Changed

- The text-contract check (Styling Standard section 6) counts an explicit `inherit` of font-size, letter-spacing, line-height or word-spacing as following the context ("context-sized"), and no longer counts a rule on `:where(...)` descendants as the part's own. Rich text and its article and compact variants leave the migration backlog (they establish the body role). No visual change (#122).
