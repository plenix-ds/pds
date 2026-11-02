/* Plenix · Avatar
   Summary: A person's picture, or their initials, in a rounded square (never a circle), inside a 1px media border (owner,
     2026-10-19: every avatar and picture placeholder has the same border).
   Usage:
     <Avatar name="Maya Chen" size="md" />
     <Avatar name="Maya Chen" src="/people/mc.jpg" label="Maya Chen" />
     <Avatar ai="claude" label="Claude" />          <Avatar logo={CompanyLogo} label="Acme Assistant" />
   Props:
     name: the person's name; without a picture the avatar shows its initials, from initialsOf(name)
     src: the URL of the person's picture; it replaces the initials
     initials: the text to show, only when there is no name to work from
     ai: an AI participant's provider, shown as its logo: "claude" | "anthropic" | "gemini" | "perplexity" | "meta" |
       "mistral" | "deepseek" (the brands' own single-color marks, built in: platform/icons/custom/BRANDS.md, which also lists
       the providers not included); give label (or a name nearby) as for a person
     logo: any other logo, as an icon (a module imported or registered through the icon path, or an icon name), never markup
     The order: a logo (ai, then logo) first, then the picture (src), then the gender icon or the initials
     size: "2xs" 20px | "xs" 24px | "sm" 28px (default) | "md" 32px | "lg" 40px | "xl" 48px | "2xl" 64px; "2xs" is for inside a small control
       (the account row in a pane footer)
     color: the person's own color when the data has one, a data color: a hue name (blue, green, purple, red, brown, gray: the --plx-sys-data-color-<hue> tokens), set as data-plx-color; no value is written (batch 280): its soft fill with
       its text color (otherwise the theme's avatar colors)
     category: instead of color, a category color by name (an avatar standing for a category): the color as its fill,
       black or white text (batch 290)
     gender: "male" | "female": with no picture, the person-male or person-female icon on soft blue or soft pink (the
       category palette) instead of the initials; any other value keeps the initials (owner, 2026-10-19)
     label: the person's name for assistive technology when no visible name is nearby; without it the avatar is hidden from
       assistive technology
     presence: the person's availability (library wave 4): "online" | "away" | "busy" | "dnd" (do not disturb)
       | "offline", a StatusDot at the avatar's bottom end corner in the presence roles of the Status colors, ringed in the surface color;
       its size follows the avatar (a 6px dot up to 32px, 12px at 40 and 48px, 16px at 64px), and from 40px it carries the
       availability's shape (a check, a clock, busy the solid dot, do not disturb a minus, a cross) so it never rests on
       color alone
     strings: the words of presence, for other languages: { online: "Online", away: "Away", busy: "Busy",
       dnd: "Do not disturb", offline: "Offline" }
     className: more classes on the avatar
   Behavior:
     A picture that fails to load falls back to the initials. The picture loads lazily and decodes off the main thread
     (loading="lazy", decoding="async"), so a long list or table of avatars fetches only the ones near the view.
     The corner and the text size follow the size.
     Initials are the first letters of the first and last name ("Maya Chen" → MC).
     Titles such as "Fr." or "Dr." and parenthesized parts are skipped; one word gives one letter.
     With a label the avatar is an image (role="img") named by the label; with presence too, the name and the state ("Maya Chen, Busy").
     Without a label the presence dot is hidden with the avatar: the page says the state in words next to it.
   Notes:
     Other props pass through to the <span>.
     initialsOf(name) is also exported for pages that need the same initials. A name with no Latin letter (an Arabic name)
       takes each word's first letter; two Arabic initials are kept apart so they do not join (owner, ctm-needs-34).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import { StatusDot } from '../StatusDot/StatusDot.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import PersonFemaleIcon from 'plenix-platform/icons/plenix/person-female';
import PersonMaleIcon from 'plenix-platform/icons/plenix/person-male';
import AnthropicLogo from 'plenix-platform/icons/plenix/ai-anthropic';
import ClaudeLogo from 'plenix-platform/icons/plenix/ai-claude';
import DeepSeekLogo from 'plenix-platform/icons/plenix/ai-deepseek';
import GeminiLogo from 'plenix-platform/icons/plenix/ai-gemini';
import MetaLogo from 'plenix-platform/icons/plenix/ai-meta';
import MistralLogo from 'plenix-platform/icons/plenix/ai-mistral';
import PerplexityLogo from 'plenix-platform/icons/plenix/ai-perplexity';

// the built-in AI provider logos (owner, 2026-10-29, #637): the brands' own single-color marks, platform/icons/custom/BRANDS.md
const AI = { anthropic: AnthropicLogo, claude: ClaudeLogo, deepseek: DeepSeekLogo, gemini: GeminiLogo, meta: MetaLogo, mistral: MistralLogo, perplexity: PerplexityLogo };

const SIZES = [20, 24, 28, 32, 40, 48, 64];   // the scale its classes define (plx-avatar--24 …)
// the names pages use: 2xs 20 (inside a small control: the account row in a pane footer), xs 24, sm 28, md 32, lg 40, xl 48, 2xl 64 (numbers are rejected by the system check)
const NAMED = { '2xs': 20, xs: 24, sm: 28, md: 32, lg: 40, xl: 48, '2xl': 64 };
// presence (library wave 4): the availability tones, the dot's size for each avatar size, and the words
const PRESENCE = ['online', 'away', 'busy', 'dnd', 'offline'];
const DOT = { 20: 'sm', 24: 'sm', 28: 'sm', 32: 'sm', 40: 'md', 48: 'md', 64: 'lg' };

// first- and last-name initials: titles (a word ending in a period, e.g. "Fr.") and parenthesized parts are skipped.
// A word's initial is its first Latin letter or digit, as always; a word with none (an Arabic name, owner ctm-needs-34) takes
// its first letter of any script. Two Arabic initials are kept apart (a zero-width non-joiner), so they do not join into a word.
const LATIN = /[A-Za-z0-9]/, ANY = /[\p{L}\p{N}]/u, JOINING = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const initialOf = (w) => (w.match(LATIN) || w.match(ANY) || [''])[0];
export function initialsOf(name) {
  const words = String(name || '').replace(/\([^)]*\)/g, ' ').split(/\s+/).filter((w) => w && !/\.$/.test(w) && initialOf(w));
  if (!words.length) return '';
  const first = initialOf(words[0]), last = words.length > 1 ? initialOf(words[words.length - 1]) : '';
  return (first + (JOINING.test(first) && JOINING.test(last) ? '\u200C' : '') + last).toUpperCase();
}

const GENDER = { male: { tone: 'blue', icon: PersonMaleIcon }, female: { tone: 'pink', icon: PersonFemaleIcon } };

export function Avatar({ name, src, initials, ai, logo, size = 'sm', color, category, gender, label, presence, strings, className, ...rest }) {
  devWarn('Avatar', { size, ai }, { size: ['2xs','xs','sm','md','lg','xl','2xl'], ai: Object.keys(AI) });
  // a logo first (an AI provider's, or the one given), then the picture, then the gender icon or the initials
  const mark = AI[ai] || logo || null;
  const n = NAMED[size] || size;
  const s = SIZES.indexOf(n) >= 0 ? n : NAMED.sm;
  const text = name ? initialsOf(name) : initials;
  const p = PRESENCE.indexOf(presence) >= 0 ? presence : null;
  const words = useStrings('avatar', strings);
  const named = label && p ? label + ', ' + words[p] : label;
  // a picture that fails to load falls back to the initials (batch 215)
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [src]);
  const picture = !mark && src && !failed;
  const g = !mark && !picture ? GENDER[gender] : null;   // no logo, no picture and a known gender: the gender icon
  return (
    <span className={cx('plx-avatar', 'plx-avatar--' + s, p && 'plx-avatar--presence', g && 'plx-avatar--gender', className)} data-plx-avatar="" data-plx-color={g ? undefined : color || undefined} data-plx-category={g ? g.tone : category || undefined} role={label ? 'img' : undefined}
      aria-label={named} aria-hidden={label ? undefined : true} {...rest}>{mark ? <Icon name={mark} className="plx-avatar__logo" /> : picture ? <img className="plx-avatar__image" src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} /> : g ? <Icon name={g.icon} filled className="plx-avatar__gender" /> : text}
      {p ? <StatusDot tone={p} size={DOT[s]} icon={DOT[s] !== 'sm'} className="plx-avatar__presence" /> : null}</span>
  );
}
