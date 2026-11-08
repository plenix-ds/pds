// States: default, current (selected), hover and focus on an item, muted, disabled, with counts and icons, grouped and collapsible, pinned. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { NavList } from '../../../platform/components/NavList/NavList.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'overview', label: 'Overview', icon: 'home' }, { id: 'cases', label: 'Cases', icon: 'folder', count: 326 }, { id: 'notes', label: 'Notes', icon: 'note', muted: true }, { id: 'archive', label: 'Archive', icon: 'archive', disabled: true }];
const meta = { title: 'Components/NavList', component: NavList, tags: ['autodocs'], args: { label: 'Settings', items, value: 'overview', onSelect: () => {} } } satisfies Meta<typeof NavList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Current: Story = { args: { value: 'cases' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Grouped: Story = { args: { items: undefined, groups: [{ heading: 'Account', items: items.slice(0, 2) }, { heading: 'Workspace', items: items.slice(2) }] } };
export const Collapsed: Story = { args: { items: undefined, groups: [{ heading: 'Account', defaultExpanded: false, items: items.slice(0, 2) }] } };
export const Pinned: Story = { args: { items: items.map((i) => ({ ...i, onPin: () => {}, pinned: i.id === 'cases' })) } };
export const Links: Story = { args: { items: items.map((i) => ({ ...i, href: '#/' + i.id })) } };
export const LongText: Story = { args: { items: [{ id: 'a', label: 'A navigation item with a very long name that wraps onto more than one line', icon: 'folder', count: 12 }] } };
export const Rtl: Story = { decorators: [rtl] };
