// States: list view, gallery view, sizes, row heights, edit mode, with reset. Hover, focus and active are on the trigger and menu items: focus is reached by play. Not applicable: disabled, loading, error, selected is the chosen option.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ViewMenu } from '../../../platform/patterns/ViewMenu/ViewMenu.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/ViewMenu', component: ViewMenu, tags: ['autodocs'], args: { value: { layout: 'list', size: 'm', height: 'short' }, onChange: () => {} } } satisfies Meta<typeof ViewMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const Gallery: Story = { args: { gallery: true, value: { layout: 'gallery', size: 'l', height: 'short' } } };
export const Tall: Story = { args: { value: { layout: 'list', size: 'm', height: 'extra-tall' } } };
export const EditModes: Story = { args: { editModes: ['inline', 'form'], value: { layout: 'list', size: 'm', height: 'short', editMode: 'form' } } };
export const WithReset: Story = { args: { onReset: () => {} } };
export const Rtl: Story = { decorators: [rtl] };
