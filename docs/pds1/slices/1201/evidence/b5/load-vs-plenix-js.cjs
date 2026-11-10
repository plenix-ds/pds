const { launch } = require('../../../../../../tests/lib');
const CDN='https://design-system.lighthouseway.org/cdn/1.7.0/';
const NAMES='AppHeader AppShell Auth Button Card Center Checkbox CommandBar CommandBarSearch DataGrid Dialog DirectionProvider DocumentViewer EmptyState FilterPanel Icon Image Inline List LoadingState MediaPlayer NavList NavPane Notice PageContent Panel RadioGroup ReadingPane RecordPage ResourceList SecondaryPane Select SessionProvider SplitView SsoButtons Stack Tabs Text Textarea ThemeProvider ToastProvider ToolRail Toolbar'.split(' ');
const html=(mode,names)=>`<!doctype html><html><head><meta charset=utf-8><link rel=stylesheet href="${CDN}plenix.css">
<script src="${CDN}vendor/react.production.min.js"></script><script src="${CDN}vendor/react-dom.production.min.js"></script>
${mode==='all'?`<script src="${CDN}plenix.js"></script>`:`<script src="${CDN}plenix-loader.js"></script>`}</head><body><div id=r></div><script>
(async()=>{const t0=performance.now();${mode==='all'?'':`await Plenix.load(${JSON.stringify(names)});`}
const h=React.createElement,P=Plenix;ReactDOM.createRoot(document.getElementById('r')).render(h(P.ThemeProvider,null,h(P.Panel,{title:'Case'},h(P.Button,null,'Open'))));
await new Promise(r=>setTimeout(r,500));window.__ready=performance.now()-t0;})();</script></body></html>`;
(async()=>{const b=await launch();const http=require('http');
const pages={all:html('all'),loader:html('loader',NAMES)};
const srv=http.createServer((q,s)=>{const m=q.url.slice(1);s.setHeader('content-type','text/html');s.end(pages[m]||'');}).listen(9986);
for(const mode of ['all','loader','all','loader']){const p=await b.newPage();const c=await p.createCDPSession();await c.send('Network.enable');await c.send('Network.setCacheDisabled',{cacheDisabled:true});
let bytes=0,reqs=0;c.on('Network.loadingFinished',e=>{bytes+=e.encodedDataLength;reqs++;});
const t=Date.now();await p.goto('http://localhost:9986/'+mode,{waitUntil:'load'});await p.waitForFunction(()=>window.__ready,{timeout:60000});
console.log(mode,'wall',Date.now()-t,'ms; to-ready',Math.round(await p.evaluate(()=>window.__ready)),'ms; wire',Math.round(bytes/1024),'KB; requests',reqs);await p.close();}
await b.close();srv.close();})().catch(e=>{console.error(e);process.exit(1)});
