// States: with unread, all read, limited with View all, empty. Hover, focus and active are on the rows: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { NotificationList } from '../../../platform/patterns/NotificationList/NotificationList.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 1, text: 'Maya Chen shared Brand kit with you', time: '5 minutes ago', unread: true }, { id: 2, text: 'Ana Ruiz commented on Floor plans', time: 'Yesterday' }, { id: 3, text: 'The export finished', time: 'Oct 8' }];
const meta = { title: 'Patterns/NotificationList', component: NotificationList, tags: ['autodocs'], args: { items, label: 'Notifications', onChange: () => {}, onOpen: () => {}, onViewAll: () => {} } } satisfies Meta<typeof NotificationList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const AllRead: Story = { args: { items: items.map((i) => ({ ...i, unread: false })) } };
export const Limited: Story = { args: { limit: 2 } };
export const NoFooter: Story = { args: { footer: false } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 1, text: 'Maya Chen shared the quarterly summary of expenditure by department and cost centre for every regional office with you and 40 other people', time: '5 minutes ago', unread: true }] } };
export const Rtl: Story = { decorators: [rtl] };
