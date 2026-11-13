// #1347: a grid's `height` is a size token. The documented token names (grid units, --plx-ref-size-100u) must reach the
// holder's data-plx-height attribute as their px value; without it the viewport is not capped and no row is virtualized.
const path=require('path'),assert=require('assert/strict'),esbuild=require('esbuild');
const build=()=>esbuild.build({stdin:{contents:"export{lengthName}from'./engine/lengthName.ts';",resolveDir:path.join(__dirname,'../platform/components/DataGrid'),loader:'ts'},bundle:true,write:false,format:'esm',target:'es2020'}).then(r=>r.outputFiles[0].text);
(async()=>{
 const bundle=await build();
 const {lengthName}=await import('data:text/javascript;base64,'+Buffer.from(bundle).toString('base64'));
 assert.equal(lengthName('--plx-ref-size-100u'),'400px','grid-unit token');
 assert.equal(lengthName('--plx-ref-size-75u'),'300px','grid-unit token, smaller');
 assert.equal(lengthName('--plx-ref-size-400px'),'400px','px-named alias');
 assert.equal(lengthName('400px'),'400px','plain px');
 assert.equal(lengthName('100%'),undefined,'fill is not a token length');
 assert.equal(lengthName(undefined),undefined,'no height');
 console.log('GRID_HEIGHT_TOKEN_1347_OK unit tokens, px aliases, plain px, fill');
})().catch(e=>{console.error(e);process.exit(1)});
