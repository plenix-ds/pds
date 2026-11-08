// States: viewers, editors, cursors, many people (max), a person button. Hover, focus and active are on the person buttons: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { PresenceBar } from '../../../platform/patterns/PresenceBar/PresenceBar.tsx';
import { rtl } from './rtl.tsx';

const people = [{ id: 1, name: 'Maya Chen', role: 'editor' as const, cursor: 'Paragraph 2' }, { id: 2, name: 'Ana Ruiz', role: 'viewer' as const }, { id: 3, name: 'Sam Patel', role: 'editor' as const }, { id: 4, name: 'Lee Park', role: 'viewer' as const }];
const meta = { title: 'Patterns/PresenceBar', component: PresenceBar, tags: ['autodocs'], args: { people, mode: 'viewers' } } satisfies Meta<typeof PresenceBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Editors: Story = { args: { mode: 'editors' } };
export const Cursors: Story = { args: { mode: 'cursors' } };
export const Max: Story = { args: { max: 2 } };
export const Clickable: Story = { args: { onPerson: () => {} }, play: async () => { await userEvent.tab(); } };
export const Alone: Story = { args: { people: people.slice(0, 1) } };
export const Empty: Story = { args: { people: [] } };
export const Rtl: Story = { decorators: [rtl] };
