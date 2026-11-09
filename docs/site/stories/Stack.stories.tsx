// States: stack (column), inline (row), gaps, alignment, wrap, center. Not applicable: hover, focus, active, disabled, loading, error, selected (a layout).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Center } from '../../../platform/components/Stack/Stack.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const boxes = ['One', 'Two', 'Three'].map((t) => <Button key={t}>{t}</Button>);
const meta = { title: 'Components/Stack', component: Stack, tags: ['autodocs'], args: { children: boxes } } satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { gap: 'lg' } };
export const Equal: Story = { args: { equal: true } };
export const AlignEnd: Story = { args: { align: 'end' } };
export const Row: Story = { render: () => <Inline gap="sm" justify="between">{boxes}</Inline> };
export const Wrap: Story = { render: () => <div className="plx-u-max-w-600px"><Inline wrap>{Array.from({ length: 12 }, (_, i) => <Button key={i}>Action {i + 1}</Button>)}</Inline></div> };
export const Centered: Story = { render: () => <Center maxWidth="sm" text><p>A short block centered at a readable width.</p></Center> };
export const LongText: Story = { args: { children: [<p key="a">A paragraph with a long run of words that wraps inside the stack rather than overflowing it, however narrow the stack is made.</p>, <p key="b">Another one.</p>] } };
export const Rtl: Story = { decorators: [rtl], render: () => <Inline gap="sm">{boxes}</Inline> };
