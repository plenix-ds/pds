/* Plenix · PresenceBar
   Summary: The current viewers, editors and a keyboard reachable cursor list.
   Usage: <PresenceBar people={people} mode="editors" />
   Props: people: [{id,name,src,role:"viewer"|"editor",cursor}]; mode: viewers|editors|cursors; max; onPerson(id); strings, className.
   Behavior: Filters by current activity, never invents live presence, exposes supplied cursor labels without geometric positioning.
   Notes: Caller owns persistence and permissions; strings translates every built-in word. Existing roles only.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { AvatarGroup } from '../../components/AvatarGroup/AvatarGroup.tsx';
import { Persona } from '../../components/Persona/Persona.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import PersonIcon from 'plenix-platform/icons/plenix/person';
/** @public one person in the bar */
export type PresencePerson = { id: string | number; name: string; src?: string; role?: 'viewer' | 'editor'; cursor?: string };
/** @public the prop type (ADR 0011) */
export type PresenceBarProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  people?: PresencePerson[];
  mode?: 'viewers' | 'editors' | 'cursors';
  max?: number;
  onPerson?(id: string | number): void;
  strings?: Record<string, string>;
  className?: string;
};
export function PresenceBar({people=[],mode='viewers',max=4,onPerson,strings,className,...rest}: PresenceBarProps) {
 const t: any=useStrings('presenceBar', strings);const m=['viewers','editors','cursors'].includes(mode)?mode:'viewers';const list=people.filter(p=>m==='editors'?p.role==='editor':m==='cursors'?!!p.cursor:true);
 return <Stack className={cx('plx-presence-bar',className)} aria-label={t[m]} {...rest}><Inline wrap><Badge icon={PersonIcon}>{t[m]}</Badge><Text variant="data">{list.length}</Text><AvatarGroup label={t[m]} people={list.map(p=>({id:p.id,name:p.name,src:p.src}))} max={max}/></Inline>{!list.length?<Text>{t.empty}</Text>:m==='cursors'?<Stack>{list.map(p=><Inline wrap key={p.id}><Persona name={p.name} src={p.src}/><Text>{p.cursor}</Text>{onPerson?<Button variant="secondary" onClick={()=>onPerson(p.id)} aria-label={t.view+' '+p.name}>{t.view}</Button>:null}</Inline>)}</Stack>:null}</Stack>;
}
