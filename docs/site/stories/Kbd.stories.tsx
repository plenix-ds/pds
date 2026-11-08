// States: default, on accent. Not applicable: hover, focus, active, disabled, loading, error, selected (a label for a key, not a control).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '../../../platform/components/Kbd/Kbd.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Kbd', component: Kbd, tags: ['autodocs'], args: { children: 'Ctrl K' } } satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OnAccent: Story = { args: { onAccent: true, children: '/' } };
export const LongText: Story = { args: { children: 'Ctrl Shift Alt Option Command K' } };
export const Rtl: Story = { decorators: [rtl] };
