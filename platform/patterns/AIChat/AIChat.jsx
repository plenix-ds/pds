/* Plenix · AIChat
   Summary: An explicitly labeled AI conversation, built from Chat and released AI review components.
   Usage: <AIChat messages={messages} onSend={send} streaming={generating} onStop={stop} />
   Props:
     messages: [{id,role:'user'|'assistant',text,state,sources,versions,onFeedback,onRegenerate,onRefine}].
     onSend(text,context): async caller request; streaming / onStop: actual transport state and cancellation.
     variant: panel (default) | page; title: conversation heading; suggestions: optional prompt choices.
     prompt / onPromptChange(text): controlled draft; composer: extra PromptInput props.
     strings: title,thread,you,assistant,empty and nested aiLabel,prompt,response,generated,citation,suggestions,disclaimer,refine.
     className: extra classes.
   Behavior: Suggestions only fill the draft and focus it. Streaming output is quiet until complete; the log
     never repeats a partial response. Chat follows new messages only while the reader remains at the end.
   Notes: Caller owns conversation storage, sources, moderation and model transport. Render plain text or trusted
     React version content, never model HTML. No generated answer is accepted or applied automatically.
*/
import React from 'react';
import { LiveRegion } from '../../utils/announce.tsx';
import { cx } from '../../utils/cx.ts';
import { Chat } from '../../components/Chat/Chat.jsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { AILabel } from '../../components/AILabel/AILabel.tsx';
import { GeneratedContent } from '../../components/GeneratedContent/GeneratedContent.tsx';
import { Citation } from '../../components/Citation/Citation.tsx';
import { PromptSuggestions } from '../../components/PromptSuggestions/PromptSuggestions.jsx';
import { AIDisclaimer } from '../../components/AIDisclaimer/AIDisclaimer.tsx';
import { RefineMenu } from '../../components/RefineMenu/RefineMenu.jsx';
import { PromptInput } from '../../components/PromptInput/PromptInput.jsx';
import { StreamingText } from '../../components/StreamingText/StreamingText.tsx';
export function AIChat({messages=[],onSend,streaming=false,onStop,variant='panel',title,suggestions=[],prompt,onPromptChange,composer={},strings,className}){
 const t={title:'AI assistant',thread:'AI conversation',you:'You',assistant:'AI assistant',empty:'Ask a question to start the conversation.',...strings},[own,setOwn]=React.useState(''),field=React.useRef(null),draft=prompt===undefined?own:prompt;
 const threadId='plx-ai-thread-'+React.useId().replace(/[^a-zA-Z0-9]/g,''),atEnd=React.useRef(true);
 const [announcement,setAnnouncement]=React.useState(''),latest=messages.filter(m=>m.role==='assistant').slice(-1)[0];
 React.useLayoutEffect(()=>{const el=document.getElementById(threadId);if(el&&atEnd.current)el.scrollTop=el.scrollHeight;},[latest?.text,messages.length,threadId]);
 React.useEffect(()=>{const a={streaming:'Generating response',done:'Response complete',stopped:'Generation stopped',...t.response},state=latest?.state||'done';setAnnouncement(latest?(a[state]||a.done)+(state==='streaming'?'':latest.text?' — '+latest.text:''):'');},[latest?.id,latest?.text,latest?.state,t.response?.streaming,t.response?.done,t.response?.stopped]);
 const change=next=>{if(prompt===undefined)setOwn(next);onPromptChange?.(next);};
 return <Stack grow={variant==='page'} className={cx('plx-ai','plx-ai-chat','plx-ai-chat--'+(variant==='page'?'page':'panel'),className)}>
 <Chat.Header title={title||t.title} meta={<AILabel strings={t.aiLabel}/>}/>
 <Chat.Thread id={threadId} label={t.thread} aria-live="off" onScroll={e=>{const el=e.currentTarget;atEnd.current=el.scrollHeight-el.scrollTop-el.clientHeight<=el.clientHeight/4;}}>{messages.length?messages.map(m=><Chat.Message key={m.id} mine={m.role==='user'} author={m.role==='user'?t.you:t.assistant}>
 {m.role==='user'?<><VisuallyHidden>{t.you+': '}</VisuallyHidden>{m.text}</>:<Stack><GeneratedContent versions={m.versions} loading={m.state==='streaming'} onFeedback={m.onFeedback} onRegenerate={m.onRegenerate} strings={t.generated}><StreamingText announce={false} text={m.text} state={m.state} strings={t.response}/></GeneratedContent>{m.sources?.length?<Citation variant="list" sources={m.sources} strings={t.citation}/>:null}{m.onRefine?<RefineMenu onRefine={m.onRefine} strings={t.refine} disabled={streaming}/>:null}</Stack>}</Chat.Message>):<Text>{t.empty}</Text>}</Chat.Thread>
 <LiveRegion kind="status">{announcement}</LiveRegion>
 {streaming&&!messages.some(m=>m.state==='streaming')?<Chat.Typing variant="thinking" label={t.response?.streaming}/>:null}
 {suggestions.length?<PromptSuggestions options={suggestions} disabled={streaming} strings={t.suggestions} onSelect={o=>{change(o.prompt||o.label);field.current?.focus();}}/>:null}
 <PromptInput {...composer} ref={field} value={draft} onChange={change} onSend={onSend} streaming={streaming} onStop={onStop} strings={t.prompt}/>
 <AIDisclaimer strings={t.disclaimer}/></Stack>;
}
