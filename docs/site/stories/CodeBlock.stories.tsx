// States: default, with a title, tall (scrolls), no copy button, copy hover and focus. Not applicable: disabled, loading, error (a failed copy is announced), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CodeBlock } from '../../../platform/components/CodeBlock/CodeBlock.tsx';
import { rtl } from './rtl.tsx';

const code = `export function greet(name: string) {\n  // say hello\n  return 'Hello, ' + name + '!';\n}`;
const meta = { title: 'Components/CodeBlock', component: CodeBlock, tags: ['autodocs'], args: { children: code } } satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Titled: Story = { args: { title: 'platform/utils/greet.ts' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Tall: Story = { args: { maxHeight: 'tall', title: 'greet.ts', children: Array.from({ length: 40 }, (_, i) => `const line${i} = ${i};`).join('\n') } };
export const NoCopy: Story = { args: { copy: false } };
export const Css: Story = { args: { language: 'css', title: 'button.css', children: '.plx-button {\n  color: var(--plx-comp-button-text);\n}' } };
export const LongText: Story = { args: { children: "const message = 'This is a single very long line of code that does not fit the width of the block and so scrolls sideways instead of wrapping onto a second line';" } };
export const Rtl: Story = { decorators: [rtl], args: { title: 'greet.ts' } };
