/* Plenix · AssistantPanel
   Summary: Contextual AI conversation in an existing inspector or a dismissible responsive Sheet.
   Usage: <AssistantPanel open={open} onOpenChange={setOpen} messages={messages} onSend={send}/>
   Props:
     open: visible (default true); onOpenChange(open): caller-owned disclosure state.
     variant: inspector (default) | overlay; title: panel heading.
     context: optional trusted React content explaining what will be sent; chat: extra AIChat props.
     strings: title,close and nested chat; className: extra classes; remaining props reach AIChat.
   Behavior: Inspector follows SidePanel window classes; overlay uses Sheet focus containment, Escape and return focus.
     Closing never sends a prompt or silently cancels the caller transport. Draft lifetime follows the caller props.
   Notes: Compose inside AppShell.panel for the inspector. Caller owns context permissions and transport cancellation.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { SidePanel } from '../SidePanel/SidePanel.jsx';
import { Sheet } from '../../components/Sheet/Sheet.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { AIChat } from '../AIChat/AIChat.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
/** @public the AI assistant panel; the remaining props reach AIChat */
export type AssistantPanelProps = Record<string, unknown> & {
  open?: boolean;
  onOpenChange?(open: boolean): void;
  variant?: 'inspector' | 'overlay';
  title?: string;
  /** trusted React content that says what will be sent */
  context?: React.ReactNode;
  /** extra AIChat props */
  chat?: Record<string, unknown>;
  strings?: Record<string, unknown>;
  className?: string;
};
export function AssistantPanel({open=true,onOpenChange,variant='inspector',title,context,chat={},strings,className,...rest}: AssistantPanelProps) {
 const t: any={title:'AI assistant',close:'Close AI assistant',...strings},name=title||t.title,body=<Stack className="plx-assistant-panel__body">{context}<AIChat {...chat} {...rest} title={name} strings={t.chat||chat.strings}/></Stack>;
 if(variant==='overlay')return <Sheet open={open} onClose={()=>onOpenChange?.(false)} title={name} icon={SparkleIcon} closeLabel={t.close} className={cx('plx-assistant-panel',className)}>{body}</Sheet>;
 return <SidePanel {...({} as any)} open={open} onOpenChange={onOpenChange} title={name} label={name} icon={SparkleIcon} collapseLabel={t.close} className={cx('plx-assistant-panel',className)}>{body}</SidePanel>;
}
