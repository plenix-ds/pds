/* Plenix · AIButton
   Summary: An explicitly named AI action using the existing sparkle icon, with optional action menu.
   Usage: <AIButton label="Summarize" onAction={summarize} />
   Props: label: accessible action name; mode: trigger|menu|icon; actions: [{id,label,disabled}]; onAction(id): async action; disabled; strings: label, failed, working; className; ref: native trigger.
   Behavior: Never invokes generation automatically. Pending actions are inert; failures remain visible for retry.
   Notes: Existing roles and the existing sparkle icon only. Caller owns AI output, data, authorization and persistence.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Stack } from '../Stack/Stack.tsx';
import { Button } from '../Button/Button.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { Menu, MenuItem } from '../Menu/Menu.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
const Trigger=React.forwardRef(function Trigger({externalRef,...props},menuRef){return <Button {...props} ref={node=>{if(typeof menuRef==='function')menuRef(node);else if(menuRef)menuRef.current=node;if(typeof externalRef==='function')externalRef(node);else if(externalRef)externalRef.current=node;}}/>;});
export const AIButton=React.forwardRef(function AIButton({label,mode='trigger',actions=[],onAction,disabled=false,strings,className},ref){
 const t=useStrings('aiButton', strings),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');const lock=React.useRef(false),alive=React.useRef(true);React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 async function run(id){if(disabled||lock.current||!onAction)return;lock.current=true;setBusy(true);setError('');try{await onAction(id);}catch(e){if(alive.current)setError(t.failed);}finally{lock.current=false;if(alive.current)setBusy(false);}}
 const name=label||t.label,props={icon:SparkleIcon,label:name,iconOnly:mode==='icon',loading:busy,disabled:disabled||!onAction||(mode==='menu'&&!actions.length),strings:{working:t.working},children:name};
 return <Stack className={cx('plx-ai-button',className)}>{mode==='menu'?<Menu label={name} trigger={<Trigger {...props} externalRef={ref} caret/>}>{actions.map(a=><MenuItem key={a.id} icon={SparkleIcon} disabled={disabled||busy||a.disabled||!onAction} onSelect={()=>run(a.id)}>{a.label}</MenuItem>)}</Menu>:<Button {...props} ref={ref} onClick={()=>run()}/>}{error?<Notice tone="danger">{error}</Notice>:null}</Stack>;
});
