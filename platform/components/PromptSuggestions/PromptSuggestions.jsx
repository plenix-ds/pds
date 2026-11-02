/* Plenix · PromptSuggestions
   Summary: Optional prompt choices as chips or cards; selecting one is an explicit action.
   Usage: <PromptSuggestions options={prompts} onSelect={choosePrompt} />
   Props: options: [{id,label,prompt,description,disabled}]; variant: chips|cards; onSelect(option): optional async callback; disabled; strings: label,empty,failed; className.
   Behavior: Only explicit selection calls the handler; pending requests block repeats and failed choices remain available.
   Notes: Existing roles and the existing sparkle icon only. Caller owns AI output, data, authorization and persistence.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Stack, Inline } from '../Stack/Stack.tsx';
import { Button } from '../Button/Button.tsx';
import { Text } from '../Text/Text.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Chip } from '../Tag/Tag.tsx';
import { Card } from '../Card/Card.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export function PromptSuggestions({ options = [], variant = 'chips', onSelect, disabled = false, strings, className }) {
  devWarn('PromptSuggestions', { variant }, { variant: ['chips', 'cards'] });
  const t = useStrings('promptSuggestions', strings),
    [busy, setBusy] = React.useState(false),
    [error, setError] = React.useState('');
  const lock = React.useRef(false),
    alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function choose(o) {
    if (disabled || o.disabled || lock.current || !onSelect) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onSelect(o);
    } catch (e) {
      if (alive.current) setError(t.failed);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  return (
    <Stack
      className={cx('plx-prompt-suggestions', className)}
      aria-label={t.label}
      role="group"
      aria-busy={busy || undefined}
    >
      {!options.length ? (
        <Text>{t.empty}</Text>
      ) : (
        <Inline wrap>
          {options.map((o) =>
            variant === 'cards' ? (
              <Card key={o.id} title={o.label}>
                <Stack>
                  {o.description ? <Text>{o.description}</Text> : null}
                  <Button
                    icon={SparkleIcon}
                    disabled={disabled || busy || o.disabled || !onSelect}
                    onClick={() => choose(o)}
                  >
                    {o.label}
                  </Button>
                </Stack>
              </Card>
            ) : (
              <Chip key={o.id} disabled={disabled || busy || o.disabled || !onSelect} onClick={() => choose(o)}>
                <Icon name={SparkleIcon} />
                {o.label}
              </Chip>
            )
          )}
        </Inline>
      )}
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Stack>
  );
}
