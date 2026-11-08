// States: default (closed), open, focus, inline. Hover and active are on the (i) button. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ContextualHelp } from '../../../platform/components/ContextualHelp/ContextualHelp.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/ContextualHelp', component: ContextualHelp, tags: ['autodocs'],
  args: { title: 'Retention', children: 'Deleted files stay in the trash for 30 days.' } } satisfies Meta<typeof ContextualHelp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const WithLink: Story = { args: { link: { href: '#/help/storage', label: 'About storage' } } };
export const Inline: Story = { args: { variant: 'inline', title: 'Tip', children: 'Drop files anywhere on the page to upload them.' } };
export const LongText: Story = { args: { children: 'Deleted files stay in the trash for thirty days, and during that time anyone with edit access can restore them, but after that they are removed for good and cannot be recovered by anyone.' } };
export const Rtl: Story = { decorators: [rtl] };
