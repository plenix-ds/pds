// States: number, semantic version, latest, draft, small, as a link (hover and focus). Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { VersionLabel } from '../../../platform/components/VersionLabel/VersionLabel.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/VersionLabel', component: VersionLabel, tags: ['autodocs'], args: { version: 12 } } satisfies Meta<typeof VersionLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Semantic: Story = { args: { version: '2.1.0' } };
export const Latest: Story = { args: { version: '2.1.0', status: 'latest' } };
export const Draft: Story = { args: { version: 3, status: 'draft' } };
export const Small: Story = { args: { version: 3, status: 'draft', size: 'sm' } };
export const Link: Story = { args: { href: '#history' } };
export const Focus: Story = { args: { href: '#history' }, play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { version: '2.1.0-beta.17+build.20261019.hotfix.for.the.council.release', status: 'draft' } };
export const Rtl: Story = { decorators: [rtl], args: { status: 'latest' } };
