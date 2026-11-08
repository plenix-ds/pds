// States: default (mixed), queued, progress (loading), ready, failed (Retry; error), empty, a pending action. Not applicable: hover and focus beyond its buttons, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DownloadManager } from '../../../platform/patterns/DownloadManager/DownloadManager.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 1, file: 'report.pdf', status: 'ready' as const, href: '/files/report.pdf' }, { id: 2, file: 'photos.zip', status: 'progress' as const, progress: 40 }, { id: 3, file: 'export.csv', status: 'queued' as const }, { id: 4, file: 'backup.tar', status: 'failed' as const, error: 'The connection was lost.' }];
const meta = { title: 'Patterns/DownloadManager', component: DownloadManager, tags: ['autodocs'], args: { items, onCancel: () => {}, onRetry: () => {}, onDownload: () => {} } } satisfies Meta<typeof DownloadManager>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Progress: Story = { args: { items: [items[1]], variant: 'progress' } };
export const Ready: Story = { args: { items: [items[0]], variant: 'ready' } };
export const Failed: Story = { args: { items: [items[3]] } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 1, file: 'quarterly-report-for-every-team-in-every-workspace-final-version-with-all-appendices.pdf', status: 'progress', progress: 60 }] } };
export const Rtl: Story = { decorators: [rtl] };
