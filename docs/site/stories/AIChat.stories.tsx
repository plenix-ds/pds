// States: default (a conversation), empty, streaming (loading, Stop), error-free partial output stays quiet, with suggestions, page variant. Not applicable: hover, focus beyond the composer, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AIChat } from '../../../platform/patterns/AIChat/AIChat.tsx';
import { rtl } from './rtl.tsx';

const messages = [{ id: 1, role: 'user' as const, text: 'When does the council meet?' }, { id: 2, role: 'assistant' as const, text: 'The council meets quarterly, on the first Thursday of the month.', sources: [{ id: 's1', title: 'Council calendar', href: '/calendar' }] }];
const meta = { title: 'Patterns/AIChat', component: AIChat, tags: ['autodocs'], args: { messages, onSend: () => {} } } satisfies Meta<typeof AIChat>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { messages: [] } };
export const Streaming: Story = { args: { streaming: true, onStop: () => {}, messages: [...messages, { id: 3, role: 'user' as const, text: 'And where?' }, { id: 4, role: 'assistant' as const, text: 'In the main', state: 'streaming' }] } };
export const Suggestions: Story = { args: { messages: [], suggestions: [{ id: 'a', label: 'Next meeting', prompt: 'When is the next meeting?' }] } };
export const Page: Story = { args: { variant: 'page' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { messages: [messages[0], { ...messages[1], text: 'The council meets quarterly, on the first Thursday of the month, in the main chamber, with every member of the standing committees present, unless the meeting has been adjourned by a vote of the majority. '.repeat(3) }] } };
export const Rtl: Story = { decorators: [rtl] };
