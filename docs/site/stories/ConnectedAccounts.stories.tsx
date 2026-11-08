// States: not connected, connected, error (Reconnect), busy (a pending action), confirm disconnect, focus on a row's action. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ConnectedAccounts } from '../../../platform/patterns/ConnectedAccounts/ConnectedAccounts.tsx';
import { rtl } from './rtl.tsx';

const accounts = [
  { id: 'drive', service: 'Google Drive', icon: 'folder', description: 'Open and save files from your Drive.', status: 'connected' as const, account: 'maya@example.com', connectedAt: '2026-10-02', scopes: ['See and open the files you choose'], loses: 'Files linked from Drive stop opening in Plenix.' },
  { id: 'mail', service: 'Mailchimp', icon: 'mail', status: 'error' as const, account: 'parish-office', error: 'Access expired on Oct 12.' },
  { id: 'cal', service: 'Calendar', icon: 'calendar', description: 'Show hearings in your calendar.', status: 'disconnected' as const, scopes: ['Add events to your calendar'] },
];
const meta = { title: 'Patterns/ConnectedAccounts', component: ConnectedAccounts, tags: ['autodocs'], args: { label: 'Connected accounts', accounts, onConnect: () => {}, onDisconnect: () => {}, onReconnect: () => {} } } satisfies Meta<typeof ConnectedAccounts>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Busy: Story = { args: { accounts: accounts.map((a) => ({ ...a, busy: a.id === 'drive' })) } };
export const NoneConnected: Story = { args: { accounts: accounts.map((a) => ({ ...a, status: 'disconnected' as const, account: undefined, error: undefined })) } };
export const LongText: Story = { args: { accounts: [{ ...accounts[0], service: 'A service with a very long name that does not fit the row', description: 'A description that runs on well past the width of its row and so wraps onto several lines below the name of the service.' }] } };
export const Rtl: Story = { decorators: [rtl] };
