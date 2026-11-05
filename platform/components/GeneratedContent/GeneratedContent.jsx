/* Plenix · GeneratedContent
   Summary: Retain generated content while people review versions, send feedback or explicitly regenerate it.
   Usage: <GeneratedContent versions={versions} onRegenerate={regenerate} onFeedback={saveFeedback}/>
   Props:
     versions: [{ id, content, label }]; caller-owned generated versions, oldest first.
     versionId: the selected id when controlled by the caller.
     defaultVersionId: initial selected id; otherwise the latest version.
     onVersionChange(id): called after explicit page navigation.
     children: content when no versions are supplied.
     loading: an external pending state; default false.
     onRegenerate({ versionId, signal }): asynchronous regeneration; the caller supplies the new version.
     onFeedback(value,context): asynchronous feedback; value is "helpful" or "unhelpful"; context is { versionId, signal }.
     strings: { label, helpful, unhelpful, regenerate, previous, next, version, feedbackSaved, failed, pending, aiLabel }.
     className: extra classes on the region.
   Behavior: Async actions run once and retain the visible version on failure. Version changes cancel obsolete actions.
     The caller adds regenerated versions to versions; the component never fabricates a new answer or persistence.
   Notes: Render trusted React content, never raw model HTML. Feedback belongs to the selected version.
*/
import React from 'react';
import { Stack,Inline } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { AILabel } from '../AILabel/AILabel.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export function GeneratedContent({versions=[],versionId,defaultVersionId,onVersionChange,children,loading=false,onRegenerate,onFeedback,strings,className}){
 const t=useStrings('generatedContent', strings),[own,setOwn]=React.useState(defaultVersionId),[busy,setBusy]=React.useState(''),[error,setError]=React.useState(''),[feedback,setFeedback]=React.useState(null),lock=React.useRef(false),epoch=React.useRef(0),controller=React.useRef(null);
 const id=versionId!==undefined?versionId:own,index=Math.max(0,versions.findIndex(v=>v.id===(id??versions[versions.length-1]?.id))),version=versions[index];
 React.useEffect(()=>{epoch.current++;controller.current?.abort();lock.current=false;setBusy('');setError('');setFeedback(null);return()=>{epoch.current++;controller.current?.abort();};},[version?.id]);
 const run=async(type,value)=>{const callback=type==='regenerate'?onRegenerate:onFeedback;if(lock.current||loading||!callback)return;const at=epoch.current;lock.current=true;setBusy(type);setError('');const abort=new AbortController();controller.current=abort;
  try{if(type==='regenerate')await callback({versionId:version?.id,signal:abort.signal});else await callback(value,{versionId:version?.id,signal:abort.signal});if(at===epoch.current&&type==='feedback')setFeedback(value);}catch(e){if(at===epoch.current&&!abort.signal.aborted)setError(e?.message||t.failed);}finally{if(at===epoch.current){lock.current=false;setBusy('');}}
 };
 const choose=i=>{if(busy||loading)return;const v=versions[i];if(!v)return;if(versionId===undefined)setOwn(v.id);onVersionChange?.(v.id);};
 return <Stack className={cx('plx-ai','plx-generated-content',className)} role="region" aria-label={t.label} aria-busy={!!busy||loading||undefined}>
 <Inline wrap><AILabel strings={strings?.aiLabel}/>{loading||busy?<Badge icon={SparkleIcon}>{t.pending}</Badge>:null}</Inline><Stack>{version?version.content:children}</Stack>
 {error?<Notice tone="danger">{error}</Notice>:null}{feedback?<Inline><Badge icon={CheckIcon} role="status">{t.feedbackSaved}</Badge></Inline>:null}
 {versions.length>1?<Inline><Button disabled={!!busy||loading||index<=0} onClick={()=>choose(index-1)}>{t.previous}</Button><Text variant="data" role="status">{t.version+' '+(index+1)+' / '+versions.length}</Text><Button disabled={!!busy||loading||index>=versions.length-1} onClick={()=>choose(index+1)}>{t.next}</Button></Inline>:null}
 <Inline wrap>{onFeedback?<><Button aria-pressed={feedback==='helpful'} disabled={!!busy||loading} onClick={()=>run('feedback','helpful')}>{t.helpful}</Button><Button aria-pressed={feedback==='unhelpful'} disabled={!!busy||loading} onClick={()=>run('feedback','unhelpful')}>{t.unhelpful}</Button></>:null}{onRegenerate?<Button icon={RefreshIcon} disabled={!!busy||loading} onClick={()=>run('regenerate')}>{t.regenerate}</Button>:null}</Inline>
 </Stack>;
}
