// What RedSave writes (#170, #171): correct code that must compile, strict, against the generated plenix.d.ts.
import * as React from 'react';
import {
  DataGrid, DataTable, Tabs, MediaCard, MediaViewer, Text,
  FilterPanel, SortPanel, GroupPanel, ColumnsMenu, useCollectionView, useAppLayout,
  Button, Input, Textarea, Select, Combobox, SearchField, NumberInput, Dialog, MenuItem, Field, Popover, Tooltip, AppShell, Chat,
} from '../../packages/react';

type Row = { id: number; name: string; status: string };
const rows: Row[] = [{ id: 1, name: 'Alpha', status: 'open' }];

// DataGrid columns are column records, not a string union; DataTable is the same component
const columns = [{ title: 'Name', field: 'name', kind: 'name' }, { title: 'Status', field: 'status', kind: ['center', 'badge'] }];
export const grid = <DataGrid label="Records" data={rows} columns={columns} />;
export const alias = <DataTable label="Records" data={rows} columns={columns} />;

// rowMenu is one fixed list or one list per row: (record) => items (#455)
export const rowMenuList = <DataGrid label="Records" data={rows} columns={columns} rowMenu={[{ label: 'Open', onSelect: (record: Row) => record.id }, { separator: true }, { label: 'Delete', danger: true }]} />;
export const rowMenuPerRow = <DataGrid label="Records" data={rows} columns={columns} rowMenu={(record: Row) => (record.status === 'open' ? [{ label: 'Close' }] : [{ label: 'Reopen' }])} />;
// openKey: a key, or null for no open row (RedSave P-63: 0.84 rejected null, so the app needed a helper)
export const openNone = <DataGrid label="Records" data={rows} columns={columns} openKey={null} />;
export const openOne = <DataGrid label="Records" data={rows} columns={columns} openKey="r1" />;

// Tabs onChange receives the tab's value, not a DOM event
export function TabsUse() {
  const [tab, setTab] = React.useState('info');
  return <Tabs label="Details" value={tab} onChange={(value: string) => setTab(value.toUpperCase())}
    items={[{ value: 'info', label: 'Info' }, { value: 'log', label: 'Log' }]} />;
}

// the collection panels take useCollectionView's props as they come
export function Collection() {
  const view = useCollectionView<Row>([{ value: 'name', label: 'Name' }, { value: 'status', label: 'Status', kind: 'select' }], { data: rows });
  return (
    <>
      <FilterPanel {...view.filterProps} />
      <SortPanel {...view.sortProps} />
      <GroupPanel {...view.groupProps} />
      <ColumnsMenu {...view.columnsProps} />
      <DataGrid label="Records" data={rows} columns={columns} {...view.tableProps} />
    </>
  );
}

// MediaCard's default aspect, Text as an inline element and headings
export const card = <MediaCard src="/a.jpg" alt="" title="hero.jpg" aspect="4/3" />;
export const texts = [<Text as="span">a</Text>, <Text as="h2">b</Text>, <Text as="h3">c</Text>, <Text as="h4">d</Text>];

// typed, not any
export const viewer = <MediaViewer open items={[{ src: '/a.jpg' }]} onClose={() => {}} />;
export function Layout() {
  const layout = useAppLayout();
  if (layout) { layout.setWidth(320); const release = layout.claimPage('detail'); release(); }
  return null;
}

// wrong code still fails
// @ts-expect-error aspect is one of the listed shapes
export const badAspect = <MediaCard aspect="7/5" />;
// @ts-expect-error the layout's width is a number
export const badWidth = () => useAppLayout()?.setWidth('wide');
type IsAny<T> = 0 extends (1 & T) ? true : false;
export const layoutTyped: IsAny<ReturnType<typeof useAppLayout>> = false;
export const aliasTyped: IsAny<typeof DataTable> = false;
export const viewerTyped: IsAny<typeof MediaViewer> = false;

// the most-used parts, typed from their headers (#687)
const ref = React.createRef<HTMLButtonElement>();
export const buttons = [
  <Button variant="primary" shortcut="Mod+S" tooltip="Save" joined={{ end: 'seam' }}>Save</Button>,
  <Button iconOnly icon="close" label="Close" tooltip={false} />,
];
export const inputs = [
  <Input size="sm" width="md" appearance="filled" data />,
  <Input size={20} />,
  <Textarea rows={4} autoGrow appearance="outline" />,
  <Select size="sm" width="lg" block appearance="filled" options={[{ value: 'a', label: 'A' }]} joined={{ start: 'square' }} />,
  <Combobox size="md" value="a" emptyText="Nothing" options={[{ value: 'a', label: 'A' }]} />,
  <Combobox multiple values={['a', 'b']} options={[{ value: 'a', label: 'A' }]} />,
  <SearchField size="sm" value="term" shortcut="Ctrl K" recent={['one', 'two']} suggestions={[{ value: 'x', label: 'X' }]} />,
  <NumberInput min={0} max={10} decimals={2} defaultValue={1} format="currency" currency="USD" unit="kg" />,
];
export const layers = [
  <Dialog open title="Edit" initialFocus={ref} />,
  <Popover initialFocus={ref} focusOnOpen={false} anchorClassName="plx-anchor" />,
  <Tooltip content="Copy" action={<Button>Learn more</Button>}><Button>Copy</Button></Tooltip>,
];
export const more = [
  <MenuItem type="radio" value="a">A</MenuItem>,
  <Field label="Name" info={<span>Shown to everyone</span>} counter={100} labelWidth="md"><Input /></Field>,
  <Field label="Bio" counter><Textarea /></Field>,
  <AppShell sideNav={<nav />} panel={<aside />} mainClassName="plx-main" />,
  <DataGrid label="Records" data={rows} columns={columns} selectable openKey={1} tree storageKey="records" />,
  <Tabs label="Details" value="info" defaultValue="info" idBase="details" panelClassName="plx-panel" items={[{ value: 'info', label: 'Info' }]} />,
];
export const chat = (
  <Chat.Thread label="Conversation">
    <Chat.Group author="Mina" mine={false}>
      <Chat.Message author="Mina" time="10:26 AM" status="read" edited mine>Hello</Chat.Message>
    </Chat.Group>
    <Chat.Typing variant="thinking" />
  </Chat.Thread>
);

// wrong code fails on the newly typed props
// @ts-expect-error a size is "sm", "md" or a number
export const badInputSize = <Input size="xl" />;
// @ts-expect-error a shortcut is a hotkey string
export const badShortcut = <Button shortcut={5}>Save</Button>;
// @ts-expect-error joined squares corners or drops a seam
export const badJoined = <Button joined={{ end: 'round' }}>Save</Button>;
// @ts-expect-error min is a number
export const badMin = <NumberInput min="zero" />;
// @ts-expect-error selectable is true or false
export const badSelectable = <DataGrid label="Records" data={rows} columns={columns} selectable="yes" />;
// @ts-expect-error recent searches are strings
export const badRecent = <SearchField recent={[1, 2]} />;
// @ts-expect-error a message's status is one of four
export const badStatus = <Chat.Message status="lost">Hi</Chat.Message>;
// @ts-expect-error a typing indicator's variant is one of three
export const badVariant = <Chat.Typing variant="dots" />;
export const chatTyped: IsAny<typeof Chat> = false;
