// States: default, focus, with list, multiple, invalid (error), disabled. Hover and active are the native control. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FileInput } from '../../../platform/components/FileInput/FileInput.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/FileInput', component: FileInput, tags: ['autodocs'], args: { label: 'Contract', accept: '.pdf' } } satisfies Meta<typeof FileInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Multiple: Story = { args: { multiple: true, showList: true, label: 'Attachments' } };
export const HiddenSummary: Story = { args: { hideSummary: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Rtl: Story = { decorators: [rtl] };
