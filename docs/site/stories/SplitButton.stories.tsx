// States: default, hover, focus (each part), active, open (the menu), disabled, primary, sizes. Not applicable: loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { SplitButton } from '../../../platform/components/SplitButton/SplitButton.tsx';
import { MenuItem } from '../../../platform/components/Menu/Menu.tsx';
import { rtl } from './rtl.tsx';

const items = (<><MenuItem onSelect={() => {}}>Save as draft</MenuItem><MenuItem onSelect={() => {}}>Save a copy</MenuItem></>);
const meta = { title: 'Components/SplitButton', component: SplitButton, tags: ['autodocs'], args: { label: 'Save', onClick: () => {}, children: items } } satisfies Meta<typeof SplitButton>;
export default meta;
type Story = StoryObj<typeof meta>;
const buttons = (c: HTMLElement) => within(c).getAllByRole('button');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(buttons(canvasElement)[0]); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Active: Story = { play: async ({ canvasElement }) => { const b = buttons(canvasElement)[0]; await userEvent.hover(b); b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } };
export const Open: Story = { play: async ({ canvasElement }) => { await userEvent.click(buttons(canvasElement)[1]); } };
export const Disabled: Story = { args: { disabled: true } };
export const Primary: Story = { args: { variant: 'primary', icon: 'upload', label: 'Upload' } };
export const Small: Story = { args: { size: 'sm' } };
export const LongText: Story = { args: { label: 'Save every change to every document in this workspace' } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await userEvent.click(buttons(canvasElement)[1]); } };
