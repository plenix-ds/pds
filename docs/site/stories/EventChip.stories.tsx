// States: default, hover, focus, fill, colors. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { EventChip } from '../../../platform/components/EventChip/EventChip.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/EventChip', component: EventChip, tags: ['autodocs'], args: { title: 'Site visit', time: '10:00', color: 'blue', onClick: () => {} } } satisfies Meta<typeof EventChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('button')); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Green: Story = { args: { color: 'green' } };
export const Static: Story = { args: { onClick: undefined } };
export const Fill: Story = { args: { fill: true, time: '14:00–15:30', title: 'Design review' } };
export const LongText: Story = { args: { title: 'Quarterly review of the regional office budget with the finance committee', time: '14:00–15:30' } };
export const Rtl: Story = { decorators: [rtl] };
