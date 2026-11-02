/* Plenix · CommentThread
   Summary: An ordered comment conversation with a reply composer and explicit thread resolution.
   Usage: <CommentThread comments={comments} onReply={saveReply} />
   Props: comments: [{id,author,body,time,own,edited,reactions}]; title; resolved; onReply(text), onResolve(next), onEdit(id,text), onReact(id,reaction); strings, className.
   Behavior: Reply submits nonblank text once, clears only after success, retains failed drafts and disables replies when resolved.
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
import { Comment } from '../../components/Comment/Comment.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
export function CommentThread({comments=[],title,resolved=false,onReply,onResolve,onEdit,onReact,strings,className,...rest}) {
 const t=useStrings('commentThread', strings);
 const [draft,setDraft]=React.useState(''),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false);const lock=React.useRef(false),alive=React.useRef(true);
 React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 async function run(fn,clear){if(lock.current||!fn)return;lock.current=true;setBusy(true);setError('');try{await fn();if(clear&&alive.current)setDraft('');}catch(e){if(alive.current)setError(t.failed);}finally{lock.current=false;if(alive.current)setBusy(false);}}
 return <Stack className={cx('plx-comment-thread',className)} aria-label={title||t.title} aria-busy={busy||undefined} {...rest}>
 <Inline wrap><Text as="h3">{title||t.title}</Text>{resolved?<Badge icon={CheckIcon} tone="success">{t.resolved}</Badge>:null}{onResolve?<Button variant="secondary" disabled={busy} onClick={()=>run(()=>onResolve(!resolved))}>{resolved?t.reopen:t.resolve}</Button>:null}</Inline>
 <Stack>{comments.map(c=><Comment key={c.id} {...c} strings={strings} onEdit={onEdit?text=>onEdit(c.id,text):undefined} onReact={onReact?id=>onReact(c.id,id):undefined}/>)}</Stack>
 {onReply&&!resolved?<Stack as="form" onSubmit={e=>{e.preventDefault();if(!draft.trim()){setError(t.empty);return;}run(()=>onReply(draft.trim()),true);}}><Field label={t.reply} error={error}><Textarea value={draft} disabled={busy} onChange={e=>setDraft(e.target.value)}/></Field><Button type="submit" disabled={busy}>{t.send}</Button></Stack>:error?<Text role="alert">{error}</Text>:null}
 </Stack>;
}
