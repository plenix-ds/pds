import React from 'react';
import { SearchWorkspace as SearchWorkspaceJs } from '../../patterns/SearchWorkspace/SearchWorkspace.tsx';
const SearchWorkspace: any = SearchWorkspaceJs;
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import type { DataGridColumn } from '../../components/DataGrid/DataGrid.tsx';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
import { NoRecords } from './NoRecords.tsx';
import { useWords } from './words.ts';
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
