// Task 165: calendar, numeric and multi-value grouping preserve canonical records.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),esbuild=require('esbuild');
const ts=file=>esbuild.transformSync(fs.readFileSync(path.join(__dirname,'../platform/components/DataGrid/'+file),'utf8'),{loader:'ts',format:'esm',target:'es2020'}).code;   // state and records are TypeScript
(async()=>{
 const uri=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
 const state=uri(ts('state.ts'));
 const source=ts('records.ts').replace(/(['"])\.\/state\.ts\1/,JSON.stringify(state));
 const {groupedRows,groupValue}=await import(uri(source)),{opening}=await import(state);
 const rows=[{id:'a',original:{text:'One',number:-1,date:'2026-01-01T23:00:00Z',flag:true,tags:['x','x','y']}},{id:'b',original:{text:'Two',number:9,date:'2026-01-02T01:00:00Z',flag:false,tags:['y']}}];
 assert.equal(groupedRows(rows,['text'],[]).length,2);
 assert.deepEqual(groupedRows(rows,['flag'],[]).map(g=>g.value),[true,false]);
 assert.deepEqual(groupedRows(rows,[{field:'number',range:10}],[]).map(g=>g.value),['[-10, 0)','[0, 10)']);
 assert.equal(groupedRows(rows,[{field:'date',interval:'month'}],[]).length,1);
 assert.equal(groupedRows(rows,[{field:'date',interval:'day'}],[]).length,2);
 assert.equal(groupValue('2026-01-01',{interval:'week'}),'2025-12-29');
 assert.equal(groupValue('bad date',{interval:'year'}),null);
 assert.equal(groupValue(0,{range:10}),'[0, 10)');
 assert.equal(groupValue(20,{}, {groupBucket:n=>n>=18?'Adult':'Child'}),'Adult');
 const groups=groupedRows(rows,['tags','flag'],[{field:'tags',multi:true}]);
 assert.equal(groups[0].rows.length,1);assert.equal(groups[1].rows.length,2);assert.equal(groups[1].groups.length,2);
 assert.strictEqual(groups[0].rows[0],rows[0]);assert.notEqual(groups[0].id,groups[1].id);
 const descriptors=[{field:'date',interval:'month'},{field:'missing'}];
 assert.deepEqual(opening({columns:[{field:'date'}],groupBy:descriptors}).groupBy,[descriptors[0]]);
 console.log('GRID_GROUP_165_OK text, booleans, numeric buckets, UTC periods, nesting and saved descriptors');
})().catch(e=>{console.error(e);process.exit(1)});
