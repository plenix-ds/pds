/* Plenix · FeatureCard
   Summary: A card that presents one feature, capability or entry point (07 Data Display › Cards and objects › Feature
     card): its icon or picture, its name and a sentence on what it does; the whole card opens it. Built from Card,
     Icon and Image.
   Usage:
     <FeatureCard icon="sparkle" hue="purple" title="Smart tags" description="Tags your pictures as they upload." href="#/tags" />
     <FeatureCard variant="image" image="../dam/assets/thumb-12.svg" title="Brand kit" description="Logos, colors and fonts in one place." href="#/brand" />
     <FeatureCard variant="horizontal" icon="share" hue="blue" title="Share links" description="Send a folder without accounts." onOpen={() => …} />
   Props:
     title: the feature's name (required): the card's heading, and its link or button with href or onOpen
     description: one sentence on what the feature does for people
     variant: "icon" (default: an icon above the name) | "image" (a picture across the top, 16:9) | "horizontal" (the
       icon, or the picture as a square, before the name and description: lists and narrow columns)
     icon: the icon name (platform/icons/map.json); hue: the icon's data color ("blue", "green", "purple", "red", "brown",
       "surface" (the link blue) or "gray", the default); tone: a status tone instead (its content color)
     image: the picture's address (variant image, or horizontal); imageAlt: its text alternative (default "": decorative,
       the name says what the card is)
     href: the card opens this address (its title is a link that covers the card)
     onOpen(): the card runs this (its title is a button that covers the card); without href or onOpen it is not interactive
     headingLevel: the heading level of the title (default 3)
     className: more classes on the card
   Behavior:
     With href or onOpen the whole card is one target (Card's opener) and one Tab stop; hover raises it, focus outlines it.
     The picture keeps its 16:9 frame before it loads, so nothing moves; it is decorative unless imageAlt says otherwise.
     Descriptions wrap; keep them to one or two lines.
   Notes:
     A grid of feature cards: ContentGrid or WidgetGrid around them, every card the same variant. Other props pass through
       to Card's <article>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Card } from '../../components/Card/Card.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Image } from '../../components/Image/Image.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';

const VARIANTS = ['icon', 'image', 'horizontal'];
const DATA_HUES = ['blue', 'green', 'purple', 'red', 'brown'];
const TONES = ['neutral', 'info', 'success', 'warning', 'danger'];

/** @public */
export type FeatureCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  title: string;
  description?: string;
  variant?: 'icon' | 'image' | 'horizontal';
  icon?: string;
  hue?: 'blue' | 'green' | 'purple' | 'red' | 'brown' | 'surface' | 'gray';
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  image?: string;
  imageAlt?: string;
  href?: string;
  onOpen?(): void;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};
export function FeatureCard({ title, description, variant = 'icon', icon, hue, tone, image, imageAlt = '', href, onOpen, headingLevel = 3, className, ...rest }: FeatureCardProps) {
  devWarn('FeatureCard', { variant, tone }, { variant: ['icon','image','horizontal'], tone: ['info','success','warning','danger','neutral'] });
  const v = VARIANTS.indexOf(variant) >= 0 ? variant : 'icon';
  const picture = v === 'image' || (v === 'horizontal' && image && !icon);
  // the plain icon (no tile, #882): a tone's content color, a data hue's color, the link blue (surface) or gray
  const look = TONES.indexOf(tone as string) >= 0 ? tone : hue === 'surface' ? 'surface' : null;
  const media = picture && image
    ? <Image src={image} alt={imageAlt} ratio={v === 'image' ? '16-9' : '1-1'} rounded={v === 'horizontal'} className="plx-feature-card__image" />
    : <Icon name={icon || SparkleIcon} size="md" className={cx('plx-feature-card__icon', look && 'plx-feature-card__icon--' + look)}
        data-plx-color={!look && DATA_HUES.indexOf(hue as string) >= 0 ? hue : undefined} />;
  return (
    <Card layout={v === 'horizontal' ? 'media-start' : 'media-first'} titleWrap title={title} meta={description} href={href} onOpen={onOpen} headingLevel={headingLevel}
      className={cx('plx-feature-card', 'plx-feature-card--' + v, className)} {...rest}>
      <span className={cx('plx-feature-card__media', picture && 'plx-feature-card__media--image')}>{media}</span>
    </Card>
  );
}
