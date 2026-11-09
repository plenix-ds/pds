// States: default (columns), tiles variant (the read-only look), headings at levels, status as a Badge. Not applicable: hover, focus, active, disabled, loading, error, selected (read-only details).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropertyGroup } from '../../../platform/patterns/PropertyGroup/PropertyGroup.tsx';
import { PropertyList } from '../../../platform/patterns/PropertyList/PropertyList.tsx';
import { rtl } from './rtl.tsx';

const list = (<PropertyList><PropertyList.Item label="Email">sara@example.org</PropertyList.Item><PropertyList.Item label="Phone" data>+1 555 0100</PropertyList.Item><PropertyList.Item label="Status" status={{ label: 'Active', tone: 'success', icon: 'check' }} /></PropertyList>);
const meta = { title: 'Patterns/PropertyGroup', component: PropertyGroup, tags: ['autodocs'], args: { heading: 'Contact', children: list } } satisfies Meta<typeof PropertyGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Tiles: Story = { args: { variant: 'tiles' } };
export const Level2: Story = { args: { level: 2 } };
export const LongText: Story = { args: { variant: 'tiles', heading: 'A group with a very long heading that does not fit the width of the section and so wraps', children: <PropertyList><PropertyList.Item label="A label that is very long too and wraps">A value that runs on well past the width of its tile and so wraps onto several lines below its label.</PropertyList.Item></PropertyList> } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'tiles' } };
