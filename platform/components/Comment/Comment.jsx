/* Plenix · Comment
   Summary: A person, timestamp and plain text with explicit edit, resolve and reaction actions.
   Usage: <Comment author={{name:"Maya Chen"}} body="Ready for review" time="2026-10-15T12:00:00Z" />
   Props: author: Persona props; body: plain text; time: ISO time; own, edited, resolved: flags; reactions: [{id,label,count,active}]; onEdit(text), onResolve(next), onReact(id): optional async handlers; strings, className.
   Behavior: Actions await callbacks, block duplicates, retain edits on failure and never mutate caller records.
   Notes: Caller owns persistence and permissions; strings translates every built-in word. Existing roles only.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { Persona } from '../Persona/Persona.jsx';
import { Time } from '../Time/Time.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';
export function Comment({author={},body='',time,own=false,edited=false,resolved=false,reactions=[],onEdit,onResolve,onReact,strings,className,...rest}) {
 const t=useStrings('comment', strings);
 const [editing,setEditing]=React.useState(false),[draft,setDraft]=React.useState(body),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');const lock=React.useRef(false),mounted=React.useRef(true);
 React.useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 React.useEffect(()=>{if(!editing)setDraft(body);},[body,editing]);
 async function act(fn,done){if(lock.current||!fn)return;lock.current=true;setBusy(true);setError('');try{await fn();if(mounted.current&&done)done();}catch(e){if(mounted.current)setError(t.failed);}finally{lock.current=false;if(mounted.current)setBusy(false);}}
 return <Stack as="article" className={cx('plx-comment',className)} aria-busy={busy||undefined} {...rest}>
 <Inline wrap><Persona {...author}/>{time?<Time value={time}/>:null}{edited?<Badge icon={PencilIcon}>{t.edited}</Badge>:null}{resolved?<Badge tone="success" icon={CheckIcon}>{t.resolved}</Badge>:null}</Inline>
 {editing?<Field label={t.message} error={error}><Textarea value={draft} disabled={busy} onChange={e=>setDraft(e.target.value)}/></Field>:<Text as="p" className="plx-comment__body">{body}</Text>}
 {!editing&&error?<Text role="alert">{error}</Text>:null}
 <Inline wrap>{editing?<><Button disabled={busy} onClick={()=>{if(!draft.trim()){setError(t.empty);return;}act(()=>onEdit(draft.trim()),()=>setEditing(false));}}>{t.save}</Button><Button variant="secondary" disabled={busy} onClick={()=>{setEditing(false);setError('');}}>{t.cancel}</Button></>:<>{own&&onEdit?<Button variant="secondary" disabled={busy} onClick={()=>{setDraft(body);setEditing(true);setError('');}}>{t.edit}</Button>:null}{onResolve?<Button variant="secondary" disabled={busy} onClick={()=>act(()=>onResolve(!resolved))}>{resolved?t.reopen:t.resolve}</Button>:null}{reactions.map(r=><Button key={r.id} variant="secondary" aria-pressed={!!r.active} disabled={busy||!onReact} onClick={()=>act(()=>onReact(r.id))}><Text>{r.label}</Text> <Text variant="data">{r.count}</Text></Button>)}</>}</Inline></Stack>;
}
