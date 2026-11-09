// States: default, on an accent surface, truncated. Not applicable: hover, focus, active, disabled, loading, error, selected (inline text, not focusable).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from '../../../platform/components/Code/Code.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Code', component: Code, tags: ['autodocs'], args: { children: 'plx-link--standalone' } } satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OnAccent: Story = { args: { onAccent: true, children: 'Ctrl K' }, };
export const Truncated: Story = { args: { truncate: true, children: 'platform/components/RichText/rich-text-with-a-very-long-file-name-that-does-not-fit-in-the-line.css' }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const LongText: Story = { args: { children: 'platform/components/RichText/rich-text-with-a-very-long-file-name-that-wraps-anywhere-rather-than-overflowing-the-line-it-sits-in-because-code-never-cuts-sideways.css' }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Rtl: Story = { decorators: [rtl] };
