/* Plenix · DownloadButton
   Summary: A button that saves a file to the device (04 Actions & Commands › Common actions › Download): the download
     icon, its label, the file's format and size before it starts, and its progress while a large or prepared file comes
     down.
   Usage:
     <DownloadButton href="/files/cross-014.png" fileName="cross-014.png" />
     <DownloadButton href={url} fileName="brand-kit.zip" format="ZIP" size={48200000}>Download original</DownloadButton>
     <DownloadButton iconOnly href={url} fileName="report.pdf" />
     <DownloadButton onDownload={start} progress={percent} fileName="export.csv" />     // prepared by the app
   Props:
     href: the file's address; it renders a link with the download attribute (the browser saves the file)
     fileName: the name the file is saved under (the download attribute); it is also part of the accessible name
     onDownload(event): runs on click instead of following a link (a file the app prepares or fetches itself)
     format: the file's format as people know it ("PNG", "PDF"); shown after the label in the data font
     size: the file's size in bytes; shown after the format (formatBytes: "4.2 MB")
     progress: while downloading: a number from 0 to 100, or true when the amount is unknown; leave it out otherwise
     iconOnly: only the download icon (default false); its name still says what downloads
     variant: the Button variant (default "secondary")
     buttonSize: the Button size, "md" (default) | "sm" | "xs"
     locale: the language the size and percent are formatted in (default: the page's language)
     strings: the words it shows and announces, for other languages: { download: "Download", downloading: "Downloading",
       ready: "Download ready" }
     children: the label (default strings.download)
     className: more classes on the button
     Other props pass through to the Button.
   Behavior:
     Before it starts, the format and size show after the label ("Download · PNG · 4.2 MB"), so people know what they
       get; an icon-only button says them in its name.
     While progress is set the icon becomes a progress ring (an unknown amount turns) and the label says "Downloading"
       with the percent in the data font; the button is busy (aria-busy) and a click does nothing, so a file never
       downloads twice. When progress reaches 100 "Download ready" is announced politely.
     The accessible name names the file and its format: "Download cross-014.png (PNG, 4.2 MB)".
   Notes:
     One file in its stored format. Several formats or sizes: a Menu of downloads; a changed or filtered copy: Export.
     Opening a file in the browser is a Link, not a download.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle.tsx';
import { formatBytes, formatPercent } from '../../utils/format.ts';
import { announce } from '../../utils/announce.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import DownloadArrowIcon from 'plenix-platform/icons/plenix/download-arrow';


export const DownloadButton = React.forwardRef(function DownloadButton({ href, fileName, onDownload, format, size, progress, iconOnly = false,
  variant = 'secondary', buttonSize = 'md', locale, strings, children, className, ...rest }, ref) {
  devWarn('DownloadButton', { variant }, { variant: ['secondary','primary','tertiary','ghost','danger','danger-secondary','quiet'] });
  const t = useStrings('downloadButton', strings);
  const busy = progress !== undefined && progress !== null && progress !== false;
  const known = busy && typeof progress === 'number';
  const pct = known ? Math.max(0, Math.min(100, progress)) : null;
  const bytes = typeof size === 'number' ? formatBytes(size, { locale }) : '';
  const facts = [format, bytes].filter(Boolean);
  const percent = known ? formatPercent(pct / 100, { locale, decimals: 0 }) : '';
  // the finished download is announced once, when progress reaches 100
  const done = React.useRef(false);
  React.useEffect(() => {
    if (known && pct >= 100 && !done.current) { done.current = true; announce(t.ready + (fileName ? ': ' + fileName : '')); }
    if (!busy) done.current = false;
  }, [busy, known, pct]);
  const label = children !== undefined && children !== null ? children : t.download;
  const word = typeof label === 'string' ? label : t.download;
  const name = busy ? [t.downloading, fileName, percent].filter(Boolean).join(' ')
    : [word, fileName].filter(Boolean).join(' ') + (facts.length ? ' (' + facts.join(', ') + ')' : '');
  const icon = busy ? <ProgressCircle size="sm" value={known ? pct : undefined} label={t.downloading} aria-hidden="true" /> : DownloadArrowIcon;
  const onClick = (e) => { if (busy) { e.preventDefault(); return; } if (onDownload) onDownload(e); };
  return (
    <Button ref={ref} variant={variant} size={buttonSize} icon={icon} iconOnly={iconOnly} label={name}
      href={busy ? undefined : href} download={href && !busy ? (fileName || '') : undefined}
      aria-busy={busy || undefined} aria-disabled={busy || undefined}
      className={cx('plx-download-button', busy && 'is-loading', className)} onClick={onClick} {...rest}>
      {busy ? <>{t.downloading}{percent ? <span className="plx-download-button__percent">{percent}</span> : null}</>
        : <>{label}{facts.length ? <span className="plx-download-button__meta">{facts.join(' · ')}</span> : null}</>}
    </Button>
  );
});
