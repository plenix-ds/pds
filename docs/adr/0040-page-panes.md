# ADR 0040: PagePanes, the exported wrapper for a side pane beside the content

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's "canonical, not patches" rule (2026-11-08). Decision D-0126 (owner may switch).
- **Issue:** #998 (S3). Brief: `docs/pds1/slices/998-page-panes/brief.md`.

## Context

- A side pane beside the page content is written by hand as `<div className="plx-page-panes">` around a `SecondaryPane` and the content.
- That pattern appears in the SecondaryPane docs, the templates and CTM.
- The CSS (`app-shell.css` and the `:has()` rules in `secondary-pane.css`) keys on that class.

## Options

| Option | For | Against |
|---|---|---|
| **A. A new export `PagePanes`, rendering the same `<div class="plx-page-panes">`** | The name matches the class and the docs. No layout change. | One more export. |
| B. `SecondaryPane.Group` | Grouped with the pane | The wrapper holds the content too, not only the pane. The name hides that. |

## Decision

**Option A** (D-0126; reply B on #998 to switch).

- **Export:** `PagePanes` from `@plenix-ds/react`, with the type `PagePanesProps = React.HTMLAttributes<HTMLDivElement>`. It renders `<div className={cx('plx-page-panes', className)} {...rest}>{children}</div>`.
- **Children:** one `SecondaryPane` (on either side) and the content, in DOM order. There are no new props.
- **CSS, tokens and behavior:** unchanged. The `:has()` rules apply as today.
- **The class:** writing `plx-page-panes` by hand is deprecated now: the docs say so and the changelog has a *Deprecated* entry. In 2.0.0 the class becomes internal (no longer public API). That is a MAJOR note, listed under *Breaking* in 2.0.0.
- **The docs, the templates and the manifest** use `PagePanes`.

## Consequences

- **Semver: MINOR** (*Added*: `PagePanes`, `PagePanesProps`; *Deprecated*: hand-written `plx-page-panes`).
- CTM replaces its raw div (`static/ctm/app.js` ~1999).

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- The build PR's tests (the brief's AC-1..3):
  - the DOM equals the raw div's;
  - the Narrow list rule still hides the content;
  - no doc or template writes `plx-page-panes` by hand (a grep in the test).
