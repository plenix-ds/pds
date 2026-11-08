// States: high, medium, low, unknown, numeric. Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfidenceIndicator } from '../../../platform/components/ConfidenceIndicator/ConfidenceIndicator.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/ConfidenceIndicator', component: ConfidenceIndicator, tags: ['autodocs'], args: { level: 'medium' } } satisfies Meta<typeof ConfidenceIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const High: Story = { args: { level: 'high' } };
export const Low: Story = { args: { level: 'low' } };
export const Unknown: Story = { args: { level: undefined } };
export const Numeric: Story = { args: { variant: 'numeric', value: 0.82 } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'numeric', value: 0.82 } };
