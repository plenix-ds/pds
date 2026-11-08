// States: columns, slider, text, same version on both sides. Hover, focus and active are on the selects and the slider: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { VersionCompare } from '../../../platform/patterns/VersionCompare/VersionCompare.tsx';
import { rtl } from './rtl.tsx';

const src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="gray"/></svg>';
const versions = [
  { id: 'v2', label: 'Version 2', date: '2026-10-02', author: 'Maya Chen', image: { src, alt: 'Easter banner, version 2' }, values: { size: '2.4 MB' }, text: 'The banner says Happy Easter.\nSee you at the vigil.' },
  { id: 'v3', label: 'Version 3', date: '2026-10-09', author: 'Alex Kim', image: { src, alt: 'Easter banner, version 3' }, values: { size: '3.1 MB' }, text: 'The banner says Happy Easter to all.\nSee you at the vigil.' },
];
const meta = { title: 'Patterns/VersionCompare', component: VersionCompare, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { label: 'Compare versions of Easter banner', versions, attributes: [{ key: 'size', label: 'Size', kind: 'data' as const }], defaultBase: 'v2', defaultTarget: 'v3' } } satisfies Meta<typeof VersionCompare>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Slider: Story = { args: { defaultMode: 'slider' } };
export const Text: Story = { args: { defaultMode: 'text' } };
export const SameVersion: Story = { args: { defaultTarget: 'v2' } };
export const Wide: Story = { args: { ratio: '21-9' as never } };
export const LongText: Story = { args: { versions: versions.map((v) => ({ ...v, label: 'Version of the quarterly summary of expenditure by department', author: 'Marina Abdel-Malik Haddad-Williams' })) } };
export const Rtl: Story = { decorators: [rtl] };
