// States: default, with subtitle, with tag, loading. Not applicable: hover, focus, active, disabled, error, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EntityTitle } from '../../../platform/components/EntityTitle/EntityTitle.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/EntityTitle', component: EntityTitle, tags: ['autodocs'], args: { icon: 'document', title: 'Easter flyer.pdf' } } satisfies Meta<typeof EntityTitle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Subtitle: Story = { args: { subtitle: 'Edited 2 hours ago' } };
export const Tag: Story = { args: { title: 'Parish photos', icon: 'folder', tag: 'Archive' } };
export const Status: Story = { args: { title: 'Budget 2027', subtitle: 'Finance', tag: { label: 'Approved', tone: 'success', icon: 'check' }, level: 3 } };
export const Loading: Story = { args: { loading: true, subtitle: 'Loading' } };
export const LongText: Story = { args: { title: 'Quarterly summary of expenditure by department and cost centre for every regional office', subtitle: 'Edited 2 hours ago by the finance committee secretary', tag: 'Archive' } };
export const Rtl: Story = { decorators: [rtl], args: { subtitle: 'Edited 2 hours ago' } };
