// States: default (first tab selected), another selected, hover and focus on a tab, disabled tab, with counts and icons, variants (folder, segmented), vertical. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Tabs, tabsPanelId } from '../../../platform/components/Tabs/Tabs.tsx';
import { rtl } from './rtl.tsx';

const items = [{ value: 'info', label: 'Info', content: 'Details of the asset.' }, { value: 'activity', label: 'Activity', count: 3, icon: 'history', content: 'Recent activity.' }, { value: 'files', label: 'Files', content: 'Attached files.' }, { value: 'locked', label: 'Locked', disabled: true, content: 'Not available.' }];
const meta = { title: 'Components/Tabs', component: Tabs, tags: ['autodocs'], args: { label: 'Asset details', items, onChange: () => {} } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'activity' } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelectorAll('[role=tab]')[1] as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Folder: Story = { args: { variant: 'folder' } };
export const Segmented: Story = { args: { variant: 'segmented' } };
export const Vertical: Story = { args: { orientation: 'vertical' } };
// without content on the items the application renders the panels, with ids from tabsPanelId(idBase, value), so each tab points at a panel that exists
export const ListOnly: Story = { render: () => <>
  <Tabs label="Asset details" idBase="demo" defaultValue="info" items={items.map(({ content: _c, ...rest }) => rest)} />
  {items.map((t) => <div key={t.value} role="tabpanel" id={tabsPanelId('demo', t.value)} aria-labelledby={'demo-tab-' + t.value} hidden={t.value !== 'info'}>{t.content}</div>)}
</> };
export const LongText: Story = { args: { items: [{ value: 'a', label: 'A tab with a very long name that does not fit', content: 'A.' }, { value: 'b', label: 'Another long tab name for the same row', content: 'B.' }, { value: 'c', label: 'Short', content: 'C.' }] } };
export const Rtl: Story = { decorators: [rtl] };
