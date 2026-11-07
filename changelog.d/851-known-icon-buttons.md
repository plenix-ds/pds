### Changed (visual)

- Icon buttons everyone knows show no visual tooltip (D-0091, DESIGN.md §6); they keep their `aria-label`. The close and dismiss X of `Dialog`, `Sheet`, `Popover`, `Banner`, `Notice`, `TeachingBubble`, `SecondaryPane` and `UploadManager`, the clear X of `Combobox`, the previous and next chevrons of `Calendar` and `Carousel`, the back arrow of `CommandMenu` and the `DataGrid` row ⋮ pass `tooltip={false}`. `Button` still shows its label as a tooltip on every other icon-only button, and an app can pass `tooltip` explicitly (#851).
