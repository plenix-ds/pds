/* Plenix · Recommendation
   Summary: Optional recommendations in a manually controlled Carousel, with a reason when one is supplied.
   Usage: <Recommendation items={items} variant="reason" onSelect={openItem}/>
   Props:
     items: [{ id, title, description, reason, href, content }]; caller-ranked recommendations.
     variant: "row" (default) | "reason".
     perView: slides per page, 1 through 4; default 3.
     onSelect(item): optional asynchronous action for items without a navigation href.
     strings: { label, open, why, empty, action }; plus Carousel strings.
     className: extra classes on the outer layout.
   Behavior: Never advances automatically or accepts a suggestion implicitly. Navigation remains a real Link.
   Notes: Caller owns ranking and explanations; a recommendation does not assert verified suitability.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { cx } from '../../utils/cx.ts';
import { SuggestedAction } from '../../components/SuggestedAction/SuggestedAction.tsx';
import { Carousel } from '../../components/Carousel/Carousel.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Popover } from '../../components/Popover/Popover.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
/** @public one recommendation, ranked by the caller */
export type RecommendationItem = { id: string | number; title: string; description?: string; reason?: string; href?: string; content?: React.ReactNode };
/** @public the prop type (ADR 0011) */
export type RecommendationProps = {
  items?: RecommendationItem[];
  variant?: 'row' | 'reason';
  /** slides per page, 1 to 4 */
  perView?: number;
  /** for items without a navigation href */
  onSelect?(item: RecommendationItem): unknown;
  strings?: Record<string, any>;
  className?: string;
};
export function Recommendation({items=[],variant='row',perView=3,onSelect,strings,className}: RecommendationProps){
  devWarn('Recommendation', { variant }, { variant: ['row','reason'] });
 const t={label:'Recommended for you',open:'Open',why:'Why recommended',empty:'No recommendations.',...strings};
 return <Stack className={cx('plx-recommendation',className)}>{items.length?<Carousel label={t.label} perView={perView} autoplay={false} strings={strings}>{items.map(item=><Stack key={item.id}><Text as="h3" variant="heading">{item.title}</Text>{item.content}{item.description?<Text>{item.description}</Text>:null}{variant==='reason'&&item.reason?<Popover title={t.why} trigger={<Button variant="ghost" icon={SparkleIcon}>{t.why}</Button>}><Text>{item.reason}</Text></Popover>:null}{item.href?<Link href={item.href}>{item.title}</Link>:onSelect?<SuggestedAction strings={strings?.action} onAction={()=>onSelect(item)}>{t.open+' '+item.title}</SuggestedAction>:null}</Stack>)}</Carousel>:<Text>{t.empty}</Text>}</Stack>;
}
