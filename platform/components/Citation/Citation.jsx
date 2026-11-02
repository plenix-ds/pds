/* Plenix · Citation
   Summary: A numbered source disclosure, source card or source list with real navigation links.
   Usage: <Citation source={{id:'guide',title:'Project guide',href:'/guide',excerpt:'Scope and constraints.'}} index={1}/>
   Props:
     source: { id, title, href, excerpt, author }; one reference.
     sources: source records for the list variant.
     variant: "inline" (default) | "card" | "list".
     index: a 1-based marker number; default 1.
     strings: { source, open, unavailable, newTab }; localized labels and link announcements.
     className: extra classes on the trigger or source container.
     ref: forwarded to the inline source trigger button.
   Behavior: A marker opens a Popover; its source link navigates. Unsafe URL protocols remain plain text.
   Notes: A citation identifies a reference; it does not assert that the source was verified or supports every claim.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { cx } from '../../utils/cx.ts';
import { Link } from '../Link/Link.tsx';
import { Popover } from '../Popover/Popover.tsx';
function hrefOf(value){if(typeof value!=='string'||!value.trim())return null;try{const u=new URL(value,'https://plenix.invalid/');return ['http:','https:'].includes(u.protocol)?value:null;}catch(e){return null;}}
export const Citation=React.forwardRef(function Citation({source,sources=[],variant='inline',index=1,strings,className},ref){
  devWarn('Citation', { variant }, { variant: ['inline','card','list'] });
 const t={source:'Source',open:'Open source',unavailable:'Source unavailable',...strings};
 const card=(s,key)=>{const title=s?.title||t.unavailable,href=hrefOf(s?.href);return <Stack key={key} className="plx-citation__source" gap="xs">{href?<Link href={href} variant="external" target="_blank" rel="noopener noreferrer" strings={strings}>{title}</Link>:<Text>{title}</Text>}{s?.author?<Text>{s.author}</Text>:null}{s?.excerpt?<Text>{s.excerpt}</Text>:null}</Stack>;};
 if(variant==='list')return <Stack className={cx('plx-citation',className)} role="list" aria-label={t.source}>{sources.map((s,i)=><Stack key={s.id||i} role="listitem">{card(s,s.id||i)}</Stack>)}</Stack>;
 if(variant==='card')return <Stack className={cx('plx-citation',className)}>{card(source,0)}</Stack>;
 return <Popover label={t.source+' '+index} title={source?.title||t.source} trigger={<Button ref={ref} className={cx('plx-citation',className)} variant="ghost" size="xs" label={t.source+' '+index}><Text as="span" variant="data">{'['+index+']'}</Text></Button>}>{card(source,0)}</Popover>;
});
