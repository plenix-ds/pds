// States: mapping (default), review, results, a missing required mapping, loading (a pending import), error (a failed import keeps the map), closed. Not applicable: hover and focus beyond its controls, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImportWizard } from '../../../platform/patterns/ImportWizard/ImportWizard.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ id: 'name', label: 'Name', required: true }, { id: 'email', label: 'Email' }];
const read = async () => ({ columns: [{ id: 'a', label: 'Full name' }, { id: 'b', label: 'Mail' }], rows: [{ a: 'Maya Chen', b: 'maya@example.com' }, { a: 'Alex Kim', b: 'alex@example.com' }] });
const meta = { title: 'Patterns/ImportWizard', component: ImportWizard, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, fields, onRead: read, onImport: () => {}, onClose: () => {} } } satisfies Meta<typeof ImportWizard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { onRead: () => new Promise(() => {}) } };
export const ReadError: Story = { args: { onRead: () => Promise.reject(new globalThis.Error('failed')) } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { fields: [{ id: 'name', label: 'A target field with a very long name that does not fit the width of the mapping row', required: true }] } };
export const Rtl: Story = { decorators: [rtl] };
