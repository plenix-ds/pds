/* Plenix · files (files/files.jsx). Split out of app/plenix.jsx in batch 113; rebuilt from Platform components in batch 199:
   the files in a DataGrid (batch 226) under the command bar (owner, 2026-10-14: search, Filter, Type, Sort, Columns, View),
   the open one in a SidePanel.
   Screens (Platforms Standard 4.3): the list (#/) and an open file (#/file/<n>), a history entry each: Back closes the
   file; closing the panel goes to the list. */
import { EntityHeader, CommandBar, CommandBarSearch, FilterPanel, SortPanel, ColumnsMenu, ViewMenu, useCollectionView, DataGrid, Inline, PageContent, SidePanel, Stack, Tag, Text } from 'plenix-platform';
import { ClassificationWidget } from '../suite/classification.jsx';
import { ALL_FILES } from '../suite/shared.jsx';
const { useState } = React;
// the grid's rows: each file with its place in the list as its id
const ROWS = ALL_FILES.map((f, i) => ({ ...f, id: i }));
const uniq = (values) => Array.from(new Set(values)).sort();
// the command bar's fields (utils/fields.ts)
const FIELDS = [
  { value: 'name', label: 'Name', kind: 'text' }, { value: 't', label: 'Type', kind: 'select', options: uniq(ALL_FILES.map((f) => f.t)) },
  { value: 'folder', label: 'Folder', kind: 'select', options: uniq(ALL_FILES.map((f) => f.folder)) }, { value: 's', label: 'Size', kind: 'text' }, { value: 'd', label: 'Modified', kind: 'text' },
];
const COLUMNS = ['name', 't', 's', 'd'];

/* ─── Files ─────────────────────────────────────────────────────── */
export function FilesScreen({ screen }) {
  const named = screen.parts[0] === 'file' ? +screen.parts[1] : null;
  const sel = named !== null && ALL_FILES[named] ? named : null;
  const setSel = (i) => (i === null ? screen.parent('/') : screen.open(['file', i]));
  const file = sel !== null ? ALL_FILES[sel] : null;
  const [meta, setMeta] = useState({});
  const v = useCollectionView(FIELDS, { text: (r) => r.name + ' ' + r.folder, quick: { t: 'list' }, columns: { order: COLUMNS, hidden: [] } });
  const n = v.count(ROWS);
  return (
    <div className="plx-page-panes">
      <PageContent>
        <Stack gap="md">
          <EntityHeader title="Files" media={{ icon: 'folder', hue: 'gray' }}
            facts={[{ label: 'Files', value: ALL_FILES.length, data: true }, { label: 'Size', value: (ALL_FILES.reduce((n, f) => n + parseFloat(f.s) * (/GB/.test(f.s) ? 1024 : /KB/.test(f.s) ? 1 / 1024 : 1), 0)).toFixed(1) + ' MB', data: true }]}
            next={ALL_FILES[0] ? { label: 'Latest file', title: <Text variant="data">{ALL_FILES[0].name}</Text>, detail: ALL_FILES[0].folder + ' · ' + ALL_FILES[0].d } : undefined}
            actions={[{ icon: 'share', label: 'Share' }]} />
          {/* the capability's own action is the bar's (1A: the actions at the start, find and view at the end) */}
          <CommandBar label="Files" actions={[{ id: 'upload', label: 'Upload', icon: 'upload' }]} count={n + (n === 1 ? ' file' : ' files')}
            find={<><CommandBarSearch {...v.searchProps} placeholder="Search files" /><FilterPanel {...v.filterProps} /></>}
            quickFilters={[Object.assign({ id: 't', label: 'Type', icon: 'image-b', noun: 'type', options: FIELDS[1].options }, v.quickProps('t'))]}
            view={<><SortPanel {...v.sortProps} /><ColumnsMenu {...v.columnsProps} fields={FIELDS.filter((f) => COLUMNS.indexOf(f.value) >= 0)} /><ViewMenu {...v.viewProps} gallery={false} /></>} />
          <DataGrid label="Files" data={ROWS} selected={sel === null ? [] : [sel]} options={{ selectableRows: 1 }} {...v.tableProps}
            onRowClick={(record) => { const i = record.id; setSel(sel === i ? null : i); }} columns={[
              { title: 'Name', field: 'name', kind: ['name', 'data'], width: '--plx-ref-size-80u' },
              { title: 'Type', field: 't', kind: 'data' },
              { title: 'Size', field: 's', kind: 'data', align: 'right' },
              { title: 'Modified', field: 'd', kind: 'data' },
            ]} />
        </Stack>
      </PageContent>
      {file ? (
        <SidePanel title={file.name} icon="doc-text" onOpenChange={(o) => { if (!o) setSel(null); }}>
          <Stack gap="md">
            <Inline gap="sm" wrap><Tag>{file.t}</Tag><Text variant="data">{file.s}</Text><Text variant="data">{file.d}</Text></Inline>
            <ClassificationWidget value={meta[sel]} onChange={(m) => setMeta((prev) => ({ ...prev, [sel]: m }))} />
          </Stack>
        </SidePanel>
      ) : null}
    </div>
  );
}
