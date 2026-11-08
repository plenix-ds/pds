// States: default, hover and focus on the resize edge, horizontal, vertical, both axes, stepped, divider variant. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Resizable, PanelSplitter } from '../../../platform/components/Resizable/Resizable.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Resizable', component: Resizable, tags: ['autodocs'], args: { label: 'Preview', axis: 'horizontal', defaultWidth: 320, minWidth: 200, maxWidth: 560, children: 'Drag the edge to make this area wider or narrower.' } } satisfies Meta<typeof Resizable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Vertical: Story = { args: { axis: 'vertical', defaultHeight: 160, minHeight: 120, maxHeight: 400, defaultWidth: undefined, minWidth: undefined, maxWidth: undefined } };
export const Both: Story = { args: { axis: 'both', defaultWidth: 240, defaultHeight: 160 } };
export const Steps: Story = { args: { steps: [240, 320, 400, 560], defaultWidth: 320 } };
export const Divider: Story = { args: { variant: 'divider' } };
export const Splitter: Story = { render: () => <PanelSplitter label="Resize navigation" value={240} min={140} max={() => 320} onChange={() => {}} edge="end" /> };
export const LongText: Story = { args: { children: 'A long piece of text that does not fit the narrow width of the area and so wraps onto several lines inside it, however the person resizes it. '.repeat(3) } };
export const Rtl: Story = { decorators: [rtl] };
