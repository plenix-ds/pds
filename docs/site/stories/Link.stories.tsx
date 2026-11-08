// States: default, hover, focus, visited, standalone, subtle, external, back. Not applicable: disabled (a link goes somewhere), loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Link } from '../../../platform/components/Link/Link.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Link', component: Link, tags: ['autodocs'], args: { href: '#/guides/upload', children: 'upload guide' } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('link')); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Visited: Story = { args: { visited: true } };
export const Standalone: Story = { args: { variant: 'standalone', children: 'View all projects' } };
export const Subtle: Story = { args: { variant: 'subtle', children: 'Terms' } };
export const External: Story = { args: { external: true, href: 'https://example.org', children: 'Material guidelines' } };
export const Back: Story = { args: { back: true, children: 'Projects' } };
export const LongText: Story = { args: { variant: 'standalone', children: 'View every project assigned to the regional offices of the northern and eastern provinces' } };
export const Rtl: Story = { decorators: [rtl], args: { back: true, children: 'Projects' } };
