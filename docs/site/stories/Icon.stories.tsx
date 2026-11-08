// States: default, sizes, filled, labeled (carries meaning), status icons. Not applicable: hover, focus, active, disabled, loading, error, selected (a graphic).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, StatusIcon } from '../../../platform/components/Icon/Icon.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Icon', component: Icon, tags: ['autodocs'], args: { name: 'folder' } } satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const ExtraLarge: Story = { args: { size: 'xl' } };
export const Filled: Story = { args: { name: 'bookmark', filled: true } };
export const Labeled: Story = { args: { name: 'bookmark', label: 'Bookmarked' } };
export const Status: Story = { render: () => <StatusIcon tone="success" size="sm">Synced</StatusIcon> };
export const StatusWarning: Story = { render: () => <StatusIcon tone="warning" /> };
export const Direction: Story = { args: { name: 'arrow-forward' } };
export const Rtl: Story = { decorators: [rtl], args: { name: 'arrow-forward' } };
