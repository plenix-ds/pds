// States: team, group with source, with members and count, link, show members (button). Hover, focus and active are on the link or button: reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { PeopleGroup } from '../../../platform/patterns/PeopleGroup/PeopleGroup.tsx';
import { rtl } from './rtl.tsx';

const members = [{ id: 1, name: 'Maya Chen', presence: 'online' as const }, { id: 2, name: 'Ana Ruiz' }, { id: 3, name: 'Sam Patel', presence: 'away' as const }, { id: 4, name: 'Lee Park' }];
const meta = { title: 'Patterns/PeopleGroup', component: PeopleGroup, tags: ['autodocs'], args: { name: 'Brand team', description: 'Design and print', members, count: 8 } } satisfies Meta<typeof PeopleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Link: Story = { args: { href: '#/teams/brand' } };
export const Focus: Story = { args: { href: '#/teams/brand' }, play: async () => { await userEvent.tab(); } };
export const Group: Story = { args: { kind: 'group', name: 'Archive editors', count: 48, members: undefined, source: 'Synced from directory', onShowMembers: () => {} } };
export const FewMax: Story = { args: { max: 2 } };
export const NoMembers: Story = { args: { members: undefined, count: undefined } };
export const LongText: Story = { args: { name: 'Archive editors of the northern and eastern provinces regional offices', description: 'Design, print and review of every document held by the finance committee' } };
export const Rtl: Story = { decorators: [rtl] };
