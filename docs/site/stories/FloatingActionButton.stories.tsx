// States: default, hover, focus, active, disabled, extended, sizes and variants. Not applicable: loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { FloatingActionButton } from '../../../platform/components/FloatingActionButton/FloatingActionButton.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/FloatingActionButton', component: FloatingActionButton, tags: ['autodocs'], args: { icon: 'plus', label: 'New asset', placement: 'inline', onClick: () => {} } } satisfies Meta<typeof FloatingActionButton>;
export default meta;
type Story = StoryObj<typeof meta>;
const button = (c: HTMLElement) => within(c).getByRole('button');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(button(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Active: Story = { play: async ({ canvasElement }) => { const b = button(canvasElement); await userEvent.hover(b); b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } };
export const Disabled: Story = { args: { disabled: true } };
export const Extended: Story = { args: { extended: true, icon: 'upload', label: 'Upload' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const LongText: Story = { args: { extended: true, label: 'Upload every file from this folder and all of its subfolders' } };
export const Rtl: Story = { decorators: [rtl], args: { extended: true, icon: 'upload', label: 'Upload' } };
