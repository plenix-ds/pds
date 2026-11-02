/* Plenix · DocumentViewer
   Summary: Read PDF, image pages or text with page navigation, thumbnails and stepped zoom.
   Usage: <DocumentViewer kind="pdf" src="/files/report.pdf" label="Report"/>
   Props: kind: pdf | images | text; src: PDF URL or Uint8Array; pages: [{id,src,alt,thumbnail}]; text;
     label; thumbnails: true; initialPage: 1; initialZoom: 100 (50,75,100,125,150,200);
     pdfModuleUrl/pdfWorkerUrl: optional URLs when serving the vendor files separately; strings: previous,next,page,zoom,
       thumbnails,loading,failed,failedEngine,failedAccess,failedParse,failedRender,empty,retry; onPageChange(page);
       onError({ reason, cause }): reason "engine" (PDF.js did not load), "access" (missing, denied or blocked document),
       "parse" (not a readable PDF) or "render" (a page could not be drawn); className.
   Behavior: Image zoom is published on the viewport; the zoom Select uses its own data prop.
     Navigation clamps to available pages. PDF loading and rendering are cancellable; stale loads cannot replace
     a newer document. A PDF or image page is laid out left to right in any interface direction (owner, 2026-10-22: CTM's
     Arabic UI): centered when narrower than the viewer, opening at its top left when wider, and again at each page; a
     text document keeps its own direction. Each failure has its own message (strings.failed replaces all four) and offers Retry; the
     message never shows the document's address or the server's error. The page counter, page buttons and zoom show
     once a document has pages. PDF text is exposed alongside the canvas for assistive technology.
   Notes: PDF.js 4.10.38 (Apache-2.0) is in the shared vendor folder (platform/vendor/pdfjs/; on the CDN
     /cdn/<version>/vendor/pdfjs/), loaded through the page's engines script (platform/engines/plenix-engines.js, which finds the vendor folder; window.PlenixVendorBase overrides). Without that script the viewer shows its engine failure.
     Its module is an ES module: serve it as text/javascript, allow it in script-src and its worker in worker-src, and
     send CORS headers when it is on another origin. URLs must obey the application CSP/CORS policy.
     PDF canvas dimensions are document geometry, never an inline style. No remote PDF code is downloaded.
*/
import React from 'react';
import { Stack,Inline } from '../Stack/Stack.tsx';
import { Button } from '../Button/Button.tsx';
import { Select } from '../Input/Input.tsx';
import { Field } from '../Field/Field.tsx';
import { Text } from '../Text/Text.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { Image } from '../Image/Image.jsx';
import { cx } from '../../utils/cx.ts';
import { engine } from '../../utils/engines.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
const ZOOMS=[50,75,100,125,150,200];
const pdfEngine=()=>engine('pdf');
// why a PDF failed, from PDF.js's error names: the engine, the document's address (missing, denied, blocked) or its content
function reasonOf(e){const n=e&&e.name||'';return /Missing|UnexpectedResponse|Password|Abort/.test(n)||/fetch|network|cors/i.test(String(e&&e.message))?'access':'parse';}
function PdfThumbnail({pdf,number,label}){const ref=React.useRef(null);React.useEffect(()=>{let live=true,task;const observer=new IntersectionObserver(async(entries)=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();try{const p=await pdf.getPage(number);if(!live)return;const v=p.getViewport({scale:1}),view=p.getViewport({scale:96/v.width}),c=ref.current;if(!c)return;c.width=Math.ceil(view.width);c.height=Math.ceil(view.height);task=p.render({canvasContext:c.getContext('2d'),viewport:view});await task.promise;}catch(e){/* Navigation remains available if a preview cannot render. */}});observer.observe(ref.current);return()=>{live=false;observer.disconnect();task?.cancel();};},[pdf,number]);return <canvas ref={ref} role="img" aria-label={label}/>;}
export function DocumentViewer({kind='text',src,pages=[],text='',label,thumbnails=true,initialPage=1,initialZoom=100,pdfModuleUrl,pdfWorkerUrl,strings,onPageChange,onError,className}){
 const t=useStrings('documentViewer', strings),[page,setPage]=React.useState(initialPage),[zoom,setZoom]=React.useState(ZOOMS.includes(initialZoom)?initialZoom:100),[pdf,setPdf]=React.useState(null),[loading,setLoading]=React.useState(false),[error,setError]=React.useState(''),[attempt,setAttempt]=React.useState(0),[accessible,setAccessible]=React.useState(''),canvas=React.useRef(null),viewport=React.useRef(null);
 const errorRef=React.useRef(onError);errorRef.current=onError;
 // one message per reason; strings.failed (an app's own wording) replaces them all unless the reason's own string is given
 const fail=(reason,cause)=>{const own='failed'+reason.charAt(0).toUpperCase()+reason.slice(1);setError((strings&&strings[own])||(strings&&strings.failed)||t[own]);setLoading(false);errorRef.current?.({reason,cause});};
 React.useEffect(()=>{let live=true,task,doc;setPdf(null);setPage(initialPage);setAccessible('');setError('');setZoom(ZOOMS.includes(initialZoom)?initialZoom:100);
  if(kind!=='pdf'||!src){setLoading(false);return;}
  setLoading(true);
  (async()=>{let engine;try{let worker;if(pdfModuleUrl){engine=await import(pdfModuleUrl);worker=new URL('pdf.worker.js',pdfModuleUrl).href;}else{const e=await pdfEngine();engine=e.module;worker=e.worker;}if(!live)return;engine.GlobalWorkerOptions.workerSrc=pdfWorkerUrl||worker;}catch(e){if(live)fail('engine',e);return;}
   try{task=engine.getDocument(typeof src==='string'?{url:src}:{data:src.slice()});doc=await task.promise;if(live){setPdf(doc);setLoading(false);}else doc.destroy();}catch(e){if(live)fail(reasonOf(e),e);}})();
  return()=>{live=false;if(task)task.destroy();else if(doc)doc.destroy();};
 },[kind,src,attempt,pdfModuleUrl,pdfWorkerUrl]);
 const count=kind==='pdf'?(pdf?.numPages||0):kind==='images'?pages.length:text?1:0;
 const current=Math.max(1,Math.min(page,count||1));
 React.useEffect(()=>{if(kind!=='pdf'||!pdf)return;let live=true,render;
  setLoading(true);setError('');setAccessible('');
  (async()=>{try{const p=await pdf.getPage(current);if(!live)return;const viewport=p.getViewport({scale:zoom/100}),c=canvas.current;if(!c)return;c.width=Math.ceil(viewport.width);c.height=Math.ceil(viewport.height);render=p.render({canvasContext:c.getContext('2d'),viewport});await render.promise;const contents=await p.getTextContent();if(live){setAccessible(contents.items.map(x=>x.str||'').join(' '));setLoading(false);}}catch(e){if(live&&e.name!=='RenderingCancelledException')fail('render',e);}})();
  return()=>{live=false;render?.cancel();};
 },[kind,pdf,current,zoom]);
 // a new page opens at its top and its start (a page is laid out left to right, whatever the interface direction)
 React.useEffect(()=>{viewport.current?.scrollTo({top:0,left:0});},[current]);
 const move=n=>{const next=Math.max(1,Math.min(count,n));setPage(next);onPageChange?.(next);};
 return <Stack className={cx('plx-document-viewer',className)} aria-label={label||t.document} role="region">
 {count?<Inline wrap><Button onClick={()=>move(current-1)} disabled={current<=1||!count}>{t.previous}</Button><Text kind="data" role="status">{t.page+' '+current+' / '+count}</Text><Button onClick={()=>move(current+1)} disabled={current>=count||!count}>{t.next}</Button><Field label={t.zoom}><Select data value={zoom} onChange={e=>setZoom(Number(e.target.value))} options={ZOOMS.map(z=>({value:z,label:z+'%'}))}/></Field></Inline>:null}
 {loading?<Text role="status">{t.loading}</Text>:null}{error?<Notice tone="danger" actions={<Button onClick={()=>setAttempt(v=>v+1)}>{t.retry}</Button>}>{error}</Notice>:null}
 {thumbnails&&count>1?<Inline wrap role="group" aria-label={t.thumbnails}>{Array.from({length:count},(_,i)=><Button key={i} aria-current={current===i+1?'page':undefined} onClick={()=>move(i+1)}>{kind==='pdf'&&pdf?<PdfThumbnail pdf={pdf} number={i+1} label={t.page+' '+(i+1)}/>:kind==='images'&&pages[i]?.thumbnail?<Image src={pages[i].thumbnail} alt={pages[i].alt||t.page+' '+(i+1)}/>:<>{t.page} <Text as="span" kind="data">{i+1}</Text></>}</Button>)}</Inline>:null}
 <div ref={viewport} className="plx-document-viewer__viewport" dir={kind==='text'?undefined:'ltr'} data-zoom={zoom} tabIndex={0} role="region" aria-label={label||t.page} aria-busy={loading||undefined}>
 {kind==='pdf'&&pdf?<><canvas ref={canvas} role="img" aria-label={(label||t.page)+' '+current}/><Text className="plx-document-viewer__pdf-text">{accessible}</Text></>:kind==='images'&&pages[current-1]?<Image key={pages[current-1].src} src={pages[current-1].src} alt={pages[current-1].alt||t.page+' '+current} fit="contain"/>:kind==='text'&&text?<pre className="plx-document-viewer__text">{text}</pre>:!loading&&!error?<Text>{t.empty}</Text>:null}
 </div></Stack>;
}
