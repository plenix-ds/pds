// States: default, selectable, selected, with a bar, empty. Hover, focus and active are on the rows and their controls: focus is reached by play. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ResourceList } from '../../../platform/patterns/ResourceList/ResourceList.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 'p1', name: 'Kitchen renovation', description: 'Cabinet quotes and layouts', meta: 'Edited today', href: '#/p1' },
  { id: 'p2', name: 'Brand kit', description: 'Logos, colors and fonts', meta: '24 files', avatar: { name: 'Maya Chen' }, href: '#/p2' },
  { id: 'p3', name: 'Floor plans', meta: 'Edited yesterday', onOpen: () => {} },
];
const meta = { title: 'Patterns/ResourceList', component: ResourceList, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { label: 'Projects', noun: 'project', items } } satisfies Meta<typeof ResourceList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Selectable: Story = { args: { selectable: true, defaultSelected: ['p2'], onSelectionChange: () => {} } };
export const NoCount: Story = { args: { showCount: false } };
export const Empty: Story = { args: { items: [], emptyState: <p>No projects yet.</p> } };
export const LongText: Story = { args: { items: [{ id: 'x', name: 'Quarterly summary of expenditure by department and cost centre for every regional office', description: 'A long description of the permits, quotes and contractors for the third floor of the regional office', meta: 'Edited by Marina Abdel-Malik Haddad-Williams yesterday', href: '#/x' }] } };
export const Rtl: Story = { decorators: [rtl] };
