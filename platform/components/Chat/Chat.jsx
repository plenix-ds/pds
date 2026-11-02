/* Plenix · Chat
   Summary: The live messaging surface of a conversation (12 › Collaboration and communication › Chat): its header, the
     thread of messages (mine on the end side, theirs on the start side), the typing dots and the composer.
   Usage:
     <Chat.Header title="Maya Chen" meta="Online" avatar={<Avatar name="Maya Chen" />} actions={<…/>} />
     <Chat.Thread label="Conversation with Maya Chen">
       <Chat.Divider>Today</Chat.Divider>
       <Chat.Group author="Maya Chen" avatar={<Avatar name="Maya Chen" size="sm" />}>
         <Chat.Message time="Oct 29, 10:24 AM">Are the renders ready?</Chat.Message>
         <Chat.Message time="Oct 29, 10:25 AM">The PDF is fine.</Chat.Message>
       </Chat.Group>
       <Chat.Message mine time="Oct 29, 10:26 AM" status="read" readTime="Oct 29, 10:27 AM">Uploading them now.</Chat.Message>
       <Chat.Divider unread />
       <Chat.Typing label="Maya is typing" />
     </Chat.Thread>
     <Chat.Composer value={text} onChange={setText} onSend={send} />
   Props:
     Chat.Header.title: who or what the conversation is with
     Chat.Header.meta: a short line under the title (presence, members)
     Chat.Header.avatar: an Avatar before the title
     Chat.Header.actions: buttons at the end
     Chat.Thread.label: the accessible name of the thread (default "Conversation")
     Chat.Thread.follow: true opens at the newest message and keeps it in view as messages arrive, unless the person scrolled up
       to read (default true)
     Chat.Thread.children: the messages, in order (the oldest first)
     Chat.Message.mine: the message is the person's own (end side, the outgoing fill and outline); default false
     Chat.Group.author: one sender's run of messages, by this sender: the photo and the name go on the first message only,
       and the messages sit closer together; only Chat.Message children take them (a Chat.Divider inside the run stays as given)
     Chat.Group.avatar: the sender's Avatar, on the run's first message
     Chat.Group.mine: true: the run is the person's own; it applies to every message of the run
     Chat.Divider.children: a line across the thread with a date ("Today"); unread: the "New messages" line (its default
       text), above the first unread message
     Chat.Message.author: who wrote it (shown above theirs; announced for mine as "You")
     Chat.Message.time: a string: when it was sent, as shown, in the footer line at the bottom of the bubble ("Sent <time>");
       dateTime: the same as a machine-readable date
     Chat.Message.status: "sending" | "sent" | "delivered" | "read" (your messages): a clock, one gray check, two gray checks, two
       green checks, after the times; readTime / readDateTime: when it was read, shown as "| Read <time>" once read
     Chat.Message.avatar: the sender's Avatar (size "sm"), on the bubble's top edge, 8px in from the start edge for theirs and
       from the end edge for yours (the owner's mockup, issue 637), half above the bubble; it takes its bubble's fill, text
       color and outline. Leave it out on the following messages of a run from the same sender
     Chat.Message.children: the message text or content
     Chat.Message actions (issue 637 slice 4): onReact(emoji), onReply(), onQuote(), onCopy() (default: copies the message's text), onForward(), and on your own
       messages onEdit() and onDelete(). Any of them gives the message an action bar beside the bubble: React (the quick reactions), Reply and More (a menu:
       Reply, Quote, Copy text, Forward, then Edit and Delete in red on your own messages)
     Chat.Message.reactions: [{ emoji, count, mine, label }]: pills under the text (the emoji and its count; yours outlined in the action color, aria-pressed),
       then an Add reaction button; a pill toggles through onReact(emoji). label names an emoji outside the six quick ones
     Chat.Message.quote: { author, text }: a quoted or replied-to message inside the bubble (a bar, the author, one line)
     Chat.Message.edited: true: "· Edited" in the footer; deleted: "This message was deleted", muted, with no actions, reactions or quote
     Chat.Message.strings: the words, for other languages
     Chat.Attachments: the pictures and files of one message, in a row (two or more pictures) or a column; its pictures open together in one MediaViewer
     Chat.Attachment.type: "image" (default) | "file"; src: the picture's URL (a file's download URL); name: its file name; alt: the picture's description (default the name);
       size: bytes, shown on a file card and in the viewer; href: a file's download link (default src); onDownload(): runs on Download (instead of the link)
       A picture is a button that opens the viewer (arrows move between the message's pictures); one that does not load becomes a card that says so.
       A file is a card with its type icon (bordered), name, size and a bordered Download button. A lone Chat.Attachment needs no Chat.Attachments.
     Chat.Voice.src: the audio URL; duration: seconds, until the file says; peaks: bar heights 0 to 1 (default a fixed shape); label: the Play button's name;
       rates: playback speeds the speed button cycles (default [1, 1.5, 2]); strings: the words
       The player: Play and Pause (one voice message plays at a time), the waveform of bars with the played part in the accent color, the time ("0:23"; "0:08 / 0:23" while
       playing or paused part-way) and the speed. The waveform is a range slider (arrows, Home and End, drag or tap) named "Voice message position"; it is drawn left to right in every language.
       The time and the speed are written in the page's digits (Arabic-Indic in Arabic), and the slider reads the time as words ("8 seconds of 23 seconds"). A voice message
       that cannot be played says so once (announce()).
     Chat.Composer.value / onChange(text): the message being written
     Chat.Composer.onSend(text, files): runs on Send and, by default, on Enter (Shift+Enter starts a new line); files are the attachments that are ready
     Chat.Composer.sendOn: "enter" (default: Enter sends) | "mod-enter" (Ctrl or Command with Enter sends; Enter starts a new line)
     Chat.Composer.attachments: the files waiting to be sent: [{ id, name, size, previewUrl, status: "uploading" | "ready" | "error", progress (0-100), error }]; the app uploads and updates them
     Chat.Composer.onAttach(files): runs with the File objects picked with Attach or Image, pasted into the text or dropped on the box; without it there are no Attach and Image buttons and no drop
     Chat.Composer.onRemoveAttachment(file), onRetryAttachment(file), onCancelAttachment(file): the buttons of a file's card (Cancel while it uploads)
     Chat.Composer.accept: the file types Attach offers (default any); imageAccept: the types Image offers (default image/*)
     Chat.Composer.emoji: true (default: an Emoji button opens a panel; today a placeholder that says the picker is coming) | false (no button) | a function (insert) => node that draws the app's own picker and calls insert(text)
     Chat.Composer.voice: true (default: a microphone dictates into the box, only where the browser has speech recognition; a disabled record control beside it, with the tooltip "Voice messages coming soon", is a placeholder until recording is built, issue 654) | false (neither)
     Chat.Composer.replyTo: { author, text }: the "Replying to <name>" line above the text, with the message's first line; onCancelReply(): its Cancel button
     Chat.Composer.lang: the dictation language (default the page's: ar-EG for Arabic, en-US for English)
     Chat.Composer.strings: the words, for other languages
     Chat.Composer.placeholder: default "Write a message"; label: the field's accessible name (default "Message")
     Chat.Composer.sendLabel: default "Send"; disabled: the composer is inert
     Chat.Typing.label: the text announced to assistive technology (default "Typing")
     Chat.Typing.variant: "typing" (default) | "thinking" | "steps"; steps: [{label,status}], current: active step index
     Chat.Typing.strings: thinking and ProgressSteps state words; className: more classes
     className on every part: more classes
   Behavior:
     Messages are outlined (the owner's chat colors, issue 637): theirs in the incoming fill and outline, yours in the outgoing
       ones, the text in the message text color; the card's corner (6px) and border (1px). Each color is a role
       (--plx-sys-message-*) with its own dark value; in dark mode both are grays (no blue), yours the lighter one.
     The footer line is the smallest text (10px) in the secondary gray, never on the message line. The status mark is named
       for assistive technology when no visible word says the state (delivered; read without a read time); green is never
       the only sign: "Read" is written.
     The thread is a log (role="log", aria-live="polite"): new messages are announced.
     Send is disabled while there is nothing to send (no text and no ready file) and while a file uploads.
     The composer is one outlined box (the input's 1px border and radius; the focus turns the border): the files waiting (the card standard), the text
       area without a border of its own (Input's context hooks), and a row of tools: Attach, Image and Emoji at the start; Listening, the microphone and Send
       (an arrow with its word) at the end. The text area starts at two lines and grows to its maximum height, then scrolls; at a phone width it starts at one.
     Every icon-only control is a bordered button (the secondary variant), as are a file's icon and the Download button: they are controls, not icons in a box (owner, issue 637).
     Dictation: the microphone starts the browser's speech recognition; the words appear in the box as they are spoken (the unfinished ones too), "Listening…"
       and a Stop button show with a red dot and a ring round the microphone; Stop, the microphone again, Send, typing in the box or the browser ending it
       stops it, and typing keeps the text exactly as typed. The microphone is looked for when the composer is drawn, so a browser that gains speech
       recognition shows it with no change. A blocked microphone says so. "Listening…" and a microphone problem are announced once each (announce()).
     The action bar sits beside the bubble in the free space (theirs at its end side, yours at its start side; mirrored in right to left) and never
       covers text. It shows on hover, on a long press (500ms) and on keyboard focus: it stays in the Tab order as a visually hidden group, so a Tab into
       it reveals it (as a skip link), and it stays while focus is in its menu or reaction panel. React opens six quick reactions (Thumbs up, Heart,
       Laughing, Surprised, Sad, Thank you) and More reactions (a placeholder until the emoji picker, issue 646). Each reaction pill is named for assistive
       technology ("Thumbs up: 2") and says whether you reacted (aria-pressed).
     Chat.Typing is a status region (role="status"), so its label is announced.
     The dots pulse one after another; people who ask their system for less motion see them still.
   Notes:
     Where speech goes: dictation uses the browser's own speech recognition, so the audio is handled by the browser's maker (Chrome sends it to Google's
       servers); Plenix has no speech service and keeps nothing.
     Other props pass through to the <span>.
     It was TypingIndicator in the loading family (batch 168); the owner placed it under Chat.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { ProgressSteps } from '../ProgressSteps/ProgressSteps.tsx';
import { Text } from '../Text/Text.tsx';
import { Textarea } from '../Input/Input.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { Popover } from '../Popover/Popover.jsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { Attachment, Attachments, Voice, FileIcon } from './ChatMedia.jsx';
import { fill } from '../../utils/fill.ts';
import { ProgressBar } from '../ProgressBar/ProgressBar.tsx';
import { announce } from '../../utils/announce.tsx';
import { formatBytes } from '../../utils/format.ts';
import { copyText } from '../../utils/clipboard.ts';
import { MessageActions, Reactions, Quote, ReplyPreview } from './ChatActions.jsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
import ClockIcon from 'plenix-platform/icons/plenix/clock';
import DoneIcon from 'plenix-platform/icons/material/done';
import DoneAllIcon from 'plenix-platform/icons/material/done-all';
import AttachmentIcon from 'plenix-platform/icons/plenix/attachment';
import ImageIcon from 'plenix-platform/icons/plenix/ed-image';
import MicIcon from 'plenix-platform/icons/plenix/mic';
import StopIcon from 'plenix-platform/icons/plenix/stop';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import WarningIcon from 'plenix-platform/icons/plenix/warning';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import MoodIcon from 'plenix-platform/icons/material/mood';
import SendIcon from 'plenix-platform/icons/material/send';
import GraphicEqIcon from 'plenix-platform/icons/material/graphic-eq';

function Typing({ label, variant = 'typing', steps = [], current = 0, strings, className, ...rest }) {
  devWarn('Chat.Typing', { variant }, { variant: ['typing','thinking','steps'] });
  const t = useStrings('chat', strings);
  if (variant === 'thinking' || variant === 'steps') return <div className={cx('plx-chat__thinking', className)} role="status" {...rest}>
    <div className="plx-chat__thinking-label"><Spinner size="sm" aria-hidden="true" role="presentation" label="" /><Icon name={SparkleIcon}/><Text>{label || t.thinking}</Text></div>
    {variant === 'steps' && steps.length ? <ProgressSteps label={label || t.thinking} steps={steps} current={current} strings={strings} /> : null}
  </div>;
  if (label === undefined) label = t.typing;
  return (
    <span className={cx('plx-chat__typing', className)} role="status" {...rest}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}

function Header({ title, meta, avatar, actions, className, ...rest }) {
  return (
    <div className={cx('plx-chat__header', className)} {...rest}>
      {avatar ? <span className="plx-chat__header-avatar">{avatar}</span> : null}
      <div className="plx-chat__header-text"><div className="plx-chat__header-title">{title}</div>{meta ? <div className="plx-chat__header-meta">{meta}</div> : null}</div>
      {actions ? <div className="plx-chat__header-actions">{actions}</div> : null}
    </div>
  );
}

function Thread({ label, follow = true, className, children, ...rest }) {
  const t = useStrings('chat');
  label = label ?? t.conversation;
  // it opens at the newest message and follows new ones, unless the person has scrolled up to read (batch 215)
  const ref = React.useRef(null), atEnd = React.useRef(true);
  const count = React.Children.count(children);
  React.useLayoutEffect(() => { const el = ref.current; if (follow && el && atEnd.current) el.scrollTop = el.scrollHeight; }, [count, follow]);
  const onScroll = (e) => { const el = e.currentTarget; atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight <= el.clientHeight / 4; if (rest.onScroll) rest.onScroll(e); };
  // it scrolls, so it is in the Tab order: the keyboard can scroll it too
  return <div ref={ref} className={cx('plx-chat__thread', className)} role="log" aria-live="polite" aria-label={label} tabIndex={0} {...rest} onScroll={onScroll}>{children}</div>;
}

// the status mark: sending a clock, sent one check, delivered two, read two in green (the owner, issue 637); it is named
// for assistive technology only when no visible word already says the state
const STATUS_ICON = { sending: ClockIcon, sent: DoneIcon, delivered: DoneAllIcon, read: DoneAllIcon };

function Footer({ status, time, dateTime, readTime, readDateTime, edited, t }) {
  const sending = status === 'sending', read = status === 'read' && readTime;
  const said = sending || (status === 'sent' && time) || read;
  return (
    <div className="plx-chat__footer">
      {sending ? <span>{t.sending}</span> : time ? <span>{t.sent} <time className="plx-chat__time" dateTime={dateTime}>{time}</time></span> : null}
      {edited ? <><span aria-hidden="true">·</span><span>{t.edited}</span></> : null}
      {read ? <><span aria-hidden="true">|</span><span>{t.read} <time className="plx-chat__time" dateTime={readDateTime}>{readTime}</time></span></> : null}
      {STATUS_ICON[status] ? <span className={cx('plx-chat__status', status === 'read' && 'plx-chat__status--read')}><Icon name={STATUS_ICON[status]} size="xs" label={said ? undefined : t[status]} /></span> : null}
    </div>
  );
}

function Message({ mine = false, author, time, dateTime, status, readTime, readDateTime, avatar, quote, reactions, edited = false, deleted = false,
  onReact, onReply, onQuote, onCopy, onForward, onEdit, onDelete, strings, className, children, onMouseEnter, onMouseLeave, onFocus, onBlur, onPointerDown, onPointerUp, onPointerCancel, ...rest }) {
  devWarn('Chat.Message', { status }, { status: [undefined, 'sending', 'sent', 'delivered', 'read'] });
  const t = useStrings('chat', strings);
  const root = React.useRef(null), body = React.useRef(null), press = React.useRef(0);
  // the action bar shows on hover, on keyboard focus inside the message (a Tab into the bar reveals it, as a skip link) and on a long press
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => () => clearTimeout(press.current), []);
  const hasActions = !deleted && !!(onReact || onReply || onQuote || onCopy || onForward || onEdit || onDelete);
  const keep = () => !!root.current && root.current.contains(document.activeElement);
  const copy = () => { if (onCopy) onCopy(); else if (body.current) copyText(body.current.innerText); };
  const events = hasActions ? {
    onMouseEnter: (e) => { setShown(true); if (onMouseEnter) onMouseEnter(e); },
    onMouseLeave: (e) => { if (!keep()) setShown(false); if (onMouseLeave) onMouseLeave(e); },
    onFocus: (e) => { setShown(true); if (onFocus) onFocus(e); },
    onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setShown(false); if (onBlur) onBlur(e); },
    onPointerDown: (e) => { if (e.pointerType === 'touch') { clearTimeout(press.current); press.current = setTimeout(() => setShown(true), LONG_PRESS); } if (onPointerDown) onPointerDown(e); },
    onPointerUp: (e) => { clearTimeout(press.current); if (onPointerUp) onPointerUp(e); },
    onPointerCancel: (e) => { clearTimeout(press.current); if (onPointerCancel) onPointerCancel(e); },
  } : { onMouseEnter, onMouseLeave, onFocus, onBlur, onPointerDown, onPointerUp, onPointerCancel };
  return (
    <div ref={root} className={cx('plx-chat__message', mine && 'plx-chat__message--mine', avatar && 'plx-chat__message--avatar', className)} {...rest} {...events}>
      {avatar ? <span className={cx('plx-chat__avatar', mine && 'plx-chat__avatar--mine')}>{avatar}</span> : null}
      <div className={cx('plx-chat__bubble', mine && 'plx-chat__bubble--mine', avatar && 'plx-chat__bubble--avatar')}>
        {mine ? <VisuallyHidden>{t.you}</VisuallyHidden> : author ? <div className="plx-chat__meta"><span className="plx-chat__author">{author}</span></div> : null}
        {quote && !deleted ? <Quote author={quote.author} text={quote.text} /> : null}
        <div ref={body} className="plx-chat__body">{deleted ? <span className="plx-chat__deleted">{t.deleted}</span> : children}</div>
        {reactions && reactions.length && !deleted ? <Reactions reactions={reactions} mine={mine} onReact={onReact} t={t} /> : null}
        {time || status || edited ? <Footer status={status} time={time} dateTime={dateTime} readTime={readTime} readDateTime={readDateTime} edited={edited && !deleted} t={t} /> : null}
      </div>
      {hasActions ? <MessageActions shown={shown} mine={mine} onReact={onReact} onReply={onReply} onQuote={onQuote} onCopy={copy} onForward={onForward} onEdit={onEdit} onDelete={onDelete} t={t} /> : null}
    </div>
  );
}
const LONG_PRESS = 500;   // ms a finger rests on a message before its action bar shows

// a run of messages from one sender: the photo and the name on the first message only, the run closer together; only the
// Chat.Message children take mine, author and avatar (anything else, a Divider, stays as given)
function Group({ mine = false, author, avatar, className, children, ...rest }) {
  let first = true;
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || child.type !== Message) return child;
    const more = first ? { mine, author, avatar } : { mine, author: undefined, avatar: undefined };
    first = false;
    return React.cloneElement(child, more);
  });
  return <div className={cx('plx-chat__group', className)} {...rest}>{items}</div>;
}

// a line across the thread: a date, or "New messages" (unread) above the first unread message
function Divider({ unread = false, className, children, ...rest }) {
  const t = useStrings('chat');
  return (
    <div className={cx('plx-chat__divider', unread && 'plx-chat__divider--unread', className)} {...rest}>
      <span className="plx-chat__divider-line" aria-hidden="true" />
      <span>{children ?? (unread ? t.newMessages : null)}</span>
      <span className="plx-chat__divider-line" aria-hidden="true" />
    </div>
  );
}

// the speech recognition the browser offers (Chrome and Safari today), looked for each time a composer mounts, so a browser that adds it later shows the microphone with no change here
const speechConstructor = () => (typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null);
// the page's language for dictation: Arabic is ar-EG, English en-US, any other the page's own tag
function speechLanguage(lang) {
  const tag = lang || (typeof document !== 'undefined' && document.documentElement.lang) || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
  if (/^ar(-|$)/i.test(tag)) return /^ar-/i.test(tag) ? tag : 'ar-EG';
  return /^en$/i.test(tag) ? 'en-US' : tag;
}
const joinSpoken = (base, spoken) => (base && spoken ? base + (/\s$/.test(base) ? '' : ' ') + spoken.trim() : base || spoken.trim());

// one file waiting to be sent: its picture or icon, its name, its state (a progress bar, ready, or an error with Retry) and a button to cancel or remove it
function ComposerFile({ file, t, onRemove, onRetry, onCancel }) {
  const status = file.status || 'ready';
  return (
    <li className="plx-chat__attachment" data-plx-status={status}>
      <span className="plx-chat__attachment-thumb">{file.previewUrl ? <img className="plx-chat__attachment-image" src={file.previewUrl} alt="" /> : <FileIcon name={file.name} />}</span>
      <span className="plx-chat__attachment-body">
        <span className="plx-chat__attachment-name">{file.name}</span>
        <span className="plx-chat__attachment-meta">
          {status === 'uploading' ? <>
            <span className="plx-chat__attachment-progress"><ProgressBar value={file.progress || 0} size="sm" label={file.progress === undefined ? t.uploadingPlain : fill(t.uploading, { percent: file.progress })} labelHidden /></span>
            <span>{file.progress === undefined ? t.uploadingPlain : fill(t.uploading, { percent: file.progress })}</span></> : null}
          {status === 'ready' ? <><Badge tone="success" icon={CheckIcon}>{t.ready}</Badge>{file.size ? <span>{formatBytes(file.size)}</span> : null}</> : null}
          {status === 'error' ? <><Badge tone="negative" icon={WarningIcon}>{file.error || t.failed}</Badge>{onRetry ? <Button variant="secondary" size="xs" icon={RefreshIcon} onClick={() => onRetry(file)}>{t.retry}</Button> : null}</> : null}
        </span>
      </span>
      <Button variant="secondary" size="sm" iconOnly icon={CloseIcon} label={status === 'uploading' ? t.cancelUpload : t.remove} onClick={() => (status === 'uploading' && onCancel ? onCancel(file) : onRemove && onRemove(file))} />
    </li>
  );
}

function Composer({ value = '', onChange, onSend, placeholder, label, sendLabel, disabled = false, attachments = [], onAttach, onRemoveAttachment, onRetryAttachment, onCancelAttachment,
  accept, imageAccept = 'image/*', emoji = true, voice = true, lang, sendOn = 'enter', replyTo, onCancelReply, strings, className, ...rest }) {
  const t = useStrings('chat', strings);
  placeholder = placeholder ?? t.placeholder; label = label ?? t.message; sendLabel = sendLabel ?? t.send;
  const [dragging, setDragging] = React.useState(false), [listening, setListening] = React.useState(false), [speech, setSpeech] = React.useState(false), [problem, setProblem] = React.useState('');
  const fileInput = React.useRef(null), imageInput = React.useRef(null), recognition = React.useRef(null), spoken = React.useRef({ base: '' }), latest = React.useRef(onChange);
  latest.current = onChange;
  React.useEffect(() => { setSpeech(!!speechConstructor()); }, []);
  React.useEffect(() => () => { if (recognition.current) recognition.current.abort(); }, []);
  const uploading = attachments.some((a) => a.status === 'uploading'), sendable = String(value).trim() || attachments.some((a) => (a.status || 'ready') === 'ready');
  const canSend = !disabled && !uploading && !!sendable;
  const stopListening = () => { if (recognition.current) recognition.current.stop(); };
  const send = () => { if (!canSend) return; spoken.current.open = false; stopListening(); if (onSend) onSend(value, attachments.filter((a) => (a.status || 'ready') === 'ready')); };
  const attach = (files) => { const list = Array.prototype.slice.call(files || []); if (list.length && onAttach) onAttach(list); };
  const listen = () => {
    const Recognition = speechConstructor();
    if (!Recognition || recognition.current) return;
    const r = new Recognition();
    r.lang = speechLanguage(lang); r.continuous = true; r.interimResults = true;
    const session = { base: String(value), open: true };
    spoken.current = session;
    r.onresult = (e) => {
      if (!session.open) return;
      let done = '', interim = '';
      for (let i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) done += e.results[i][0].transcript; else interim += e.results[i][0].transcript; }
      if (latest.current) latest.current(joinSpoken(spoken.current.base, done + interim));
    };
    r.onerror = (e) => { const blocked = e.error === 'not-allowed' || e.error === 'service-not-allowed'; setProblem(blocked ? t.micBlocked : t.micStopped); announce(blocked ? t.micBlocked : t.micStopped, { politeness: 'assertive' }); };
    r.onend = () => { session.open = false; if (recognition.current === r) recognition.current = null; setListening(false); };
    recognition.current = r; setProblem('');
    try { r.start(); setListening(true); announce(t.listening); } catch (err) { session.open = false; recognition.current = null; setProblem(t.micStopped); announce(t.micStopped, { politeness: 'assertive' }); }
  };
  // typing while dictating ends the dictation and keeps the text as typed: a later speech result would otherwise write the starting text plus the speech over it
  const typed = (text) => { if (recognition.current) { spoken.current.open = false; stopListening(); } if (onChange) onChange(text); };
  const emojiPanel = typeof emoji === 'function' ? emoji((text) => { if (onChange) onChange(String(value) + text); }) : <Text variant="secondary">{t.emojiSoon}</Text>;
  const hasFiles = !!onAttach, dropping = dragging && hasFiles;
  return (
    <form className={cx('plx-chat__composer', className)} onSubmit={(e) => { e.preventDefault(); send(); }} {...rest}>
      <div className={cx('plx-chat__box', dropping && 'plx-chat__box--drop')}
        onDragOver={hasFiles ? (e) => { if (Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) { e.preventDefault(); setDragging(true); } } : undefined}
        onDragLeave={hasFiles ? (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); } : undefined}
        onDrop={hasFiles ? (e) => { e.preventDefault(); setDragging(false); attach(e.dataTransfer.files); } : undefined}>
        {dropping ? <div className="plx-chat__drop" role="status">{t.dropFiles}</div> : null}
        {replyTo ? <ReplyPreview author={replyTo.author} text={replyTo.text} onCancel={onCancelReply} t={t} /> : null}
        {attachments.length ? <ul className="plx-chat__strip" aria-label={t.attachments}>{attachments.map((a) => <ComposerFile key={a.id} file={a} t={t} onRemove={onRemoveAttachment} onRetry={onRetryAttachment} onCancel={onCancelAttachment} />)}</ul> : null}
        <Textarea className="plx-chat__field" rows={2} autoGrow value={value} placeholder={placeholder} aria-label={label} disabled={disabled}
          onChange={(e) => typed(e.target.value)}
          onPaste={hasFiles ? (e) => { const files = e.clipboardData && e.clipboardData.files; if (files && files.length) { e.preventDefault(); attach(files); } } : undefined}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
            if (sendOn === 'mod-enter' ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey || e.altKey)) { e.preventDefault(); send(); }
          }} />
        {problem ? <div className="plx-chat__problem"><Text variant="caption">{problem}</Text></div> : null}
        <div className="plx-chat__tools">
          {hasFiles ? <>
            <Button variant="secondary" size="sm" iconOnly icon={AttachmentIcon} label={t.attach} disabled={disabled} onClick={() => fileInput.current && fileInput.current.click()} />
            <Button variant="secondary" size="sm" iconOnly icon={ImageIcon} label={t.image} disabled={disabled} onClick={() => imageInput.current && imageInput.current.click()} />
            <input ref={fileInput} type="file" multiple hidden accept={accept} onChange={(e) => { attach(e.target.files); e.target.value = ''; }} />
            <input ref={imageInput} type="file" multiple hidden accept={imageAccept} onChange={(e) => { attach(e.target.files); e.target.value = ''; }} /></> : null}
          {emoji ? <Popover title={t.emoji} size="sm" placement="top-start" trigger={<Button variant="secondary" size="sm" iconOnly icon={MoodIcon} label={t.emoji} disabled={disabled} />}><div className="plx-chat__panel">{emojiPanel}</div></Popover> : null}
          <span className="plx-chat__tools-end">
            {listening ? <span className="plx-chat__listening"><span className="plx-chat__dot" aria-hidden="true" />{t.listening}<Button variant="secondary" size="xs" icon={StopIcon} onClick={stopListening}>{t.stop}</Button></span> : null}
            {voice ? <Tooltip content={t.recordSoon}><span className="plx-chat__record" role="button" aria-disabled="true" tabIndex={0} aria-label={t.record}><Button variant="secondary" size="sm" iconOnly icon={GraphicEqIcon} label={t.record} tooltip={false} disabled aria-hidden="true" tabIndex={-1} /></span></Tooltip> : null}
            {voice && speech ? <span className={cx('plx-chat__mic', listening && 'plx-chat__mic--listening')}><Button variant="secondary" size="sm" iconOnly icon={MicIcon} label={listening ? t.stop : t.dictate} disabled={disabled} onClick={listening ? stopListening : listen} /></span> : null}
            <Button type="submit" variant="primary" size="sm" icon={SendIcon} disabled={!canSend}>{sendLabel}</Button>
          </span>
        </div>
      </div>
    </form>
  );
}

export const Chat = { Header, Thread, Group, Divider, Message, Attachments, Attachment, Voice, Composer, Typing };
