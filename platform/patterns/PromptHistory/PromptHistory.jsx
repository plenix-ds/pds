/* Plenix · PromptHistory
   Summary: Reuse a saved prompt from a plain or searchable history, preserving the original prompt.
   Usage: <PromptHistory items={history} searchable onSelect={reusePrompt}/>
   Props:
     items: [{ id, prompt, createdAt }]; saved prompts and optional ISO timestamps.
     searchable: show the search field; default true.
     onSelect(item): asynchronous reuse callback; never sends to a model implicitly.
     strings: { label, search, empty, failed }; plus SearchField strings.
     className: extra classes on the named region.
   Behavior: Search filters text without mutating history. Selection waits once and reports errors in context.
   Notes: Caller owns storage, privacy and retention; selecting a prompt never sends it to a model implicitly.
*/
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Time } from '../../components/Time/Time.jsx';
export function PromptHistory({items=[],searchable=true,onSelect,strings,className}){
 const t={label:'Prompt history',search:'Search prompts',empty:'No matching prompts.',failed:'The prompt could not be reused. Try again.',...strings},[query,setQuery]=React.useState(''),[busy,setBusy]=React.useState(null),[error,setError]=React.useState(''),lock=React.useRef(false),live=React.useRef(true);
 React.useEffect(()=>{live.current=true;return()=>{live.current=false;};},[]);
 const visible=items.filter(i=>String(i.prompt).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 const choose=async item=>{if(lock.current||!onSelect)return;lock.current=true;setBusy(item.id);setError('');try{await onSelect(item);}catch(e){if(live.current)setError(e?.message||t.failed);}finally{lock.current=false;if(live.current)setBusy(null);}};
 return <Stack className={cx('plx-prompt-history',className)} role="region" aria-label={t.label}>{searchable?<SearchField label={t.search} placeholder={t.search} value={query} onChange={e=>setQuery(e.target.value)} onClear={()=>setQuery('')} strings={strings}/>:null}{error?<Notice tone="danger">{error}</Notice>:null}{visible.length?visible.map(i=><Stack key={i.id} gap="xs"><Button variant="ghost" disabled={busy!==null||!onSelect} aria-busy={busy===i.id||undefined} onClick={()=>choose(i)}>{i.prompt}</Button>{i.createdAt?<Time value={i.createdAt}/>:null}</Stack>):<Text>{t.empty}</Text>}</Stack>;
}
