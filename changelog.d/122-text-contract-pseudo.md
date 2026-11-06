### Changed

- The text-contract check no longer counts a `::before` or `::after` rule as the part's own typography, and never calls a part context-sized when its own font weight is no text role's. `plx-link` and `plx-link--standalone` leave the migration backlog: they set no font family (a link takes its sentence's font; the print-only address after it is a pseudo-element), only a weight. No visual change (#122).
