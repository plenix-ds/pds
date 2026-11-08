// States: inline (a marker that opens a popover; hover, focus, open), card, list, unavailable link. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Citation } from '../../../platform/components/Citation/Citation.tsx';
import { rtl } from './rtl.tsx';

const source = { id: 'guide', title: 'Project guide', href: '/guide', excerpt: 'Scope and constraints.', author: 'Maya Chen' };
const meta = { title: 'Components/Citation', component: Citation, tags: ['autodocs'], args: { source, index: 1 } } satisfies Meta<typeof Citation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button')); } };
export const Card: Story = { args: { variant: 'card' } };
export const List: Story = { args: { variant: 'list', source: undefined, sources: [source, { id: 'rules', title: 'Rules of procedure', href: '/rules' }] } };
export const Unavailable: Story = { args: { variant: 'card', source: { id: 'gone', title: 'Withdrawn document' } } };
export const LongText: Story = { args: { variant: 'card', source: { ...source, title: 'Project guide to the scope, constraints, schedule, budget and approvals for every phase of the redevelopment', excerpt: 'Scope and constraints for every phase, including the parts that depend on approvals the council has not yet given.' } } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'card' } };
