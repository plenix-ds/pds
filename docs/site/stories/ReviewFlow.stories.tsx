// States: in review, read-only, decided history, statuses, human kind, queue (selected). Hover, focus and active are on the decision buttons: focus is reached by play. Not applicable: disabled, loading, error.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ReviewFlow } from '../../../platform/patterns/ReviewFlow/ReviewFlow.tsx';
import { ReviewQueue } from '../../../platform/patterns/ReviewFlow/ReviewQueue.tsx';
import { WorkflowStatus } from '../../../platform/patterns/ReviewFlow/WorkflowStatus.tsx';
import { rtl } from './rtl.tsx';

const reviewers = [{ id: 1, name: 'Maya Chen', decision: 'approved' as const }, { id: 2, name: 'Ana Ruiz' }];
const history = [{ id: 1, name: 'Maya Chen', decision: 'approved' as const, comment: 'Looks good.', time: 'Oct 8, 2026', dateTime: '2026-10-08' }];
const meta = { title: 'Patterns/ReviewFlow', component: ReviewFlow, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { title: 'Easter banner', status: 'in-review', reviewers, history, onDecision: () => {} } } satisfies Meta<typeof ReviewFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const ReadOnly: Story = { args: { onDecision: undefined } };
export const Approved: Story = { args: { status: 'approved', onDecision: undefined } };
export const Human: Story = { args: { kind: 'human', title: 'Summary of the vestry minutes' } };
export const Statuses: Story = { render: () => <div>{(['draft', 'in-review', 'approved', 'changes-requested', 'rejected', 'published', 'scheduled'] as const).map((s) => <WorkflowStatus key={s} status={s} />)}</div> };
export const Queue: Story = { render: () => <ReviewQueue label="Waiting for review" noun="item" items={[{ id: 1, name: 'Easter banner', submittedBy: 'Maya Chen', submitted: 'Today', status: 'in-review' }, { id: 2, name: 'Advent poster', submittedBy: 'Ana Ruiz', status: 'in-review' }]} onDecision={() => {}} /> };
export const LongText: Story = { args: { title: 'Quarterly summary of expenditure by department and cost centre for every regional office' } };
export const Rtl: Story = { decorators: [rtl] };
