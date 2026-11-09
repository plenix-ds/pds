// States: list, restore, preview, current version, empty. Hover, focus and active are on the version buttons: focus is reached by play. Not applicable: disabled, loading (restoring), error (a rejection shows the failure), selected is the current version.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { VersionHistory } from '../../../platform/patterns/VersionHistory/VersionHistory.tsx';
import { rtl } from './rtl.tsx';

const versions = [
  { id: 'v3', version: '3', date: 'Oct 9, 2026', dateTime: '2026-10-09', author: 'Alex Kim', description: 'Changed the headline.' },
  { id: 'v2', version: '2', date: 'Oct 2, 2026', dateTime: '2026-10-02', author: 'Maya Chen', description: 'First review.' },
  { id: 'v1', version: '1', date: 'Sep 28, 2026', dateTime: '2026-09-28', author: 'Maya Chen' },
];
const meta = { title: 'Patterns/VersionHistory', component: VersionHistory, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { versions, currentId: 'v3', onPreview: () => {}, onRestore: () => {} } } satisfies Meta<typeof VersionHistory>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Restore: Story = { args: { variant: 'restore', currentId: 'v2' } };
export const Preview: Story = { args: { variant: 'preview', versions: versions.map((v) => ({ ...v, preview: <p>Preview of version {v.version}</p> })) } };
export const Empty: Story = { args: { versions: [] } };
export const LongText: Story = { args: { versions: [{ ...versions[0], description: 'Changed the headline, the subtitle and the image of the banner for the vigil, and moved the date to the second line for every regional office.', author: 'Marina Abdel-Malik Haddad-Williams' }] } };
export const Rtl: Story = { decorators: [rtl] };
