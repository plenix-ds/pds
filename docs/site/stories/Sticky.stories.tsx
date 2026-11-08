// States: default, stuck (the shadow shows), always shadow, bottom edge, labeled region. Not applicable: hover, focus, active, disabled, loading, error, selected (a layout region).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sticky } from '../../../platform/components/Sticky/Sticky.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Sticky', component: Sticky, tags: ['autodocs'], args: { label: 'Project header', children: <strong>Kitchen renovation</strong> } } satisfies Meta<typeof Sticky>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Stuck: Story = { args: { stuck: true } };
export const AlwaysShadow: Story = { args: { shadow: 'always' } };
export const NoShadow: Story = { args: { shadow: 'none', stuck: true } };
export const Bottom: Story = { args: { edge: 'bottom', stuck: true, label: 'Actions', children: <><Button>Cancel</Button><Button variant="primary">Save</Button></> } };
export const LongText: Story = { args: { stuck: true, children: <strong>A project header with a long title that wraps onto more than one line when the region is narrow</strong> } };
export const Rtl: Story = { decorators: [rtl], args: { stuck: true } };
