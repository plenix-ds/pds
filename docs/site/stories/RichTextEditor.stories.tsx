// States: default, focus, with content, full toolbar, no toolbar, read-only, invalid (error), warning, disabled. Hover and active are the toolbar buttons. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RichTextEditor } from '../../../platform/components/RichTextEditor/RichTextEditor.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/RichTextEditor', component: RichTextEditor, tags: ['autodocs'], args: { label: 'Description', placeholder: 'Describe the change' } } satisfies Meta<typeof RichTextEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithContent: Story = { args: { defaultValue: '<p>The <strong>kitchen</strong> remodel starts in March.</p><ul><li>Order cabinets</li><li>Book the plumber</li></ul>' } };
export const FullToolbar: Story = { args: { toolbar: 'full' } };
export const NoToolbar: Story = { args: { toolbar: false } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: '<p>Locked text.</p>' } };
export const Invalid: Story = { args: { invalid: true } };
export const Warning: Story = { args: { warning: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '<p>Disabled text.</p>' } };
export const LongText: Story = { args: { defaultValue: '<p>The kitchen remodel starts in March and covers the cabinets, the island, the restored window frames and the lighting, with the plumber and the electrician booked for the second week and the inspection planned for the end of the month.</p>' } };
export const Rtl: Story = { decorators: [rtl] };
