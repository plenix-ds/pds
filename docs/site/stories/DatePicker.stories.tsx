// States: default, hover, focus, open (the calendar), with a value, range, date and time, invalid (error), disabled, read-only. Not applicable: loading, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DatePicker } from '../../../platform/components/DatePicker/DatePicker.tsx';
import { Field } from '../../../platform/components/Field/Field.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/DatePicker', component: DatePicker, tags: ['autodocs'], decorators: [(Story) => <Field label="Due date"><Story /></Field>] } satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithValue: Story = { args: { defaultValue: '2026-10-07' } };
export const Range: Story = { args: { mode: 'range', defaultValue: { start: '2026-10-07', end: '2026-10-14' }, presets: true } };
export const DateTime: Story = { args: { mode: 'date-time', defaultValue: '2026-10-07T09:30' } };
export const Invalid: Story = { args: { invalid: true, defaultValue: '2026-10-07' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '2026-10-07' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: '2026-10-07' } };
export const Rtl: Story = { decorators: [rtl], args: { defaultValue: '2026-10-07' } };
