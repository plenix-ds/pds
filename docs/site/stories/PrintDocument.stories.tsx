// States: default (an A4 sheet on screen), with header and footer, right to left document. Not applicable: hover, focus, active, disabled, loading, error, selected (a printable page).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrintDocument } from '../../../platform/patterns/PrintDocument/PrintDocument.tsx';
import { AnswerLines } from '../../../platform/components/AnswerLines/AnswerLines.tsx';
import { rtl } from './rtl.tsx';

const body = (<><h1>Hearing notice</h1><p>The hearing is set for the first Thursday of the quarter.</p><AnswerLines label="Notes" lines={4} /></>);
const meta = { title: 'Patterns/PrintDocument', component: PrintDocument, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { children: body } } satisfies Meta<typeof PrintDocument>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHeaderAndFooter: Story = { args: { header: <strong>Council of the Diocese</strong>, footer: <p>Issued 2026-11-05</p> } };
export const LongText: Story = { args: { children: <><h1>A notice with a very long title that wraps onto several lines of the sheet</h1><p>{'A paragraph of body text that fills the sheet and wraps within its margins. '.repeat(20)}</p></> } };
export const Rtl: Story = { decorators: [rtl], args: { dir: 'rtl' } };
