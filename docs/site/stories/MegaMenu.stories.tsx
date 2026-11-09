// States: closed (trigger), open, accordion, with a featured card, current link. Hover and active are the trigger and links; focus is reached by play. Not applicable: disabled, loading, error, selected (current is the selected link).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MegaMenu } from '../../../platform/components/MegaMenu/MegaMenu.tsx';
import { Card } from '../../../platform/components/Card/Card.tsx';
import { rtl } from './rtl.tsx';

const groups = [
  { title: 'Start', links: [{ label: 'Upload files', href: '#upload', description: 'Add files to a project', current: true }, { label: 'Share a link', href: '#share' }] },
  { title: 'Manage', links: [{ label: 'Members', href: '#members' }, { label: 'Billing', href: '#billing' }] },
];
const meta = { title: 'Components/MegaMenu', component: MegaMenu, tags: ['autodocs'], args: { label: 'Guides', groups } } satisfies Meta<typeof MegaMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const Accordion: Story = { args: { layout: 'accordion' }, play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const Featured: Story = { args: { featured: <Card title="What is new" meta="3 guides">Read the latest guides.</Card> }, play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const LongText: Story = { args: { label: 'Guides for every regional office and every team', groups: [{ title: 'Getting started with the shared workspace', links: [{ label: 'Upload files from your computer, phone or shared drive', href: '#u', description: 'Add files to a project and set who can see them, edit them and share them further.' }] }] } };
export const Rtl: Story = { decorators: [rtl] };
