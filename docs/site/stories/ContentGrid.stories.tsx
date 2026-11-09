// States: grid (default), sizes, masonry, justified, virtualized, empty. Not applicable: hover, focus beyond its cards, active, disabled, loading, error, selected (a layout).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContentGrid } from '../../../platform/patterns/ContentGrid/ContentGrid.tsx';
import { Card } from '../../../platform/components/Card/Card.tsx';
import { rtl } from './rtl.tsx';

const cards = Array.from({ length: 8 }, (_, i) => <Card key={i}>Asset {i + 1}</Card>);
const meta = { title: 'Patterns/ContentGrid', component: ContentGrid, tags: ['autodocs'], args: { label: 'Assets', children: cards } } satisfies Meta<typeof ContentGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'xs' } };
export const Large: Story = { args: { size: 'lg' } };
export const Masonry: Story = { args: { layout: 'masonry', size: 'sm', children: cards.map((c, i) => <div key={i} className={i % 2 ? 'plx-u-max-w-600px' : undefined}>{c}</div>) } };
export const Empty: Story = { args: { children: undefined } };
export const LongText: Story = { args: { children: [<Card key="a">An asset with a very long name that does not fit the width of its card and so wraps onto several lines</Card>, <Card key="b">Short</Card>] } };
export const Rtl: Story = { decorators: [rtl] };
