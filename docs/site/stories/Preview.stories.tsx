// States: default, button (hover/focus by play), fit cover/contain, corner slots. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Preview } from '../../../platform/components/Preview/Preview.tsx';
import { Tag } from '../../../platform/components/Tag/Tag.tsx';
import { rtl } from './rtl.tsx';

const img = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="gray"/></svg>';
const meta = { title: 'Components/Preview', component: Preview, tags: ['autodocs'],
  args: { ratio: '16-9', children: <img className="plx-preview__media" src={img} alt="A gray placeholder" /> } } satisfies Meta<typeof Preview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Cover: Story = { args: { fit: 'cover' } };
export const Contain: Story = { args: { fit: 'contain', ratio: '1-1' } };
export const Portrait: Story = { args: { ratio: '3-4' } };
export const Slots: Story = { args: { topStart: <Tag>PNG</Tag>, bottomEnd: <Tag>2.4 MB</Tag> } };
export const Button: Story = { args: { as: 'button', topStart: <Tag>PNG</Tag>, onClick: () => {} } };
export const Focus: Story = { args: { as: 'button', onClick: () => {} }, play: async () => { await userEvent.tab(); } };
export const Rtl: Story = { decorators: [rtl], args: { topStart: <Tag>PNG</Tag> } };
