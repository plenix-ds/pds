// States: default, with facts at both ends, long facts. Not applicable: hover, focus, active, disabled, loading, error, selected (a footer line of facts).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBar } from '../../../platform/patterns/StatusBar/StatusBar.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/StatusBar', component: StatusBar, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { start: <span>24 assets</span>, end: <span>Synced 10:24 AM</span> } } satisfies Meta<typeof StatusBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StartOnly: Story = { args: { end: undefined } };
export const LongText: Story = { args: { start: <span>24,512 assets across every collection in every workspace you manage, filtered by owner and type</span>, end: <span>Last synced with the shared library at 10:24 AM on the first Thursday of the quarter</span> } };
export const Rtl: Story = { decorators: [rtl] };
