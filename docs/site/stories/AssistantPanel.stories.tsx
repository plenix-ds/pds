// States: open (inspector), overlay, with context, closed. Focus: reached by play (the chat input and buttons). Not applicable: hover/active are the controls, disabled, error (the chat shows it), selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AssistantPanel } from '../../../platform/patterns/AssistantPanel/AssistantPanel.tsx';
import { rtl } from './rtl.tsx';

const messages = [{ id: 1, role: 'user', content: 'Summarize the quotes.' }, { id: 2, role: 'assistant', content: 'There are two quotes; the second covers the cabinets.' }];
const meta = { title: 'Patterns/AssistantPanel', component: AssistantPanel, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, onOpenChange: () => {}, title: 'Assistant', messages, onSend: () => {} } } satisfies Meta<typeof AssistantPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Overlay: Story = { args: { variant: 'overlay' } };
export const WithContext: Story = { args: { context: <p>The selected folder and its 12 files will be sent.</p> } };
export const Empty: Story = { args: { messages: [] } };
export const Closed: Story = { args: { open: false } };
export const Rtl: Story = { decorators: [rtl] };
