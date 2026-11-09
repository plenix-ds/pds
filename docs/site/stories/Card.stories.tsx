// States: default, selected, collapsed/expanded, open (link or button). Hover, focus and active reach the title link: by play. Not applicable: disabled, loading, error.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Card, Panel, MediaCard } from '../../../platform/components/Card/Card.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Card', component: Card, tags: ['autodocs'],
  args: { title: 'Brand kit', meta: '12 assets', children: 'Logos, colors and templates for the whole team.' } } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Openable: Story = { args: { onOpen: () => {} } };
export const Hover: Story = { args: { onOpen: () => {} }, play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('button')); } };
export const Focus: Story = { args: { onOpen: () => {} }, play: async () => { await userEvent.tab(); } };
export const Selected: Story = { args: { onOpen: () => {}, selected: true } };
export const Expandable: Story = { args: { expandable: true, defaultExpanded: true } };
export const Collapsed: Story = { args: { expandable: true, defaultExpanded: false } };
export const Glow: Story = { args: { surface: 'glow' } };
export const LongText: Story = { args: { title: 'Kitchen renovation: permits, quotes, contractors and the full schedule of works', meta: 'Personal · 12 files · shared with 8 people across 3 teams' } };
export const Rtl: Story = { decorators: [rtl] };

export const PanelDefault: Story = { name: 'Panel', render: () => <Panel title="Storage" description="Space used by your files" actions={<Button size="sm">Manage</Button>} footer="Updated today">42 GB of 100 GB used.</Panel> };
export const PanelCollapsible: Story = { name: 'Panel collapsible', render: () => <Panel title="Storage" collapsible>42 GB of 100 GB used.</Panel> };
export const Media: Story = { name: 'MediaCard', render: () => <MediaCard title="hero.jpg" meta="2.4 MB · JPG" icon="image" /> };
export const MediaSelected: Story = { name: 'MediaCard selected', render: () => <MediaCard title="hero.jpg" meta="2.4 MB · JPG" icon="image" selected onSelectChange={() => {}} selectLabel="Select hero.jpg" /> };
