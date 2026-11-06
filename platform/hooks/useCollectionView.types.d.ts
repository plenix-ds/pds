export interface CollectionField<Row = Record<string, unknown>> {
  value: string; label?: React.ReactNode; kind?: string;
  options?: ReadonlyArray<{ value: string | number | boolean; label?: React.ReactNode }>;
  get?: (row: Row) => unknown;
  [option: string]: unknown;
}
export interface CollectionLevel { field: string; dir?: 'asc' | 'desc'; hideEmpty?: boolean; }
export interface CollectionColumns { order: string[]; hidden: string[]; }
export interface CollectionDisplay { layout: 'list' | 'gallery'; size: 's' | 'm' | 'l'; height: 'short' | 'medium' | 'tall' | 'extra-tall'; editMode?: 'inline' | 'form'; }
export interface CollectionFilter { join: 'and' | 'or'; items: Array<Record<string, unknown> | CollectionFilter>; }
export type CollectionQuickValue = Array<string | number | boolean> | { preset: string; from?: string; to?: string };
export interface CollectionViewOptions<Row> {
  text?: (row: Row) => string; data?: Row[]; storageKey?: string; today?: string;
  quick?: Record<string, 'list' | 'date' | { kind: 'list' | 'date' | 'single'; required?: boolean; options?: CollectionField<Row>['options'] }>;
  columns?: CollectionColumns; sort?: CollectionLevel[]; view?: Partial<CollectionDisplay>;
}
export interface CollectionView<Row> {
  search: string; filter: CollectionFilter; quick: Record<string, CollectionQuickValue>; sort: CollectionLevel[]; group: CollectionLevel[];
  columns: CollectionColumns; view: CollectionDisplay;
  setSearch: React.Dispatch<React.SetStateAction<string>>; setFilter: React.Dispatch<React.SetStateAction<CollectionFilter>>;
  setSort: React.Dispatch<React.SetStateAction<CollectionLevel[]>>; setGroup: React.Dispatch<React.SetStateAction<CollectionLevel[]>>;
  setColumns: React.Dispatch<React.SetStateAction<CollectionColumns>>; setView: React.Dispatch<React.SetStateAction<CollectionDisplay>>;
  setQuick(key: string, value: CollectionQuickValue): void; reset(): void; test(row: Row): boolean; count(rows: Row[]): number;
  table: React.MutableRefObject<unknown>;
  searchProps: { value: string; onChange(event: React.ChangeEvent<HTMLInputElement>): void; onClear(): void };
  filterProps: { fields: CollectionField<Row>[]; value: CollectionFilter; onChange: CollectionView<Row>['setFilter'] };
  sortProps: { fields: CollectionField<Row>[]; value: CollectionLevel[]; onChange: CollectionView<Row>['setSort']; grouped: boolean };
  groupProps: { fields: CollectionField<Row>[]; value: CollectionLevel[]; onChange: CollectionView<Row>['setGroup']; table: React.MutableRefObject<unknown> };
  columnsProps: { fields: CollectionField<Row>[]; value: CollectionColumns; onChange: CollectionView<Row>['setColumns'] };
  viewProps: { value: CollectionDisplay; onChange: CollectionView<Row>['setView']; onReset(): void };
  quickProps(key: string): { kind: string; required: boolean; value: CollectionQuickValue; onChange(value: CollectionQuickValue): void; counts?: Map<unknown, number> };
  tableProps: { filter(row: Row): boolean; sort: CollectionLevel[]; groupBy: string[] | false; columnOrder: string[]; hiddenColumns: string[]; rowHeight: CollectionDisplay['height']; editMode?: CollectionDisplay['editMode']; onReady(controller: unknown): void };
}
export declare function useCollectionView<Row = Record<string, unknown>>(fields: CollectionField<Row>[], options?: CollectionViewOptions<Row>): CollectionView<Row>;
