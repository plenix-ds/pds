// States: default, collapsible (expanded and collapsed), resizable, with a back row, list-detail (detail open). Hover, focus and active are on the buttons: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SecondaryPane } from '../../../platform/patterns/SecondaryPane/SecondaryPane.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/SecondaryPane', component: SecondaryPane, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { title: 'Files', icon: 'folder-open', children: <p>The pane content.</p> } } satisfies Meta<typeof SecondaryPane>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Collapsible: Story = { args: { collapsible: true } };
export const Collapsed: Story = { args: { collapsible: true, defaultCollapsed: true } };
export const Resizable: Story = { args: { resizable: true } };
export const Wide: Story = { args: { width: 'lg' } };
export const EndSide: Story = { args: { side: 'end' } };
export const Back: Story = { args: { title: 'Case overview', back: { parent: 'cases', href: '#cases' } } };
export const DetailOpen: Story = { args: { detailOpen: true, onBack: () => {} } };
export const LongText: Story = { args: { title: 'Files of the shared drive of the regional office for the northern and eastern provinces', back: { parent: 'all of the cases assigned to the tribunal this year', href: '#cases' } } };
export const Rtl: Story = { decorators: [rtl] };
