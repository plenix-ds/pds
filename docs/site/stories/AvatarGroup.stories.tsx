// States: default (stack), grid, overflow (+N count), overflow control (+N button, hover and focus). Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AvatarGroup } from '../../../platform/components/AvatarGroup/AvatarGroup.tsx';
import { rtl } from './rtl.tsx';

const people = [{ name: 'Maya Chen' }, { name: 'Alex Kim', presence: 'away' as const }, { name: 'Sam Patel', color: 'green' }, { name: 'Lee Park' }, { name: 'Noor Haddad' }, { name: 'Jo Rivera' }];
const meta = { title: 'Components/AvatarGroup', component: AvatarGroup, tags: ['autodocs'], args: { label: 'Collaborators', people } } satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Few: Story = { args: { people: people.slice(0, 3) } };
export const Grid: Story = { args: { layout: 'grid', max: 12 } };
export const Overflow: Story = { args: { max: 3 } };
export const OverflowControl: Story = { args: { max: 3, onMore: () => {} } };
export const Focus: Story = { args: { max: 3, onMore: () => {} }, play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { label: 'Everyone who collaborated on the quarterly review of every open case', max: 2 } };
export const Rtl: Story = { decorators: [rtl], args: { max: 3, onMore: () => {} } };
