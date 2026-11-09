// States: default (navigation beside sections), a collapsible section (closed and open), rows with controls, with actions. Not applicable: hover and focus beyond its controls, disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsLayout, SettingsSection, SettingsRow } from '../../../platform/patterns/SettingsLayout/SettingsLayout.tsx';
import { NavList } from '../../../platform/components/NavList/NavList.tsx';
import { Switch } from '../../../platform/components/Checkbox/Checkbox.tsx';
import { Select } from '../../../platform/components/Input/Input.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const nav = <NavList label="Settings" value="regional" onSelect={() => {}} items={[{ id: 'regional', label: 'Regional' }, { id: 'notifications', label: 'Notifications' }]} />;
const sections = (<>
  <SettingsSection title="Regional" description="Language and formats."><SettingsRow label="Date format" description="How dates are written."><Select aria-label="Date format" options={[{ value: 'iso', label: '2026-10-05' }, { value: 'us', label: '10/05/2026' }]} /></SettingsRow><SettingsRow label="Notifications"><Switch aria-label="Notifications" label="On" /></SettingsRow></SettingsSection>
  <SettingsSection title="Advanced" collapsible defaultExpanded={false}><SettingsRow label="Debug mode"><Switch aria-label="Debug mode" label="Off" /></SettingsRow></SettingsSection>
</>);
const meta = { title: 'Patterns/SettingsLayout', component: SettingsLayout, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { nav, children: sections } } satisfies Meta<typeof SettingsLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expanded: Story = { args: { children: <SettingsSection title="Advanced" collapsible defaultExpanded><SettingsRow label="Debug mode"><Switch aria-label="Debug mode" label="Off" /></SettingsRow></SettingsSection> } };
export const WithActions: Story = { args: { children: <SettingsSection title="Regional" actions={<><Button>Cancel</Button><Button variant="primary">Save</Button></>}><SettingsRow label="Date format"><Select aria-label="Date format" options={[{ value: 'iso', label: '2026-10-05' }]} /></SettingsRow></SettingsSection> } };
export const LongText: Story = { args: { children: <SettingsSection title="A section with a very long title that does not fit the width of the page and so wraps" description="And a description that runs on well past the width of the section."><SettingsRow label="A setting with a very long label that wraps onto several lines" description="And a description that is long too, so it wraps beside the control."><Switch aria-label="Setting" label="On" /></SettingsRow></SettingsSection> } };
export const Rtl: Story = { decorators: [rtl] };
