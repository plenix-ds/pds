// States: article (default), compact, from HTML (cleaned), as a landmark section. Not applicable: hover, focus beyond its links, active, disabled, loading, error, selected (static prose).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichText } from '../../../platform/components/RichText/RichText.tsx';
import { rtl } from './rtl.tsx';

const body = (<><h2>Before you upload</h2><p>Name each file the way the <a href="#naming">naming guide</a> says.</p><ul><li>Photos</li><li>Drawings</li></ul><blockquote>Keep names short.</blockquote><p>Use <code>plx-link</code> for links.</p><pre><code>const a = 1;</code></pre></>);
const meta = { title: 'Components/RichText', component: RichText, tags: ['autodocs'], args: { children: body } } satisfies Meta<typeof RichText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { variant: 'compact' } };
export const FromHtml: Story = { args: { children: undefined, html: '<h3>Notes</h3><p>Cleaned <strong>HTML</strong> from an editor.</p><script>alert(1)</script>' } };
export const Landmark: Story = { args: { as: 'section', label: 'Guide' } };
export const LongText: Story = { args: { children: <p>A very long paragraph that runs well past the reading width of the article variant so that it wraps onto many lines and shows how the measure is kept to about eighty characters. {'It keeps going with more words. '.repeat(12)}</p> } };
export const Rtl: Story = { decorators: [rtl] };
