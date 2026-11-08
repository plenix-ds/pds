// States: list, grid, groups, current item, counts, closed. Hover, focus and active are on the items: focus is reached by play. Not applicable: disabled, loading, error. (Mobile is parked, D-0013: the stories cover the component as it is.)
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { BottomSheetNav } from '../../../platform/patterns/BottomSheetNav/BottomSheetNav.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'notes', label: 'All notes', icon: 'doc-text', count: 24 }, { id: 'tasks', label: 'Tasks', icon: 'check', count: 3 }, { id: 'files', label: 'Files', icon: 'folder' }];
const meta = { title: 'Patterns/BottomSheetNav', component: BottomSheetNav, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, onClose: () => {}, title: 'Go to', items, value: 'notes', onSelect: () => {} } } satisfies Meta<typeof BottomSheetNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Grid: Story = { args: { layout: 'grid', title: 'Applications' } };
export const Groups: Story = { args: { items: undefined, groups: [{ heading: 'Workspace', items: items.slice(0, 2) }, { heading: 'Storage', items: items.slice(2) }] } };
export const Large: Story = { args: { detent: 'large' } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { items: [{ id: 'a', label: 'Quarterly summary of expenditure by department and cost centre for every regional office', count: 240 }] } };
export const Rtl: Story = { decorators: [rtl] };
