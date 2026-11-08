// States: default, with name and location, formats, name empty (error). Hover, focus and active are on the fields and buttons: focus is reached by play. Not applicable: disabled, loading (saving), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SaveAs } from '../../../platform/patterns/SaveAs/SaveAs.tsx';
import { rtl } from './rtl.tsx';

const locations = [{ id: 'root', label: 'Library', children: [{ id: 'brand', label: 'Brand kit' }, { id: 'plans', label: 'Floor plans' }] }];
const meta = { title: 'Patterns/SaveAs', component: SaveAs, tags: ['autodocs'], args: { locations, initialLocation: 'root', initialName: 'Letterhead copy', onSave: () => {}, onCancel: () => {} } } satisfies Meta<typeof SaveAs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Formats: Story = { args: { formats: [{ value: 'pdf', label: 'PDF' }, { value: 'docx', label: 'Word' }], initialFormat: 'pdf' } };
export const Empty: Story = { args: { initialName: '' } };
export const Location: Story = { args: { initialLocation: 'brand' } };
export const LongText: Story = { args: { initialName: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026 copy' } };
export const Rtl: Story = { decorators: [rtl] };
