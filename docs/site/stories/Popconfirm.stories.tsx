// States: closed, open (confirm), danger, with description. Hover, focus and active are on the trigger and buttons: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Popconfirm } from '../../../platform/patterns/Popconfirm/Popconfirm.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/Popconfirm', component: Popconfirm, tags: ['autodocs'],
  args: { trigger: <Button>Publish</Button>, title: 'Publish 3 changes?', description: 'People with the link see them at once.', confirmLabel: 'Publish', onConfirm: () => {}, onCancel: () => {} } } satisfies Meta<typeof Popconfirm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const Danger: Story = { args: { trigger: <Button size="xs" icon="trash" iconOnly label="Remove tag" />, title: 'Remove this tag?', description: undefined, confirmLabel: 'Remove', tone: 'danger' }, play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const LongText: Story = { args: { title: 'Publish every change made to the documents of the regional office?', description: 'People with the link, including every member of the finance committee, see them at once and are notified.' }, play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const Rtl: Story = { decorators: [rtl] };
