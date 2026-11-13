/* Plenix · Page templates: SearchResultsPage: a search results page
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { SearchWorkspace as SearchWorkspaceJs } from '../../patterns/SearchWorkspace/SearchWorkspace.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import type { DataGridColumn } from '../../components/DataGrid/DataGrid.tsx';
import { Frame, NoRecords, useWords } from './shared.tsx';
import type { FrameProps } from './shared.tsx';
const SearchWorkspace: any = SearchWorkspaceJs;

/** @public the prop type of SearchResultsPage (ADR 0011) */
export type SearchResultsPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  query?: string;
  onQueryChange?: (query: string) => void;
  rows?: Record<string, unknown>[];
  columns?: DataGridColumn[];
  strings?: Record<string, string>;
  children?: React.ReactNode;
  title?: React.ReactNode;
};
export function SearchResultsPage({ query = '', onQueryChange, rows = [], columns = [], strings, children, title, ...rest }: SearchResultsPageProps) {
  const t = useWords(strings);
  return <Frame {...rest}><SearchWorkspace title={title || t.search} query={query} onQueryChange={onQueryChange} count={rows.length}>{children}{rows.length ? <DataGrid label="" data={rows} columns={columns as any} /> : <NoRecords strings={strings} />}</SearchWorkspace></Frame>;
}
