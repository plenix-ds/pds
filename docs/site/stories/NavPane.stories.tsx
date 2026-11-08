// States: default, with header, footer and rail, wide, start-collapsing. Hover, focus and active belong to the content inside: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { NavPane } from '../../../platform/patterns/NavPane/NavPane.tsx';
import { NavList } from '../../../platform/components/NavList/NavList.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/NavPane', component: NavPane, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { label: 'Categories and collections', title: 'Asset Manager', actions: <Button size="sm" icon="plus" iconOnly label="New collection" />,
    children: <NavList label="Collections" items={[{ id: 'all', label: 'All assets', count: 120 }, { id: 'brand', label: 'Brand kit', count: 24 }]} value="all" /> } } satisfies Meta<typeof NavPane>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Slots: Story = { args: { header: <p>Header slot</p>, footer: <p>Footer slot</p> } };
export const Wide: Story = { args: { width: 360 } };
export const CollapseAtStart: Story = { args: { collapseAt: 'start' } };
export const LongText: Story = { args: { title: 'Asset Manager for the shared drive of the regional office and every team', label: 'Categories and collections of every regional office' } };
export const Rtl: Story = { decorators: [rtl] };
