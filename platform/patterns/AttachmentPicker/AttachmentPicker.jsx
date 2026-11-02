/* Plenix · AttachmentPicker
   Summary: Attach device files as removable rows or chips without uploading them implicitly.
   Usage: <AttachmentPicker value={files} onChange={setFiles} accept=".pdf" multiple />
   Props: value: File[]; onChange(next); variant: inline | chips; accept: extension/MIME list; multiple: true;
     maxFiles, maxSize: optional count and per-file byte limits; disabled; strings: label, remove, invalid, limit, empty.
   Behavior: Validate a batch before changing it; preserve attachments on errors; allow same-named distinct files.
   Notes: The caller owns upload and persistence. Limits apply to device files, not an authorization policy.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { cx } from '../../utils/cx.ts';
import { FileInput } from '../../components/FileInput/FileInput.tsx';
import { FileRow, FileRowList } from '../../components/FileRow/FileRow.jsx';
import { MenuItem } from '../../components/Menu/Menu.jsx';
import { Tag, TagList } from '../../components/Tag/Tag.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
export function AttachmentPicker({value=[],onChange,variant='inline',accept='',multiple=true,maxFiles,maxSize,disabled=false,strings,className}){
  devWarn('AttachmentPicker', { variant }, { variant: ['inline','chips'] });
 const t=useStrings('attachmentPicker',strings),[error,setError]=React.useState(''),[inputKey,setInputKey]=React.useState(0);
 const remove=(i)=>{if(!disabled){setError('');onChange?.(value.filter((_,n)=>n!==i));}};
 const add=(files)=>{setInputKey(n=>n+1);const rules=accept.toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);
  if(files.some(f=>(typeof maxSize==='number'&&f.size>maxSize)||(rules.length&&!rules.some(r=>r[0]==='.'?f.name.toLowerCase().endsWith(r):r.endsWith('/*')?f.type.toLowerCase().startsWith(r.slice(0,-1)):f.type.toLowerCase()===r)))){setError(t.invalid);return;}
  const next=multiple?value.concat(files.filter(f=>!value.some(v=>v.name===f.name&&v.size===f.size&&v.lastModified===f.lastModified))):files.slice(0,1);
  if(typeof maxFiles==='number'&&next.length>maxFiles){setError(t.limit);return;}setError('');onChange?.(next);
 };
 return <Stack className={cx('plx-attachment-picker',className)}><FileInput strings={strings} key={inputKey} label={t.label} accept={accept} multiple={multiple} disabled={disabled} onChange={add}/>
  {error?<Notice tone="danger">{error}</Notice>:null}
  {!value.length?<Text>{t.empty}</Text>:variant==='chips'?<TagList label={t.label}>{value.map((f,i)=><Tag key={i} onRemove={disabled?undefined:()=>remove(i)} removeLabel={t.remove.replace('{name}',f.name)}><Text kind="data">{f.name}</Text></Tag>)}</TagList>:<FileRowList label={t.label}>{value.map((f,i)=><FileRow strings={strings} as="li" key={i} file={{name:f.name,size:f.size,type:f.type}} actions={!disabled?<MenuItem onSelect={()=>remove(i)}>{t.remove.replace('{name}',f.name)}</MenuItem>:null}/>)}</FileRowList>}
 </Stack>;
}
