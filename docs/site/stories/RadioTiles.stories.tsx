// States: default, hover, focus, selected (the chosen tile), disabled tile, read-only. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RadioTiles } from '../../../platform/components/RadioTiles/RadioTiles.tsx';
import { rtl } from './rtl.tsx';

const options = [{ value: 'solid', label: 'Solid', description: 'The accent color' }, { value: 'light', label: 'Light', description: 'A pale header' }, { value: 'plain', label: 'Plain', description: 'No color', disabled: true }];
const meta = { title: 'Components/RadioTiles', component: RadioTiles, tags: ['autodocs'], args: { legend: 'Header style', options, onChange: () => {} } } satisfies Meta<typeof RadioTiles>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { value: 'solid' } };
export const Focus: Story = { args: { value: 'solid' }, play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('label') as HTMLElement); } };
export const ReadOnly: Story = { args: { value: 'light', readOnly: true } };
export const Small: Story = { args: { size: 'sm', value: 'solid' } };
export const Large: Story = { args: { size: 'lg', value: 'solid' } };
export const LongText: Story = { args: { value: 'solid', options: [{ value: 'a', label: 'A header style with a very long name that wraps onto several lines', description: 'A description that is also long enough to wrap in a narrow tile, with a few more words.' }, { value: 'b', label: 'Short' }] } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'solid' } };
