// Loading indicators: Spinner (size, label) and Skeleton (opt-in only, D-0130). Not applicable: hover, focus, active, disabled, error, selected (status indicators).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner, Skeleton } from '../../../platform/components/Loading/Loading.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Loading', component: Spinner, tags: ['autodocs'], args: { label: 'Saving' } } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const SkeletonBlock: Story = { render: () => <Skeleton width="200px" height="16px" /> };
export const LongText: Story = { args: { label: 'Saving all of the changes made to every document in the workspace' } };
export const Rtl: Story = { decorators: [rtl] };
