// States: default (empty), error, warning, success, system kinds (offline, not found, permission denied), page size. Not applicable: hover, focus beyond its action, disabled, loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from '../../../platform/components/EmptyState/EmptyState.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/EmptyState', component: EmptyState, tags: ['autodocs'], args: { icon: 'folder', title: 'No assets yet', children: 'Upload a file to start your library.' } } satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Page: Story = { args: { size: 'page', action: <Button variant="primary">Upload</Button> } };
export const Error: Story = { args: { tone: 'error', title: 'The assets could not load', children: undefined, action: <Button icon="refresh">Retry</Button> } };
export const Warning: Story = { args: { tone: 'warning', title: 'Storage is almost full' } };
export const Success: Story = { args: { tone: 'success', title: 'Everything is reviewed', children: undefined } };
export const Offline: Story = { args: { kind: 'offline', icon: undefined, title: undefined, children: undefined, action: <Button icon="refresh">Try again</Button> } };
export const NotFound: Story = { args: { kind: 'not-found', icon: undefined, title: undefined, children: undefined } };
export const PermissionDenied: Story = { args: { kind: 'permission-denied', icon: undefined, title: 'You can’t open this project', children: 'Ask its owner to share it with you.' } };
export const LongText: Story = { args: { title: 'There are no assets in this collection yet, and none in any collection that shares its permissions', children: 'Upload a file, drag one in from another collection, or ask a teammate who has access to share one with you.' } };
export const Rtl: Story = { decorators: [rtl], args: { size: 'page', action: <Button variant="primary">Upload</Button> } };
