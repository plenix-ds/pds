// States: default (the first section current), hover and focus on a link, selected (a controlled current section). Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Anchor } from '../../../platform/components/Anchor/Anchor.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'intro', label: 'Introduction' }, { id: 'rights', label: 'Usage rights', children: [{ id: 'licenses', label: 'Licenses' }, { id: 'credits', label: 'Credits' }] }, { id: 'contact', label: 'Contact' }];
const meta = { title: 'Components/Anchor', component: Anchor, tags: ['autodocs'], args: { items } } satisfies Meta<typeof Anchor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { value: 'licenses' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { items: [{ id: 'a', label: 'Usage rights for every photograph, illustration and diagram published in this guide' }, { id: 'b', label: 'Contact' }] } };
export const Rtl: Story = { decorators: [rtl] };
