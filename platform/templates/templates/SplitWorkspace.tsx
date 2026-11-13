import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import type { DataGridColumn } from '../../components/DataGrid/DataGrid.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { SplitView as SplitViewJs, ReadingPane as ReadingPaneJs } from '../../patterns/SplitView/SplitView.tsx';
const SplitView: any = SplitViewJs;
const ReadingPane: any = ReadingPaneJs;
import { useWords } from './words.ts';
/** @public the prop type of SplitWorkspace (ADR 0011); R is the list's row type, passed to its DataGrid (#923) */
export type SplitWorkspaceProps<R = Record<string, unknown>> = {
  pane?: React.ReactNode;
  paneTitle?: React.ReactNode;
  rows?: R[];
  columns?: DataGridColumn<R>[];
  grid?: Record<string, unknown>;
  detailOpen?: boolean;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  orientation?: unknown;
  defaultSize?: unknown;
  size?: unknown;
  onSizeChange?: (size: number) => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
export function SplitWorkspace<R = Record<string, unknown>>({ pane, paneTitle, rows, columns, grid, detailOpen = true, title, actions, toolbar, empty, orientation, defaultSize, size, onSizeChange, strings, children, header, sideNav, footer, mainId }: SplitWorkspaceProps<R>) {
  const t = useWords(strings), id = React.useId(), list = paneTitle || t.pane;
  // grid: the list's own DataGrid options (issue 681), spread last, so grid.label may rename the list; the fill and scroll stay the grid's defaults
  const first = columns ? <DataGrid<R> label={list} data={rows || []} columns={columns} {...grid} /> : <ReadingPane label={list}>{pane}</ReadingPane>;
  const second = <ReadingPane label={title || t.detail} actions={detailOpen ? actions : null} empty={empty || <EmptyState title={t.noSelection}>{t.noSelectionDescription}</EmptyState>}>{detailOpen ? children : null}</ReadingPane>;
  return <AppShell page="master-detail" header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}><PageContent>{toolbar}<SplitView label={title || list} firstLabel={list} orientation={orientation} defaultSize={defaultSize} size={size} onSizeChange={onSizeChange} first={first} second={second} /></PageContent></AppShell>;
}
