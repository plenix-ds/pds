// States: closed (the trigger), open (the dialog), hover and focus, a query with matches, no matches (empty), loading. Not applicable: disabled, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { CommandPalette } from '../../../platform/patterns/CommandPalette/CommandPalette.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'new', label: 'New asset', icon: 'plus', group: 'Create', shortcut: 'N', onSelect: () => {} }, { id: 'theme', label: 'Change theme', icon: 'gear', group: 'Settings', onSelect: () => {} }, { id: 'help', label: 'Open help', icon: 'help', group: 'Settings', onSelect: () => {} }];
const meta = { title: 'Patterns/CommandPalette', component: CommandPalette, tags: ['autodocs'], args: { items, trigger: <Button icon="search">Commands</Button> } } satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Query: Story = { play: async ({ canvasElement }) => { await open(canvasElement); await userEvent.keyboard('theme'); } };
export const NoMatches: Story = { play: async ({ canvasElement }) => { await open(canvasElement); await userEvent.keyboard('zzzz'); } };
export const Loading: Story = { args: { loading: true }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const LongText: Story = { args: { items: [{ id: 'x', label: 'A command with a very long label that does not fit the width of the palette and so is cut', group: 'Create', onSelect: () => {} }] }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await open(canvasElement); } };
