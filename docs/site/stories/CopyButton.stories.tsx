// States: default, hover, focus, copied (after a press), disabled. Not applicable: loading, error (a failed copy is reported through onCopy), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { CopyButton } from '../../../platform/components/CopyButton/CopyButton.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/CopyButton', component: CopyButton, tags: ['autodocs'], args: { value: 'ASSET-0142', label: 'Copy ID' } } satisfies Meta<typeof CopyButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('button')); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Copied: Story = { play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button')); } };
export const WithLabel: Story = { args: { showLabel: true, label: 'Copy link' } };
export const Field: Story = { args: { field: true, fieldLabel: 'Share link', value: 'https://example.org/share/ASSET-0142', label: 'Copy link' } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { field: true, fieldLabel: 'Share link', value: 'https://example.org/share/collections/annual-report/ASSET-0142?version=17&view=full', label: 'Copy link' } };
export const Rtl: Story = { decorators: [rtl], args: { showLabel: true } };
