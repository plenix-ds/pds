// States: shown (tones), with action, dismiss (focus by play). A toast is shown through useToast inside a ToastProvider; the stories show one on load. Not applicable: hover (pauses the timer), disabled, loading, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ToastProvider, useToast } from '../../../platform/components/Toast/Toast.tsx';
import { rtl } from './rtl.tsx';

type Args = { message: string; tone?: 'info' | 'success' | 'warning' | 'danger'; withAction?: boolean };
function Show({ message, tone, withAction }: Args) {
  const toast = useToast();
  React.useEffect(() => { toast.show(message, { tone, duration: 600000, ...(withAction ? { action: { label: 'Undo', onAction: () => {} } } : {}) } as never); }, []);
  return <p>The page behind the toast.</p>;
}
const meta = { title: 'Components/Toast', component: Show, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>], args: { message: 'Saved' } } satisfies Meta<typeof Show>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { tone: 'success' } };
export const Warning: Story = { args: { tone: 'warning', message: 'The connection is slow.' } };
export const Danger: Story = { args: { tone: 'danger', message: 'The asset could not be moved.' } };
export const Action: Story = { args: { message: 'Asset moved to Crosses', withAction: true }, play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { message: 'Quarterly summary of expenditure by department and cost centre for every regional office was moved to the archive folder of the finance committee.', withAction: true } };
export const Rtl: Story = { decorators: [rtl], args: { tone: 'success' } };
