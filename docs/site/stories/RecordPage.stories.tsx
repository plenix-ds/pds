// States: default (header over the body), with an aside, header alone, sizes and surfaces. Not applicable: hover, focus beyond its content, active, disabled, loading, error, selected (a page structure).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecordPage } from '../../../platform/patterns/RecordPage/RecordPage.tsx';
import { Badge } from '../../../platform/components/Badge/Badge.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const header = <RecordPage.Header title="Cross 014.png" description="Uploaded by Maya Chen" meta={<Badge tone="success" icon="check">Approved</Badge>} actions={<Button>Download</Button>} />;
const meta = { title: 'Patterns/RecordPage', component: RecordPage, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { header, children: <p>The record&apos;s body: panels and tables.</p> } } satisfies Meta<typeof RecordPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAside: Story = { args: { aside: <aside aria-label="Facts"><p>Size 2.4 MB</p></aside> } };
export const HeaderOnly: Story = { render: () => <RecordPage.Header title="General" description="Language and regional formats" size="lg" surface="card" headingLevel={1} /> };
export const LongText: Story = { args: { header: <RecordPage.Header title="A record with a very long title that does not fit the width of the page and so wraps onto several lines" description="A description that runs on well past the width of the header and so wraps too." /> } };
export const Rtl: Story = { decorators: [rtl], args: { aside: <aside aria-label="Facts"><p>Size 2.4 MB</p></aside> } };
