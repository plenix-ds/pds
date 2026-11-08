// States: structured, with status and facts, next step, actions, streamlined, section, all layouts, long text. Hover, focus and active are on the actions: focus is reached by play. Not applicable: disabled (a disabled action is shown), loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { EntityHeader } from '../../../platform/patterns/EntityHeader/EntityHeader.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/EntityHeader', component: EntityHeader, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { media: { person: 'Maya Chen', color: 'blue' }, title: 'Maya Chen', subtitle: 'Creative Director · Apex Co',
    status: { tone: 'action-required', icon: 'alert', label: 'Reconnect due' },
    facts: [{ label: 'Last message', value: '10:24 AM', data: true }, { label: 'Owner', value: 'Sam Patel' }],
    next: { title: 'Send the revised quote', detail: 'Due tomorrow · Sam Patel' },
    actions: [{ icon: 'phone', label: 'Call' }, { icon: 'message', label: 'Message', primary: true }, { icon: 'share', label: 'Share', disabled: true }] } } satisfies Meta<typeof EntityHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Minimal: Story = { args: { media: undefined, subtitle: undefined, status: undefined, facts: undefined, next: undefined, actions: undefined } };
export const IconMedia: Story = { args: { media: { icon: 'folder', hue: 'purple', box: true }, title: 'Kitchen renovation' } };
export const Versus: Story = { args: { media: { versus: [{ name: 'Michael Bennett' }, { name: 'Charlotte Bennett' }] }, title: 'Michael Bennett vs. Charlotte Bennett' } };
export const TextActions: Story = { args: { actionLabels: 'text' } };
export const Column: Story = { args: { layout: 'column-large' } };
export const Edge: Story = { args: { layout: 'edge' } };
export const Section: Story = { args: { kind: 'section', headingLevel: 2 } };
export const Streamlined: Story = { args: { headerStyle: 'streamlined', badges: [{ label: 'Priority', tone: 'warning', icon: 'alert' }], people: { label: 'Team', list: [{ name: 'Ana Ruiz' }, { name: 'Sam Patel' }] } } };
export const LongText: Story = { args: { title: 'Quarterly summary of expenditure by department and cost centre for every regional office', subtitle: 'Prepared for the finance committee of the northern and eastern provinces' } };
export const Rtl: Story = { decorators: [rtl] };
