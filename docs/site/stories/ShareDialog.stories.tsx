// States: people tab (default), link tab, restricted and view link access, dirty (close asks first), loading (a pending save), error (a failed save keeps the draft), no web share. Not applicable: hover and focus beyond its controls, disabled beyond pending, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { ShareDialog } from '../../../platform/patterns/ShareDialog/ShareDialog.tsx';
import { rtl } from './rtl.tsx';

const people = [{ value: 'maya', label: 'Maya Chen', description: 'maya@example.com' }, { value: 'alex', label: 'Alex Kim', description: 'alex@example.com' }];
const roles = [{ value: 'viewer', label: 'Viewer' }, { value: 'editor', label: 'Editor' }];
const meta = { title: 'Patterns/ShareDialog', component: ShareDialog, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, title: 'Share record', people, roles, grants: [{ person: 'maya', role: 'editor' }], url: 'https://example.org/records/14', onSave: () => {}, onClose: () => {} } } satisfies Meta<typeof ShareDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
const save = async () => { await userEvent.click(within(document.body).getByRole('button', { name: /save/i })); };

export const Default: Story = {};
export const Link: Story = { args: { initialTab: 'link' } };
export const LinkView: Story = { args: { initialTab: 'link', linkAccess: 'view' } };
export const NoGrants: Story = { args: { grants: [] } };
export const NoWebShare: Story = { args: { initialTab: 'link', webShare: false } };
export const Loading: Story = { args: { onSave: () => new Promise(() => {}) }, play: async () => { await save(); } };
export const Error: Story = { args: { onSave: () => Promise.reject(new globalThis.Error('failed')) }, play: async () => { await save(); } };
export const LongText: Story = { args: { title: 'Share the record of the hearing for every case filed this quarter', people: [{ value: 'a', label: 'A person with a very long name that does not fit the width of the row', description: 'a-very-long-address@a-very-long-domain-name.example.org' }], grants: [{ person: 'a', role: 'viewer' }] } };
export const Rtl: Story = { decorators: [rtl] };
