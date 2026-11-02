/* Plenix · DataToolbar
   Summary: The toolbar row above a list or grid (view switch, sort, size, export).
   Usage:
     <DataToolbar label="View options" start={<>…</>} end={<>…</>} />
   Props:
     label: the toolbar's accessible name
     start: a group of controls at the start of the row
     end: a group of controls at the end of the row; it may shrink in a narrow row (issue 880), so a count or summary there
       is a <Text truncate> that ends in an ellipsis rather than running past the toolbar
     children: controls after the start group
     className: more classes
   Behavior:
     It is a Toolbar: arrow keys move between the controls (one Tab stop sequence).
     Controls take the toolbar role height.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Toolbar } from '../../components/Toolbar/Toolbar.tsx';

export function DataToolbar({ label, start, end, className, children }) {
  return (
    <Toolbar label={label} className={cx('plx-data-toolbar', className)}>
      {start ? <Toolbar.Group className="plx-data-toolbar__group">{start}</Toolbar.Group> : null}
      {children}
      <Toolbar.Spacer />
      {end ? <Toolbar.Group className="plx-data-toolbar__group plx-data-toolbar__group--end">{end}</Toolbar.Group> : null}
    </Toolbar>
  );
}
