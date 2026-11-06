// What a TypeScript app writes against two wave-3 helpers (#764): this file must compile.
import { copyName } from '../../platform/patterns/DuplicateAction/DuplicateAction.tsx';
import { useAutosave } from '../../platform/patterns/Autosave/Autosave.tsx';
import type { AutosaveResult } from '../../platform/patterns/Autosave/Autosave.tsx';

const name: string = copyName('Report', ['Report copy']);
const readonlyTaken: readonly string[] = ['a', 'b'];
const again: string = copyName('Report', readonlyTaken, { copyOf: 'Copy of {name}' });
void name; void again;

export function Probe(props: { text: string }) {
  const saved: AutosaveResult = useAutosave<string>(props.text, async (value: string) => { void value.length; });
  const state: 'saving' | 'saved' | 'offline' | 'failed' = saved.state;
  const ok: Promise<boolean> = saved.flush();
  const again2: Promise<boolean> = saved.retry();
  const dirty: boolean = saved.dirty;
  void state; void ok; void again2; void dirty;
  return null;
}
