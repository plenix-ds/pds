// States: default, focus, selected, invalid (error), disabled. Hover and active are the open list's rows. Not applicable: loading, warning is Combobox's.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CountrySelect } from '../../../platform/components/CountrySelect/CountrySelect.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/CountrySelect', component: CountrySelect, tags: ['autodocs'], args: { 'aria-label': 'Country', value: null, onChange: () => {} } } satisfies Meta<typeof CountrySelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Selected: Story = { args: { value: 'DE' } };
export const Flags: Story = { args: { value: 'DE', flags: true } };
export const Only: Story = { args: { only: ['US', 'CA', 'MX'], priority: ['US'] } };
export const Language: Story = { args: { type: 'language', value: 'de', 'aria-label': 'Language' } };
export const Locale: Story = { args: { type: 'locale', value: 'de-DE', 'aria-label': 'Format' } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true, value: 'DE' } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'DE' } };
