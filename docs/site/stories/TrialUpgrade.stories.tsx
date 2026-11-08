// States: closed (banner), open (plans compared), message only. Hover, focus and active are on the buttons: focus is reached by play. Not applicable: disabled, loading (checkout), error (a rejection keeps the selection), selected is the chosen plan.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TrialUpgrade } from '../../../platform/patterns/TrialUpgrade/TrialUpgrade.tsx';
import { rtl } from './rtl.tsx';

const plans = [{ id: 'team', title: 'Team', meta: '$12 per person', values: { storage: '1 TB', support: 'Email' } }, { id: 'business', title: 'Business', meta: '$24 per person', values: { storage: '5 TB', support: 'Priority' } }];
const attributes = [{ key: 'storage', label: 'Storage' }, { key: 'support', label: 'Support' }];
const meta = { title: 'Patterns/TrialUpgrade', component: TrialUpgrade, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { message: 'Your trial ends in 3 days.', plans, attributes, onUpgrade: () => {} } } satisfies Meta<typeof TrialUpgrade>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { args: { defaultOpen: true } };
export const MessageOnly: Story = { args: { plans: [], attributes: [] } };
export const LongText: Story = { args: { defaultOpen: true, message: 'Your trial of the shared workspace for the regional office ends in three days; choose a plan to keep every document.' } };
export const Rtl: Story = { decorators: [rtl], args: { defaultOpen: true } };
