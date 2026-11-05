/* Plenix suite · capture (suite/capture.jsx). Split out of app/plenix.jsx in batch 113; rebuilt from Platform components in
   batch 199: the files as RadioTiles, the chosen one as a PropertyList, the proposal as a CodeBlock with its parts as Tags. */
import { Button, Chat, CodeBlock, Table, Dialog, Inline, Notice, RadioTiles, Skeleton, Stack, Tag, TagList, Text, useUnsavedGuard } from 'plenix-platform';
// a name/value table as a static Table (batches 229, 234: every table runs on DataGrid): rows [name, value, technical?]; the names
// are the row header, values wrap, a value may be any React content
// name/value facts as the defined data grid, with a header row (owner, 2026-10-09: all name/value lists in the DataGrid's look)
const facts=(label,rows)=>{const list=rows.filter(Boolean);return <Table label={label} headerMenu={false}
  data={list.map((r,i)=>({id:i,name:r[0],value:typeof r[1]==="string"||typeof r[1]==="number"?String(r[1]):""}))}
  columns={[{title:"Name",field:"name",kind:"wrap",rowLabel:true,width:"--plx-ref-size-60u",sortable:false},
    {title:"Value",field:"value",kind:"wrap",sortable:false,render:d=>{const r=list[d.id];return r?(r[2]?<Text variant="data">{r[1]}</Text>:r[1]):null;}}]}/>;};
import { CAPTURES, aiFileName } from './shared.jsx';
const { useState } = React;

const PART = { date: 'Date', project: 'Project', type: 'Type', description: 'Description' };

/* ─── Capture UI ────────────────────────────────────────────────── */
export function CaptureUI({ onClose }) {
  const [sel, setSel] = useState(null); const [loading, setLoading] = useState(false); const [res, setRes] = useState(null); const [saved, setSaved] = useState(false);
  // a proposed name not yet accepted is unsaved: closing the dialog or leaving the page asks first
  const close = useUnsavedGuard(!!(sel && res && !saved), 'The proposed file name has not been saved.')(onClose);
  const pick = async (f) => { setSel(f); setRes(null); setSaved(false); setLoading(true); try { setRes(await aiFileName(f.context)); } catch { /* no proposal */ } setLoading(false); };
  return (
    <Dialog open onClose={close} title="AI File Naming" description="Select a file — AI reads the content and proposes a structured name.">
      <Stack gap="md">
        <RadioTiles legend="File" legendHidden size="lg" value={sel ? sel.fileName : undefined} onChange={(v) => pick(CAPTURES.find((f) => f.fileName === v))}
          options={CAPTURES.map((f) => ({ value: f.fileName, label: f.emoji + ' ' + f.label, description: f.fileName }))} />
        {sel ? (
          <Stack gap="md">
            {facts("Selected file",[["Original filename",sel.fileName,true],["Type",sel.type,true]])}
            {loading ? (
              <Stack gap="sm">
                <Notice tone="info"><Inline gap="sm"><Chat.Typing label="Thinking" /><span>Reading content and extracting metadata…</span></Inline></Notice>
                <Skeleton height="32px" />
                <Skeleton height="24px" width="200px" />
              </Stack>
            ) : null}
            {res && !loading && !saved ? (
              <Stack gap="sm" className="plx-motion-enter">
                <CodeBlock title="Proposed filename" language="text">{res.filename}</CodeBlock>
                <TagList label="Filename parts">{Object.entries(res.parts || {}).filter(([k]) => PART[k]).map(([k, v]) => <Tag key={k}>{PART[k] + ': ' + v}</Tag>)}</TagList>
                {res.tags ? <TagList label="Tags">{res.tags.map((t) => <Tag key={t}>{t}</Tag>)}</TagList> : null}
                {res.summary ? <Text variant="secondary" as="p"><q>{res.summary}</q></Text> : null}
                <Inline gap="sm"><Button variant="primary" onClick={() => setSaved(true)}>Accept &amp; Save</Button><Button onClick={() => pick(sel)}>Regenerate</Button><Button variant="ghost" onClick={() => { setSel(null); setRes(null); }}>Cancel</Button></Inline>
              </Stack>
            ) : null}
            {saved ? (
              <Stack gap="sm" className="plx-motion-enter">
                <Notice tone="success">Saved to OneDrive</Notice>
                <Text variant="data">{res && res.filename}</Text>
                <Inline><Button onClick={() => { setSel(null); setRes(null); setSaved(false); }}>Capture another file</Button></Inline>
              </Stack>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Dialog>
  );
}
