/* Plenix suite · leftnav (suite/leftnav.jsx). Split out of app/plenix.jsx in batch 113; edit here. */
import { Button, Icon, NavList, NavPane } from 'plenix-platform';
import { ALL_BOOKMARKS, ALL_FILES, ALL_NOTES, ALL_TASKS, Av, CALENDARS, CONTACTS, PROJECTS, ProjStatus, THREADS } from './shared.jsx';

/* ─── Left Nav (contextual) ─────────────────────────────────────── */
export function LeftNav({section,sub,setSub,onSettings}){
  const groups={};PROJECTS.forEach(p=>{const t=p.tags[0];if(!groups[t])groups[t]=[];groups[t].push(p);});
  const tagLabels={personal:"Personal",client:"Client Work",research:"Research",travel:"Travel",finance:"Finance",archive:"Archive"};
 /* a colored mark before a row: a dot (a project's color) or a square (a calendar's color) */
  const Mark=({color,square})=><span aria-hidden="true"    className={[[[["plx-u-inline-block plx-u-shrink-0", (square ? "plx-u-w-10px" : "plx-u-w-6px"), (square ? "plx-u-h-10px" : "plx-u-h-6px"), (square ? "plx-u-border-radius-detail-4px" : "plx-u-border-radius-pill"), "plx-u-bg-data"].filter(Boolean).join(" ")].filter(Boolean).join(" ")].filter(Boolean).join(" ")].filter(Boolean).join(" ")} data-plx-color={color}/>;
  const by=(list,key,count)=>[...new Set(list.map(x=>x[key]))].map(v=>({id:v,label:v,count:count(v)}));
  const nav={
    projects:{label:"Projects",groups:[{heading:null,items:[{id:"all",label:"All projects",count:PROJECTS.length}]}].concat(Object.entries(groups).map(([tag,projs])=>({heading:tagLabels[tag]||tag,
      items:projs.map(p=>({id:p.id,label:p.name,count:p.files,icon:<span className="plx-u-items-center plx-u-gap-x-4px plx-u-inline-flex"><Mark color={p.color}/>{p.status&&<ProjStatus s={p.status}/>}</span>}))})))},
    messaging:{label:"Messages",groups:[{heading:null,items:[{id:"all",label:"All messages"}]},{heading:"Channels",items:[{id:"sms",label:"SMS"},{id:"whatsapp",label:"WhatsApp"},{id:"email",label:"Email"}]},
      {heading:"Threads",items:THREADS.map(t=>({id:`t-${t.id}`,label:t.name,count:t.unread>0?t.unread:undefined,icon:<Av name={t.name} avColor={t.avColor} size={22}/>}))}]},
    contacts:{label:"Contacts",groups:[{heading:null,items:[{id:"all",label:"All contacts",count:CONTACTS.length}]},{heading:"Groups",items:[{id:"clients",label:"Clients",count:2},{id:"contractors",label:"Contractors",count:2},{id:"professional",label:"Professional"},{id:"personal",label:"Personal"}]}]},
    calendar:{label:"Calendars",groups:[{heading:"My calendars",items:[{id:"all",label:"All calendars",icon:<Mark square color="gray"/>}].concat(CALENDARS.map(c=>({id:c.id,label:c.label,icon:<Mark square color={c.color}/>})))}],
      after:<div className="plx-u-border-t-border-divider plx-u-border-t-solid-2 plx-u-border-t-1px plx-u-mt-12px plx-u-pt-8px"><Button size="sm" variant="ghost" icon={<Icon name="upload"/>}>Import calendar</Button></div>},
    tasks:{label:"Tasks",groups:[{heading:null,items:[{id:"all",label:"All tasks",count:ALL_TASKS.filter(t=>!t.done).length},{id:"due",label:"Due soon",count:ALL_TASKS.filter(t=>!t.done&&["Mar 8","Mar 10"].includes(t.due)).length}]},
      {heading:"By project",items:by(ALL_TASKS,"proj",p=>ALL_TASKS.filter(t=>t.proj===p&&!t.done).length)}]},
    notes:{label:"Notes",groups:[{heading:null,items:[{id:"all",label:"All notes",count:ALL_NOTES.length}]},{heading:"Folders",items:by(ALL_NOTES,"folder",f=>ALL_NOTES.filter(n=>n.folder===f).length)}]},
    bookmarks:{label:"Bookmarks",groups:[{heading:null,items:[{id:"all",label:"All bookmarks",count:ALL_BOOKMARKS.length}]},{heading:"Collections",items:by(ALL_BOOKMARKS,"col",c=>ALL_BOOKMARKS.filter(b=>b.col===c).length)}]},
    files:{label:"Files",groups:[{heading:null,items:[{id:"all",label:"All files",count:ALL_FILES.length}]},{heading:"Folders",items:by(ALL_FILES,"folder",f=>ALL_FILES.filter(x=>x.folder===f).length)}]},
  };
  const content=Object.fromEntries(Object.entries(nav).map(([k,v])=>[k,<><NavList label={v.label} value={sub} onSelect={setSub} groups={v.groups}/>{v.after||null}</>]));
  if(!content[section])return null;

 /* the page's side navigation: the AppShell sizes, collapses (Ctrl+[ or the header's toggle) and overlays it */
  return(
    <NavPane as="div" label={nav[section].label} title={nav[section].label} footer={onSettings?<Button size="sm" variant="ghost" icon="gear" onClick={onSettings}>{nav[section].label} settings</Button>:null}>
      {content[section]}
    </NavPane>
  );
}
