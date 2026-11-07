/* Plenix · trustedHtml (platform/utils/trustedHtml.ts)
   Summary: The one place Plenix turns an HTML string into nodes, safe under Trusted Types: a page that sets `Content-Security-Policy: require-trusted-types-for 'script'` rejects a plain string
     handed to innerHTML or DOMParser. Plenix creates one Trusted Types policy, named "plenix", and uses it to parse into an inert document (scripts never run, nothing loads) and to name the one vendor script it loads (window.PlenixTrustedTypes shares it with plenix-engines.js); the nodes that
     reach the page are copied from that document through an allow-list (richTextClean.ts) or are built by Plenix (iconMarkup), never the parsed nodes themselves.
   Usage: const fragment = parseHtmlFragment('<p>Hello</p>');   // a DocumentFragment in an inert document; adopt what you keep
   Props: parseHtmlFragment(html): the fragment the HTML parses to (as a <template>'s content: table rows and the like stay)
   Behavior: A page that restricts policy names (trusted-types ...) has to allow "plenix". When the policy cannot be created and the page enforces Trusted Types, parsing returns an empty
     fragment and development warns once; without Trusted Types the string is parsed as it is.
   Notes: No other code under platform/ writes HTML: no innerHTML, outerHTML, insertAdjacentHTML or dangerouslySetInnerHTML (a check holds this, tests/trusted-types-940.test.js). The editor engine
     under vendor/ is outside this rule.
*/
import { development } from './devWarn.ts';

type Policy = { createHTML(html: string): unknown; createScriptURL(url: string): unknown };
type Rules = { createHTML(html: string): string; createScriptURL(url: string): string };
type TrustedTypesApi = { createPolicy(name: string, rules: Rules): Policy };

let policy: Policy | null | undefined, warned = false;

/** the Trusted Types policy Plenix parses HTML with ("plenix"), or null where the browser has none or the page does not allow the name */
function plenixPolicy(): Policy | null {
  if (policy !== undefined) return policy;
  policy = null;
  const api = typeof window !== 'undefined' ? (window as unknown as { trustedTypes?: TrustedTypesApi }).trustedTypes : undefined;
  if (api && typeof api.createPolicy === 'function') {
    const shared = (window as unknown as { PlenixTrustedTypes?: Policy }).PlenixTrustedTypes;   // plenix-engines.js may have made it first: a name can be made once
    if (shared) policy = shared;
    else {
      try {
        // createScriptURL is for the one script Plenix adds, the editor engine under vendor/ (plenix-engines.js makes the same policy when it loads first)
        policy = api.createPolicy('plenix', { createHTML: (html: string) => html, createScriptURL: (url: string) => { if (!/\/vendor\/[\w./-]+\.js$/.test(new URL(url, document.baseURI).pathname)) throw new TypeError('Plenix only loads its own vendor scripts'); return url; } });
        (window as unknown as { PlenixTrustedTypes?: Policy }).PlenixTrustedTypes = policy;
      } catch { policy = null; }
    }
  }
  return policy;
}

/** the fragment an HTML string parses to, in an inert document (as a <template>'s content) */
export function parseHtmlFragment(html: string): DocumentFragment {
  const source = '<template>' + html + '</template>', made = plenixPolicy();
  try {
    const doc = new DOMParser().parseFromString((made ? made.createHTML(source) : source) as string, 'text/html');
    const holder = doc.querySelector('template');
    return holder ? holder.content : doc.createDocumentFragment();
  } catch {
    // the page enforces Trusted Types and does not allow the "plenix" policy: nothing is parsed
    if (development() && !warned) { warned = true; console.warn('[Plenix] This page enforces Trusted Types and does not allow the "plenix" policy: add it to the trusted-types directive (trusted-types plenix).'); }
    return document.implementation.createHTMLDocument('').createDocumentFragment();
  }
}
