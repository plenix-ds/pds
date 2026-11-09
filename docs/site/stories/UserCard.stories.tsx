// States: default, compact, with details, with actions, link (hover/focus by play), presence. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { UserCard } from '../../../platform/patterns/UserCard/UserCard.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/UserCard', component: UserCard, tags: ['autodocs'], args: { name: 'Maya Chen', secondary: 'Designer · Brand team', presence: 'online' } } satisfies Meta<typeof UserCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Details: Story = { args: { details: [{ icon: 'mail', label: 'maya.chen@example.org' }, { icon: 'phone', label: '+1 415 555 0134', data: true }] } };
export const Actions: Story = { args: { role: 'Owner', actions: <><Button variant="secondary" icon="message">Message</Button><Button variant="ghost" icon="phone">Call</Button></> } };
export const Link: Story = { args: { href: '#/contacts/12' } };
export const Hover: Story = { args: { href: '#/contacts/12' }, play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('link')); } };
export const Focus: Story = { args: { href: '#/contacts/12', actions: <Button variant="ghost">Follow</Button> }, play: async () => { await userEvent.tab(); } };
export const Compact: Story = { args: { variant: 'compact', secondary: 'alex.kim@example.org', actions: <Button variant="ghost">Follow</Button> } };
export const Away: Story = { args: { presence: 'away' } };
export const LongText: Story = { args: { name: 'Marina Abdel-Malik Haddad-Williams', secondary: 'Regional director for the northern and eastern provinces', role: 'Owner', details: [{ icon: 'mail', label: 'marina.abdel-malik.haddad-williams@regional-office.example.org' }] } };
export const Rtl: Story = { decorators: [rtl] };
