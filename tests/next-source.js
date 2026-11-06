/* Plenix · source renderer fixture
   Summary: Loads the owned table source independently for focused browser diagnostics.
   Usage: await require('./next-source')(page).
   Props: A page with the Platform peer components and React globals already loaded.
   Behavior: Bundles only the new renderer; rejects legacy grid modules in the source graph.
   Notes: Regular acceptance tests still use the ordinary built public export. */
const path=require('path'),assert=require('assert/strict');
module.exports=async page=>{
 const result=await require('esbuild').build({entryPoints:[path.resolve(__dirname,'../platform/components/DataGrid/DataGridEngine.tsx')],bundle:true,write:false,metafile:true,format:'iife',globalName:'SourceNext',define:{'process.env.NODE_ENV':'"production"'},plugins:[require('./icon-modules.js'),{name:'browser-peers',setup(build){build.onResolve({filter:/^react(?:-dom)?$/},args=>({path:args.path,namespace:'peers'}));build.onLoad({filter:/.*/,namespace:'peers'},args=>({contents:'module.exports=window.'+(args.path==='react'?'React':'ReactDOM')+';'}));}}]});
 assert.equal(Object.keys(result.metafile.inputs).some(file=>/platform[\\/]components[\\/]DataGrid[\\/]/.test(file)),false,'Independent source must not import legacy grid modules');
 await page.addScriptTag({content:result.outputFiles[0].text});
 await page.evaluate(()=>{window.Plenix=Object.freeze(Object.assign({},window.Plenix,{DataGridEngine:SourceNext.DataGridEngine}));});
};
