/* Plenix · Chat actions (the parts of Chat.jsx a person acts on in a message, issue 637 slice 4; documented in Chat.jsx)
   Summary: the action bar beside a bubble (React, Reply, More), the More menu, the reaction pills with Add reaction, the quick reactions panel,
     the quote inside a bubble and the composer's "Replying to" line. Every icon-only control is a bordered button (the secondary variant; owner, issue 637).
   Usage:
     <Chat.Message mine onReact={react} onReply={reply} onEdit={edit} onDelete={remove} reactions={[{ emoji: '👍', count: 2, mine: true }]}
       quote={{ author: 'Maya Chen', text: 'The PDF is fine.' }} edited>Both floors in one file.</Chat.Message>
     <Chat.Composer replyTo={{ author: 'Maya Chen', text: 'The PDF is fine.' }} onCancelReply={cancel} … />
   Props:
     the same as in Chat.jsx (Chat.Message: onReact, onReply, onQuote, onCopy, onForward, onEdit, onDelete, reactions, quote, edited, deleted;
     Chat.Composer: replyTo, onCancelReply).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Menu, MenuItem, MenuDivider } from '../Menu/Menu.tsx';
import { Popover } from '../Popover/Popover.tsx';
import { Text } from '../Text/Text.tsx';
import { fill } from '../../utils/fill.ts';
import ReplyIcon from 'plenix-platform/icons/plenix/reply';
import MoreIcon from 'plenix-platform/icons/plenix/more';
import QuoteIcon from 'plenix-platform/icons/plenix/format-quote';
import CopyIcon from 'plenix-platform/icons/plenix/ed-copy';
import ForwardIcon from 'plenix-platform/icons/plenix/forward';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import AddReactionIcon from 'plenix-platform/icons/material/add-reaction';

// the quick reactions, in the owner's order, each with its name for assistive technology (the strings' keys)
const QUICK_REACTIONS = [['👍', 'thumbsUp'], ['❤️', 'heart'], ['😂', 'laugh'], ['😮', 'wow'], ['😢', 'sad'], ['🙏', 'thanks']];
type Words = Record<string, string>;
const nameOf = (emoji: string, t: Words) => { const q = QUICK_REACTIONS.find((r) => r[0] === emoji); return q ? t[q[1]] : emoji; };

// React: a panel of the quick reactions and More reactions (a placeholder until the emoji picker, issue 646)
function ReactionPicker({ onReact, t, trigger }: { onReact?: (emoji: string) => void; t: Words; trigger: React.ReactElement }) {
  const [more, setMore] = React.useState(false);
  return (
    <Popover title={t.addReaction} size="md" placement="bottom-start" trigger={trigger}>
      <div className="plx-chat__picker">
        <div className="plx-chat__quick" role="group" aria-label={t.reactions}>
          {QUICK_REACTIONS.map(([e, k]) => <Button key={k} variant="secondary" size="sm" label={t[k]} tooltip={false} onClick={() => onReact && onReact(e)}><span className="plx-chat__emoji" aria-hidden="true">{e}</span></Button>)}
          <Button variant="secondary" size="sm" iconOnly icon={AddReactionIcon} label={t.moreReactions} aria-expanded={more} onClick={() => setMore(!more)} />
        </div>
        {more ? <Text variant="secondary">{t.emojiSoon}</Text> : null}
      </div>
    </Popover>
  );
}

// the action bar beside the bubble: React, Reply and More (Reply, Quote, Copy text, Forward | Edit, Delete on your own messages)
export function MessageActions({ shown, mine, onReact, onReply, onQuote, onCopy, onForward, onEdit, onDelete, t }: { shown?: boolean; mine?: boolean; onReact?: (emoji: string) => void; onReply?: () => void; onQuote?: () => void; onCopy?: () => void; onForward?: () => void; onEdit?: () => void; onDelete?: () => void; t: Words }) {
  const own = mine && (onEdit || onDelete);
  return (
    <div className={cx('plx-chat__actions', mine && 'plx-chat__actions--mine', !shown && 'plx-visually-hidden')} role="group" aria-label={t.messageActions}>
      {onReact ? <ReactionPicker onReact={onReact} t={t} trigger={<Button variant="secondary" size="sm" iconOnly icon={AddReactionIcon} label={t.react} />} /> : null}
      {onReply ? <Button variant="secondary" size="sm" iconOnly icon={ReplyIcon} label={t.reply} onClick={onReply} /> : null}
      <Menu label={t.moreActions} placement={mine ? 'bottom-end' : 'bottom-start'} trigger={<Button variant="secondary" size="sm" iconOnly icon={MoreIcon} label={t.moreActions} />}>
        {onReply ? <MenuItem icon={ReplyIcon} onSelect={onReply}>{t.reply}</MenuItem> : null}
        {onQuote ? <MenuItem icon={QuoteIcon} onSelect={onQuote}>{t.quote}</MenuItem> : null}
        <MenuItem icon={CopyIcon} onSelect={onCopy}>{t.copyText}</MenuItem>
        {onForward ? <MenuItem icon={ForwardIcon} onSelect={onForward}>{t.forward}</MenuItem> : null}
        {own ? <MenuDivider /> : null}
        {mine && onEdit ? <MenuItem icon={PencilIcon} onSelect={onEdit}>{t.edit}</MenuItem> : null}
        {mine && onDelete ? <MenuItem icon={TrashIcon} danger onSelect={onDelete}>{t.delete}</MenuItem> : null}
      </Menu>
    </div>
  );
}

// the reactions under the text: a pill each (emoji and count; yours outlined in the action color), then Add reaction
export function Reactions({ reactions, mine, onReact, t }: { reactions: Array<{ emoji: string; count: number; mine?: boolean; label?: string }>; mine?: boolean; onReact?: (emoji: string) => void; t: Words }) {
  return (
    <div className={cx('plx-chat__reactions', mine && 'plx-chat__reactions--mine')} role="group" aria-label={t.reactions}>
      {reactions.map((r) => (
        <button key={r.emoji} type="button" className={cx('plx-chat__reaction', r.mine && 'plx-chat__reaction--mine')} aria-pressed={!!r.mine}
          aria-label={fill(t.reactionCount, { name: r.label || nameOf(r.emoji, t), count: r.count })} onClick={onReact ? () => onReact(r.emoji) : undefined} disabled={!onReact}>
          <span className="plx-chat__emoji" aria-hidden="true">{r.emoji}</span><span aria-hidden="true">{r.count}</span>
        </button>
      ))}
      {onReact ? <ReactionPicker onReact={onReact} t={t} trigger={<Button variant="secondary" size="xs" iconOnly icon={AddReactionIcon} label={t.addReaction} />} /> : null}
    </div>
  );
}

// a quoted or replied-to message inside the bubble: a bar, its author and one line of its text
export function Quote({ author, text }: { author?: React.ReactNode; text?: React.ReactNode }) {
  return (
    <blockquote className="plx-chat__quote">
      <span className="plx-chat__quote-author">{author}</span>
      <span className="plx-chat__quote-text">{text}</span>
    </blockquote>
  );
}

// the composer's "Replying to <name>" line with the message's first line and a Cancel button
export function ReplyPreview({ author, text, onCancel, t }: { author: string; text?: React.ReactNode; onCancel?: () => void; t: Words }) {
  return (
    <div className="plx-chat__replying">
      <span className="plx-chat__replying-icon"><Icon name={ReplyIcon} size="sm" /></span>
      <span className="plx-chat__quote plx-chat__quote--replying">
        <span className="plx-chat__quote-author">{fill(t.replyingTo, { name: author })}</span>
        <span className="plx-chat__quote-text">{text}</span>
      </span>
      {onCancel ? <Button variant="secondary" size="sm" iconOnly icon={CloseIcon} label={t.cancelReply} onClick={onCancel} /> : null}
    </div>
  );
}
