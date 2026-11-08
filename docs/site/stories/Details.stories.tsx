// States: closed (default), open, hover and focus on the summary, bordered and inline variants. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Details } from '../../../platform/components/Details/Details.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Details', component: Details, tags: ['autodocs'], args: { summary: 'Why do we need your phone number?', children: 'We text you a code when you sign in from a new device.' } } satisfies Meta<typeof Details>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Bordered: Story = { args: { variant: 'bordered', summary: 'Technical details', defaultOpen: true } };
export const Inline: Story = { args: { variant: 'inline', summary: 'Show the error' } };
export const LongText: Story = { args: { summary: 'Why do we need your phone number, and what do we do with it after you have confirmed your identity on a new device?', defaultOpen: true } };
export const Rtl: Story = { decorators: [rtl], args: { defaultOpen: true } };
