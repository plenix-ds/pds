// Angular standalone bridges; generated inputs follow build-types.js output.
const fs = require('fs'), path = require('path');
function runtime(ng, forms) {
 let configured;
 const fields={Input:'value',Textarea:'value',Select:'value',SearchField:'value',Slider:'value',NumberInput:'value',Combobox:'value',OtpInput:'value',Rating:'value',RadioGroup:'value',ChoiceList:'value',DatePicker:'value',TimePicker:'value',Calendar:'value',Checkbox:'checked',Radio:'checked',Switch:'checked'};
 function configurePlenix(value){configured=value;}
 function adapter(name,schema){
  class Adapter{
   constructor(){this.__plxZone=ng.inject(ng.NgZone);this.__plxPlatform=ng.inject(ng.PLATFORM_ID);this.props={};this.__plxChange=()=>{};this.__plxTouch=()=>{};for(const e of schema.events)this[e.output]=new ng.EventEmitter();}
   ngAfterViewInit(){if(this.__plxPlatform==='server')return;this.__plxRuntime=configured||{React:globalThis.React,ReactDOM:globalThis.ReactDOM,Plenix:globalThis.Plenix};const r=this.__plxRuntime;if(!r.React||!r.ReactDOM?.createRoot||!r.Plenix?.[name])throw Error('Load matching React, ReactDOM and Plenix CDN scripts before Angular: '+name);this.__plxNodes=Array.from(this.__plxProjection.nativeElement.childNodes);const owner=this;this.__plxSlot=function(){const ref=r.React.useRef(null);r.React.useLayoutEffect(()=>{for(const n of owner.__plxNodes)ref.current.appendChild(n);return()=>{for(const n of owner.__plxNodes)owner.__plxProjection.nativeElement.appendChild(n);};},[]);return r.React.createElement('span',{ref,className:'plx-angular-slot'});};this.__plxRoot=r.ReactDOM.createRoot(this.__plxMount.nativeElement);this.render();}
   ngOnChanges(){this.render();}
   render(){if(!this.__plxRoot)return;const p={...this.props};for(const k of schema.inputs)if(this[k]!==undefined)p[k]=this[k]===''&&schema.booleans.includes(k)?true:this[k];const field=name==='Combobox'&&p.multiple?'values':fields[name];if(this.__plxHasModel&&field)p[field]=this.__plxModel;if(this.__plxFormDisabled!==undefined)p.disabled=this.__plxFormDisabled;for(const e of schema.events){const callback=p[e.prop];p[e.prop]=(...args)=>this.__plxZone.run(()=>{if(e.prop==='onChange'&&field){const v=args[0];this.__plxChange(v&&v.target?v.target[field]:v);}if(e.prop==='onBlur')this.__plxTouch();if(typeof callback==='function')callback(...args);this[e.output].emit(args.length>1?args:args[0]);});}this.__plxRoot.render(this.__plxRuntime.React.createElement(this.__plxRuntime.Plenix[name],p,this.__plxNodes.length?this.__plxRuntime.React.createElement(this.__plxSlot):p.children));}
   writeValue(v){this.__plxHasModel=true;this.__plxModel=v;this.render();}
   registerOnChange(fn){this.__plxChange=fn;}
   registerOnTouched(fn){this.__plxTouch=fn;}
   setDisabledState(v){this.__plxFormDisabled=v;this.render();}
   ngOnDestroy(){this.__plxRoot?.unmount();this.__plxRoot=null;}
  }
  Object.defineProperty(Adapter,'name',{value:'Plx'+name});ng.ViewChild('mount',{static:true})(Adapter.prototype,'__plxMount');ng.ViewChild('projection',{static:true})(Adapter.prototype,'__plxProjection');
  ng.Component({selector:'plx-'+name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase(),standalone:true,template:'<span #projection class="plx-angular-projection"><ng-content></ng-content></span><span #mount class="plx-angular-mount"></span>',styles:[':host, .plx-angular-projection, .plx-angular-mount, .plx-angular-slot { display: contents; }'],encapsulation:ng.ViewEncapsulation.None,inputs:['props',...schema.inputs],outputs:schema.events.map(e=>e.output),providers:fields[name]?[{provide:forms.NG_VALUE_ACCESSOR,useExisting:ng.forwardRef(()=>Adapter),multi:true}]:[]})(Adapter);return Adapter;
 }
 return{configurePlenix,components:Object.fromEntries(Object.entries(SCHEMA).map(([n,s])=>[n,adapter(n,s)]))};
}
// each component's props block, in the header-typed form the schema reads ("  name?: type;" lines, "[prop: string]" when it takes
// its element's attributes): from index.d.ts's header-typed declarations, and, for a part written in TypeScript (re-exported
// from tsc's types/ since D-0081), from its <Name>Props in that declaration, its top-level members brought to that form
function propBlocks(PKG,src){
 const out={};
 for(const m of src.matchAll(/export declare const (\w+): React\.ComponentType</g)){const n=m[1],start=src.indexOf('export interface '+n+'Props');out[n]=start<0?'':src.slice(start,src.indexOf('\n}',start));}
 // every <Name>Props in tsc's declarations (a barrel re-exports a part from another file, so the props can live anywhere in types/)
 const props={},walk=(d)=>{for(const f of fs.existsSync(d)?fs.readdirSync(d):[]){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p);else if(f.endsWith('.d.ts')){const t=fs.readFileSync(p,'utf8');for(const m of t.matchAll(/export (?:type|interface) (\w+)Props\b/g)){if(m[1] in props)continue;const e=t.indexOf('\n}',m.index);props[m[1]]=t.slice(m.index,e<0?undefined:e);}}}};
 walk(path.join(PKG,'react','types'));
 for(const m of src.matchAll(/export \{([^}]+)\} from "\.\/types\/[^"]+\.js"/g)){
  for(const raw of m[1].split(',')){
   const n=raw.trim().split(/\s+as\s+/).pop();if(!/^[A-Z]\w*$/.test(n)||n in out||!(n in props))continue;
   const blk=props[n];
   out[n]=blk.split('\n').filter(l=>/^ {4}\w+\??: /.test(l)).map(l=>'  '+l.slice(4).replace(/^(\w+)\??: /,'$1?: ')).join('\n')+(/HTMLAttributes|\[prop: string\]/.test(blk)?'\n  [prop: string]':'');
  }
 }
 return out;
}
module.exports=function(ctx){
 const{PKG,VERSION,SCOPE,SITE,REPO,write,json,copy}=ctx,out=path.join(PKG,'angular'),types=path.join(PKG,'react','index.d.ts'),src=fs.readFileSync(types,'utf8');
 const blocks=propBlocks(PKG,src),names=Object.keys(blocks),schema={};if(!names.length)throw Error('Angular needs generated React declarations');
 for(const n of names){const block=blocks[n],keys=[...block.matchAll(/^  (\w+)\?: /gm)].map(m=>m[1]);if(block.includes('[prop: string]'))keys.push(...['id','value','checked','disabled','required','readOnly','placeholder','name','multiple','onClick','onFocus','onKeyDown'].filter(k=>!keys.includes(k)));schema[n]={booleans:[...block.matchAll(/^  (\w+)\?: boolean;/gm)].map(m=>m[1]).concat(['disabled','checked','required','readOnly','multiple']),inputs:keys.filter(k=>!/^on[A-Z]/.test(k)&&k!=='children'),events:[...new Set([...keys.filter(k=>/^on[A-Z]/.test(k)),'onChange','onBlur'])].map(prop=>({prop,output:'plx'+prop.slice(2)}))};}
 write(path.join(out,'index.mjs'),'import "@angular/compiler";\nimport * as ng from "@angular/core";\nimport * as forms from "@angular/forms";\nconst SCHEMA='+JSON.stringify(schema)+';\nconst api=('+runtime.toString()+')(ng,forms);\nexport const configurePlenix=api.configurePlenix;\n'+names.map(n=>'export const '+n+'=api.components.'+n+';').join('\n')+'\n');copy(types,path.join(out,'react-props.d.ts'));
 write(path.join(out,'index.d.ts'),'import type * as ng from "@angular/core";\nimport type * as Props from "./react-props.js";\nexport declare function configurePlenix(runtime:{React:any;ReactDOM:any;Plenix:Record<string,any>}):void;\n'+names.map(n=>{const s=schema[n],ins=['props',...s.inputs],outs=s.events.map(e=>e.output),selector='plx-'+n.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();return 'export declare class '+n+' {\n props:Props.'+n+'Props;\n'+s.inputs.map(k=>' '+k+':Props.'+n+'Props['+JSON.stringify(k)+'];').join('\n')+'\n'+outs.map(k=>' '+k+':ng.EventEmitter<any>;').join('\n')+'\n writeValue(v:unknown):void; registerOnChange(fn:(v:any)=>void):void; registerOnTouched(fn:()=>void):void; setDisabledState(v:boolean):void;\n static ɵfac:ng.ɵɵFactoryDeclaration<'+n+',never>;\n static ɵcmp:ng.ɵɵComponentDeclaration<'+n+','+JSON.stringify(selector)+',never,{'+ins.map(k=>JSON.stringify(k)+':'+JSON.stringify(k)).join(';')+'},{'+outs.map(k=>JSON.stringify(k)+':'+JSON.stringify(k)).join(';')+'},never,["*"],true>;\n}';}).join('\n'));
 json(path.join(out,'components.json'),schema);json(path.join(out,'package.json'),{name:SCOPE+'/angular',version:VERSION,type:'module',main:'./index.mjs',types:'./index.d.ts',exports:{'.':{types:'./index.d.ts',import:'./index.mjs'},'./components.json':'./components.json'},files:['*.mjs','*.d.ts','*.json','README.md','example'],sideEffects:true,publishConfig:{registry:'https://npm.pkg.github.com',access:'restricted'},license:'UNLICENSED',homepage:SITE,repository:{type:'git',url:'git+'+REPO,directory:'packages/angular'},peerDependencies:{'@angular/core':'>=17 <22','@angular/common':'>=17 <22','@angular/forms':'>=17 <22','@angular/compiler':'>=17 <22','@types/react':'>=18 <20'}});
 write(path.join(out,'README.md'),'# Plenix Angular\n\nStandalone client-side adapters for matching-version CDN React, ReactDOM, Plenix and plenix.css. Nothing is downloaded automatically. Import named components into standalone imports. Inputs follow generated React props; arbitrary and render-function props use [props]. Events use plx-prefixed names, e.g. (plxClick), (plxChange). Projected content retains its Angular view.\n\nForm controls provide ControlValueAccessor for ngModel/reactive forms, including disabled/touched. Combobox multiple binds values. Server rendering has empty hosts; React mounts after view initialization. This distribution uses Angular runtime JIT: @angular/compiler is an explicit imported peer. It is unsuitable for compiler-free/AOT-only deployments. Use matching Angular peer versions; no second React is bundled. Types/inputs come from build-types.js.\n');
 write(path.join(out,'example','app.ts'),'import {Component} from "@angular/core";\nimport {FormsModule} from "@angular/forms";\nimport {Input,Button} from "@plenix-ds/angular";\n@Component({selector:"plx-example",standalone:true,imports:[FormsModule,Input,Button],template:`<plx-input [(ngModel)]="name" [props]="inputProps"/><plx-button (plxClick)="saved=name">Save project</plx-button><p>{{saved}}</p>`})\nexport class App {name="";saved="";inputProps={"aria-label":"Project name"};}\n');return 'angular: '+names.length+' typed standalone CDN adapters';
};
