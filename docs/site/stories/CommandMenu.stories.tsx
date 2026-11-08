// States: default, focus, filtered, empty, loading. Hover and active are the rows. Not applicable: disabled (a disabled item is in Disabled), error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CommandMenu } from '../../../platform/components/CommandMenu/CommandMenu.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 'new', label: 'Create collection', icon: 'plus', group: 'Create', shortcut: 'Mod+Shift+N' },
  { id: 'up', label: 'Upload files', icon: 'upload', group: 'Create' },
  { id: 'theme', label: 'Change theme', icon: 'gear', group: 'Settings', items: [{ id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }] },
  { id: 'off', label: 'Archive everything', group: 'Settings', disabled: true },
];
const meta = { title: 'Components/CommandMenu', component: CommandMenu, tags: ['autodocs'], args: { label: 'Commands', items } } satisfies Meta<typeof CommandMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Filtered: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('cre'); } };
export const Empty: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('zzzz'); } };
export const Disabled: Story = { args: { items: [items[3]] } };
export const Loading: Story = { args: { loading: true } };
export const Rtl: Story = { decorators: [rtl] };
