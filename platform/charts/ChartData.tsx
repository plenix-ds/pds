/* Plenix · ChartData
   Summary: A chart's data as a table, one click away: a "Show the data" button that opens a Dialog (the default), or
     the inline Details under the chart (dataView="inline"). Used by ChartFrame and Gauge (ADR 0054, issue 1229, design 1229).
   Props:
     title: the chart's name: the Dialog's title
     summary: the button's (or the Details') label; tableLabel: the table's accessible name
     columns, data, index: the table, as the Table takes them
     dataView: "dialog" (default) | "inline"
   Behavior:
     The button is a ghost sm Button with the table icon and aria-haspopup="dialog"; the Dialog is md, titled with the
       chart's title, has no footer (the close button, Escape and the scrim close it), and returns focus to the button.
     The table is built when the data is first opened, so a closed chart carries no second grid.
*/
import React from 'react';
import { Details } from '../components/Details/Details.tsx';
import { Table } from '../components/Table/Table.tsx';
import type { TableProps } from '../components/Table/Table.tsx';
import { Button } from '../components/Button/Button.tsx';
import { Dialog } from '../components/Dialog/Dialog.tsx';
import TableViewIcon from 'plenix-platform/icons/plenix/view-table';

/** @public how a chart shows its data: a Dialog (default) or inline under the chart */
export type ChartDataView = 'dialog' | 'inline';
type ChartDataProps = { title: string; summary: string; tableLabel: string; columns: NonNullable<TableProps['columns']>; data: Record<string, unknown>[]; index?: string; dataView?: ChartDataView };
export function ChartData({ title, summary, tableLabel, columns, data, index, dataView = 'dialog' }: ChartDataProps) {
  const [opened, setOpened] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const button = React.useRef<HTMLButtonElement>(null);
  const grid = <Table label={tableLabel} columns={columns} data={data} index={index} />;
  if (dataView === 'inline') {
    return (
      <Details summary={summary} variant="inline" className="plx-chart__data" onToggle={(o) => { if (o) setOpened(true); }}>
        {opened ? grid : null}
      </Details>
    );
  }
  const close = () => { setOpen(false); const b = button.current; if (b) setTimeout(() => b.focus(), 0); };
  return (
    <>
      <Button ref={button} variant="ghost" size="sm" icon={TableViewIcon} className="plx-chart__data-button" aria-haspopup="dialog" onClick={() => setOpen(true)}>{summary}</Button>
      {open ? <Dialog open size="md" title={title} onClose={close}>{grid}</Dialog> : null}
    </>
  );
}
