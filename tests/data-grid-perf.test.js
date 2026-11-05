/* Plenix · DataGrid performance
   Summary: Measures real 600-row saved/plain views, draw latency and geometry-read calls.
   Usage: node tests/data-grid-perf.test.js; PERF_BASELINE=1 reports before-change numbers without asserting targets.
   Props: PERF_REPORT optional JSON path; TEST_PORT optional isolated server port.
   Behavior: Warms the engine, then times 8-column and 18-column/14-hidden cases with/without storageKey views.
   Notes: getBoundingClientRect calls are geometry reads, not proof of forced browser layouts. Skips without Chrome. It draws its own
   host page (platform.css and platform.js of this checkout) and never opens the design spec: it no longer skips when the spec is absent (#338). */
const fs=require('fs'),path=require('path'),ROOT=path.resolve(__dirname,'..');
const chrome=process.env.CHROME_PATH||['C:/Program Files/Google/Chrome/Application/chrome.exe','/usr/bin/google-chrome','/usr/bin/chromium'].find(p=>fs.existsSync(p));
if(!chrome||!fs.existsSync(chrome)){console.log('DATA_GRID_PERF_SKIP Chrome unavailable');process.exit(0);}
process.env.CHROME_PATH=chrome;
const NEXT=process.env.DT_ENGINE==='next';
const {serve,launch}=require('./lib'),PORT=+process.env.TEST_PORT||9250;
(async()=>{const server=await serve(PORT);let browser;try{browser=await launch();const page=await browser.newPage();await page.setViewport({width:1440,height:1000});const bundle=process.env.PERF_BUNDLE_PATH?fs.readFileSync(process.env.PERF_BUNDLE_PATH,'utf8'):null;
 const html='<!doctype html><html lang="en" data-plx-theme="default" data-plx-mode="light" data-plx-density="compact"><head><meta charset="utf-8"><link rel="stylesheet" href="/Plenix/platform/system/fonts.css"><link rel="stylesheet" href="/Plenix/platform/platform.css"><script src="/Plenix/platform/vendor/react-loader.js"></script><script src="/Plenix/platform/dist/platform.js"></script><script src="/Plenix/platform/dev/style-audit.js"></script></head><body></body></html>';
 await page.setRequestInterception(true);page.on('request',req=>req.url().endsWith('/tests/.data-grid-perf.html')?req.respond({status:200,contentType:'text/html',body:html}):bundle&&req.url().split('?')[0].endsWith('/platform/dist/platform.js')?req.respond({status:200,contentType:'text/javascript',body:bundle}):req.continue());
 await page.goto('http://127.0.0.1:'+PORT+'/Plenix/tests/.data-grid-perf.html',{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.Plenix);await page.evaluate(({baseline,next})=>{window.perfBaseline=baseline;window.perfNext=next;window.PerfComponent=next?Plenix.DataGridEngine:Plenix.DataGrid;},{baseline:!!process.env.PERF_BASELINE,next:NEXT});const result=await page.evaluate(async()=>{
 const R=React,D=ReactDOM,h=R.createElement,P=Plenix,Component=window.PerfComponent;const host=document.createElement('div');document.body.replaceChildren(host);let root=D.createRoot(host);const frame=()=>new Promise(r=>requestAnimationFrame(()=>r()));
 await new Promise(resolve=>D.flushSync(()=>root.render(h(Component,{label:'Engine warmup',data:[{id:1,a:'Warm'}],columns:[{field:'a',title:'Warm'}],height:'--plx-ref-size-100u',narrow:'table',onReady:resolve}))));await frame();await frame();D.flushSync(()=>root.unmount());root=D.createRoot(host);await frame();
 let reads=0;const own=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){reads++;return own.apply(this,arguments);};
 const rows=Array.from({length:600},(_,i)=>Object.fromEntries([['id',i],...Array.from({length:18},(_,j)=>['c'+j,j===1?{name:'Person '+i}:j===2?[{label:'Design'},{label:'Review'}]:j===3?(i+1)*2000:j===4?{label:'Ready',tone:'success',icon:'check'}:'Value '+String(600-i).padStart(4,'0')+' '+j])]));
 const results=[];
 try{for(const n of [8,18])for(const saved of [false,true]){
   const columns=Array.from({length:n},(_,i)=>({title:'Column '+i,field:'c'+i,width:160,...(i===1?{kind:'avatar-name'}:i===2?{kind:'tags'}:i===3?{type:'bytes'}:i===4?{kind:'badge'}:{})})),key='plx-perf-'+n,hidden=n===18?columns.slice(4).map(c=>c.field):[];
   const storage='plx-data-grid:'+key;if(saved)localStorage.setItem(storage,JSON.stringify({order:columns.map(c=>c.field).reverse(),hidden,widths:Object.fromEntries(columns.map(c=>[c.field,'160px'])),sort:[{column:'c0',dir:'asc'}]}));else localStorage.removeItem(storage);
   let table,props;const start=performance.now(),readStart=reads;
   await new Promise(resolve=>{props={label:'Performance records',data:rows,columns,height:'--plx-ref-size-100u',narrow:'table',storageKey:saved?key:undefined,hiddenColumns:saved?undefined:hidden,onReady:t=>{table=t;resolve();}};D.flushSync(()=>root.render(h(Component,props)));});
   const opening=performance.now()-start,buildReads=reads-readStart;await frame();await frame();
   const measure=async action=>{const r=reads,t=performance.now();action();await frame();return {ms:+(performance.now()-t).toFixed(2),geometryReads:reads-r};};
   const order=table.getColumns().map(c=>c.getField()).filter(Boolean),expected=columns.map(c=>c.field);if(saved)expected.reverse();
   if(JSON.stringify(order)!==JSON.stringify(expected))throw Error('Saved/initial order including hidden columns differs');
   if(table.getColumns().filter(c=>c.isVisible()).length!==n-hidden.length)throw Error('Initial hidden column state differs');
   const render=patch=>{props={...props,...patch};D.flushSync(()=>root.render(h(Component,props)));};
   const toggle=await measure(()=>render({hiddenColumns:hidden.concat('c1')}));
   const sort=await measure(()=>render({sort:[{field:'c0',dir:'desc'}]}));
   const filter=await measure(()=>render({filter:d=>d.c0.includes('Value 00')}));
   let moves=0;if(!window.perfNext&&table.columnManager){const manager=table.columnManager,moved=manager.moveColumn.bind(manager);manager.moveColumn=(...args)=>{moves++;return moved(...args);};const unchangedOrder=table.getColumns().map(c=>c.getField()).filter(Boolean);render({columnOrder:unchangedOrder});await frame();render({columnOrder:unchangedOrder.slice()});await frame();if(moves&&!window.perfBaseline)throw Error('Unchanged hidden-column order moved columns');}
   render({filter:undefined});await frame();const holder=host.querySelector(window.perfNext?'.plx-data-grid__grid-tableholder':'.plx-data-grid__grid-tableholder'),scrollStart=performance.now();holder.scrollTop=holder.scrollHeight;holder.dispatchEvent(new Event('scroll'));await frame();await frame();const scrollMs=+(performance.now()-scrollStart).toFixed(2),renderedRows=host.querySelectorAll(window.perfNext?'.plx-data-grid__grid-row':'.plx-data-grid__grid-row').length;
   if(renderedRows>=600)throw Error('Rich-cell scrolling rendered the complete source instead of a virtual window');
   results.push({engine:window.perfNext?'next':'current',columns:n,scrollMs,renderedRows,hidden:hidden.length,saved,nativeRowGeometry:(window.perfNext||!table.rowManager)?null:String(table.rowManager.rows[0].normalizeHeight).includes('calcHeight'),openMs:+opening.toFixed(2),restoreMs:saved?+opening.toFixed(2):null,geometryReads:buildReads,unchangedMoves:moves,toggle,sort,filter,rows:table.getData().length});
   D.flushSync(()=>root.unmount());root=D.createRoot(host);localStorage.removeItem(storage);await frame();
 }return results;}finally{Element.prototype.getBoundingClientRect=own;D.flushSync(()=>root.unmount());}
 });
 if(process.env.PERF_REPORT)fs.writeFileSync(process.env.PERF_REPORT,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result,null,2));const bad=result.flatMap(r=>[...((r.saved?r.openMs>=300:r.openMs>=150)?['opening '+r.columns+' saved='+r.saved+': '+r.openMs]:[]),...['toggle','sort','filter'].filter(k=>r[k].ms>=50).map(k=>k+' '+r.columns+': '+r[k].ms)]);if(bad.length&&!process.env.PERF_BASELINE)throw Error(bad.join('; '));console.log('DATA_GRID_PERF_'+(process.env.PERF_BASELINE?'BASELINE':'OK')+'4scenarios; restoreMs is full saved-view mount-to-ready latency');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
