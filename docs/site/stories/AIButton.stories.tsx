// States: default, hover, focus, disabled, loading (pending action), error (failed action, shown with retry). Not applicable: selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { AIButton } from '../../../platform/components/AIButton/AIButton.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/AIButton', component: AIButton, tags: ['autodocs'], args: { label: 'Summarize', onAction: () => {} } } satisfies Meta<typeof AIButton>;
export default meta;
type Story = StoryObj<typeof meta>;
const button = (c: HTMLElement) => within(c).getByRole('button');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(button(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { onAction: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await userEvent.click(button(canvasElement)); } };
export const Error: Story = { args: { onAction: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await userEvent.click(button(canvasElement)); } };
export const Icon: Story = { args: { mode: 'icon' } };
export const Menu: Story = { args: { mode: 'menu', actions: [{ id: 'short', label: 'Short summary' }, { id: 'long', label: 'Detailed summary' }] } };
export const LongText: Story = { args: { label: 'Summarize every document in this workspace for the whole team' } };
export const Rtl: Story = { decorators: [rtl] };
