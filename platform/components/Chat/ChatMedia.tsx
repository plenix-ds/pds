/* Plenix · Chat media (the parts of Chat.jsx that show files and voice inside a message; documented in Chat.jsx)
   Summary: Chat.Attachment (a picture or a file in a bubble), Chat.Attachments (the row or column of them, one viewer for the pictures)
     and Chat.Voice (the voice-message player). The composer's file icons come from here too.
   Usage:
     <Chat.Attachments><Chat.Attachment src={url} name="wall.png" /><Chat.Attachment type="file" name="quotes.pdf" size={2400000} href={url} /></Chat.Attachments>
     <Chat.Voice src={audioUrl} duration={23} />
   Props:
     the same as in Chat.jsx (Chat.Attachment: type, src, name, alt, size, href, onDownload; Chat.Voice: src, duration, peaks, label, rates, strings).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Text } from '../Text/Text.tsx';
import { MediaViewer } from '../MediaViewer/MediaViewer.tsx';
import { useStrings, useDigits } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import type { IconModule } from '../Icon/Icon.tsx';
import { announce } from '../../utils/announce.tsx';
import { formatBytes, formatNumber, formatDuration, formatLocale, numeralLocale } from '../../utils/format.ts';
import { localDigits } from '../../utils/digits.ts';
import DocumentIcon from 'plenix-platform/icons/plenix/document';
import FilePdfIcon from 'plenix-platform/icons/plenix/file-pdf';
import FileJpgIcon from 'plenix-platform/icons/plenix/file-jpg';
import FilePngIcon from 'plenix-platform/icons/plenix/file-png';
import FileSvgIcon from 'plenix-platform/icons/plenix/file-svg';
import FilePsdIcon from 'plenix-platform/icons/plenix/file-psd';
import FileAiIcon from 'plenix-platform/icons/plenix/file-ai';
import PlayIcon from 'plenix-platform/icons/material/play-arrow';
import PauseIcon from 'plenix-platform/icons/material/pause';
import DownloadIcon from 'plenix-platform/icons/material/download';
import BrokenImageIcon from 'plenix-platform/icons/material/broken-image';
import { fill } from '../../utils/fill.ts';

const FILE_ICONS: Record<string, IconModule> = { pdf: FilePdfIcon, jpg: FileJpgIcon, jpeg: FileJpgIcon, png: FilePngIcon, svg: FileSvgIcon, psd: FilePsdIcon, ai: FileAiIcon };
const fileIconOf = (name: unknown) => FILE_ICONS[(String(name || '').split('.').pop() || '').toLowerCase()] || DocumentIcon;
export const FileIcon = ({ name }: { name?: string }) => <Icon icon={fileIconOf(name)} size="lg" />;
const clock = (seconds: unknown) => { const n = Math.max(0, Math.floor(Number(seconds) || 0)); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); };

type Words = Record<string, string>;
type Group = { open: (index: number | null) => void };
const GroupContext = React.createContext<Group | null>(null);

// a picture: a button that opens the viewer; a picture that does not load becomes a card that says so
function Picture({ src, name, alt, row, index, t }: { src?: string; name?: string; alt?: string; row?: boolean; index?: number; t: Words }) {
  const group = React.useContext(GroupContext);
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null), failed = failedSrc === src; // a new src is tried again
  if (failed) {
    return (
      <span className={cx('plx-chat__image', 'plx-chat__image--broken', row && 'plx-chat__image--row')} role="img" aria-label={t.imageFailed + (name ? ': ' + name : '')}>
        <Icon icon={BrokenImageIcon} size="lg" />
        <span className="plx-chat__image-broken-text">{t.imageFailed}</span>
      </span>
    );
  }
  return (
    <button type="button" className={cx('plx-chat__image', row && 'plx-chat__image--row')} aria-haspopup="dialog" aria-label={t.openImage + ': ' + (alt || name || '')} onClick={() => group && group.open(index as number)}>
      <img className="plx-chat__image-picture" src={src} alt="" onError={() => setFailedSrc(src as string)} />
    </button>
  );
}

// a file: its icon with a border, its name and size, and Download
function FileCard({ name, size, href, onDownload, t }: { name?: string; size?: number; href?: string; onDownload?: () => void; t: Words }) {
  return (
    <span className="plx-chat__file">
      <span className="plx-chat__attachment-thumb"><FileIcon name={name} /></span>
      <span className="plx-chat__attachment-body">
        <span className="plx-chat__attachment-name">{name}</span>
        {size ? <span className="plx-chat__attachment-meta"><bdi>{formatBytes(size)}</bdi></span> : null}
      </span>
      <Button variant="secondary" size="sm" iconOnly icon={DownloadIcon} label={t.download + ': ' + name} href={href} download={href ? name : undefined} onClick={onDownload ? () => onDownload() : undefined} />
    </span>
  );
}

/** @public an attachment: type "image" (default) | "file"; src, name, alt, size, href, onDownload (ADR 0011) */
export type AttachmentProps = { type?: 'image' | 'file'; src?: string; name?: string; alt?: string; size?: number; href?: string; onDownload?: () => void; row?: boolean; index?: number; strings?: Catalog | null };
function Attachment(props: AttachmentProps) {
  const group = React.useContext(GroupContext);
  const t = useStrings('chat', props.strings) as unknown as Words;
  if (!group) return <Attachments><Attachment {...props} /></Attachments>;
  const { type = 'image', src, name, alt, size, href, onDownload, row, index } = props;
  return type === 'file'
    ? <FileCard name={name} size={size} href={href || src} onDownload={onDownload} t={t} />
    : <Picture src={src} name={name} alt={alt} row={row} index={index} t={t} />;
}

/** @public a group of attachments: pictures open one viewer (ADR 0011) */
export type AttachmentsProps = React.HTMLAttributes<HTMLSpanElement> & { strings?: Catalog | null };
function Attachments({ className, children, strings, ...rest }: AttachmentsProps) {
  const [at, setAt] = React.useState<number | null>(null);
  const list = React.Children.toArray(children).filter((c): c is React.ReactElement<AttachmentProps> => React.isValidElement(c));
  const isImage = (c: React.ReactElement<AttachmentProps>) => c.type === Attachment && (c.props.type || 'image') !== 'file';
  const pictures = list.filter(isImage);
  const items = pictures.map((c) => ({ src: c.props.src as string, alt: c.props.alt || c.props.name || '', title: c.props.name, meta: c.props.size ? [formatBytes(c.props.size)] : undefined }));
  let n = 0;
  const shown = list.map((c) => (isImage(c) ? React.cloneElement(c, { row: pictures.length > 1, index: n++ }) : c));
  const ctx = React.useMemo(() => ({ open: setAt }), []);
  return (
    <GroupContext.Provider value={ctx}>
      <span className={cx('plx-chat__media', pictures.length > 1 && 'plx-chat__media--row', className)} {...rest}>{shown}</span>
      {items.length ? <MediaViewer open={at !== null} items={items} index={at === null ? 0 : at} onIndexChange={setAt} onClose={() => setAt(null)} strings={strings && (strings as unknown as { viewer?: Catalog }).viewer} /> : null}
    </GroupContext.Provider>
  );
}

// the bars: a few levels of height (four), so the sizes are tokens; with no peaks given a fixed shape is drawn
const DEFAULT_PEAKS = [0.2, 0.4, 0.7, 0.5, 0.3, 0.8, 1, 0.6, 0.35, 0.65, 0.9, 0.45, 0.2, 0.5, 0.75, 1, 0.65, 0.35, 0.3, 0.6, 0.85, 0.45, 0.2, 0.35];
const levelOf = (p: unknown) => 1 + Math.min(3, Math.floor(Math.max(0, Math.min(1, Number(p) || 0)) * 4));
const RATES = [1, 1.5, 2];
let playing: HTMLAudioElement | null = null; // one voice message plays at a time

/** @public a voice message: src, duration, peaks, label, rates (ADR 0011) */
export type VoiceProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & { src?: string; duration?: number; peaks?: number[]; label?: string; rates?: number[]; strings?: Catalog | null };
function Voice({ src, duration, peaks, label, rates = RATES, strings, className, ...rest }: VoiceProps) {
  const t = useStrings('chat', strings) as unknown as Words;
  // the time and the speed in the page's digits (Arabic-Indic in Arabic, like the file size); the slider reads the time as words ("8 seconds of 23 seconds")
  const digits = useDigits(), locale = numeralLocale(formatLocale(), digits);
  const shown = (s: unknown) => localDigits(clock(s), { digits });
  const spoken = (s: unknown) => formatDuration(Math.max(0, Math.floor(Number(s) || 0)), { locale, display: 'long' });
  const audio = React.useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = React.useState(false), [time, setTime] = React.useState(0), [total, setTotal] = React.useState(Number(duration) || 0), [rate, setRate] = React.useState(0), [failed, setFailed] = React.useState(false), [focus, setFocus] = React.useState(false);
  const bars = (peaks && peaks.length ? peaks.slice(0, 48) : DEFAULT_PEAKS), reached = total ? Math.round((time / total) * bars.length) : 0;
  React.useEffect(() => () => { if (playing === audio.current) playing = null; }, []);
  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (!a.paused) { a.pause(); return; }
    if (playing && playing !== a) playing.pause();
    setFailed(false);
    const started = a.play();
    if (started && started.catch) started.catch(() => { setFailed(true); announce(t.voiceFailed, { politeness: 'assertive' }); });
  };
  const seek = (value: number) => { const a = audio.current; if (a) a.currentTime = value; setTime(value); };
  const cycle = () => { const next = (rate + 1) % rates.length; setRate(next); if (audio.current) audio.current.playbackRate = rates[next]; };
  const name = label || t.playVoice, speed = formatNumber(rates[rate], { locale });
  return (
    <span className={cx('plx-chat__voice', className)} {...rest}>
      <audio ref={audio} src={src} preload="metadata"
        onLoadedMetadata={(e) => { if (isFinite(e.currentTarget.duration)) setTotal(e.currentTarget.duration); }}
        onPlay={() => { playing = audio.current; (audio.current as HTMLAudioElement).playbackRate = rates[rate]; setOn(true); }}
        onPause={() => { if (playing === audio.current) playing = null; setOn(false); }}
        onEnded={() => { setOn(false); setTime(0); }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onError={() => { setFailed(true); announce(t.voiceFailed, { politeness: 'assertive' }); }} />
      <Button variant="secondary" size="sm" iconOnly icon={on ? PauseIcon : PlayIcon} label={on ? t.pauseVoice : name} onClick={toggle} />
      <span className={cx('plx-chat__voice-wave', focus && 'plx-chat__voice-wave--focus')} dir="ltr">
        <span className="plx-chat__voice-bars" aria-hidden="true">{bars.map((p, i) => <span key={i} className={cx('plx-chat__bar', 'plx-chat__bar--h' + levelOf(p), i < reached && 'plx-chat__bar--played')} />)}</span>
        <input type="range" className="plx-chat__voice-seek" min={0} max={total || 0} step={1} value={Math.min(Math.floor(time), Math.floor(total || 0))} disabled={!total}
          aria-label={t.voiceSeek} aria-valuetext={fill(t.voicePosition, { time: spoken(time), total: spoken(total) })} onChange={(e) => seek(Number(e.target.value))}
          onFocus={(e) => setFocus(e.target.matches(':focus-visible'))} onBlur={() => setFocus(false)} />
      </span>
      <span className="plx-chat__voice-time" dir="ltr">{on || time ? shown(time) + ' / ' + shown(total) : shown(total)}</span>
      <Button variant="secondary" size="sm" aria-label={fill(t.voiceSpeed, { rate: speed })} onClick={cycle}>{speed}×</Button>
      {failed ? <Text variant="caption">{t.voiceFailed}</Text> : null}
    </span>
  );
}

export { Attachment, Attachments, Voice };
