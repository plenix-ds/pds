/* Plenix suite · shared (suite/shared.jsx). Split out of app/plenix.jsx in batch 113; edit here. */
import { Avatar, Inline, StatusIcon, Text } from 'plenix-platform';


/* ─── Data ──────────────────────────────────────────────────────── */
export const PROJECTS=[
  {id:1,name:"Kitchen Renovation",      status:"active",   color:"brown",tags:["personal","home"],  files:14,desc:"Full kitchen remodel — cabinets, counters, plumbing. Target Q3 2026."},
  {id:2,name:"Apex Co — Brand Refresh", status:"active",   color:"blue",tags:["client","design"],  files:31,desc:"Visual identity refresh: logo, color system, digital templates."},
  {id:3,name:"AI Writing Tools",        status:"paused",   color:"purple",tags:["research","ai"],    files:8, desc:"Evaluating AI writing assistants for team adoption."},
  {id:4,name:"Spain — June 2026",       status:"active",   color:"green",tags:["personal","travel"],files:9, desc:"Two weeks in Madrid and Seville. Flights booked."},
  {id:5,name:"Tax & Finances 2026",     status:"active",   color:"red",tags:["personal","finance"],files:22,desc:"Annual tax prep, estimated payments, expense tracking."},
  {id:6,name:"Home Purchase 2024",      status:"completed",color:"gray",tags:["archive","legal"],  files:67,desc:"Archive — all docs from 412 Birchwood Dr closing."},
];
export const EMAILS=[
  {id:1,from:"Maya Chen",      subj:"Round 3 concepts — confirm Thursday?",prev:"Hey! Just want to confirm we're presenting the logo directions this Thursday…",time:"10:24 AM",unread:true, av:"M",avColor:"blue",proj:"Apex Co"},
  {id:2,from:"ABC Plumbing",   subj:"Kitchen quote follow-up",             prev:"Hi, this is Jeff from ABC Plumbing. Following up on our estimate…",          time:"9:41 AM", unread:true, av:"A",avColor:"brown",proj:"Kitchen Reno"},
  {id:3,from:"Luis Herrera",   subj:"Q1 tax docs ready for review",        prev:"Your estimated Q1 tax documents are attached. Please review section 3…",      time:"Yesterday",unread:false,av:"L",avColor:"purple",proj:"Tax"},
  {id:4,from:"James Whitfield",subj:"RE: SOW — one small change",          prev:"Looks mostly good. I'd like to adjust the payment milestone on page 3…",      time:"Yesterday",unread:false,av:"J",avColor:"blue",proj:"Apex Co"},
  {id:5,from:"Booking.com",    subj:"Your Madrid reservation is confirmed",prev:"Thank you for booking! Your reservation at Hotel Only YOU Atocha is confirmed.",time:"Mar 3",  unread:false,av:"B",avColor:"green",proj:"Spain"},
];
export const EVENTS=[
  {id:1,time:"9:00 AM", title:"Standup — Apex team",    sub:"30 min", color:"blue"},
  {id:2,time:"2:00 PM", title:"Contractor call (ABC)",  sub:"1 hour", color:"brown"},
  {id:3,time:"4:30 PM", title:"Budget review — kitchen",sub:"30 min", color:"brown"},
];
export const CALENDARS=[
  {id:"work",   label:"Work",          color:"blue", on:true},
  {id:"home",   label:"Personal",      color:"green", on:true},
  {id:"apex",   label:"Apex Co",       color:"brown", on:true},
  {id:"travel", label:"Travel",        color:"purple", on:true},
  {id:"tax",    label:"Finance & Tax", color:"red", on:true},
];
/* Tag each event to a calendar */
export const CAL_EVENTS=[
  {id:1,date:5, title:"Standup — Apex",       time:"9:00 AM", color:"blue",cal:"work"},
  {id:2,date:5, title:"Contractor call",       time:"2:00 PM", color:"brown",cal:"apex"},
  {id:3,date:8, title:"Logo review — Round 3", time:"10:00 AM",color:"blue",cal:"work"},
  {id:4,date:10,title:"Plumbing quote (2nd)",  time:"11:00 AM",color:"brown",cal:"home"},
  {id:5,date:15,title:"Q1 tax payment due",    time:"All day", color:"red",cal:"tax"},
  {id:6,date:18,title:"Brand presentation",    time:"3:00 PM", color:"blue",cal:"apex"},
  {id:7,date:28,title:"Spain trip — depart",   time:"All day", color:"green",cal:"travel"},
];
export const CONTACTS=[
  {id:1,name:"Maya Chen",       gender:"female",role:"Creative Director",co:"Apex Co",     av:"M",avColor:"blue",last:"10:24 AM",msg:"Sounds great — I'll have concepts by Friday."},
  {id:2,name:"Jeff Torres",     gender:"male",role:"Plumber",          co:"ABC Plumbing",av:"J",avColor:"brown",last:"9:41 AM", msg:"We can do Thursday the 12th at 2pm."},
  {id:3,name:"Luis Herrera",    gender:"male",role:"CPA",              co:"Herrera Tax", av:"L",avColor:"purple",last:"Yesterday",msg:"Your Q1 tax docs are attached."},
  {id:4,name:"James Whitfield", gender:"male",role:"CEO",              co:"Apex Co",     av:"J",avColor:"blue",last:"Yesterday",msg:"RE: SOW — looks good, one small change."},
  {id:5,name:"Sarah Morgan",    gender:"female",role:"Friend",           co:"",            av:"S",avColor:"green",last:"Mar 3",    msg:"Did you decide on the cabinet color?"},
];
export const THREADS=[
  {id:1,name:"Maya Chen",       av:"M",avColor:"blue",ch:"WhatsApp",preview:"Sounds great — I'll have concepts by Friday.",time:"10:24 AM",unread:2},
  {id:2,name:"ABC Plumbing",    av:"A",avColor:"brown",ch:"SMS",      preview:"We can do Thursday the 12th at 2pm.",    time:"9:41 AM", unread:1},
  {id:3,name:"James Whitfield", av:"J",avColor:"blue",ch:"Email",    preview:"RE: SOW — looks good, one small change.", time:"Yesterday",unread:0},
  {id:4,name:"Garret Builders", av:"G",avColor:"gray",ch:"SMS",      preview:"Demo day confirmed. See you at 10am.",   time:"Yesterday",unread:0},
];
export const MSGS={
  1:[{from:"Maya",text:"Hey! Confirming — presenting round 3 on Thursday the 8th?",time:"9:55 AM",mine:false},{from:"me",text:"Yes, confirmed. I'll have the Figma file shared by Wednesday evening.",time:"10:01 AM",mine:true},{from:"Maya",text:"Perfect. And you're adding the dark mode variants too?",time:"10:18 AM",mine:false},{from:"me",text:"Absolutely — 3 full directions, light and dark each.",time:"10:21 AM",mine:true},{from:"Maya",text:"Sounds great — I'll have the revised concepts by Friday.",time:"10:24 AM",mine:false}],
  2:[{from:"ABC",text:"Hi, this is Jeff from ABC Plumbing. Following up on the kitchen quote.",time:"9:10 AM",mine:false},{from:"me",text:"Hi Jeff — yes, we'd love a second look. Available this week?",time:"9:25 AM",mine:true},{from:"ABC",text:"We can do Thursday the 12th at 2pm if that works.",time:"9:41 AM",mine:false}],
};
export const ALL_TASKS=[
  {id:1,title:"Get second plumbing quote",     done:false,due:"Mar 10",proj:"Kitchen Reno",pri:"high"},
  {id:2,title:"Order cabinet samples",          done:true, due:"Mar 1", proj:"Kitchen Reno",pri:"med"},
  {id:3,title:"Confirm countertop material",    done:false,due:"Mar 15",proj:"Kitchen Reno",pri:"med"},
  {id:4,title:"Deliver logo concepts round 3",  done:false,due:"Mar 8", proj:"Apex Co",     pri:"high"},
  {id:5,title:"Send revised SOW for approval",  done:true, due:"Feb 28",proj:"Apex Co",     pri:"high"},
  {id:6,title:"Set up brand asset folder",      done:false,due:"Mar 12",proj:"Apex Co",     pri:"med"},
  {id:7,title:"Book Madrid hotel — Chueca",     done:false,due:"Mar 20",proj:"Spain Trip",  pri:"med"},
  {id:8,title:"File Q1 estimated tax payment",  done:false,due:"Mar 15",proj:"Tax",         pri:"high"},
  {id:9,title:"Upload expense receipts Jan–Feb",done:false,due:"Mar 10",proj:"Tax",         pri:"med"},
];
export const ALL_NOTES=[
  {id:1,folder:"Kitchen Reno",title:"Contractor comparison",   preview:"ABC Plumbing came in $2,400 under Garret but has mixed Yelp reviews…",date:"Mar 2", tags:["contractors","cost"]},
  {id:2,folder:"Kitchen Reno",title:"Cabinet style decisions", preview:"Leaning Shaker in off-white. Confirm door pull finish with Sarah.",      date:"Feb 22",tags:["design","decisions"]},
  {id:3,folder:"Apex Co",     title:"Kickoff meeting recap",   preview:"Client wants to retain the wordmark but fully refresh the color system.",date:"Feb 20",tags:["client","milestone"]},
  {id:4,folder:"Apex Co",     title:"Typography shortlist",    preview:"Top candidates: Canela, Söhne Breit, GT Planar. Present 3 directions.", date:"Mar 1", tags:["type","design"]},
  {id:5,folder:"Spain Trip",  title:"Hotel shortlist — Madrid",preview:"Barrio de Chueca is the area. Budget €150/night max. 3 options.",       date:"Feb 28",tags:["travel","hotels"]},
  {id:6,folder:"Research",    title:"AI tools comparison",     preview:"Compared Jasper, Copy.ai, and Claude for long-form writing. Claude wins.",date:"Mar 3", tags:["ai","tools"]},
];
export const ALL_BOOKMARKS=[
  {id:1,col:"Kitchen Inspo",  title:"Shaker Cabinet Guide — Houzz",   url:"houzz.com",             date:"Feb 18",tags:["cabinets"],  thumb:"🏠"},
  {id:2,col:"Kitchen Inspo",  title:"Quartz vs Granite 2026",         url:"thespruce.com",         date:"Feb 10",tags:["countertops"],thumb:"🪨"},
  {id:3,col:"Brand Research", title:"2026 Brand Design Trends",        url:"underconsideration.com",date:"Feb 22",tags:["branding"],  thumb:"🎨"},
  {id:4,col:"Brand Research", title:"Apex Competitor — Studio Maake", url:"studiomaake.com",       date:"Feb 12",tags:["competitor"],thumb:"🔍"},
  {id:5,col:"Spain Trip",     title:"Seville Top 20 Restaurants",     url:"eater.com",             date:"Feb 28",tags:["food"],      thumb:"🍽️"},
  {id:6,col:"Spain Trip",     title:"Renfe Madrid–Seville Tickets",   url:"renfe.com",             date:"Mar 1", tags:["transport"], thumb:"🚄"},
  {id:7,col:"AI Tools",       title:"Claude API Documentation",       url:"docs.anthropic.com",    date:"Mar 3", tags:["claude"],   thumb:"🤖"},
];
export const ALL_FILES=[
  {name:"2026-02-28_KitchenReno_Quote_ABCPlumbing.pdf",  t:"PDF", s:"1.2 MB",folder:"Kitchen Reno",d:"Feb 28",ai:true},
  {name:"2026-02-15_KitchenReno_Inspo_IslandLayouts.png",t:"IMG", s:"4.1 MB",folder:"Kitchen Reno",d:"Feb 15",ai:true},
  {name:"2026-02-20_ApexCo_BrandBrief_V2.pdf",           t:"PDF", s:"3.4 MB",folder:"Apex Co",     d:"Feb 20",ai:true},
  {name:"2026-03-01_ApexCo_LogoConcepts_R3.fig",         t:"FIG", s:"12 MB", folder:"Apex Co",     d:"Mar 1", ai:false},
  {name:"IMG_4891.png",                                   t:"IMG", s:"2.1 MB",folder:"Uncategorized",d:"Mar 3", ai:false},
  {name:"document(3).pdf",                               t:"PDF", s:"1.1 MB",folder:"Uncategorized",d:"Mar 4", ai:false},
  {name:"2026-01-05_TaxDocs_W2_Employer.pdf",             t:"PDF", s:"224 KB",folder:"Tax 2026",   d:"Jan 5",  ai:true},
];
export const CAPTURES=[
  {label:"Contractor quote screenshot",fileName:"IMG_4891.png",             type:"PNG",emoji:"📸",context:"Screenshot of ABC Plumbing estimate. Kitchen sink relocation. Labor $1,200, materials $640, permit $180. Total $2,020. March 4 2026. Project: Kitchen Renovation."},
  {label:"Client contract PDF",        fileName:"document(3).pdf",          type:"PDF",emoji:"📄",context:"Contract from Apex Design Co. Scope: brand identity refresh — logo, color system, typography. 50/50 payment split. March 4 2026."},
  {label:"Flight search screenshot",  fileName:"Screen Shot 2026-03-03.png",type:"PNG",emoji:"✈️",context:"Google Flights results for Madrid round trip June 14–21 from JFK. Prices $640–$910. Iberia and Delta. Project: Spain Trip."},
  {label:"Budget spreadsheet",        fileName:"Untitled spreadsheet.xlsx", type:"XLSX",emoji:"📊",context:"Budget tracker for Apex Co brand refresh. Categories: design fees, ad spend, printing. Total budget $18,400. Q2 2026."},
];

/* ─── API ───────────────────────────────────────────────────────── */
async function callClaude(sys,usr){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:usr}]})});
  const d=await r.json();return d.content?.[0]?.text||"";
}
export async function aiFileName(ctx){
  const sys=`You are Plenix's file naming engine. Return ONLY valid JSON, no markdown:
{"filename":"YYYY-MM-DD_Project_Type_Description.ext","parts":{"date":"YYYY-MM-DD","project":"...","type":"...","description":"...","ext":".pdf"},"tags":["tag1","tag2","tag3"],"summary":"One sentence about the file."}`;
  const raw=await callClaude(sys,ctx);
  try{return JSON.parse(raw.replace(/```json|```/g,""));}catch{return null;}
}
export async function aiSearch(q){
  const sys=`You are Plenix's search engine. Projects: Kitchen Renovation, Apex Co Brand Refresh, AI Writing Tools, Spain Trip June 2026, Tax & Finances 2026.
Return ONLY valid JSON: {"answer":"2-3 sentence summary","results":[{"id":1,"name":"...","module":"Files|Notes|Bookmarks|Tasks|Contacts","project":"...","preview":"1-2 sentences","date":"human date","tags":["..."],"icon":"emoji"}]}
3-5 realistic results.`;
  const raw=await callClaude(sys,`Query: "${q}"`);
  try{return JSON.parse(raw.replace(/```json|```/g,""));}catch{return null;}
}

/* a card surface (the legacy .card rule, on tokens): spread into a style, before the element's own properties */

/* ─── Shared atoms ──────────────────────────────────────────────── */
/* avatars: the Platform Avatar (rounded squares; corner and text size follow the size). Sizes snap to the scale. */
const AV_SIZES=[24,28,32,40,48,64];
export const Av=({name,av,avColor,size=28})=>{const s=AV_SIZES.reduce((a,b)=>Math.abs(b-size)<Math.abs(a-size)?b:a);return <Avatar name={name} initials={av} size={s} color={avColor}/>;};
// a status is never a dot (owner, 2026-10-14): priority is its icon and a short word; a project's status, in the tight nav
// row, its icon with its name spoken
const PRI_TONE={high:"danger",med:"warning",low:"success"}, PRI_LABEL={high:"High priority",med:"Medium priority",low:"Low priority"}, PRI_WORD={high:"High",med:"Medium",low:"Low"};
// the word in the row's secondary text (12px), so it shares the task's and the date's size and baseline
export const Priority=({pri})=><Inline gap="2xs" align="baseline"><StatusIcon tone={PRI_TONE[pri]||"neutral"} size="sm" label={PRI_LABEL[pri]} className="plx-u-self-center"/><Text variant="secondary" aria-hidden="true">{PRI_WORD[pri]||pri}</Text></Inline>;
const STATUS_TONE={active:"success",paused:"warning",completed:"neutral"};
export const ProjStatus=({s})=><StatusIcon tone={STATUS_TONE[s]||"neutral"} size="sm" label={"Status: "+s}/>;
