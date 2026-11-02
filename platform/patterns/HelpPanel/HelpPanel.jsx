/* Plenix · HelpPanel
   Summary: Searchable help articles in the Platform inspector SidePanel.
   Usage: <HelpPanel open title="Help" articles={articles} onOpenChange={setOpen} />
   Props:
     articles: [{ id, title, summary, content, href }]; content is a Platform node; href is an optional full article URL.
     open, onOpenChange, title: SidePanel props; strings: { title, search, empty, back, read, close }; className: extra classes.
   Behavior:
     Search matches article titles and summaries. Selecting a result opens its content; Back restores the results.
     Empty results are explicit; every article action is a Button and every external article is a Link.
   Notes:
     Supply article content from a trusted renderer. The inspector owns responsive placement and scrolling.
*/
import React from 'react';
import { SidePanel } from '../SidePanel/SidePanel.jsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function HelpPanel({ articles = [], open = true, onOpenChange, title, strings, className }) {
  const t = useStrings('helpPanel', strings);
  const [query, setQuery] = React.useState(''), [selected, setSelected] = React.useState(null);
  const article = articles.find((a) => a.id === selected);
  const matches = articles.filter((a) => (a.title + ' ' + (a.summary || '')).toLowerCase().includes(query.trim().toLowerCase()));
  return <SidePanel title={title || t.title} open={open} onOpenChange={onOpenChange} collapseLabel={t.close} className={cx('plx-help-panel', className)}>
    <Stack className="plx-help-panel__content">
      {article ? <><Button onClick={() => setSelected(null)}>{t.back}</Button><Text as="h3" variant="heading">{article.title}</Text>
        {article.content}{article.href ? <Link href={article.href}>{t.read}</Link> : null}</>
        : <><SearchField label={t.search} placeholder={t.search} value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} strings={strings} />
          {matches.length ? matches.map((a) => <Stack key={a.id} gap="xs"><Button variant="ghost" onClick={() => setSelected(a.id)}>{a.title}</Button>
            {a.summary ? <Text>{a.summary}</Text> : null}</Stack>) : <EmptyState title={t.empty} />}</>}
    </Stack>
  </SidePanel>;
}
