// States: default, hover and focus (as a button), active (files over it), reject (not accepted), as a drop target. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DropZone } from '../../../platform/components/DropZone/DropZone.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/DropZone', component: DropZone, tags: ['autodocs'], args: { children: 'Drop files or click to choose' } } satisfies Meta<typeof DropZone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AsButton: Story = { args: { as: 'button', onClick: () => {} } };
export const Hover: Story = { args: { as: 'button', onClick: () => {} }, play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { args: { as: 'button', onClick: () => {} }, play: async () => { await userEvent.tab(); } };
export const Active: Story = { args: { active: true } };
export const Reject: Story = { args: { reject: true, rejectContent: 'Only images can go here' } };
export const DropTarget: Story = { args: { name: 'Archive', onDropItem: () => {}, children: 'Archive' } };
export const LongText: Story = { args: { children: 'Drop every file you want to add to this case here, or click to choose them from your computer or your phone' } };
export const Rtl: Story = { decorators: [rtl], args: { as: 'button', onClick: () => {} } };
