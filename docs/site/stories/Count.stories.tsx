// States: plain, pill, tones, capped, empty. Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Count } from '../../../platform/components/Count/Count.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Count', component: Count, tags: ['autodocs'], args: { value: 24 } } satisfies Meta<typeof Count>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Pill: Story = { args: { variant: 'pill', label: '24 unread notifications' } };
export const Info: Story = { args: { variant: 'pill', tone: 'info' } };
export const Capped: Story = { args: { variant: 'pill', value: 240, max: 99 } };
export const Zero: Story = { args: { variant: 'pill', value: 0 } };
export const Empty: Story = { args: { value: null } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'pill', value: 240, max: 99 } };
