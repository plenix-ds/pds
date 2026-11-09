// States: default, pressed tool, disabled tool, with labels. Hover, focus and active are on the tools: focus is reached by play (one Tab stop; arrows move). Not applicable: loading, error, selected is pressed.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ToolRail } from '../../../platform/patterns/ToolRail/ToolRail.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/ToolRail', component: ToolRail, tags: ['autodocs'],
  args: { label: 'Tools', children: [<ToolRail.Item key="a" icon="ed-crop" label="Crop" pressed onClick={() => {}} />, <ToolRail.Item key="b" icon="ed-rotate" label="Rotate" onClick={() => {}} />, <ToolRail.Divider key="d" />, <ToolRail.Item key="c" icon="ed-text" label="Text" disabled />] } } satisfies Meta<typeof ToolRail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Arrow: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{ArrowDown}'); } };
export const Labels: Story = { args: { showLabels: true } };
export const LongText: Story = { args: { showLabels: true, children: [<ToolRail.Item key="a" icon="ed-crop" label="Crop the picture to the shape of the frame" onClick={() => {}} />] } };
export const Rtl: Story = { decorators: [rtl] };
