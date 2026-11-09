// States: each tone (info, success, warning, danger as the error), with a title, with actions, dismissible (hover and focus on its button). Not applicable: disabled, loading, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Notice } from '../../../platform/components/Notice/Notice.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Notice', component: Notice, tags: ['autodocs'], args: { children: 'This folder is shared with 3 people.' } } satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { tone: 'success', children: 'Your changes are saved.' } };
export const Warning: Story = { args: { tone: 'warning' } };
export const Error: Story = { args: { tone: 'danger', title: 'The export failed', children: 'The server did not answer.', actions: <Button size="xs">Try again</Button> } };
export const Dismissible: Story = { args: { onDismiss: () => {} } };
export const Focus: Story = { args: { onDismiss: () => {} }, play: async () => { await userEvent.tab(); } };
export const WithTitle: Story = { args: { title: 'Heads up' } };
export const LongText: Story = { args: { title: 'This folder is shared with every member of three teams', children: 'Anyone with access to these teams can open, copy and download everything in it, in every workspace you manage, until you change the setting on the folder itself.', onDismiss: () => {} } };
export const Rtl: Story = { decorators: [rtl], args: { title: 'Heads up', onDismiss: () => {} } };
