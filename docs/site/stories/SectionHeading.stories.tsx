// States: default, collapsible expanded and collapsed, with icon and actions. Hover, focus and active are on the toggle: focus is reached by play. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SectionHeading } from '../../../platform/components/SectionHeading/SectionHeading.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/SectionHeading', component: SectionHeading, tags: ['autodocs'], args: { level: 2, children: 'Appearance' } } satisfies Meta<typeof SectionHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsible: Story = { args: { collapsible: true, expanded: true, controls: 'recent-body', onToggle: () => {}, children: 'Recent' } };
export const Collapsed: Story = { args: { collapsible: true, expanded: false, controls: 'recent-body', onToggle: () => {}, children: 'Recent' } };
export const Focus: Story = { args: { collapsible: true, controls: 'recent-body', onToggle: () => {} }, play: async () => { await userEvent.tab(); } };
export const WithIcon: Story = { args: { icon: 'user' } };
export const WithActions: Story = { args: { actions: <Button size="sm">Edit</Button> } };
export const LongText: Story = { args: { children: 'Appearance, density and the language of every screen shown to members of the regional office', actions: <Button size="sm">Edit</Button> } };
export const Rtl: Story = { decorators: [rtl], args: { collapsible: true, controls: 'x', onToggle: () => {} } };
