// States: default (header, main, footer), with a side navigation, with an inspector panel, dashboard and settings pages, narrow. Not applicable: hover, focus beyond its parts, disabled, loading, error, selected (a page frame).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell, PageContent } from '../../../platform/patterns/AppShell/AppShell.tsx';
import { AppHeader } from '../../../platform/patterns/AppHeader/AppHeader.tsx';
import { rtl } from './rtl.tsx';

const header = <AppHeader tone="plain" appName="Assets" />;
const meta = { title: 'Patterns/AppShell', component: AppShell, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { header, children: <PageContent><p>The page content.</p></PageContent> } } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SideNav: Story = { args: { sideNav: <nav aria-label="Sections"><p>Navigation</p></nav> } };
export const Inspector: Story = { args: { panel: <aside aria-label="Details"><p>Inspector</p></aside> } };
export const Footer: Story = { args: { footer: <footer><p>Status</p></footer> } };
export const Dashboard: Story = { args: { page: 'dashboard' } };
export const Settings: Story = { args: { page: 'settings' } };
export const LongText: Story = { args: { children: <PageContent><p>{'A long page of content that fills the main region and wraps within it. '.repeat(20)}</p></PageContent> } };
export const Rtl: Story = { decorators: [rtl], args: { sideNav: <nav aria-label="Sections"><p>Navigation</p></nav> } };
