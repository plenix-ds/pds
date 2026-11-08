// States: default, with a prefix, a suffix, an icon and a joined button, focus (one focus state for the group), disabled, invalid. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { InputGroup } from '../../../platform/components/InputGroup/InputGroup.tsx';
import { Input } from '../../../platform/components/Input/Input.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/InputGroup', component: InputGroup, tags: ['autodocs'], args: { prefix: 'https://', children: <Input aria-label="Website" placeholder="example.org" /> } } satisfies Meta<typeof InputGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Suffix: Story = { args: { prefix: undefined, suffix: 'kg', width: 'sm', children: <Input aria-label="Weight" inputMode="decimal" /> } };
export const Search: Story = { args: { prefix: undefined, icon: 'search', end: <Button>Search</Button>, children: <Input aria-label="Search assets" /> } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Disabled: Story = { args: { children: <Input aria-label="Website" disabled defaultValue="example.org" /> } };
export const Invalid: Story = { args: { children: <Input aria-label="Website" invalid defaultValue="example" /> } };
export const LongText: Story = { args: { prefix: 'https://www.a-very-long-organization-name.example.org/', children: <Input aria-label="Path" defaultValue="cases/2026/quarterly-review/attachments/final-version" /> } };
export const Rtl: Story = { decorators: [rtl] };
