// States: closed (default), cut-out (open), beacon, contained in a region. Not applicable: hover, focus (it is not focusable; Escape dismisses), active, disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spotlight } from '../../../platform/components/Spotlight/Spotlight.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const Demo = (props: { open?: boolean; variant?: 'cutout' | 'beacon' }) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  return <div className="plx-u-relative"><Button ref={ref} icon="filter">Filters</Button><Spotlight target={ref} open={props.open} variant={props.variant} contained onDismiss={() => {}} /></div>;
};
const meta = { title: 'Components/Spotlight', component: Demo, tags: ['autodocs'], args: { open: true } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { open: false } };
export const Cutout: Story = {};
export const Beacon: Story = { args: { variant: 'beacon' } };
export const Rtl: Story = { decorators: [rtl] };
