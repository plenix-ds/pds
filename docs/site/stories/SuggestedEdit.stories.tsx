// States: diff (default, pending edits), accept, reject, all, decided (accepted and rejected), loading (a pending decision), error (a failed decision keeps the edits), disabled. Not applicable: hover, focus beyond its buttons, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { SuggestedEdit } from '../../../platform/components/SuggestedEdit/SuggestedEdit.tsx';
import { rtl } from './rtl.tsx';

const edits = [{ id: 'e1', before: 'meets quarterly', after: 'meets every quarter', status: 'pending' as const }, { id: 'e2', before: 'on the first Thursday', after: 'on the first Thursday of the month', status: 'pending' as const }];
const meta = { title: 'Components/SuggestedEdit', component: SuggestedEdit, tags: ['autodocs'], args: { edits, onDecision: () => {} } } satisfies Meta<typeof SuggestedEdit>;
export default meta;
type Story = StoryObj<typeof meta>;
const first = async (c: HTMLElement) => { await userEvent.click(within(c).getAllByRole('button')[0]); };

export const Default: Story = {};
export const Accept: Story = { args: { variant: 'accept' } };
export const Reject: Story = { args: { variant: 'reject' } };
export const All: Story = { args: { variant: 'all' } };
export const Decided: Story = { args: { edits: [{ ...edits[0], status: 'accepted' }, { ...edits[1], status: 'rejected' }] } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { onDecision: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await first(canvasElement); } };
export const Error: Story = { args: { onDecision: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await first(canvasElement); } };
export const Disabled: Story = { args: { disabled: true } };
export const Empty: Story = { args: { edits: [] } };
export const LongText: Story = { args: { edits: [{ id: 'e1', before: 'The council meets quarterly, on the first Thursday of the month, in the main chamber', after: 'The council meets every quarter, on the first Thursday of the month, in the main chamber with every member of the standing committees present', status: 'pending' }] } };
export const Rtl: Story = { decorators: [rtl] };
