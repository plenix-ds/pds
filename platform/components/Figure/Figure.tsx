/* Plenix · Figure
   Summary: A picture, chart or diagram with the caption that explains it, and the credit or data source when it has one.
   Usage:
     <Figure caption="The kitchen after the remodel, with the oak finish the client chose." credit="Photo: Ana Ruiz">
       <Image src="kitchen.jpg" alt="The finished kitchen" ratio="4-3" />
     </Figure>
     <Figure caption="Uploads per week" credit="Source: Plenix storage report, October"><LineChart … /></Figure>
     <Figure captionPosition="overlay" caption="Lisbon office, east wing"><Image … /></Figure>
   Props:
     children: the media: an Image, a chart, a diagram or a code block (required)
     caption: one sentence that says what the media shows and why it is there (a string or nodes)
     credit: who made it or where the data comes from, after the caption ("Photo: Ana Ruiz", "Source: …")
     captionPosition: "below" (default) | "overlay" (on the bottom of a picture, over a dark scrim; short captions only)
     className: more classes on the <figure>
   Behavior:
     The caption stays next to the media at every width; it wraps under it and never moves away from it.
     An overlay caption sits on the picture's bottom edge on the media scrim, in the content-on-media color; a credit
       below an overlay caption moves under the picture.
     The <figure> and <figcaption> tie the caption to the media for assistive technology.
   Notes:
     A decorative picture needs no figure: use the Image with alt="".
     The caption adds to the alt text, never repeats it.
     Other props pass through to the <figure>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';

export function Figure({ children, caption, credit, captionPosition = 'below', className, ...rest }) {
  const overlay = captionPosition === 'overlay' && caption;
  return (
    <figure className={cx('plx-figure', 'plx-figure--' + (overlay ? 'overlay' : 'below'), credit && 'plx-figure--credited', className)} {...rest}>
      <div className="plx-figure__media">
        {children}
        {overlay ? <figcaption className="plx-figure__caption plx-figure__caption--overlay">{caption}</figcaption> : null}
      </div>
      {!overlay && (caption || credit) ? (
        <figcaption className="plx-figure__caption">
          {caption ? <span className="plx-figure__text">{caption}</span> : null}
          {credit ? <span className="plx-figure__credit">{credit}</span> : null}
        </figcaption>
      ) : null}
      {overlay && credit ? <div className="plx-figure__caption"><span className="plx-figure__credit">{credit}</span></div> : null}
    </figure>
  );
}
