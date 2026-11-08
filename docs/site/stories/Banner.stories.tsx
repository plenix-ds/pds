// States: default, error (danger tone), dismissible. Not applicable: hover/focus on the banner itself (only its buttons), disabled, loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '../../../platform/components/Banner/Banner.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Banner', component: Banner, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { title: 'Your plan ends in 3 days', children: 'Renew it to keep sharing links active.', tone: 'warning' } } satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { tone: 'info', title: undefined, children: 'This folder is read-only.' } };
export const Success: Story = { args: { tone: 'success', title: 'Saved', children: 'Your changes are synced.' } };
export const Warning: Story = {};
export const Error: Story = { args: { tone: 'danger', title: 'Sync failed', children: 'The library could not sync.', actions: <Button size="sm">Retry</Button> } };
export const Dismissible: Story = { args: { onDismiss: () => {} } };
export const Pane: Story = { args: { placement: 'pane', tone: 'neutral', title: undefined, children: 'Showing the last 30 days.' } };
export const LongText: Story = { args: { onDismiss: () => {}, actions: <Button size="sm">Renew now</Button>,
  title: 'Your plan ends in three days and sharing will stop for everyone',
  children: 'Renew it to keep sharing links active for every member of every team, in every workspace you manage, without interruption.' } };
export const Rtl: Story = { decorators: [rtl], args: { onDismiss: () => {} } };
