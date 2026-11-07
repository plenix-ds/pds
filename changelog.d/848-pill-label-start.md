### Fixed

- DataGrid: the label of a pill in a pill grid starts at the start edge of the pill, the equal width of the column leaves its spare room after it. It was centered, against the rule that text is not centered (#848). The equal width of a column's pills is unchanged and now has a test, with people pills.

- DataGrid: Plenix `DataPill`s that a column's own `render` draws (CTM's Applicant, Respondent and Assigned to) are one width per column too, the widest drawn in the view, label at the start. The width never shrinks while scrolling (#848).
