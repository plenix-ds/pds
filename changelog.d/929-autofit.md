### Changed (visual)
- A DataGrid sizes its columns to their content and fits them to its width before it shows cards (#929, the owner: "autosize and autofit"):
  - Each column starts at its content: its header and its widest value, capped at its set width. Spare room goes to the title (the first key column), else the widest text column.
  - Over the room, the columns with the most room above their minimum readable width (minWidth, else the header, at least 80px) give it up first, and the title last.
  - Cards only when every column is at its minimum and it still doesn't fit.
  - A column the person sized keeps its width. narrow="table" and narrow="list" keep their set widths, as before.
