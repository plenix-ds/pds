// States: empty, with files, chips, limits, disabled. Hover, focus and active are on the add button and the Remove buttons: focus is reached by play. Not applicable: loading, error (a refused file is reported in the picker), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AttachmentPicker } from '../../../platform/patterns/AttachmentPicker/AttachmentPicker.tsx';
import { rtl } from './rtl.tsx';

const files = [new File(['x'], 'Letterhead.pdf', { type: 'application/pdf' }), new File(['y'], 'Quote for the cabinets and the island.pdf', { type: 'application/pdf' })];
const meta = { title: 'Patterns/AttachmentPicker', component: AttachmentPicker, tags: ['autodocs'], args: { value: [], onChange: () => {}, accept: '.pdf' } } satisfies Meta<typeof AttachmentPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithFiles: Story = { args: { value: files } };
export const Chips: Story = { args: { variant: 'chips', value: files } };
export const Limits: Story = { args: { maxFiles: 2, maxSize: 1048576, value: files } };
export const Single: Story = { args: { multiple: false, value: files.slice(0, 1) } };
export const Disabled: Story = { args: { disabled: true, value: files } };
export const Rtl: Story = { decorators: [rtl], args: { value: files } };
