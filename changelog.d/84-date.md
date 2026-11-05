### Added

- DataGrid: the `date` cell editor (ADR 0016, #84 phase 2), turned on with `editing={{ types: ['date'] }}` and `editor: 'date'` on a column whose values are `YYYY-MM-DD`. Plenix's DatePicker field opens in the cell, drawn bare through Input's context hooks. A date typed (read on Enter or when the field is left) or chosen in the calendar saves its calendar day; Escape cancels; Tab saves what was typed and moves; a click elsewhere saves; emptying the field saves `null`. Without the type turned on, nothing changes.
