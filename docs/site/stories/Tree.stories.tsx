// States: default, selected, expanded, hover and focus on a row, loading (children load), error (Try again), with icons and meta. Not applicable: disabled, empty.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Tree } from '../../../platform/components/Tree/Tree.tsx';
import { rtl } from './rtl.tsx';

const nodes = [{ id: 'brand', label: 'Brand kit', icon: 'folder', children: [{ id: 'logos', label: 'Logos', icon: 'folder', children: [{ id: 'logo-a', label: 'Logo A.svg', icon: 'image' }] }, { id: 'colors', label: 'Colors.pdf', icon: 'doc', meta: '2 MB' }] }, { id: 'photos', label: 'Photos', icon: 'folder', children: [{ id: 'cross', label: 'Cross 014.png', icon: 'image' }] }, { id: 'notes', label: 'Notes.txt', icon: 'doc' }];
const meta = { title: 'Components/Tree', component: Tree, tags: ['autodocs'], args: { label: 'Folders', nodes } } satisfies Meta<typeof Tree>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: 'logos', expanded: ['brand'] } };
export const Expanded: Story = { args: { expanded: ['brand', 'logos', 'photos'] } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { nodes: [{ id: 'remote', label: 'Remote folder', icon: 'folder', hasChildren: true }], loadChildren: () => new Promise(() => {}), expanded: ['remote'] } };
export const Error: Story = { args: { nodes: [{ id: 'remote', label: 'Remote folder', icon: 'folder', hasChildren: true }], loadChildren: () => Promise.reject(new globalThis.Error('failed')), expanded: ['remote'] } };
export const LongText: Story = { args: { nodes: [{ id: 'a', label: 'A folder with a very long name that does not fit the width of the tree and so wraps or is cut', icon: 'folder', children: [{ id: 'b', label: 'Child' }] }], expanded: ['a'] } };
export const Rtl: Story = { decorators: [rtl], args: { expanded: ['brand'], selected: 'logos' } };
