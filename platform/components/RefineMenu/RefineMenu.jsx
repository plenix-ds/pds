/* Plenix · RefineMenu
   Summary: Requested text refinement by length, tone or a custom instruction.
   Usage: <RefineMenu onRefine={requestRevision} />
   Props: onRefine({action,tone?,prompt?}): async callback; disabled; label; strings: label,shorter,longer,tone,formal,casual,neutral,custom,prompt,apply,cancel,empty,failed; className.
   Behavior: Quick actions use Menu; custom instructions use a named Dialog and preserve failed text. No refinement runs before selection.
   Notes: Existing roles and the existing sparkle icon only. Caller owns AI output, data, authorization and persistence.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Stack } from '../Stack/Stack.tsx';
import { Button } from '../Button/Button.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { Menu, MenuItem, MenuSub } from '../Menu/Menu.jsx';
import { Dialog } from '../Dialog/Dialog.jsx';
import { Field } from '../Field/Field.tsx';
import { Textarea } from '../Input/Input.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export function RefineMenu({ onRefine, disabled = false, label, strings, className }) {
  const t = useStrings('refineMenu', strings),
    [custom, setCustom] = React.useState(false),
    [prompt, setPrompt] = React.useState(''),
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
  async function run(value) {
    if (disabled || lock.current || !onRefine) return;
    if (value.action === 'custom' && !prompt.trim()) {
      setError(t.empty);
      return;
    }
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onRefine(value);
      if (alive.current && value.action === 'custom') {
        setCustom(false);
        setPrompt('');
      }
    } catch (e) {
      if (alive.current) setError(t.failed);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  return (
    <Stack className={cx('plx-refine-menu', className)}>
      <Menu
        label={label || t.label}
        trigger={
          <Button icon={SparkleIcon} disabled={disabled || busy || !onRefine} caret>
            {label || t.label}
          </Button>
        }
      >
        <MenuItem disabled={disabled || busy} onSelect={() => run({ action: 'shorter' })}>
          {t.shorter}
        </MenuItem>
        <MenuItem disabled={disabled || busy} onSelect={() => run({ action: 'longer' })}>
          {t.longer}
        </MenuItem>
        <MenuSub label={t.tone} disabled={disabled || busy}>
          {['formal', 'casual', 'neutral'].map((tone) => (
            <MenuItem key={tone} disabled={disabled || busy} onSelect={() => run({ action: 'tone', tone })}>
              {t[tone]}
            </MenuItem>
          ))}
        </MenuSub>
        <MenuItem
          disabled={disabled || busy}
          onSelect={() => {
            setError('');
            setCustom(true);
          }}
        >
          {t.custom}
        </MenuItem>
      </Menu>
      {error && !custom ? <Notice tone="danger">{error}</Notice> : null}
      <Dialog
        open={custom}
        title={t.custom}
        onClose={() => {
          if (!busy) setCustom(false);
        }}
        dismissible={!busy}
        footer={
          <>
            <Button disabled={disabled || busy} onClick={() => setCustom(false)}>
              {t.cancel}
            </Button>
            <Button
              disabled={disabled || busy || !onRefine}
              onClick={() => run({ action: 'custom', prompt: prompt.trim() })}
            >
              {t.apply}
            </Button>
          </>
        }
      >
        <Field label={t.prompt} error={error}>
          <Textarea value={prompt} disabled={disabled || busy} onChange={(e) => setPrompt(e.target.value)} />
        </Field>
      </Dialog>
    </Stack>
  );
}
