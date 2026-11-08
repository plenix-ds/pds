// States: done (default), streaming (loading, quiet progress), stopped. Not applicable: hover, focus, active, disabled, error, selected (read-only text with a live region).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreamingText } from '../../../platform/components/StreamingText/StreamingText.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/StreamingText', component: StreamingText, tags: ['autodocs'], args: { text: 'The council meets quarterly, on the first Thursday of the month.' } } satisfies Meta<typeof StreamingText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Streaming: Story = { args: { state: 'streaming', text: 'The council meets quarterly, on the' } };
export const Stopped: Story = { args: { state: 'stopped', text: 'The council meets quarterly, on the' } };
export const Empty: Story = { args: { state: 'streaming', text: '' } };
export const LongText: Story = { args: { text: 'The council meets quarterly, on the first Thursday of the month, in the main chamber, with every member of the standing committees present. '.repeat(4) } };
export const Rtl: Story = { decorators: [rtl] };
