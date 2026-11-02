/* ══════════════════════════════════════════════════════════
     PLENIX APP DATA — window globals (plain JS, loaded before plenix.js)
     
     All static data that components need at runtime is stored
     here as window.* so Babel script size stays minimal. Every suite application loads it, so it holds only what
     more than one page reads. What only Settings reads is in suite/settings-data.js (issue 882).
     
     Contents:
       window.CAPABILITY_GROUPS — 11 groups of project capabilities
                                  drives New Project modal checklist
                                  and ProjectNav sidebar grouping
       window.DEFAULT_CAPS      — Set of capability IDs enabled by default
       window.PROJ_TYPES        — 6 groups of project types (33 total)
                                  used by New Project modal type picker
                                  and Settings > Project Types panel
       window.ALL_PROJ_TYPES    — flat array derived from PROJ_TYPES
       window.CAT_FLAT          — flat category strings for MetaPanel picker
     ══════════════════════════════════════════════════════════ */

  window.CAPABILITY_GROUPS=[
    /* ── UNIVERSAL LAYER ── 48 capabilities, 9 groups */
    {id:"u-platform",group:"Platform",layer:"universal",items:[
      {id:"about",label:"About",icon:"circle-info",layer:"universal"},
      {id:"activity",label:"Activity",icon:"timeline",layer:"universal"},
      {id:"dashboard",label:"Dashboard",icon:"dashboard",layer:"universal"},
      {id:"navigation",label:"Navigation",icon:"explore",layer:"universal"},
      {id:"projects",label:"Projects",icon:"home",layer:"universal"},
      {id:"search",label:"Search & Filters",icon:"search",layer:"universal"},
      {id:"settings",label:"Settings",icon:"gear",layer:"universal"},
    ]},
    {id:"u-communication",group:"Communication",layer:"universal",items:[
      {id:"calendar",label:"Calendar",icon:"calendar",layer:"universal"},
      {id:"contacts",label:"Contacts",icon:"contacts",layer:"universal"},
      {id:"email",label:"Email",icon:"mail",layer:"universal"},
      {id:"messaging",label:"Messaging",icon:"mail",layer:"universal",desc:"SMS · WhatsApp · Slack"},
    ]},
    {id:"u-productivity",group:"Productivity",layer:"universal",items:[
      {id:"forms",label:"Forms",icon:"fact-check",layer:"universal"},
      {id:"goals",label:"Goals",icon:"target",layer:"universal"},
      {id:"habits",label:"Habits",icon:"event-repeat",layer:"universal"},
      {id:"journal",label:"Journal",icon:"edit-note",layer:"universal"},
      {id:"notes",label:"Notes",icon:"sticky-note-2",layer:"universal"},
      {id:"tasks",label:"Tasks",icon:"task-alt",layer:"universal"},
      {id:"templates",label:"Text Templates",icon:"text-snippet",layer:"universal"},
    ]},
    {id:"u-files",group:"Files",layer:"universal",items:[
      {id:"files",label:"Files",icon:"doc-text",layer:"universal"},
      {id:"smart_file_naming",label:"Smart File Naming",icon:"doc-text",layer:"universal"},
    ]},
    {id:"u-media",group:"Media",layer:"universal",items:[
      {id:"audio",label:"Audio",icon:"doc-text",layer:"universal"},
      {id:"digital_asset_management",label:"Digital Asset Management",icon:"doc-text",layer:"universal"},
      {id:"images",label:"Images",icon:"image-a-2",layer:"universal"},
      {id:"video",label:"Video",icon:"doc-text",layer:"universal"},
    ]},
    {id:"u-knowledge",group:"Knowledge",layer:"universal",items:[
      {id:"bookmarks",label:"Bookmarks",icon:"link",layer:"universal"},
      {id:"books",label:"Books",icon:"sticky-note-2",layer:"universal"},
      {id:"browser_extension_mobile_capture",label:"Browser Extension / Mobile Capture",icon:"snapshot",layer:"universal"},
      {id:"capture",label:"Capture",icon:"snapshot",layer:"universal"},
      {id:"duplicates_broken_links",label:"Duplicates & Broken Links",icon:"link",layer:"universal"},
      {id:"highlights",label:"Highlights",icon:"sticky-note-2",layer:"universal"},
      {id:"import_export_backup",label:"Import / Export / Backup",icon:"doc-text",layer:"universal"},
      {id:"reader_articles",label:"Reader / Articles",icon:"sticky-note-2",layer:"universal"},
      {id:"sharing_collaboration",label:"Sharing / Collaboration",icon:"share",layer:"universal"},
      {id:"tags",label:"Tags",icon:"tags",layer:"universal"},
      {id:"web_archive",label:"Web Archive",icon:"link",layer:"universal"},
      {id:"wiki",label:"Wiki",icon:"text-card",layer:"universal"},
    ]},
    {id:"u-ai",group:"AI",layer:"universal",items:[
      {id:"ai_agents",label:"AI Agents",icon:"sparkle",layer:"universal"},
      {id:"ai_chat",label:"AI Chat",icon:"sparkle",layer:"universal"},
      {id:"automations",label:"Automations",icon:"bolt",layer:"universal"},
      {id:"connectors",label:"Connectors",icon:"hub",layer:"universal"},
      {id:"model_selection",label:"Model Selection",icon:"sparkle",layer:"universal"},
      {id:"prompt_studio",label:"Prompt Studio",icon:"sparkle",layer:"universal"},
      {id:"voice_input",label:"Voice Input",icon:"voice-selection",layer:"universal"},
    ]},
    {id:"u-finance",group:"Finance",layer:"universal",items:[
      {id:"bookkeeping",label:"Bookkeeping",icon:"calculate",layer:"universal"},
      {id:"expenses",label:"Expenses",icon:"receipt",layer:"universal"},
      {id:"income",label:"Income",icon:"trending-up",layer:"universal"},
    ]},
    {id:"u-utilities",group:"Utilities",layer:"universal",items:[
      {id:"password_manager",label:"Password Manager",icon:"key",layer:"universal"},
      {id:"translation",label:"Translation & Dictionary",icon:"translate",layer:"universal"},
    ]},

    /* ── CLIENT LAYER ── 11 capabilities, 1 group */
    {id:"c-pipeline",group:"Pipeline",layer:"client",items:[
      {id:"client_portal",label:"Client Portal",icon:"web",layer:"client"},
      {id:"contracts",label:"Contracts",icon:"contract",layer:"client"},
      {id:"deals",label:"Deals",icon:"handshake",layer:"client"},
      {id:"estimates",label:"Estimates",icon:"request-quote",layer:"client"},
      {id:"invoices",label:"Invoices",icon:"receipt-long",layer:"client"},
      {id:"leads",label:"Leads",icon:"person-search",layer:"client"},
      {id:"payments",label:"Payments",icon:"payments",layer:"client"},
      {id:"proposals",label:"Proposals",icon:"slideshow",layer:"client"},
      {id:"rate_cards",label:"Rate Cards",icon:"price-change",layer:"client"},
      {id:"scheduling",label:"Scheduling",icon:"event-available",layer:"client"},
      {id:"services",label:"Services",icon:"home-repair-service",layer:"client"},
    ]},

    /* ── PROJECT / WORK LAYER ── 14 capabilities, 2 groups */
    {id:"p-marketing",group:"Marketing",layer:"project",items:[
      {id:"analytics",label:"Analytics",icon:"analytics",layer:"project"},
      {id:"campaigns",label:"Campaigns",icon:"campaign",layer:"project"},
      {id:"channels",label:"Channels",icon:"cell-tower",layer:"project"},
      {id:"content_calendar",label:"Content Calendar",icon:"edit-calendar",layer:"project"},
      {id:"mood_boards",label:"Mood Boards",icon:"palette",layer:"project"},
    ]},
    {id:"p-control",group:"Project Control",layer:"project",items:[
      {id:"changes",label:"Changes",icon:"change-circle",layer:"project"},
      {id:"issues",label:"Issues",icon:"bug-report",layer:"project"},
      {id:"purchase_orders",label:"Purchase Orders",icon:"shopping-cart",layer:"project"},
      {id:"resourcing",label:"Resourcing",icon:"groups",layer:"project"},
      {id:"risks",label:"Risks",icon:"warning",layer:"project"},
      {id:"roadmap",label:"Roadmap",icon:"signpost",layer:"project"},
      {id:"suppliers",label:"Suppliers",icon:"local-shipping",layer:"project"},
      {id:"time_tracking",label:"Time Tracking",icon:"clock",layer:"project"},
      {id:"timesheets",label:"Timesheets",icon:"pending-actions",layer:"project"},
    ]},
  ];

  window.DEFAULT_CAPS=new Set(["activity","calendar","roadmap","notes","bookmarks","contacts","tasks","time_tracking","files"]);

  window.PROJ_TYPES=[
    {group:"Creative & Production",types:["Branding","Photography","Video / Film","Design","Writing / Editorial","Music / Audio"]},
    {group:"Business & Operations",types:["Client Project","Sales","Product Launch","Events","Operations","Finance","Legal","HR / Recruitment","Training"]},
    {group:"Technical",types:["Development / Engineering","IT / Infrastructure","Data / Analytics","IT Project","Cybersecurity","Cloud / DevOps"]},
    {group:"Personal",types:["Personal","Health / Wellness","Learning / Education","Home / Renovation","Academic"]},
    {group:"Research & Strategy",types:["Research","Marketing","Competitive Analysis","Strategy"]},
    {group:"Other",types:["Internal / Admin","Non-profit / Community","Travel"]},
  ];
  window.ALL_PROJ_TYPES=window.PROJ_TYPES.flatMap(function(g){return g.types.map(function(t){return {name:t,group:g.group};});});
  window.CAT_FLAT=["Personal","Personal > Health","Personal > Finance","Personal > Family","Client Work","Client Work > Design","Client Work > Development","Client Work > Strategy","Research","Research > Market Research","Research > Competitive Analysis","Travel","Finance","Archive"];
  window.TAG_GROUPS={
    "Business":["strategy","Q2","VIP","supplier","meeting","approved","draft","needs-review","follow-up"],
    "Creative":["branding","typography","inspiration","design","photography","video","audio"],
    "Nature":["mountain","snow","lake","nature","aerial","landscape","wildlife"],
    "Visual":["portrait","urban","architecture","interior","product","black-and-white","abstract"],
  };
