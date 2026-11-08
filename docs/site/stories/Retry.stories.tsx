// States: running, waiting (countdown), failed, done, dismissable, warning tone. Hover, focus and active are on the Retry and Dismiss buttons: focus is reached by play. Not applicable: disabled, loading is running, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RetryNotice } from '../../../platform/patterns/Retry/Retry.tsx';
import type { RetryState } from '../../../platform/patterns/Retry/Retry.tsx';
import { rtl } from './rtl.tsx';

const state = (over: Partial<RetryState>): RetryState => ({ status: 'failed', attempt: 3, attempts: 3, seconds: 0, error: new Error('The server did not answer.'), result: undefined, retry: () => {}, cancel: () => {}, ...over });
const meta = { title: 'Patterns/Retry', component: RetryNotice, tags: ['autodocs'], args: { retry: state({}), title: 'The assets could not load', children: 'The server did not answer.' } } satisfies Meta<typeof RetryNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Failed: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Running: Story = { args: { retry: state({ status: 'running', attempt: 1, error: undefined }) } };
export const Waiting: Story = { args: { retry: state({ status: 'waiting', attempt: 1, seconds: 8 }), showCount: true } };
export const Done: Story = { args: { retry: state({ status: 'done', error: undefined }) } };
export const Warning: Story = { args: { tone: 'warning' } };
export const Dismissable: Story = { args: { onDismiss: () => {} } };
export const LongText: Story = { args: { title: 'The assets of the shared drive of the regional office could not load for the finance committee', children: 'The server did not answer after three attempts; check the connection of the regional office and try again in a few minutes.' } };
export const Rtl: Story = { decorators: [rtl] };
