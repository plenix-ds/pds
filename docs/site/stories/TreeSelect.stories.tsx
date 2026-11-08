// States: default (closed), open, hover and focus, with a value, multiple (checked), search, invalid (error), warning, disabled, read-only, loading (children load). Not applicable: selected beyond the value.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { TreeSelect } from '../../../platform/components/TreeSelect/TreeSelect.tsx';
import { rtl } from './rtl.tsx';

const nodes = [{ id: 'brand', label: 'Brand kit', children: [{ id: 'logos', label: 'Logos' }, { id: 'colors', label: 'Colors' }] }, { id: 'photos', label: 'Photos', children: [{ id: 'cross', label: 'Cross 014' }] }, { id: 'notes', label: 'Notes' }];
const meta = { title: 'Components/TreeSelect', component: TreeSelect, tags: ['autodocs'], args: { label: 'Folder', nodes, onChange: () => {} } } satisfies Meta<typeof TreeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const WithValue: Story = { args: { value: 'logos' } };
export const Multiple: Story = { args: { multiple: true, values: ['logos', 'cross'] }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Search: Story = { args: { search: true }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Invalid: Story = { args: { invalid: true, value: 'logos' } };
export const Warning: Story = { args: { warning: true, value: 'logos' } };
export const Disabled: Story = { args: { disabled: true, value: 'logos' } };
export const ReadOnly: Story = { args: { readOnly: true, value: 'logos' } };
export const Loading: Story = { args: { nodes: [{ id: 'remote', label: 'Remote folder', hasChildren: true }], loadChildren: () => new Promise(() => {}), defaultExpanded: ['remote'] }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const LongText: Story = { args: { nodes: [{ id: 'a', label: 'A folder with a very long name that does not fit the width of the field' }], value: 'a' } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'logos' } };
