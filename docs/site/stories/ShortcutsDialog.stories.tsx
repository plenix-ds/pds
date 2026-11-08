// States: open (default, grouped list), search with matches, no matches (empty), not searchable, closed. Not applicable: hover and focus beyond its controls, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { ShortcutsDialog } from '../../../platform/patterns/ShortcutsDialog/ShortcutsDialog.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/ShortcutsDialog', component: ShortcutsDialog, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, onClose: () => {} } } satisfies Meta<typeof ShortcutsDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Search: Story = { play: async () => { await userEvent.type(within(document.body).getByRole('searchbox'), 'search'); } };
export const NoMatches: Story = { play: async () => { await userEvent.type(within(document.body).getByRole('searchbox'), 'zzzz'); } };
export const NotSearchable: Story = { args: { searchable: false } };
export const Closed: Story = { args: { open: false } };
export const Rtl: Story = { decorators: [rtl] };
