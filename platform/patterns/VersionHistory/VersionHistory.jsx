/* Plenix · VersionHistory
   Summary: A version timeline with an optional preview and a confirmed restore.
   Usage: <VersionHistory versions={versions} currentId="v2" onRestore={restore}/>
   Props: versions: [{id,version,date,dateTime,author,description,preview}]; currentId; onPreview(version);
     onRestore(version): async; variant: list | restore | preview; strings: label,preview,restore,confirm,cancel,failed,restored,empty.
   Behavior: Preview never restores. Restore requires confirmation and waits for persistence; errors keep context.
   Notes: Caller owns version storage, authorization and currentId. No history is rewritten optimistically.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { cx } from '../../utils/cx.ts';
import { Timeline } from '../../components/Timeline/Timeline.tsx';
import { VersionLabel } from '../../components/VersionLabel/VersionLabel.jsx';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import ClockIcon from 'plenix-platform/icons/plenix/clock';
export function VersionHistory({versions=[],currentId,onPreview,onRestore,variant='list',strings,className}){
  devWarn('VersionHistory', { variant }, { variant: ['list','restore','preview'] });
 const t=useStrings('versionHistory', strings),[ask,setAsk]=React.useState(null),[preview,setPreview]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[done,setDone]=React.useState(false),lock=React.useRef(false),alive=React.useRef(true);
 React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 const restore=async()=>{if(lock.current||!ask||!onRestore)return;const v=versions.find(v=>v.id===ask.id);if(!v||v.id===currentId){setAsk(null);return;}lock.current=true;setBusy(true);setError('');try{await onRestore(v);if(alive.current){setAsk(null);setDone(true);}}catch(e){if(alive.current)setError(e?.message||t.failed);}finally{lock.current=false;if(alive.current)setBusy(false);}};
 const viewing=preview&&versions.find(v=>v.id===preview.id);
 return <Stack className={cx('plx-version-history',className)}>{error?<Notice tone="danger">{error}</Notice>:null}{done?<Badge tone="success" icon={CheckIcon}>{t.restored}</Badge>:null}{!versions.length?<Text>{t.empty}</Text>:<Timeline label={t.label} items={versions.map(v=>({id:v.id,time:v.date,dateTime:v.dateTime,title:<VersionLabel version={v.version} status={v.id===currentId?'latest':undefined}/>,icon:ClockIcon,description:[v.author,v.description].filter(Boolean).join(' · '),content:<Inline>{variant==='preview'||onPreview?<Button size="sm" onClick={()=>{setPreview(v);onPreview?.(v);}}>{t.preview}</Button>:null}{variant!=='list'&&onRestore&&v.id!==currentId?<Button size="sm" disabled={busy} onClick={()=>{setError('');setAsk(v);}}>{t.restore}</Button>:null}</Inline>}))}/>}
 <Dialog open={!!viewing} title={t.preview} onClose={()=>setPreview(null)}>{viewing?.preview||viewing?.description}</Dialog>
 <Dialog open={!!ask} title={t.confirm} dismissible={!busy} onClose={()=>setAsk(null)} footer={<Inline><Button disabled={busy} onClick={()=>setAsk(null)}>{t.cancel}</Button><Button variant="primary" disabled={busy} onClick={restore}>{t.restore}</Button></Inline>}><VersionLabel version={ask?.version||''}/>{error?<Notice tone="danger">{error}</Notice>:null}</Dialog>
 </Stack>;
}
