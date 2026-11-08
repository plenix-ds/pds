// States: default, hover, focus, with line numbers, read-only, invalid (error), warning, disabled. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CodeEditor } from '../../../platform/components/CodeEditor/CodeEditor.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/CodeEditor', component: CodeEditor, tags: ['autodocs'], args: { label: 'Example', language: 'css', defaultValue: '.plx-card {\n  padding: var(--plx-sys-space-inset-md);\n}' } } satisfies Meta<typeof CodeEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LineNumbers: Story = { args: { lineNumbers: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Warning: Story = { args: { warning: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Tall: Story = { args: { height: 'lg', lineNumbers: true } };
export const LongText: Story = { args: { defaultValue: '.plx-very-long-selector-name-that-does-not-fit-the-width-of-the-editor-and-so-scrolls-sideways .plx-another-long-selector { color: red; }' } };
export const Rtl: Story = { decorators: [rtl], args: { lineNumbers: true } };
