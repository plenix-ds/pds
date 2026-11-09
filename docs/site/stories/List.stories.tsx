// States: icons, ordered, steps, bullets, nested, tones. Not applicable: hover, focus, active, disabled, loading, error, selected (a list of text).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { List } from '../../../platform/components/List/List.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/List', component: List, tags: ['autodocs'],
  args: { items: [{ icon: 'circle-check', tone: 'success', children: 'Use it for a short list of results.' }, { icon: 'close', tone: 'danger', children: 'Avoid it for long paragraphs.' }] } } satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Ordered: Story = { args: { ordered: true, items: [{ children: 'Create the project' }, { children: 'Upload the files', items: [{ children: 'Photos' }], ordered: 'alpha' }] } };
export const Steps: Story = { args: { ordered: true, variant: 'steps', items: [{ children: 'Choose the files' }, { children: 'Add the details' }] } };
export const Bullets: Story = { args: { variant: 'bullets', items: [{ children: 'Presence: online, away, busy, offline.' }, { children: 'Workflow: done, in progress.' }] } };
export const WithChildren: Story = { args: { items: undefined, children: <List.Item icon="close" tone="danger">Avoid this.</List.Item> } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { variant: 'bullets', items: [{ children: 'Presence shows whether a person is online, away, busy or offline, and it updates every few seconds while the page is open on any device.' }] } };
export const Rtl: Story = { decorators: [rtl], args: { ordered: true, variant: 'steps', items: [{ children: 'Choose the files' }, { children: 'Add the details' }] } };
