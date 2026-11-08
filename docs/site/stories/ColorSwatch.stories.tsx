// States: default, hover, focus, pressed (selected, with onClick), with a visible label, shapes and sizes. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ColorSwatch } from '../../../platform/components/ColorSwatch/ColorSwatch.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/ColorSwatch', component: ColorSwatch, tags: ['autodocs'], args: { color: 'blue', label: 'Blue' } } satisfies Meta<typeof ColorSwatch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Control: Story = { args: { onClick: () => {} } };
export const Hover: Story = { args: { onClick: () => {} }, play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { args: { onClick: () => {} }, play: async () => { await userEvent.tab(); } };
export const Pressed: Story = { args: { onClick: () => {}, pressed: true } };
export const Round: Story = { args: { shape: 'round', size: 'sm' } };
export const Category: Story = { args: { color: undefined, category: 'teal', label: 'Teal' } };
export const WithLabel: Story = { args: { showLabel: true, onClick: () => {} } };
export const LongText: Story = { args: { showLabel: true, label: 'A very long name for a color that a category chose for itself' } };
export const Rtl: Story = { decorators: [rtl], args: { showLabel: true, onClick: () => {} } };
