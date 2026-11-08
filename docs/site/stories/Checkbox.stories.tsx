// States: default, hover, focus, active, checked (selected), indeterminate, disabled, invalid (error). Not applicable: loading.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Checkbox } from '../../../platform/components/Checkbox/Checkbox.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Checkbox', component: Checkbox, tags: ['autodocs'], args: { label: 'Include subfolders' } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
const box = (c: HTMLElement) => within(c).getByRole('checkbox');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(box(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Active: Story = { play: async ({ canvasElement }) => { const b = box(canvasElement); await userEvent.hover(b); b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } };
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };
export const Invalid: Story = { args: { 'aria-invalid': true } };
export const WithDescription: Story = { args: { description: 'Every file in every folder below this one is included.' } };
export const LongText: Story = { args: { label: 'Include every subfolder, every shared link and every archived version of every document in this workspace' } };
export const Rtl: Story = { decorators: [rtl], args: { defaultChecked: true } };
