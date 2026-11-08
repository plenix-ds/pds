// States: default (a thread with a header and composer), typing (loading), message statuses (sending to read), deleted, with reactions. Not applicable: hover/focus beyond the composer and the action bar, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Chat } from '../../../platform/components/Chat/Chat.tsx';
import { Avatar } from '../../../platform/components/Avatar/Avatar.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Chat', component: Chat.Thread, tags: ['autodocs'] } satisfies Meta<typeof Chat.Thread>;
export default meta;
type Story = StoryObj<typeof meta>;
const maya = <Avatar name="Maya Chen" size="sm" />;
const thread = (extra?: React.ReactNode, text = 'Are the renders ready?') => (
  <Chat.Thread label="Conversation with Maya Chen">
    <Chat.Divider>Today</Chat.Divider>
    <Chat.Group author="Maya Chen" avatar={maya}>
      <Chat.Message time="10:24 AM">{text}</Chat.Message>
      <Chat.Message time="10:25 AM">The PDF is fine.</Chat.Message>
    </Chat.Group>
    <Chat.Message mine time="10:26 AM" status="read" readTime="10:27 AM">Uploading them now.</Chat.Message>
    {extra}
  </Chat.Thread>
);

export const Default: Story = { render: () => <div><Chat.Header title="Maya Chen" meta="Online" avatar={<Avatar name="Maya Chen" />} />{thread()}<Chat.Composer value="" onChange={() => {}} onSend={() => {}} /></div> };
export const Typing: Story = { render: () => thread(<Chat.Typing label="Maya is typing" />) };
export const Statuses: Story = { render: () => <Chat.Thread label="Statuses">{(['sending', 'sent', 'delivered', 'read'] as const).map((s) => <Chat.Message key={s} mine time="10:26 AM" status={s}>{s}</Chat.Message>)}</Chat.Thread> };
export const Reactions: Story = { render: () => <Chat.Thread label="Reactions"><Chat.Message time="10:24 AM" reactions={[{ emoji: '👍', count: 2, mine: true }]} onReact={() => {}}>Looks good to me.</Chat.Message></Chat.Thread> };
export const Deleted: Story = { render: () => <Chat.Thread label="Deleted"><Chat.Message time="10:24 AM" deleted>Gone</Chat.Message></Chat.Thread> };
export const Unread: Story = { render: () => thread(<Chat.Divider unread />) };
export const Focus: Story = { render: () => <Chat.Composer value="" onChange={() => {}} onSend={() => {}} />, play: async () => { await userEvent.tab(); } };
export const LongText: Story = { render: () => thread(undefined, 'Are the renders for the third floor, the roof terrace and the two courtyards ready, and did the structural engineer sign off the revised beam sizes before the hearing was adjourned?') };
export const Rtl: Story = { decorators: [rtl], render: () => <div>{thread()}<Chat.Composer value="" onChange={() => {}} onSend={() => {}} /></div> };
