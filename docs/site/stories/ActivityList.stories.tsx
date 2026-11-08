// States: default, unread, selected, hover and focus on a row, with actions, stacked, two-line titles, empty. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ActivityList } from '../../../platform/patterns/ActivityList/ActivityList.tsx';
import { Avatar } from '../../../platform/components/Avatar/Avatar.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const rows = (<>
  <ActivityList.Item leading={<Avatar name="Maya Chen" size="sm" />} title="Maya Chen" meta="Round 3 concepts" time="10:24 AM" dateTime="2026-10-05T10:24" unread onOpen={() => {}} />
  <ActivityList.Item leading={<Avatar name="Alex Kim" size="sm" />} title="Alex Kim" meta="Budget review" time="9:02 AM" dateTime="2026-10-05T09:02" selected onOpen={() => {}} />
  <ActivityList.Item leading={<Avatar name="Sam Patel" size="sm" />} title="Sam Patel" meta="Hearing notes" time="Yesterday" actions={<Button size="xs">Archive</Button>} onOpen={() => {}} />
</>);
const meta = { title: 'Patterns/ActivityList', component: ActivityList, tags: ['autodocs'], args: { label: 'Recent emails', children: rows } } satisfies Meta<typeof ActivityList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Stacked: Story = { args: { stacked: true } };
export const TwoLineTitles: Story = { args: { titleLines: 2, children: <ActivityList.Item title="Your request to change the hearing date for the third floor case has been approved by the registry" time="10:24 AM" unread onOpen={() => {}} /> } };
export const Empty: Story = { args: { children: undefined } };
export const LongText: Story = { args: { children: <ActivityList.Item title="A message with a very long title that does not fit the width of the list and so is cut with an ellipsis" meta="And a long line of meta text under it" time="10:24 AM" onOpen={() => {}} /> } };
export const Rtl: Story = { decorators: [rtl] };
