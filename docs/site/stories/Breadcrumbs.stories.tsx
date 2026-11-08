// States: default, long trail. Hover, focus and active are on the links: reached by play. Not applicable: disabled, loading, error, selected (the last level is plain text, the current page).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Breadcrumbs } from '../../../platform/components/Breadcrumbs/Breadcrumbs.tsx';
import { rtl } from './rtl.tsx';

const items = [{ label: 'Library', href: '#/' }, { label: 'Forms', href: '#/forms' }, { label: 'Combobox' }];
const meta = { title: 'Components/Breadcrumbs', component: Breadcrumbs, tags: ['autodocs'], args: { label: 'Breadcrumb', items } } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('link', { name: 'Forms' })); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { items: [{ label: 'Library of shared documents for every regional office', href: '#/' },
  { label: 'Annual reports and financial statements', href: '#/reports' }, { label: 'Quarterly summary of expenditure by department and cost centre' }] } };
export const Rtl: Story = { decorators: [rtl] };
