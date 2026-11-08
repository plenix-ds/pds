// States: default, pull. Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Blockquote } from '../../../platform/components/Blockquote/Blockquote.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Blockquote', component: Blockquote, tags: ['autodocs'],
  args: { citation: 'Ana Ruiz, project lead', children: 'Every room gets its own folder before the first upload.' } } satisfies Meta<typeof Blockquote>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Pull: Story = { args: { variant: 'pull', children: 'The archive is the product.' } };
export const NoCitation: Story = { args: { citation: undefined } };
export const LongText: Story = { args: { children: 'Every room gets its own folder before the first upload, and every folder keeps its own history, its own members and its own rules for who may change what, so nothing is shared by accident.' } };
export const Rtl: Story = { decorators: [rtl] };
