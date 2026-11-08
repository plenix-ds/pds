// States: default (gray hue), hues, tones, sizes, filled, labeled. Not applicable: hover, focus, active, disabled, loading, error, selected (a marker, not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile } from '../../../platform/components/IconTile/IconTile.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/IconTile', component: IconTile, tags: ['autodocs'], args: { icon: 'briefcase' } } satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Blue: Story = { args: { hue: 'blue' } };
export const Purple: Story = { args: { hue: 'purple', icon: 'sparkle', filled: true } };
export const Surface: Story = { args: { hue: 'surface' } };
export const Warning: Story = { args: { tone: 'warning', icon: 'alert', label: 'Overdue' } };
export const Danger: Story = { args: { tone: 'danger', icon: 'alert', label: 'Failed' } };
export const Small: Story = { args: { size: 'sm', hue: 'green' } };
export const Large: Story = { args: { size: 'lg', hue: 'red' } };
export const Rtl: Story = { decorators: [rtl], args: { hue: 'blue' } };
