// States: default, hover, focus, active, loading (progress, known and unknown), disabled, icon only. Not applicable: error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { DownloadButton } from '../../../platform/components/DownloadButton/DownloadButton.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/DownloadButton', component: DownloadButton, tags: ['autodocs'], args: { href: '/files/cross-014.png', fileName: 'cross-014.png' } } satisfies Meta<typeof DownloadButton>;
export default meta;
type Story = StoryObj<typeof meta>;
const control = (c: HTMLElement) => within(c).getByRole('link');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(control(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Active: Story = { play: async ({ canvasElement }) => { const b = control(canvasElement); await userEvent.hover(b); b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } };
export const WithDetails: Story = { args: { format: 'ZIP', size: 48200000, children: 'Download original', fileName: 'brand-kit.zip' } };
export const Progress: Story = { args: { href: undefined, onDownload: () => {}, progress: 40, fileName: 'export.csv' } };
export const UnknownProgress: Story = { args: { href: undefined, onDownload: () => {}, progress: true, fileName: 'export.csv' } };
export const Disabled: Story = { args: { href: undefined, onDownload: () => {}, disabled: true } };
export const IconOnly: Story = { args: { iconOnly: true } };
export const LongText: Story = { args: { fileName: 'quarterly-report-for-every-team-in-every-workspace-final-version-2.pdf', format: 'PDF', size: 4200000 } };
export const Rtl: Story = { decorators: [rtl], args: { format: 'PNG', size: 42000 } };
