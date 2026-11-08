// States: auto direction, id, email. Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive; it only isolates text direction).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Isolate } from '../../../platform/components/Isolate/Isolate.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Isolate', component: Isolate, tags: ['autodocs'], args: { dir: 'auto', children: 'Letterhead.pdf' } } satisfies Meta<typeof Isolate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Id: Story = { args: { kind: 'id', dir: undefined, children: '20261020-01' } };
export const Email: Story = { args: { kind: 'email', dir: undefined, children: 'office@example.org' } };
export const LongText: Story = { args: { children: 'Quarterly-summary-of-expenditure-by-department-and-cost-centre-for-every-regional-office-2026.pdf' } };
export const Rtl: Story = { decorators: [rtl], args: { kind: 'id', dir: undefined, children: '20261020-01' } };
