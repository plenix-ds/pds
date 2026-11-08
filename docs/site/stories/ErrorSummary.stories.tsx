// States: default (error), single error, with a title. Focus: the summary takes focus when it appears (autoFocus); its links are reached by play. Not applicable: hover, active, disabled, loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ErrorSummary } from '../../../platform/components/ErrorSummary/ErrorSummary.tsx';
import { rtl } from './rtl.tsx';

const errors = [{ target: 'asset-name', message: 'Enter a name' }, { target: 'asset-owner', message: 'Choose an owner' }];
const meta = { title: 'Components/ErrorSummary', component: ErrorSummary, tags: ['autodocs'], args: { errors, autoFocus: false } } satisfies Meta<typeof ErrorSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Single: Story = { args: { errors: errors.slice(0, 1) } };
export const WithTitle: Story = { args: { title: 'The asset was not saved', headingLevel: 3 } };
export const Empty: Story = { args: { errors: [] } };
export const LongText: Story = { args: { errors: [{ target: 'a', message: 'Enter a name for the asset that is no longer than one hundred characters and does not use slashes' }, { target: 'b', message: 'Choose an owner from the list of people who have access to this workspace' }] } };
export const Rtl: Story = { decorators: [rtl] };
