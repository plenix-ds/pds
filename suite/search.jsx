/* Plenix suite · search (suite/search.jsx). Split out of app/plenix.jsx in batch 113; rebuilt from Platform components in
   batch 199: the answer as a Notice, the results as Cards. */
import { Button, Card, Chat, Inline, Notice, PageContent, SearchField, Skeleton, Stack, Tag, TagList, Text, Field } from 'plenix-platform';
import { aiSearch } from './shared.jsx';
const { useState, useRef, useEffect } = React;

/* ─── Search ────────────────────────────────────────────────────── */
export function SearchScreen({ initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery); const [loading, setLoading] = useState(false); const [res, setRes] = useState(null); const ref = useRef();
  // a query handed over from the Search workspace (Ask AI) runs at once
  useEffect(() => { setTimeout(() => ref.current && ref.current.focus(), 80); if (initialQuery.trim()) run(); }, []);
  const run = async () => { if (!q.trim()) return; setLoading(true); setRes(null); try { setRes(await aiSearch(q)); } catch { /* no answer */ } setLoading(false); };
  const SUGG = ['contractor quote kitchen', 'Apex brand guidelines', 'flights to Madrid', 'tax documents 2026', 'meeting notes'];
  return (
    <PageContent className="plx-motion-enter">
      <Stack gap="md" className="plx-u-mx-auto plx-u-w-100p plx-u-max-w-600px">
        <Stack gap="xs">
          <Text as="h1" variant="title">Search everything</Text>
          <Text variant="secondary">Files, notes, tasks, bookmarks, contacts — unified across all projects.</Text>
        </Stack>
        <Field label="Search everything" hideLabel><SearchField ref={ref} label="Search everything" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} placeholder="Try: contractor quote from last month…" loading={loading} shortcut="Enter" /></Field>
        <Inline gap="sm">
          <Button variant="primary" onClick={run} disabled={!q.trim() || loading}>{loading ? 'Searching…' : 'Search'}</Button>
          {q ? <Button onClick={() => { setQ(''); setRes(null); }}>Clear</Button> : null}
        </Inline>
        {!res && !loading ? (
          <Stack gap="sm">
            <Text variant="eyebrow">Suggested searches</Text>
            <Inline wrap gap="sm">{SUGG.map((s) => <Button key={s} size="sm" onClick={() => { setQ(s); setTimeout(run, 80); }}>{s}</Button>)}</Inline>
          </Stack>
        ) : null}
        {loading ? (
          <Stack gap="sm">
            <Notice tone="info"><Inline gap="sm"><Chat.Typing label="Searching" /><span>Scanning all modules…</span></Inline></Notice>
            {[1, 2, 3].map((i) => <Skeleton key={i} height="72px" />)}
          </Stack>
        ) : null}
        {res && !loading ? (
          <Stack gap="sm" className="plx-motion-enter">
            {res.answer ? <Notice tone="info">{res.answer}</Notice> : null}
            <Text variant="eyebrow">{(res.results && res.results.length) || 0} results</Text>
            {(res.results || []).map((r, i) => (
              <Card key={i} title={r.name} meta={r.preview} onOpen={() => {}}>
                <Inline wrap gap="sm">
                  <Tag>{r.module}</Tag>
                  {r.project ? <Text variant="secondary">{r.project}</Text> : null}
                  {r.tags && r.tags.length ? <TagList label="Tags">{r.tags.map((t) => <Tag key={t}>{t}</Tag>)}</TagList> : null}
                  <Text variant="data" className="plx-u-ms-auto">{r.date}</Text>
                </Inline>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </PageContent>
  );
}
