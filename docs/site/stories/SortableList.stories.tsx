// States: vertical (default), grid, hover and focus on a handle, picked up with the keyboard, move buttons, disabled, a group of two lists. Not applicable: loading, error, selected beyond the picked-up item.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SortableList } from '../../../platform/patterns/SortableList/SortableList.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 1, name: 'Hero banner' }, { id: 2, name: 'Announcement' }, { id: 3, name: 'Navigation' }, { id: 4, name: 'Footer' }];
const meta = { title: 'Patterns/SortableList', component: SortableList, tags: ['autodocs'], args: { label: 'Steps', items, onReorder: () => {} } } satisfies Meta<typeof SortableList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Grid: Story = { args: { layout: 'grid' } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const PickedUp: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{Space}'); } };
export const MoveButtons: Story = { args: { moveButtons: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Group: Story = { render: () => <><SortableList id="todo" group="board" label="To do" items={items.slice(0, 2)} onMove={() => {}} onReorder={() => {}} /><SortableList id="done" group="board" label="Done" items={items.slice(2)} onMove={() => {}} onReorder={() => {}} /></> };
export const LongText: Story = { args: { items: [{ id: 1, name: 'A step with a very long name that does not fit the width of the list and so wraps onto several lines' }, ...items.slice(1)] } };
export const Rtl: Story = { decorators: [rtl] };
