/* Plenix · TeachingBubble
   Summary: A callout that points at a feature to introduce it once, or leads a short tour step by step: a title, one or
     two sentences, an optional picture, a step count and its actions, in a Popover filled with the brand blue, with an
     arrow at the feature, while a Spotlight dims the rest of the window around it
     (09 Overlays › Contextual overlays › Teaching bubble; also 10 Patterns › Coach mark).
   Usage:
     <TeachingBubble target={<Button icon="filter">Filters</Button>} open={tip} onDismiss={() => setTip(false)}
       title="Saved filters" primaryAction={{ label: 'Got it', onClick: done }}>Save a set of filters and open it from here next time.</TeachingBubble>
     <TeachingBubble target={…} open title="Share a board" step={{ current: 2, total: 3 }}
       primaryAction={{ label: 'Next', onClick: next }} secondaryAction={{ label: 'Back', onClick: back }} onDismiss={end}>…</TeachingBubble>
     <TeachingBubble target={…} open media={<Image src="board.png" alt="" ratio="16-9" />} wide title="Boards">…</TeachingBubble>
   Props:
     target: the element it points at (one element; it is not changed: it keeps its own role and actions)
     open: whether it shows (the caller decides, and remembers that it was dismissed)
     onDismiss(): runs from Close and Escape (the person is done with it)
     title: the feature's name; it names the bubble
     children: what the feature does for the person, then how: one or two sentences (about 25 words)
     media: a picture above the title (an Image; decorative pictures take alt="")
     step: { current, total }: the step count of a tour ("2 of 3")
     primaryAction: { label, onClick }: the main action (Got it, Next, Try it)
     secondaryAction: { label, onClick }: a second action (Back, Not now)
     placement: where it sits against the target (default "bottom"; Popover's placements)
     wide: the wide bubble (400px) for a picture or a longer step (default false: 320px)
     spotlight: while it is open, a Spotlight dims the rest of the window and leaves the target bright and usable
       (default true; false for a quiet hint that leaves the page as it is)
     focusOnOpen: focus moves into it when it opens (default false: a bubble that appears by itself leaves focus where it
       is; set it when a tour step opens it after an action)
     strings: the words it shows and announces, for other languages: { close: "Close", step: "{current} of {total}" }
       ({…} are filled with the numbers, set in the data font)
     className: more classes on the bubble
   Behavior:
     It opens only by the open prop (Popover's manual trigger) and stays open until an action or Close; a click outside
       does not close it. Escape and Close run onDismiss and return focus to the target.
     It is a non-modal dialog named by its title: the page stays usable; Tab reaches its actions after the target.
     The arrow points at the target; the bubble keeps its side so the arrow stays true.
     With spotlight (the default) the rest of the window is dimmed while it is open: the target is never covered and
       keeps its actions; a press on the dim does nothing; focus is not trapped. The dim goes when the bubble closes.
   Notes:
     One at a time, and only for something new or easily missed; never for errors or what people must know to finish a
       task. Its surface is the brand blue (plx-sys.brand-primary) with the color on the brand (plx-sys.brand-on-primary)
       for its text, icons and actions (owner, 2026-10-13): the primary action is filled with that color, the secondary
       action and Close are drawn in it; the pair meets the text contrast in light and dark.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Button } from '../Button/Button.tsx';
import { Popover } from '../Popover/Popover.tsx';
import type { PopoverProps } from '../Popover/Popover.tsx';
import { Spotlight } from '../Spotlight/Spotlight.tsx';
import { SurfaceContext } from '../../providers/Surface.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import { fillNodes } from '../../utils/fillNodes.tsx';


// a string with {name} places filled by numbers in the data font (counts are technical values)

// an action button of the bubble
export type TeachingBubbleAction = { label: React.ReactNode; onClick?: (event: React.MouseEvent<HTMLElement>) => void };
export type TeachingBubbleProps = {
  /** the element it points to: one element */
  target: React.ReactElement;
  open?: boolean;
  onDismiss?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  media?: React.ReactNode;
  /** the step in a tour: { n, total } */
  step?: Record<string, React.ReactNode> | null;
  primaryAction?: TeachingBubbleAction | null;
  secondaryAction?: TeachingBubbleAction | null;
  placement?: PopoverProps['placement'];
  wide?: boolean;
  spotlight?: boolean;
  focusOnOpen?: boolean;
  strings?: Catalog | null;
  className?: string;
};
export function TeachingBubble({ target, open = false, onDismiss, title, children, media, step, primaryAction, secondaryAction, placement = 'bottom',
  wide = false, spotlight = true, focusOnOpen = false, strings, className }: TeachingBubbleProps) {
  const t = useStrings('teachingBubble', strings) as { close: string; step: string };
  const id = useUid('plx-teaching-bubble');
  const actions = primaryAction || secondaryAction;
  const spot = React.useRef<HTMLSpanElement>(null);   // the target's box: the spotlight's anchor
  return (
    <span ref={spot} className="plx-teaching-bubble__target">
    {spotlight ? <Spotlight target={spot} open={!!open} /> : null}
    <Popover trigger={React.Children.only(target)} triggerOn="manual" open={!!open} onOpenChange={(v) => { if (!v && onDismiss) onDismiss(); }}
      placement={placement} size={wide ? 'lg' : 'md'} arrow focusOnOpen={focusOnOpen} aria-labelledby={id + 't'}
      className={cx('plx-teaching-bubble', wide && 'plx-teaching-bubble--wide', className)}>
      {/* the bubble is an inverse surface: its buttons take that look (SurfaceContext, Button) */}
      <SurfaceContext.Provider value="inverse">
      {media ? <div className="plx-teaching-bubble__media">{media}</div> : null}
      <div className="plx-teaching-bubble__header">
        <h2 id={id + 't'} className="plx-teaching-bubble__title">{title}</h2>
        {onDismiss ? <Button variant="ghost" size="xs" iconOnly tooltip={false} icon={CloseIcon} label={t.close} className="plx-teaching-bubble__close" onClick={onDismiss} /> : null}
      </div>
      <p className="plx-teaching-bubble__text">{children}</p>
      {step || actions ? (
        <div className="plx-teaching-bubble__footer">
          {step ? <span className="plx-teaching-bubble__step">{fillNodes(t.step, step)}</span> : null}
          {actions ? (
            <span className="plx-teaching-bubble__actions">
              {secondaryAction ? <Button onClick={secondaryAction.onClick}>{secondaryAction.label}</Button> : null}
              {primaryAction ? <Button variant="primary" onClick={primaryAction.onClick}>{primaryAction.label}</Button> : null}
            </span>
          ) : null}
        </div>
      ) : null}
      </SurfaceContext.Provider>
    </Popover>
    </span>
  );
}
