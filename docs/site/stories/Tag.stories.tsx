// States: default, category, removable (hover/focus by play), renamable, chip selected, tag list. Not applicable: disabled, loading, error (a state of the field that holds tags: TagInput).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Tag, Chip, TagList } from '../../../platform/components/Tag/Tag.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Tag', component: Tag, tags: ['autodocs'], args: { children: 'sky' } } satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Category: Story = { args: { category: 'teal', children: 'Client' } };
export const Removable: Story = { args: { onRemove: () => {} } };
export const Focus: Story = { args: { onRemove: () => {} }, play: async () => { await userEvent.tab(); } };
export const Renamable: Story = { args: { onRename: () => {} } };
export const ChipOff: Story = { render: () => <Chip onClick={() => {}}>Favorites</Chip> };
export const ChipSelected: Story = { render: () => <Chip selected onClick={() => {}}>Favorites</Chip> };
export const List: Story = { render: () => <TagList label="Keywords"><Tag onRemove={() => {}}>sky</Tag><Tag category="teal">Client</Tag></TagList> };
export const LongText: Story = { args: { children: 'Quarterly summary of expenditure by department and cost centre for every regional office', onRemove: () => {} }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Rtl: Story = { decorators: [rtl], args: { onRemove: () => {} } };
