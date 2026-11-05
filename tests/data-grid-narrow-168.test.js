// Tasks 168, 679 and 929: a DataGrid is a table while its visible columns fit its measured width (at their minimum readable
// widths, issue 929) and the row cards when they do not, in a SplitView too (issue 679 replaces #168's table-in-a-pane default; the owner's priority 1). narrow="table" keeps a
// fixed table and narrow="list" the cards. Each case reads the grid's --narrow class, its width and what its columns need.
const assert=require('assert/strict');const{serve,launch}=require('./lib');
(async()=>{const server=await serve(9727);let browser;try{browser=await launch();const page=await browser.newPage();await page.setViewport({width:1440,height:1000});await page.goto('http://127.0.0.1:9727/Plenix/dashboard/index.html',{waitUntil:'load'});await page.waitForFunction(()=>window.Plenix&&window.ReactDOM);await page.addStyleTag({content:'[data-narrow-fixture]{display:flex;flex-direction:column;block-size:var(--plx-ref-size-140u)}[data-narrow-fixture][data-standalone]{inline-size:var(--plx-ref-size-140u)}'});const results=[];
// four columns of 120px need 480px at their set widths, but only 320px at their minimums (80px each: issue 929, the columns
// shrink to fit before the cards); six need 480px and eight 640px at their minimums
const CASES=[
  {name:'a SplitView grid whose columns fit its pane only by shrinking to their minimums (320px): the table',pane:true,size:360,cols:4,want:false},
  {name:'a SplitView grid whose columns do not fit its pane even at their minimums (480px): the cards',pane:true,size:360,cols:6,want:true},
  {name:'a SplitView grid whose columns fit its pane: the table',pane:true,size:640,cols:4,want:false},
  {name:'narrow="table" in a pane too small: a fixed table',pane:true,size:360,cols:4,narrow:'table',want:false},
  {name:'narrow="list" in a pane wide enough: the cards under 600px',pane:true,size:400,cols:4,narrow:'list',want:true},
  {name:'a standalone 560px grid whose columns fit (480px): the table, no fixed 600px breakpoint',pane:false,cols:4,want:false},
  {name:'a standalone 560px grid whose columns fit by shrinking (480px at their minimums): the table',pane:false,cols:6,want:false},
  {name:'a standalone 560px grid whose columns do not fit even at their minimums (640px): the cards',pane:false,cols:8,want:true}];
for(const test of CASES){await page.evaluate(test=>{const h=React.createElement,host=document.createElement('main');host.setAttribute('data-narrow-fixture','');if(!test.pane)host.setAttribute('data-standalone','');document.body.replaceChildren(host);document.documentElement.setAttribute('data-plx-mode','light');const fields=['a','b','c','d','e','f','g','h'].slice(0,test.cols);const data=Array.from({length:12},(_,id)=>Object.assign({id},Object.fromEntries(fields.map(f=>[f,f.toUpperCase()])))),columns=fields.map(field=>({field,title:field,width:'--plx-ref-size-30u'})),grid=h(Plenix.DataGrid,{label:'Narrow choice',data,columns,narrow:test.narrow});ReactDOM.createRoot(host).render(test.pane?h(Plenix.SplitView,{label:'Layout choice',defaultSize:test.size,first:grid,second:h('p',null,'Details')}):grid);},test);await page.waitForSelector('.plx-data-grid__grid-row');await new Promise(r=>setTimeout(r,500));results.push({...test,...(await page.$eval('.plx-data-grid',el=>({actual:el.classList.contains('plx-data-grid--narrow'),width:el.clientWidth,sideways:(()=>{const h=el.querySelector('.plx-data-grid__grid-tableholder');return h.scrollWidth>h.clientWidth+1;})()})))});}
console.log(JSON.stringify(results,null,2));for(const r of results){assert.equal(r.actual,r.want,r.name+' '+JSON.stringify(r));if(r.actual)assert.equal(r.sideways,false,r.name+': the cards never scroll sideways '+JSON.stringify(r));}
console.log('GRID_NARROW_OK measured fit in a pane and alone, explicit table and list');
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
