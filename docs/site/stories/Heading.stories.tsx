// States: each level and size. Not applicable: hover, focus, active, disabled, loading, error, selected (static text).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '../../../platform/components/Heading/Heading.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Heading', component: Heading, tags: ['autodocs'], args: { children: 'Recent activity' } } satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PageTitle: Story = { args: { level: 1, children: 'Posts' } };
export const Level3: Story = { args: { level: 3, children: 'Billing' } };
export const Level4: Story = { args: { level: 4, children: 'Invoices' } };
export const SizeOverride: Story = { args: { level: 3, size: 2, children: 'Billing, drawn at level 2' } };
export const LongText: Story = { args: { level: 1, children: 'Recent activity on every case in every workspace you manage, across all of your teams and offices' } };
export const Rtl: Story = { decorators: [rtl] };
