// States: default (no votes), voting (hover and focus on a choice), voted (selected), a turned-off member (disabled), hidden votes, quorum met and not met, custom options. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { VoteTally } from '../../../platform/components/VoteTally/VoteTally.tsx';
import { rtl } from './rtl.tsx';

const members = [{ memberId: 1, name: 'Maya Chen', role: 'President', vote: null }, { memberId: 2, name: 'Alex Kim', role: 'Member', vote: 'approve' as const }, { memberId: 3, name: 'Sam Patel', role: 'Member', vote: 'deny' as const }, { memberId: 4, name: 'Lee Park', role: 'Member', vote: null, disabledReason: 'Recused' }];
const meta = { title: 'Components/VoteTally', component: VoteTally, tags: ['autodocs'], args: { label: 'Motion 14: approve the 2027 budget', members, onVote: () => {} } } satisfies Meta<typeof VoteTally>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { members: members.map((m) => ({ ...m, vote: null })) } };
export const Voted: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Hidden: Story = { args: { members: members.map((m, i) => (i === 1 ? { ...m, voteHidden: true } : m)) } };
export const Quorum: Story = { args: { outcome: { approve: 1, deny: 1, abstain: 0, notVoted: 1, turnedOff: 1, present: 3, quorum: { needed: 3, present: 3, met: true }, result: 'tied' } as never } };
export const QuorumNotMet: Story = { args: { outcome: { approve: 1, deny: 0, abstain: 0, notVoted: 2, turnedOff: 1, present: 3, quorum: { needed: 4, present: 3, met: false }, result: 'pending' } as never } };
export const Attendance: Story = { args: { options: [{ key: 'present', label: 'Present', icon: 'check', tone: 'success' }, { key: 'absent', label: 'Absent', icon: 'close', tone: 'danger' }], members: members.map((m) => ({ ...m, vote: null })) } };
export const LongText: Story = { args: { label: 'Motion 14: approve the 2027 budget for every department, every office and every standing committee of the council', members: [{ ...members[0], name: 'Alexandria Montgomery-Whitfield Jr.', role: 'President of the standing committee on finance and the budget' }] } };
export const Rtl: Story = { decorators: [rtl] };
