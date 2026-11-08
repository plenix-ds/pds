// States: default, hover, focus, filled (value), disabled, read-only, invalid (error), warning. Not applicable: loading, selected. Textarea and Select are shown below the Input.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Input, Textarea, Select } from '../../../platform/components/Input/Input.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Input', component: Input, tags: ['autodocs'], args: { 'aria-label': 'Name', placeholder: 'Name' } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('input') as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithValue: Story = { args: { defaultValue: 'Maya Chen' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Maya Chen' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Maya Chen' } };
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Maya' } };
export const Warning: Story = { args: { warning: true, defaultValue: 'Maya' } };
export const Filled: Story = { args: { appearance: 'filled', defaultValue: 'Maya Chen' } };
export const Data: Story = { args: { data: true, defaultValue: 'CASE-2026-0147' } };
export const Multiline: Story = { render: () => <Textarea aria-label="Notes" rows={4} defaultValue="A few notes about the hearing." /> };
export const Choice: Story = { render: () => <Select aria-label="Format" options={[{ value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' }]} /> };
export const LongText: Story = { args: { defaultValue: 'A very long value that does not fit the width of the field and so scrolls inside it instead of wrapping onto a second line' } };
export const Rtl: Story = { decorators: [rtl], args: { defaultValue: 'Maya Chen' } };
