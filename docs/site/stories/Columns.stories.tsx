// States: default (two columns), three, divided, sidebar ratios, collapsing. Not applicable: hover, focus, active, disabled, loading, error, selected (a layout).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Columns } from '../../../platform/components/Columns/Columns.tsx';
import { Stack } from '../../../platform/components/Stack/Stack.tsx';
import { rtl } from './rtl.tsx';

const cols = (n: number) => Array.from({ length: n }, (_, i) => <Stack key={i}><strong>Column {i + 1}</strong><span>Text for the column.</span></Stack>);
const meta = { title: 'Components/Columns', component: Columns, tags: ['autodocs'], args: { children: cols(2) } } satisfies Meta<typeof Columns>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Three: Story = { args: { count: 3, children: cols(3) } };
export const Divided: Story = { args: { count: 3, divided: true, children: cols(3) } };
export const SidebarStart: Story = { args: { ratio: 'sidebar-start' } };
export const SidebarEnd: Story = { args: { ratio: 'sidebar-end' } };
export const Collapsing: Story = { args: { collapseBelow: 'wide', count: 3, children: cols(3) } };
export const LongText: Story = { args: { children: [<Stack key="a"><strong>A column with a very long heading that wraps onto several lines</strong><span>Text for the column that also runs long enough to wrap in a narrow column.</span></Stack>, <Stack key="b"><strong>Short</strong></Stack>] } };
export const Rtl: Story = { decorators: [rtl], args: { ratio: 'sidebar-start' } };
