### Fixed
- MetricCard `type="person" layout="tile"` is a column again: the plain tile's row rule came after the person tile's column rule at the same specificity, so the count and unit sat beside the name and the name was cut (1.7.0 regression found by CTM#326, #1240).
