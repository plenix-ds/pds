/* Plenix · PromptInput
   Summary: A labeled AI prompt composer with explicit send, stop, attachments and model selection.
   Usage: <PromptInput value={prompt} onChange={setPrompt} onSend={send} />
   Props:
     value / onChange(text): controlled draft; defaultValue: initial uncontrolled draft.
     onSend(text,{attachments,model,signal}): async request; only success clears an unchanged draft.
     multiline: use a Textarea (default false); streaming: show Stop instead of Send.
     onStop(): caller cancellation; disabled: disable all input; attachments: allow file selection.
     accept: allowed file types; onAttachmentsChange(files): report selected files.
     models: [{id,label,disabled}]; model / onModelChange(id): controlled model chip menu.
     strings: label, placeholder, send, stop, stopping, failed, attachments, model, remove and file-input words.
     readOnly: shows the draft and sends nothing (the field is read-only; Send, the attachments and the model are off); default the nearest ReadOnly region's.
     className: extra classes; ref: forwarded to the input or textarea.
   Behavior: Enter submits; Shift+Enter adds a line; IME composition never submits. Pending requests run once,
     preserve failed drafts, cancel on unmount and never erase text typed while a request was pending.
   Notes: Attachments stay local until onSend; the caller owns upload policy, model access and cancellation.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Input, Textarea } from '../Input/Input.tsx';
import { Stack, Inline } from '../Stack/Stack.tsx';
import { Field } from '../Field/Field.tsx';
import { Button } from '../Button/Button.tsx';
import { FileInput } from '../FileInput/FileInput.tsx';
import { Chip } from '../Tag/Tag.tsx';
import { Menu, MenuItem, MenuRadioGroup } from '../Menu/Menu.jsx';
import { Notice } from '../Notice/Notice.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
import StopIcon from 'plenix-platform/icons/plenix/stop';
export const PromptInput = React.forwardRef(function PromptInput({value,defaultValue='',onChange,onSend,multiline=false,streaming=false,onStop,disabled=false,attachments=false,accept,onAttachmentsChange,models=[],model,onModelChange,strings,readOnly,className},ref){
 const locked=useReadOnly(readOnly);
 const t={label:'Prompt',placeholder:'Ask a question',send:'Send prompt',stop:'Stop generating',stopping:'Stopping',failed:'Could not send the prompt. Try again.',attachments:'Attachments',model:'Choose model',...strings};
 const [own,setOwn]=React.useState(defaultValue),[files,setFiles]=React.useState([]),[fileKey,setFileKey]=React.useState(0),[busy,setBusy]=React.useState(false),[stopping,setStopping]=React.useState(false),[error,setError]=React.useState('');
 const text=value===undefined?own:value,latest=React.useRef(text),alive=React.useRef(true),lock=React.useRef(false),stopLock=React.useRef(false),abort=React.useRef(null);latest.current=text;
 React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;abort.current?.abort();};},[]);
 React.useEffect(()=>{if(!streaming){stopLock.current=false;setStopping(false);}},[streaming]);
 const change=next=>{if(value===undefined)setOwn(next);onChange?.(next);};
 const selectFiles=next=>{setFiles(next);onAttachmentsChange?.(next);};
 async function send(){if(disabled||locked||streaming||lock.current||!onSend||!String(text).trim())return;lock.current=true;setBusy(true);setError('');const sent=text,controller=new AbortController();abort.current=controller;
  try{await onSend(sent,{attachments:files.slice(),model,signal:controller.signal});if(alive.current&&!controller.signal.aborted){if(latest.current===sent)change('');selectFiles([]);setFileKey(k=>k+1);}}
  catch(e){if(alive.current&&!controller.signal.aborted)setError(t.failed);}finally{lock.current=false;if(alive.current)setBusy(false);}}
 async function stop(){if(stopLock.current||!onStop)return;stopLock.current=true;abort.current?.abort();setStopping(true);setError('');try{await onStop();}catch(e){if(alive.current){stopLock.current=false;setStopping(false);setError(t.failed);}}}
 const Control=multiline?Textarea:Input,chosen=models.find(m=>m.id===model);
 return <Stack as="form" className={cx('plx-ai','plx-prompt-input',className)} aria-label={t.label} aria-busy={busy||undefined} onSubmit={e=>{e.preventDefault();send();}}>
 <Field label={t.label}><Control ref={ref} value={text} rows={multiline?3:undefined} disabled={disabled} readOnly={locked||undefined} placeholder={t.placeholder} enterKeyHint="send" onChange={e=>change(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing&&e.keyCode!==229){e.preventDefault();send();}}}/></Field>
 <Inline wrap>{attachments?<FileInput key={fileKey} multiple showList accept={accept} label={t.attachments} strings={strings} disabled={disabled||locked||busy||streaming} onChange={selectFiles}/>:null}
 {models.length?<Menu label={t.model} trigger={<Chip disabled={disabled||locked||busy||streaming||!onModelChange} aria-label={t.model+': '+(chosen?.label||t.model)}>{chosen?.label||t.model}</Chip>}><MenuRadioGroup label={t.model} value={model} onChange={onModelChange}>{models.map(m=><MenuItem key={m.id} value={m.id} disabled={m.disabled}>{m.label}</MenuItem>)}</MenuRadioGroup></Menu>:null}
 {streaming?<Button icon={StopIcon} disabled={disabled||stopping||!onStop} onClick={stop}>{stopping?t.stopping:t.stop}</Button>:<Button type="submit" icon={SparkleIcon} disabled={disabled||locked||busy||!onSend||!String(text).trim()}>{t.send}</Button>}</Inline>
 {error?<Notice tone="danger">{error}</Notice>:null}</Stack>;
});
