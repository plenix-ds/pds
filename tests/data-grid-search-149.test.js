// Task 149: real typing in a 600-row, eleven-column sorted grid; light mode only.
// narrow:'table' (issue 929): the grid-step check below reads a column at its set width, which a fixed table keeps; the
// default grid now sizes its columns to their content and fits them to its width.
const assert=require('assert/strict');
const {serve,launch}=require('./lib');
(async()=>{const server=await serve(9721);let browser;try{
 browser=await launch();const page=await browser.newPage();await page.setViewport({width:1440,height:1000});
 await page.goto('http://127.0.0.1:9721/Plenix/dashboard/index.html',{waitUntil:'load'});await page.waitForFunction(()=>window.Plenix&&window.ReactDOM);
 await page.evaluate(()=>{
  document.documentElement.setAttribute('data-plx-mode','light');const h=React.createElement,host=document.createElement('main');document.body.replaceChildren(host);
  const data=Array.from({length:600},(_,i)=>Object.fromEntries([['id',i],['name','Record '+String(600-i).padStart(3,'0')],...Array.from({length:10},(_,j)=>['field'+j,'Value '+i+' '+j])]));
  const columns=[{field:'name',title:'Name',width:'--plx-ref-size-240px'},...Array.from({length:10},(_,j)=>({field:'field'+j,title:'Field '+j,width:'--plx-ref-size-120px'}))];
  window.__search149={localeCalls:0,tokenReads:0,filterCalls:0,selectionChanges:0};const locale=String.prototype.localeCompare,computed=window.getComputedStyle;
  String.prototype.localeCompare=function(...args){window.__search149.localeCalls++;return locale.apply(this,args);};
  window.getComputedStyle=function(...args){window.__search149.tokenReads++;return computed.apply(this,args);};
  function Fixture(){const[q,setQ]=React.useState('');return h(React.Fragment,null,h('input',{'aria-label':'Search records',value:q,onChange:e=>setQ(e.target.value)}),h(Plenix.DataGrid,{label:'Search performance',data,columns,selectable:true,narrow:'table',onReady:api=>window.__searchApi149=api,onSelectionChange:()=>window.__search149.selectionChanges++,sort:[{field:'name',dir:'asc'}],filter:q?r=>{window.__search149.filterCalls++;return r.name.toLowerCase().includes(q.toLowerCase());}:undefined,mode:'pages',pageSize:50,narrow:'table'}));}
  ReactDOM.createRoot(host).render(h(Fixture));
 });
 await page.waitForFunction(()=>document.querySelector('.plx-data-grid__grid-row [data-plx-field="name"]')?.textContent.includes('Record 001'));
 await page.waitForFunction(()=>window.__searchApi149);await page.evaluate(()=>{window.__searchApi149.selectRow(0);window.__search149.selectionChanges=0;window.__search149.localeCalls=0;window.__search149.tokenReads=0;});
 const started=Date.now();await page.type('input[aria-label="Search records"]','Record 59');
 await page.waitForFunction(()=>{const cells=[...document.querySelectorAll('.plx-data-grid__grid-row [data-plx-field="name"]')];return cells.length===10&&cells[0].textContent.includes('Record 590')&&cells.at(-1).textContent.includes('Record 599');});
 const stats=await page.evaluate(()=>({...window.__search149,value:document.querySelector('input[aria-label="Search records"]').value}));stats.elapsedMs=Date.now()-started;
 console.log(JSON.stringify(stats));assert.equal(stats.value,'Record 59');assert.equal(stats.selectionChanges,1,'notify only when the selected record becomes hidden');assert.ok(stats.filterCalls<=600*'Record 59'.length,'each query evaluates the predicate at most once per record');assert.ok(stats.tokenReads<600,'typing must not resolve token widths separately for every record');assert.equal(stats.localeCalls,0,'search must reuse the numeric collator rather than construct one through localeCompare');
 const override=await page.addStyleTag({content:'.plx-data-grid{--plx-ref-space-4px:var(--plx-ref-size-16px)}'});
 await page.evaluate(()=>document.documentElement.setAttribute('data-plx-density','comfortable'));
 await page.waitForFunction(()=>{const grid=document.querySelector('.plx-data-grid'),cell=grid.querySelector('.plx-data-grid__grid-row [data-plx-field="field0"]');return Math.abs(cell.getBoundingClientRect().width-parseFloat(Plenix.gridPx(120,{el:grid})))<1;});
 await override.evaluate(el=>el.remove());await page.evaluate(()=>document.documentElement.setAttribute('data-plx-density','standard'));
 await page.waitForFunction(()=>{const grid=document.querySelector('.plx-data-grid'),cell=grid.querySelector('.plx-data-grid__grid-row [data-plx-field="field0"]');return Math.abs(cell.getBoundingClientRect().width-parseFloat(Plenix.gridPx(120,{el:grid})))<1;});
 console.log('GRID_SEARCH_OK 600 rows, 11 columns; filtered sort preserved');
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
