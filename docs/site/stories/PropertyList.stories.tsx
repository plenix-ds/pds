// States: columns (default), stacked, tiles (the read-only look), a full-width tile, status Badge, data font, a label naming a control. Not applicable: hover, focus, active, disabled, loading, error, selected (read-only details).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropertyList } from '../../../platform/patterns/PropertyList/PropertyList.tsx';
import { rtl } from './rtl.tsx';

const items = (<><PropertyList.Item label="Size" data>2.4 MB</PropertyList.Item><PropertyList.Item label="Owner">Maya Chen</PropertyList.Item><PropertyList.Item label="Status" status={{ label: 'Active', tone: 'success', icon: 'check' }} /></>);
const meta = { title: 'Patterns/PropertyList', component: PropertyList, tags: ['autodocs'], args: { children: items } } satisfies Meta<typeof PropertyList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Stacked: Story = { args: { layout: 'stacked' } };
export const Tiles: Story = { args: { variant: 'tiles' } };
export const FullWidthTile: Story = { args: { variant: 'tiles', children: <><PropertyList.Item label="Owner">Maya Chen</PropertyList.Item><PropertyList.Item label="Notes" span="full">A long note that takes the whole row of the tiles list, so it reads as one block of text.</PropertyList.Item></> } };
export const Description: Story = { args: { children: <PropertyList.Item label="Retention" description="How long files stay in the trash">30 days</PropertyList.Item> } };
export const LongText: Story = { args: { variant: 'tiles', children: <PropertyList.Item label="A label that is very long and wraps onto several lines">A value that runs on well past the width of its tile and so wraps onto several lines below its label.</PropertyList.Item> } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'tiles' } };
