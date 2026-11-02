/* Plenix · AIExplanation
   Summary: A requested explanation and caller supplied factors, with optional confidence.
   Usage: <AIExplanation summary="Suggested because it matches your saved topics." factors={reasons} />
   Props: summary: explanation text; factors: [{id,label,detail}]; confidence: ConfidenceIndicator props; label,title; open,onOpenChange; strings: label,title,close; className.
   Behavior: Opens only on request, uses the existing Popover focus/escape behavior and never invents reasons or confidence.
   Notes: Existing roles and the existing sparkle icon only. Caller owns AI output, data, authorization and persistence.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Popover } from '../../components/Popover/Popover.tsx';
import { ConfidenceIndicator } from '../../components/ConfidenceIndicator/ConfidenceIndicator.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export function AIExplanation({summary,factors=[],confidence,label,title,open,onOpenChange,strings,className}){const t=useStrings('aiExplanation', strings);return <Popover title={title||t.title} open={open} onOpenChange={onOpenChange} closeButton strings={{close:t.close}} trigger={<Button icon={SparkleIcon}>{label||t.label}</Button>}><Stack className={cx('plx-ai-explanation',className)}><Text as="p">{summary}</Text>{factors.length?<Stack as="ul">{factors.map(f=><Text as="li" key={f.id}><Text variant="strong">{f.label}</Text>{f.detail?' — '+f.detail:null}</Text>)}</Stack>:null}{confidence?<ConfidenceIndicator {...confidence}/>:null}</Stack></Popover>;}
