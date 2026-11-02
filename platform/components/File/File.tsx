/* Plenix · File
   Summary: A file or a folder as one object, the same everywhere it appears (12 Specialized › Files, assets, and DAM ›
     File, Folder): its type's icon (or a small picture), its name, with the extension kept in view when a long name is
     cut, and its facts, the size and the date for a file, the number of items for a folder, in the data font. A line
     inside lists, rows and pickers; a chip for attachments.
   Usage:
     <File name="Letterhead.pdf" size={1240000} modified="2026-10-14" />
     <File kind="folder" name="Brand kit" count={24} onOpen={() => openFolder('brand')} />
     <File name="Cross 014.png" src="/thumbs/cross-014.png" size={482000} href="/files/cross-014" />
     <File name="Minutes 2026-10.docx" appearance="chip" size={88000} />
   Props:
     name: the file's or folder's name, as it is stored (required; never rewritten)
     kind: "file" (default) | "folder"
     size: the file's size in bytes (written by formatBytes: "1.2 MB"); a string is shown as it is
     modified: when it last changed: a Date or "YYYY-MM-DD" (written by formatDate, short: "Oct 14")
     count: a folder's number of items ("24 items")
     meta: more facts after the size and the date (text or nodes; wrap technical values in <Text variant="data">)
     type: the file's MIME type ("image/png"), used for the icon when the extension says nothing
     icon: an icon name from platform/icons/map.json, instead of the type's own icon (fileIcon)
     src: a small picture of the file (an image's thumbnail): drawn in place of the icon; it falls back to the icon
     open: a folder shows the open folder icon (a folder open in a tree); default false
     appearance: "line" (default: no frame, inside rows and lists) | "chip" (a framed chip: attachments, a field's value)
     href: the name becomes a link to the file or folder; onOpen(): the name becomes a button that runs it (only one)
     strings: the words, for other languages: { folder: "folder", items: "{n} items", item: "{n} item" }
     className: more classes on the file
   Behavior:
     The name is one text: a long name is cut at the end of its base name with an ellipsis, so the extension (".pdf")
       always stays in view; the full name is the element's title and its accessible name.
     With href the name is a link (it goes to the file's page); with onOpen it is a button (it opens a viewer or the
       folder in place). Either is the one Tab stop of the file; without them the file is static text.
     A folder's name is followed by the word "folder" for screen readers (visually hidden), so the kind is never only
       an icon.
   Notes:
     The icon is decorative: the name, with its extension, says the type. Icons by extension: fileIcon(name, type) (PDF,
       PNG, JPG, SVG, PSD, AI, ZIP; documents, tables, code and images by kind; "document" otherwise).
     File names (with their extension) are technical values: the data font. Folder names are labels: the UI font. Sizes,
       dates and counts: the data font.
     Other props pass through to the outer <span>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatBytes, formatDate, formatNumber } from '../../utils/format.ts';
import type { DateInput } from '../../utils/format.ts';
import { Icon } from '../Icon/Icon.tsx';
import type { IconModule, IconValue } from '../Icon/Icon.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { development } from '../../utils/devWarn.ts';
import CodeIcon from 'plenix-platform/icons/plenix/code';
import DocTextIcon from 'plenix-platform/icons/plenix/doc-text';
import DocumentIcon from 'plenix-platform/icons/plenix/document';
import FileAiIcon from 'plenix-platform/icons/plenix/file-ai';
import FileJpgIcon from 'plenix-platform/icons/plenix/file-jpg';
import FilePdfIcon from 'plenix-platform/icons/plenix/file-pdf';
import FilePngIcon from 'plenix-platform/icons/plenix/file-png';
import FilePsdIcon from 'plenix-platform/icons/plenix/file-psd';
import FileSvgIcon from 'plenix-platform/icons/plenix/file-svg';
import FileZipIcon from 'plenix-platform/icons/plenix/file-zip';
import FolderIcon from 'plenix-platform/icons/plenix/folder';
import FolderOpenIcon from 'plenix-platform/icons/plenix/folder-open';
import ImageA2Icon from 'plenix-platform/icons/plenix/image-a-2';
import TableIcon from 'plenix-platform/icons/plenix/table';
import { fill } from '../../utils/fill.ts';

const BY_EXT: Record<string, string> = {
  pdf: 'file-pdf', png: 'file-png', jpg: 'file-jpg', jpeg: 'file-jpg', svg: 'file-svg', psd: 'file-psd', ai: 'file-ai',
  zip: 'file-zip', rar: 'file-zip', '7z': 'file-zip', gz: 'file-zip', tar: 'file-zip',
  doc: 'doc-text', docx: 'doc-text', odt: 'doc-text', rtf: 'doc-text', txt: 'doc-text', md: 'doc-text', pages: 'doc-text',
  xls: 'table', xlsx: 'table', ods: 'table', csv: 'table', numbers: 'table',
  gif: 'image-a-2', webp: 'image-a-2', heic: 'image-a-2', tif: 'image-a-2', tiff: 'image-a-2', avif: 'image-a-2', bmp: 'image-a-2',
  js: 'code', jsx: 'code', ts: 'code', json: 'code', html: 'code', css: 'code', xml: 'code', yml: 'code', yaml: 'code',
};

// the part after the last dot (not a leading dot: ".env" has no extension), lowercased
export function fileExtension(name: unknown): string {
  const s = String(name || '');
  const i = s.lastIndexOf('.');
  return i > 0 && i < s.length - 1 ? s.slice(i + 1).toLowerCase() : '';
}

// the icon of a file's type: by its extension, else by its MIME type, else "document"
export function fileIcon(name: unknown, type?: string | null): string {
  const ext = fileExtension(name);
  if (BY_EXT[ext]) return BY_EXT[ext];
  if (/^image\//.test(type || '')) return 'image-a-2';
  if (/^text\//.test(type || '')) return 'doc-text';
  return 'document';
}
// the same icon as the imported module the File draws (#280): fileIcon stays a name (it is public: a caller may print or
// compare it); this one is the component's own (plx-icons: is not needed, every name it can return is imported here)
const TYPE_ICONS: Record<string, IconModule> = Object.fromEntries([CodeIcon, DocTextIcon, DocumentIcon, FileAiIcon, FileJpgIcon, FilePdfIcon, FilePngIcon, FilePsdIcon, FileSvgIcon, FileZipIcon, ImageA2Icon, TableIcon].map((m) => [m.name, m]));
// a type whose icon has no import here (one added to BY_EXT alone) draws the document icon, and development says so once,
// so the icon never silently disappears
const unmapped = new Set<string>();
function fileIconModule(name: string, type?: string | null): IconModule {
  const n = fileIcon(name, type);
  if (TYPE_ICONS[n]) return TYPE_ICONS[n];
  if (!unmapped.has(n) && development() && typeof console !== 'undefined') { unmapped.add(n); console.warn('[Plenix] File: the type icon "' + n + '" has no import in File.tsx (TYPE_ICONS); the document icon is drawn.'); }
  return DocumentIcon;
}

function Picture({ src, icon }: { src?: string | null; icon: IconValue }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [src]);
  if (src && !failed) return <img className="plx-file__picture" src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
  return <span className="plx-file__icon" aria-hidden="true"><Icon name={icon} /></span>;
}

export type FileProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** the file's name, with its extension */
  name?: string;
  kind?: 'file' | 'folder';
  /** in bytes (a string is shown as it is) */
  size?: number | string | null;
  /** when it last changed: a Date or "YYYY-MM-DD" */
  modified?: DateInput;
  /** a folder's item count */
  count?: number;
  /** more after the facts */
  meta?: React.ReactNode;
  /** the MIME type (the icon when the extension says nothing) */
  type?: string;
  icon?: IconValue;
  /** a picture instead of the icon */
  src?: string;
  /** a folder is open */
  open?: boolean;
  appearance?: 'line' | 'chip';
  href?: string;
  onOpen?: () => void;
  strings?: Catalog | null;
};
export function File({ name = '', kind = 'file', size, modified, count, meta, type, icon, src, open = false, appearance = 'line',
  href, onOpen, strings, className, ...rest }: FileProps) {
  const t = useStrings('file', strings) as { item: string; items: string; folder: string };
  const folder = kind === 'folder';
  const ext = folder ? '' : fileExtension(name);
  const base = ext ? name.slice(0, name.length - ext.length - 1) : name;
  const glyph = icon || (folder ? (open ? FolderOpenIcon : FolderIcon) : fileIconModule(name, type));
  const facts: string[] = [];
  if (!folder && size !== undefined && size !== null && size !== '') facts.push(typeof size === 'number' ? formatBytes(size) : String(size));
  if (folder && typeof count === 'number') facts.push(fill(count === 1 ? t.item : t.items, { n: formatNumber(count) }));
  if (modified) facts.push(formatDate(modified, { dateStyle: 'short' }));
  const text = (
    <>
      <span className="plx-file__base">{base}</span>
      {ext ? <span className="plx-file__ext">{'.' + ext}</span> : null}
      {folder ? <VisuallyHidden>{', ' + t.folder}</VisuallyHidden> : null}
    </>
  );
  const nameCls = cx('plx-file__name', !folder && 'plx-file__name--data');
  const nameEl = href ? <a className={nameCls} href={href} title={name}>{text}</a>
    : onOpen ? <button type="button" className={nameCls} title={name} onClick={onOpen}>{text}</button>
      : <span className={nameCls} title={name}>{text}</span>;
  return (
    <span className={cx('plx-file', 'plx-file--' + (folder ? 'folder' : 'file'), 'plx-file--' + (appearance === 'chip' ? 'chip' : 'line'), className)} {...rest}>
      <Picture src={folder ? null : src} icon={glyph} />
      <span className="plx-file__text">
        {nameEl}
        {facts.length || meta ? (
          <span className="plx-file__meta">
            {facts.length ? <span className="plx-file__facts">{facts.join(' · ')}</span> : null}
            {meta ? <span className="plx-file__more">{meta}</span> : null}
          </span>
        ) : null}
      </span>
    </span>
  );
}
