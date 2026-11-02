### Changed
- Component stylesheets carry no duplicate selector blocks (#882): 78 of 80 merged, with no change in any computed style. Three declarations that a later one in the same block always overrode are gone. Two stay on purpose: Dialog's motion block (its order is fixed in #912) and PropertyList's grid fallback for browsers without subgrid.
