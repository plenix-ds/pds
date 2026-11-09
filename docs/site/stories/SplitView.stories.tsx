// States: side by side (default), stacked, a divider to resize (hover and focus), stepped sizes, the reading pane with actions and empty. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SplitView, ReadingPane } from '../../../platform/patterns/SplitView/SplitView.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const first = <div><p>Message one</p><p>Message two</p></div>;
const second = <ReadingPane label="Round 3 concepts" actions={<Button size="xs">Reply</Button>}><p>The message body.</p></ReadingPane>;
const meta = { title: 'Patterns/SplitView', component: SplitView, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { label: 'Inbox', firstLabel: 'Message list', defaultSize: 320, first, second } } satisfies Meta<typeof SplitView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Stacked: Story = { args: { orientation: 'stacked', defaultSize: 160 } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Steps: Story = { args: { steps: [240, 320, 400] } };
export const EmptyReadingPane: Story = { args: { second: <ReadingPane label="No message selected" empty="Select a message to read it." /> } };
export const LongText: Story = { args: { second: <ReadingPane label="A message with a very long subject that does not fit the width of the pane and so wraps"><p>{'A body that runs on and on. '.repeat(30)}</p></ReadingPane> } };
export const Rtl: Story = { decorators: [rtl] };
