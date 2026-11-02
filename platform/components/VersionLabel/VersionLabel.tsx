/* Plenix · VersionLabel
   Summary: Which version of an item this is: a number ("v12") or a semantic version ("2.1.0") in the data font, with a
     qualifier when it helps ("Latest", "Draft") (03 Content & Identity › Metadata › Version label).
   Usage:
     <VersionLabel version={12} />
     <VersionLabel version="2.1.0" status="latest" />
     <VersionLabel version={3} status="draft" size="sm" href="#history" />
   Props:
     version: a whole number (drawn "v12") or a semantic version string (drawn as it is, "2.1.0"); never both mixed
     status: "latest" | "draft": the qualifier on a neutral badge after the number; leave it out for any other version
     size: "md" (default: 12px text and a 20px badge) | "sm" (compact: 11px text and a 16px badge, for table rows and
       dense lists)
     href: the version history: the number becomes a link to it
     strings: the words, for other languages: { version: "Version", prefix: "v", latest: "Latest", draft: "Draft" }
     className: more classes on the label
   Behavior:
     Read as "Version 12" (the prefix "v" is hidden from assistive technology and the word is said instead), then the
       qualifier.
     Not interactive itself; with href the number is a link (one Tab stop).
   Notes:
     One format across the product: numbers for an item's saved versions, semantic versions for releases.
     Mark only one version "Latest" at a time.
     Other props pass through to the <span>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Badge } from '../Badge/Badge.tsx';
import { Link } from '../Link/Link.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

const STATUSES = ['latest', 'draft'];

export function VersionLabel({ version, status, size = 'md', href, strings, className, ...rest }) {
  devWarn('VersionLabel', { size }, { size: ['md','sm'] });
  const words = useStrings('versionLabel', strings);
  const s = size === 'sm' ? 'sm' : 'md';
  const numbered = typeof version === 'number' || /^\d+$/.test(String(version));
  const number = (
    <>
      <VisuallyHidden>{words.version + ' '}</VisuallyHidden>
      {numbered ? <span aria-hidden="true">{words.prefix}</span> : null}
      {String(version)}
    </>
  );
  return (
    <span className={cx('plx-version-label', 'plx-version-label--' + s, className)} {...rest}>
      {href ? <Link href={href} className="plx-version-label__number">{number}</Link> : <span className="plx-version-label__number">{number}</span>}
      {STATUSES.indexOf(status) >= 0 ? <Badge tone="neutral" size={s === 'sm' ? 'sm' : 'md'} className="plx-version-label__status">{words[status]}</Badge> : null}
    </span>
  );
}
