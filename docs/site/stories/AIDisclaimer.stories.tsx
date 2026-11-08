// States: default (footer), inline, with a policy link. Not applicable: hover/focus beyond the link, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AIDisclaimer } from '../../../platform/components/AIDisclaimer/AIDisclaimer.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/AIDisclaimer', component: AIDisclaimer, tags: ['autodocs'] } satisfies Meta<typeof AIDisclaimer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Inline: Story = { args: { variant: 'inline' } };
export const WithPolicy: Story = { args: { href: '/ai-policy' } };
export const LongText: Story = { args: { href: '/ai-policy', children: 'This content was generated from the sources you selected and may contain mistakes. Review every figure, name and date against the original documents before you share it with anyone outside your team.' } };
export const Rtl: Story = { decorators: [rtl], args: { href: '/ai-policy' } };
