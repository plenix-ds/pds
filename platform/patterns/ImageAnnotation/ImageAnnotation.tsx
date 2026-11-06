/* Plenix · ImageAnnotation
   Summary: Named image pins and regions linked to comment threads without pointer-only interaction.
   Usage: <ImageAnnotation src={image} alt="Review artwork" annotations={notes} onAdd={saveAnnotation} />
   Props: src, alt: image; annotations: [{id,label,kind:"pin"|"region",location,x,y,comments}]; selectedId,onSelectionChange(id); onAdd({kind,location,text}), onReply(id,text); strings, className.
   Behavior: Shows caller named locations as an accessible list beside the image. Selection opens its thread; adding requires location and comment and retains failures. Caller image coordinates are snapped to the existing four-pixel grid and drawn by the shared reposition engine; the named list remains the keyboard alternative.
   Notes: Caller owns persistence and permissions; strings translates every built-in word. Existing roles only.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { useReposition } from '../../utils/dnd.ts';
import { snapToGrid } from '../../utils/grid.ts';
import { Image } from '../../components/Image/Image.tsx';
import { Input, Select } from '../../components/Input/Input.tsx';
import { CommentThread } from '../CommentThread/CommentThread.tsx';
import type { ThreadComment } from '../CommentThread/CommentThread.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
function AnnotationMark({ annotation, index, active, onSelect, strings }: { annotation: Annotation; index: number; active: boolean; onSelect: () => void; strings: any }) {
  const position = { x: snapToGrid(Number(annotation.x) || 0), y: snapToGrid(Number(annotation.y) || 0) };
  const move = useReposition({ name: annotation.label || annotation.location, position, disabled: true });
  return (
    <Button
      ref={move.props.ref}
      className={cx('plx-image-annotation__mark', annotation.kind === 'region' && 'plx-image-annotation__mark--region')}
      variant="secondary"
      aria-label={
        (annotation.kind === 'region' ? strings.region : strings.pin) +
        ' ' +
        (index + 1) +
        ': ' +
        (annotation.label || annotation.location)
      }
      aria-pressed={active}
      onClick={onSelect}
    >
      <Text variant="data">{index + 1}</Text>
    </Button>
  );
}
/** @public one comment in a thread */
export type AnnotationComment = ThreadComment;
/** @public one annotation: a pin or a region, named by its location */
export type Annotation = { id: string | number; label?: string; kind?: 'pin' | 'region'; location?: string; x?: number; y?: number; comments?: AnnotationComment[] };
/** @public the prop type (ADR 0011) */
export type ImageAnnotationProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  src: string;
  alt?: string;
  annotations?: Annotation[];
  selectedId?: string | number | null;
  onSelectionChange?(id: string | number | null): void;
  onAdd?(annotation: { kind: 'pin' | 'region'; location: string; text: string; x?: number; y?: number }): unknown;
  onReply?(id: string | number, text: string): unknown;
  strings?: Record<string, string>;
  className?: string;
};
export function ImageAnnotation({
  src,
  alt,
  annotations = [],
  selectedId,
  onSelectionChange,
  onAdd,
  onReply,
  strings,
  className,
  ...rest
}: ImageAnnotationProps) {
  const t: any = useStrings('imageAnnotation', strings);
  const [own, setOwn] = React.useState<any>(null),
    [kind, setKind] = React.useState<'pin' | 'region'>('pin'),
    [location, setLocation] = React.useState(''),
    [text, setText] = React.useState(''),
    [error, setError] = React.useState(''),
    [busy, setBusy] = React.useState(false);
  const lock = React.useRef(false),
    alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const id = selectedId === undefined ? own : selectedId,
    active = annotations.find((a) => a.id === id);
  async function add(e: any) {
    e.preventDefault();
    if (lock.current || !onAdd) return;
    if (!location.trim() || !text.trim()) {
      setError(t.empty);
      return;
    }
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onAdd({ kind, location: location.trim(), text: text.trim() });
      if (alive.current) {
        setText('');
        setLocation('');
      }
    } catch (e) {
      if (alive.current) setError(t.failed);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  return (
    <Stack className={cx('plx-image-annotation', className)} aria-label={t.title} {...rest}>
      <Stack className="plx-image-annotation__canvas" gap="none">
        <Image src={src} alt={alt} ratio="16-9" fit="contain" />
        {annotations.map((a, i) => (
          <AnnotationMark
            key={a.id}
            annotation={a}
            index={i}
            active={id === a.id}
            strings={t}
            onSelect={() => {
              if (selectedId === undefined) setOwn(a.id);
              if (onSelectionChange) onSelectionChange(a.id);
            }}
          />
        ))}
      </Stack>
      <Inline wrap>
        {annotations.map((a, i) => (
          <Button
            key={a.id}
            variant="secondary"
            aria-pressed={id === a.id}
            onClick={() => {
              if (selectedId === undefined) setOwn(a.id);
              if (onSelectionChange) onSelectionChange(a.id);
            }}
          >
            <Text variant="data">{i + 1}</Text> <Text>{a.label || a.location}</Text>{' '}
            <Text>{a.kind === 'region' ? t.region : t.pin}</Text>
          </Button>
        ))}
      </Inline>
      {!annotations.length ? <Text>{t.none}</Text> : null}
      {active ? (
        <CommentThread
          key={active.id}
          title={active.label || active.location}
          comments={active.comments || []}
          strings={strings}
          onReply={onReply ? async (value: string) => { await onReply(active.id, value); } : undefined}
        />
      ) : null}
      {onAdd ? (
        <Stack as="form" onSubmit={add}>
          <Field label={t.kind}>
            <Select
              disabled={busy}
              value={kind}
              onChange={(e) => setKind(e.target.value as 'pin' | 'region')}
              options={[
                { value: 'pin', label: t.pin },
                { value: 'region', label: t.region }
              ]}
            />
          </Field>
          <Field label={t.location}>
            <Input value={location} disabled={busy} onChange={(e) => setLocation(e.target.value)} />
          </Field>
          <Field label={t.comment} error={error}>
            <Textarea value={text} disabled={busy} onChange={(e) => setText(e.target.value)} />
          </Field>
          <Button type="submit" disabled={busy}>
            {t.add}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
