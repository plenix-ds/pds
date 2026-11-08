// States: each drawing of the set, sizes, on the accent, labeled. Not applicable: hover, focus, active, disabled, loading, error, selected (decorative).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Illustration } from '../../../platform/components/Illustration/Illustration.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Illustration', component: Illustration, tags: ['autodocs'], args: { name: 'empty-folder' } } satisfies Meta<typeof Illustration>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoResults: Story = { args: { name: 'no-results' } };
export const Offline: Story = { args: { name: 'offline', size: 'lg' } };
export const Error: Story = { args: { name: 'error' } };
export const Small: Story = { args: { size: 'sm' } };
export const OnAccent: Story = { args: { name: 'get-started', tone: 'on-accent' } };
export const Labeled: Story = { args: { label: 'An empty folder' } };
export const Rtl: Story = { decorators: [rtl] };
