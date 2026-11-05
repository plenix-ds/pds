### Changed (visual)

- EntityHeader: with no box (the default for `media={{ icon, hue }}`), a stretched media (column large and edge, for pages and sections) now draws its icon as big as its measured square, at least 112px (page, column large), 128px (page, edge), 64px and 80px (section), instead of the small 40–48px tile icon in a much larger area (#418, D-0059). The other layouts were already at their area size. `box: true` keeps the small tile icon.
