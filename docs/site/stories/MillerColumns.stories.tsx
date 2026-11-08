// States: default, a path chosen (selected), hover and focus on an item, loading (children load), error (Try again), checked leaves, preview, disabled item. Not applicable: none.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MillerColumns } from '../../../platform/components/MillerColumns/MillerColumns.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 'brand', label: 'Brand kit', icon: 'folder', children: [{ id: 'logos', label: 'Logos', children: [{ id: 'logo-a', label: 'Logo A.svg' }, { id: 'logo-b', label: 'Logo B.svg' }] }, { id: 'colors', label: 'Colors.pdf' }] },
  { id: 'photos', label: 'Photos', icon: 'folder', children: [{ id: 'cross', label: 'Cross 014.png' }] },
  { id: 'private', label: 'Private', icon: 'folder', disabled: true },
];
const meta = { title: 'Components/MillerColumns', component: MillerColumns, tags: ['autodocs'], args: { label: 'Assets', items } } satisfies Meta<typeof MillerColumns>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultPath: ['brand', 'logos'] } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Preview: Story = { args: { defaultPath: ['brand', 'logos', 'logo-a'], renderPreview: (item: { label?: unknown }) => <div>Preview of {String(item.label)}</div> } };
export const Checked: Story = { args: { defaultPath: ['brand', 'logos'], checked: ['logo-a'] } };
export const Loading: Story = { args: { items: [{ id: 'remote', label: 'Remote folder', hasChildren: true }], loadChildren: () => new Promise(() => {}), defaultPath: ['remote'] } };
export const Error: Story = { args: { items: [{ id: 'remote', label: 'Remote folder', hasChildren: true }], loadChildren: () => Promise.reject(new globalThis.Error('failed')), defaultPath: ['remote'] } };
export const Resizable: Story = { args: { resizable: true } };
export const LongText: Story = { args: { items: [{ id: 'a', label: 'A folder with a very long name that does not fit the width of its column and so wraps', children: [{ id: 'b', label: 'Child' }] }] } };
export const Rtl: Story = { decorators: [rtl], args: { defaultPath: ['brand'] } };
