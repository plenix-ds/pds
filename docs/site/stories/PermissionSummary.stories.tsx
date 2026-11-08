// States: list, compact, with manage button or link, nothing allowed. Hover, focus and active are on the manage control: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { PermissionSummary } from '../../../platform/patterns/PermissionSummary/PermissionSummary.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/PermissionSummary', component: PermissionSummary, tags: ['autodocs'],
  args: { access: 'Your team can edit', detail: 'From the Marketing folder · 12 people', can: ['View', 'Comment', 'Edit details'], cannot: ['Share', 'Delete'], onManage: () => {} } } satisfies Meta<typeof PermissionSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Compact: Story = { args: { variant: 'compact', icon: 'lock', access: 'Only you', can: ['View', 'Edit'], cannot: ['Share'], detail: undefined } };
export const ManageLink: Story = { args: { onManage: undefined, manageHref: '#/sharing' } };
export const OnlyCan: Story = { args: { cannot: undefined } };
export const NothingAllowed: Story = { args: { can: [], cannot: ['View', 'Edit', 'Share'] } };
export const LongText: Story = { args: { access: 'Everyone in the regional office for the northern and eastern provinces can edit', detail: 'From the shared drive of the finance committee · 1,284 people across 14 teams' } };
export const Rtl: Story = { decorators: [rtl] };
