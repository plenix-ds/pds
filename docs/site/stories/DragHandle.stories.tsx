// States: default, hover, focus, picked up (selected, aria-pressed), disabled, horizontal. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DragHandle } from '../../../platform/components/DragHandle/DragHandle.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/DragHandle', component: DragHandle, tags: ['autodocs'], args: { label: 'Move Hero banner' } } satisfies Meta<typeof DragHandle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const PickedUp: Story = { args: { dnd: { 'aria-pressed': true } as never } };
export const Disabled: Story = { args: { disabled: true } };
export const Horizontal: Story = { args: { orientation: 'horizontal', label: 'Move column Status' } };
export const LongText: Story = { args: { label: 'Move the hero banner above the announcement and below the navigation' } };
export const Rtl: Story = { decorators: [rtl], args: { orientation: 'horizontal' } };
