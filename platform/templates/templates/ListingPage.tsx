/* Plenix · Page templates: ListingPage: the canonical full-room list
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { SidePanel as SidePanelJs } from '../../patterns/SidePanel/SidePanel.tsx';
import { RecordPage as RecordPageJs } from '../../patterns/RecordPage/RecordPage.tsx';
import { PagePanes } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import type { DataGridColumn } from '../../components/DataGrid/DataGrid.tsx';
import { Frame, NoRecords, useWords } from './shared.tsx';
import type { FrameProps } from './shared.tsx';
const SidePanel: any = SidePanelJs;
const RecordPage: any = RecordPageJs;

// the full-room list (issue 522, the canonical DataGrid page): the toolbar, then the grid filling the room left and
// scrolling inside (fill, virtual rows, no page controls); the chosen record's detail in a SidePanel beside it
/** @public the prop type of ListingPage (ADR 0011); R is the list's row type, passed to its DataGrid (ADR 0024) */
export type ListingPageProps<R = Record<string, unknown>> = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  rows?: R[];
  columns?: DataGridColumn<R>[];
  empty?: React.ReactNode;
  /** the first load is under way: the grid shows the region loading state */
  loading?: boolean;
  /** from the long wait of the first load a Cancel button calls this (ADR 0051) */
  onLoadingCancel?: () => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
  label?: unknown;
  toolbar?: React.ReactNode;
  grid?: Record<string, unknown>;
  detail?: React.ReactNode;
  detailTitle?: React.ReactNode;
  onDetailClose?: () => void;
};
export function ListingPage<R = Record<string, unknown>>({ rows = [], columns = [], empty, loading, onLoadingCancel, strings, children, label, toolbar, grid, detail, detailTitle, onDetailClose, ...rest }: ListingPageProps<R>) {
  const id = React.useId();
  const t = useWords(strings);
  const list = rows.length || loading ? <DataGrid<R> label={label || rest.title || t.pane} data={rows} columns={columns} loading={loading} onLoadingCancel={onLoadingCancel} {...grid} /> : <NoRecords empty={empty} strings={strings} />;
  if (!detail) return <Frame {...rest}>{children}{toolbar}{list}</Frame>;
  return <AppShell page={rest.page || 'workspace'} header={rest.header} sideNav={rest.sideNav} footer={rest.footer} mainId={rest.mainId || 'plx-template-' + id}>
    <PagePanes>
      <PageContent><RecordPage header={rest.title ? <RecordPage.Header title={rest.title} description={rest.description} actions={rest.actions} /> : null}>{children}{toolbar}{list}</RecordPage></PageContent>
      <SidePanel title={detailTitle || t.detail} onOpenChange={(open: any) => { if (!open && onDetailClose) onDetailClose(); }}>{detail}</SidePanel>
    </PagePanes>
  </AppShell>;
}
