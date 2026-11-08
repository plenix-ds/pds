// States: active (nothing shows), warning (the countdown dialog, focus on Stay signed in), signed out (the message), inline signed out. Not applicable: hover and focus beyond its buttons, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionTimeout } from '../../../platform/patterns/SessionTimeout/SessionTimeout.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/SessionTimeout', component: SessionTimeout, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { state: 'warning', remaining: 120, idleMinutes: 30, onStay: () => {}, onSignOut: () => {}, onSignIn: () => {} } } satisfies Meta<typeof SessionTimeout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { state: 'active' } };
export const Warning: Story = {};
export const LastMinute: Story = { args: { remaining: 45 } };
export const SignedOut: Story = { args: { state: 'signed-out' } };
export const InlineSignedOut: Story = { args: { state: 'signed-out', inline: true } };
export const WithSavedNote: Story = { args: { state: 'signed-out', saved: 'Your draft was saved at 10:24.' } };
export const LongText: Story = { args: { state: 'signed-out', inline: true, idleMinutes: 30, saved: 'Your draft of the hearing notice, the supporting letters and every attachment you added were saved at 10:24 and will be waiting for you.' } };
export const Rtl: Story = { decorators: [rtl] };
