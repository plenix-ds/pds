// States: sequential (default), parallel, status (read only), a decision form for the current reviewer, loading (a pending decision), error (a failed decision keeps the reason), rejected. Not applicable: hover, focus beyond its controls, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ApprovalWorkflow } from '../../../platform/patterns/ApprovalWorkflow/ApprovalWorkflow.tsx';
import { rtl } from './rtl.tsx';

const steps = [{ id: 's1', label: 'Design review', reviewers: [{ id: 'maya', name: 'Maya Chen', decision: 'approved' }] }, { id: 's2', label: 'Legal review', reviewers: [{ id: 'alex', name: 'Alex Kim' }, { id: 'sam', name: 'Sam Patel' }] }, { id: 's3', label: 'Final approval', reviewers: [{ id: 'lee', name: 'Lee Park' }] }];
const meta = { title: 'Patterns/ApprovalWorkflow', component: ApprovalWorkflow, tags: ['autodocs'], args: { title: 'Artwork approval', steps, reviewerId: 'alex', onDecision: () => {} } } satisfies Meta<typeof ApprovalWorkflow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Parallel: Story = { args: { variant: 'parallel' } };
export const Status: Story = { args: { variant: 'status' } };
export const Approved: Story = { args: { steps: steps.map((s) => ({ ...s, reviewers: s.reviewers.map((r) => ({ ...r, decision: 'approved' })) })), variant: 'status' } };
export const Rejected: Story = { args: { steps: [{ ...steps[0] }, { ...steps[1], reviewers: [{ id: 'alex', name: 'Alex Kim', decision: 'rejected' }, steps[1].reviewers[1]] }, steps[2]], variant: 'status' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const NotYourTurn: Story = { args: { reviewerId: 'lee' } };
export const LongText: Story = { args: { title: 'Approval of the artwork for every printed and digital use of the new brand across all offices', steps: steps.map((s) => ({ ...s, label: s.label + ' of the complete artwork package and its supporting documents' })) } };
export const Rtl: Story = { decorators: [rtl] };
