/* Plenix · AISearch
   Summary: Search with optional semantic matching, a clearly identified generated answer and linked sources above results.
   Usage: <AISearch onSearch={({query,semantic,signal})=>search(query,semantic,signal)}/>
   Props:
     onSearch({ query, semantic, signal }): asynchronous search returning { answer, sources, results }.
     defaultQuery: initial query text; default empty.
     defaultSemantic: initial semantic matching choice; default false.
     semanticToggle: show the explicit semantic Switch; default true.
     strings: { label, query, search, semantic, results, empty, failed, pending, generatedContent, citation }.
     className: extra classes on the named region.
   Behavior: Only submit starts a request. A newer submit aborts and supersedes older work; errors preserve the previous result.
     Changing the semantic toggle never submits or claims semantic support without the caller implementing it.
   Notes: This is a UI adapter, not a model or search service; caller content must be trusted React nodes.
*/
import React from 'react';
import { Stack,Inline } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { cx } from '../../utils/cx.ts';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Switch } from '../../components/Checkbox/Checkbox.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { GeneratedContent } from '../../components/GeneratedContent/GeneratedContent.jsx';
import { Citation } from '../../components/Citation/Citation.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export function AISearch({onSearch,defaultQuery='',defaultSemantic=false,semanticToggle=true,strings,className}){
 const t=useStrings('aiSearch', strings),[query,setQuery]=React.useState(defaultQuery),[semantic,setSemantic]=React.useState(defaultSemantic),[data,setData]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),epoch=React.useRef(0),controller=React.useRef(null),pending=React.useRef(null);
 React.useEffect(()=>()=>{epoch.current++;controller.current?.abort();},[]);
 const search=async e=>{e?.preventDefault();if(!query.trim()||!onSearch)return;const key=JSON.stringify([query.trim(),semantic]);if(pending.current===key)return;pending.current=key;controller.current?.abort();const abort=new AbortController(),at=++epoch.current;controller.current=abort;setBusy(true);setError('');try{const next=await onSearch({query:query.trim(),semantic,signal:abort.signal});if(at===epoch.current)setData(next||{results:[]});}catch(err){if(at===epoch.current&&!abort.signal.aborted)setError(err?.message||t.failed);}finally{if(at===epoch.current){pending.current=null;setBusy(false);}}};
 return <Stack className={cx('plx-ai-search',className)} role="region" aria-label={t.label}><Stack as="form" onSubmit={search}><SearchField label={t.query} placeholder={t.query} value={query} onChange={e=>setQuery(e.target.value)} onClear={()=>setQuery('')} strings={strings}/>{semanticToggle?<Switch label={t.semantic} checked={semantic} onChange={e=>setSemantic(e.target.checked)}/>:null}<Button type="submit" disabled={!query.trim()||!onSearch}>{t.search}</Button></Stack>
 {busy?<Inline><Badge icon={SparkleIcon} role="status">{t.pending}</Badge></Inline>:null}{error?<Notice tone="danger">{error}</Notice>:null}{data&&data.answer!==undefined&&data.answer!==null?<GeneratedContent strings={strings?.generatedContent}>{data.answer}<Citation variant="list" sources={data.sources||[]} strings={strings?.citation}/></GeneratedContent>:null}
 {data?<Stack role="region" aria-label={t.results}>{(data.results||[]).length?(data.results||[]).map(item=><Stack key={item.id} gap="xs">{item.href?<Link href={item.href}>{item.title}</Link>:<Text>{item.title}</Text>}{item.description?<Text>{item.description}</Text>:null}</Stack>):<Text>{t.empty}</Text>}</Stack>:null}</Stack>;
}
