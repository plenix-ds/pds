// Plenix's built-in Arabic words (owner, arabic-batch4-36, arabic-words-37; issue 427): every section of en.js in Arabic, a draft
// (Builder 02's table, ~/handoff/i18n/strings.md) for the owner's review. LocaleProvider uses them for an Arabic locale after the
// application's own catalog and before English; a part's strings prop still wins.
export default {
  "menuBar": {
    "more": "قوائم أخرى"
  },
  "overflowList": {
    "more": "عناصر أخرى"
  },
  "entityHeader": {
    "vs": "ضد",
    "versus": "{a} ضد {b}"
  },
  "timeline": {
    "pending": "معلّق",
    "tagPending": "{category} · معلّق",
    "legend": "التصفية حسب الفئة"
  },
  "pagination": {
    "label": "الصفحات",
    "range": "{first} إلى {last} من {total}",
    "previous": "الصفحة السابقة",
    "next": "الصفحة التالية",
    "page": "الصفحة {n}",
    "perPage": "لكل صفحة"
  },
  "chart": {
    "barChart": {
      "category": "الفئة",
      "total": "الإجمالي",
      "range": "النطاق",
      "count": "العدد"
    },
    "boxPlot": {
      "group": "المجموعة",
      "min": "الحد الأدنى",
      "q1": "الربع الأول",
      "median": "الوسيط",
      "q3": "الربع الثالث",
      "max": "الحد الأقصى",
      "outliers": "القيم الشاذة",
      "n": "القيم"
    },
    "bulletChart": {
      "measure": "المقياس",
      "value": "القيمة",
      "target": "الهدف",
      "ranges": "النطاقات",
      "poor": "ضعيف",
      "fair": "مقبول",
      "good": "جيد"
    },
    "chartFrame": {
      "showData": "عرض البيانات",
      "table": "{title}: البيانات"
    },
    "comboChart": {
      "category": "الفئة",
      "bars": "الأعمدة",
      "lines": "الخطوط"
    },
    "diagram": {
      "step": "الخطوة",
      "kind": "النوع",
      "next": "يؤدي إلى",
      "previous": "يأتي من",
      "process": "الخطوة",
      "decision": "قرار",
      "terminal": "بداية أو نهاية",
      "data": "البيانات",
      "box": "الجزء",
      "group": "المجموعة",
      "end": "النهاية"
    },
    "funnelChart": {
      "stage": "المرحلة",
      "value": "العدد",
      "kept": "المتبقي من الخطوة السابقة",
      "ofFirst": "من الخطوة الأولى"
    },
    "ganttChart": {
      "task": "المهمة",
      "progress": "تم",
      "dependsOn": "بانتظار",
      "status": "الحالة",
      "today": "اليوم",
      "milestone": "مَعلَم",
      "start": "البداية",
      "end": "النهاية"
    },
    "gauge": {
      "showData": "عرض البيانات",
      "table": "{title}: البيانات",
      "measure": "المقياس",
      "value": "القيمة",
      "min": "الحد الأدنى",
      "max": "الحد الأقصى",
      "ok": ""
    },
    "geoMap": {
      "region": "المنطقة",
      "place": "المكان",
      "value": "القيمة",
      "noData": "لا توجد بيانات",
      "latitude": "خط العرض",
      "longitude": "خط الطول",
      "zoom": "التكبير",
      "zoomIn": "تكبير",
      "zoomOut": "تصغير",
      "reset": "عرض الخريطة كاملة"
    },
    "heatMap": {
      "value": "القيمة",
      "row": "الصف",
      "column": "العمود",
      "date": "التاريخ",
      "missing": "لا توجد بيانات",
      "low": "منخفض",
      "high": "مرتفع",
      "scale": "مقياس الألوان"
    },
    "lineChart": {
      "category": "الفئة"
    },
    "lollipopChart": {
      "category": "الفئة",
      "value": "القيمة"
    },
    "networkGraph": {
      "node": "العقدة",
      "group": "المجموعة",
      "links": "متصل بـ",
      "zoomIn": "تكبير",
      "zoomOut": "تصغير",
      "fit": "ملاءمة",
      "hintZoom": " الأزرار +/- للتكبير والتصغير، والرقم 0 يناسب الرسم.",
      "none": "لا شيء"
    },
    "pieChart": {
      "part": "الجزء",
      "value": "القيمة",
      "share": "الحصة",
      "total": "الإجمالي",
      "other": "أخرى"
    },
    "radarChart": {
      "measure": "المقياس"
    },
    "sankeyDiagram": {
      "source": "المصدر",
      "target": "الهدف",
      "value": "القيمة",
      "total": "الإجمالي"
    },
    "scatterChart": {
      "series": "السلسلة",
      "item": "العنصر"
    },
    "timelineChart": {
      "item": "العنصر",
      "lane": "المسار",
      "today": "اليوم",
      "date": "التاريخ",
      "dates": "التواريخ",
      "start": "البداية",
      "end": "النهاية"
    },
    "treeChart": {
      "name": "الاسم",
      "detail": "التفاصيل",
      "parent": "يتبع لـ",
      "level": "المستوى",
      "folded": "مطوي",
      "open": "مفتوح"
    },
    "treemap": {
      "group": "المجموعة",
      "item": "الجزء",
      "value": "القيمة",
      "share": "الحصة"
    },
    "waterfallChart": {
      "step": "الخطوة",
      "change": "التغيير",
      "total": "الإجمالي",
      "running": "المجموع التراكمي",
      "increase": "زيادة",
      "decrease": "نقصان",
      "end": "النهاية"
    },
    "wordCloud": {
      "value": "العدد",
      "word": "المصطلح",
      "group": "المجموعة"
    },
    "chartLegend": {
      "legend": "دليل الرسم"
    }
  },
  "avatar": {
    "online": "متصل",
    "away": "غائب",
    "busy": "مشغول",
    "dnd": "عدم الإزعاج",
    "offline": "غير متصل"
  },
  "avatarGroup": {
    "more": "+{n}",
    "moreLabel": "{n} إضافية"
  },
  "anchor": {
    "label": "في هذه الصفحة"
  },
  "backToTop": {
    "label": "العودة إلى الأعلى"
  },
  "barcode": {
    "label": "الباركود {format}: {value}",
    "invalid": "رمز {format} غير صالح",
    "formats": {
      "code128": "Code 128",
      "ean13": "EAN-13",
      "upca": "UPC-A"
    }
  },
  "branch": {
    "loading": "جارٍ التحميل…",
    "loadingName": "جارٍ تحميل {label}",
    "failed": "تعذّر تحميل هذه العناصر",
    "failedName": "تعذّر تحميل {label}",
    "retry": "إعادة المحاولة"
  },
  "brand": {
    "name": "Plenix"
  },
  "button": {
    "working": "جارٍ العمل"
  },
  "calendar": {
    "label": "التقويم",
    "previous": "الشهر السابق",
    "next": "الشهر التالي",
    "week": "الأسبوع",
    "weekShort": "أسبوع",
    "today": "اليوم"
  },
  "carousel": {
    "slide": "{n} من {total}",
    "previous": "الشريحة السابقة",
    "next": "الشريحة التالية",
    "goTo": "الانتقال إلى الشريحة {n}",
    "goToPage": "الانتقال إلى الصفحة {n}",
    "pages": "الشرائح",
    "pause": "إيقاف مؤقت",
    "play": "تشغيل",
    "pauseLabel": "إيقاف الشرائح مؤقتًا",
    "playLabel": "تشغيل الشرائح",
    "strip": "الشرائح"
  },
  "cascader": {
    "placeholder": "اختيار",
    "separator": " / ",
    "search": "بحث",
    "noMatches": "لا توجد نتائج مطابقة",
    "empty": "لا توجد عناصر",
    "remove": "إزالة {label}",
    "columns": "الخيارات",
    "allOf": "كل {label}",
    "more": "+{n}",
    "moreLabel": "{n} إضافية",
    "limit": "يمكنك اختيار {n} كحد أقصى.",
    "loading": "جارٍ التحميل…",
    "error": "تعذّر تحميل النتائج",
    "results": {
      "zero": "لا توجد تطابقات",
      "one": "تطابق واحد",
      "two": "تطابقان",
      "few": "{n} تطابقات",
      "many": "{n} تطابقًا",
      "other": "{n} تطابق"
    }
  },
  "codeBlock": {
    "code": "الرمز",
    "copy": "نسخ",
    "copied": "تم النسخ",
    "failed": "تعذّر النسخ"
  },
  "codeEditor": {
    "hint": "مفتاح Tab يضيف مسافة بادئة. اضغط Escape ثم Tab للخروج من المحرّر."
  },
  "combobox": {
    "loading": "جارٍ التحميل…",
    "error": "تعذّر تحميل الخيارات",
    "emptyText": "لا توجد نتائج مطابقة",
    "removeItem": "إزالة {label}",
    "moreChips": "{count} إضافية",
    "clear": "مسح",
    "create": "إنشاء “{text}”",
    "results": {
      "zero": "لا توجد خيارات",
      "one": "خيار واحد",
      "two": "خياران",
      "few": "{n} خيارات",
      "many": "{n} خيارًا",
      "other": "{n} خيار"
    }
  },
  "commandMenu": {
    "label": "الأوامر",
    "placeholder": "اكتب أمرًا أو ابحث",
    "empty": "لا توجد نتائج لـ «{query}»",
    "loading": "جارٍ التحميل",
    "back": "رجوع",
    "results": "{count} نتيجة"
  },
  "contextualHelp": {
    "more": "المزيد عن {title}",
    "moreUntitled": "مزيد من المعلومات"
  },
  "copyButton": {
    "copy": "نسخ",
    "copied": "تم النسخ",
    "failed": "تعذّر النسخ. حدّد النص وانسخه يدويًا."
  },
  "countrySelect": {
    "country": "اختر بلدًا أو منطقة",
    "language": "اختر لغة",
    "locale": "اختر لغة ومنطقة",
    "suggested": "مقترح",
    "all": "الكل"
  },
  "dataGrid": {
    "cardCount": {
      "zero": "لا توجد سجلات",
      "one": "سجل واحد",
      "two": "سجلان",
      "few": "{n} سجلات",
      "many": "{n} سجلًا",
      "other": "{n} سجل"
    },
    "cellsSelected": {
      "zero": "لا توجد خلايا محددة",
      "one": "خلية واحدة محددة",
      "two": "خليتان محددتان",
      "few": "{n} خلايا محددة",
      "many": "{n} خلية محددة",
      "other": "{n} خلية محددة"
    },
    "cellsCopied": {
      "zero": "لم تُنسخ خلايا",
      "one": "نُسخت خلية واحدة",
      "two": "نُسخت خليتان",
      "few": "نُسخت {n} خلايا",
      "many": "نُسخت {n} خلية",
      "other": "نُسخت {n} خلية"
    },
    "cellsPasted": {
      "zero": "لم تُلصق خلايا",
      "one": "لُصقت خلية واحدة",
      "two": "لُصقت خليتان",
      "few": "لُصقت {n} خلايا",
      "many": "لُصقت {n} خلية",
      "other": "لُصقت {n} خلية"
    },
    "cellsFilled": {
      "zero": "لم تتم تعبئة أي خلية",
      "one": "تمت تعبئة خلية واحدة",
      "two": "تمت تعبئة خليتين",
      "few": "تمت تعبئة {n} خلايا",
      "many": "تمت تعبئة {n} خلية",
      "other": "تمت تعبئة {n} خلية"
    },
    "cellsSkipped": {
      "zero": "لم يتم تخطّي أي خلية",
      "one": "تم تخطّي خلية واحدة",
      "two": "تم تخطّي خليتين",
      "few": "تم تخطّي {n} خلايا",
      "many": "تم تخطّي {n} خلية",
      "other": "تم تخطّي {n} خلية"
    },
    "cellsRefused": {
      "zero": "لا توجد خلايا تعذّر حفظها",
      "one": "تعذّر حفظ خلية واحدة",
      "two": "تعذّر حفظ خليتين",
      "few": "تعذّر حفظ {n} خلايا",
      "many": "تعذّر حفظ {n} خلية",
      "other": "تعذّر حفظ {n} خلية"
    },
    "empty": "لا يوجد شيء للعرض",
    "failed": "تعذّر تحميل الجدول",
    "retry": "إعادة المحاولة",
    "columnsFailed": "تعذّر فتح قائمة الأعمدة",
    "close": "إغلاق",
    "selectAll": "تحديد كل الصفوف",
    "selectRow": "تحديد الصف",
    "rowActions": "إجراءات الصف",
    "clearSort": "إلغاء الفرز",
    "hide": "إخفاء الحقل",
    "wider": "أعرض",
    "fit": "ملاءمة المحتوى",
    "deleted": "محذوف",
    "perPage": "الصفوف في كل صفحة",
    "view": "خيارات العرض",
    "wrapHeaders": "التفاف العناوين",
    "markRead": "وضع علامة مقروء",
    "markUnread": "وضع علامة غير مقروء",
    "wrapText": "التفاف النص",
    "wrapAll": "التفاف كل الأعمدة",
    "fullText": "عرض النص كاملًا",
    "rowHeight": "ارتفاع الصف",
    "short": "قصير",
    "medium": "متوسط",
    "tall": "طويل",
    "extra-tall": "طويل جدًا",
    "filter": "تصفية",
    "clearFilter": "مسح التصفية",
    "groupBy": "التجميع حسب هذا الحقل",
    "noGroup": "عدم التجميع حسب هذا الحقل",
    "sizeToFit": "ملاءمة عرض العمود",
    "sizeAllToFit": "ملاءمة عرض كل الأعمدة",
    "moreColumns": "المزيد…",
    "columns": "الأعمدة",
    "loadMore": "تحميل المزيد",
    "loading": "جارٍ تحميل السجلات",
    "group": "التجميع حسب هذا الحقل",
    "filterBy": "التصفية حسب هذا الحقل",
    "any": "أي قيمة",
    "contains": "يحتوي على…",
    "moveRow": "نقل الصف",
    "moveUp": "نقل لأعلى",
    "moveDown": "نقل لأسفل",
    "moveTop": "نقل إلى الأعلى",
    "moveBottom": "نقل إلى الأسفل",
    "resize": "تغيير الحجم",
    "range": "{first}–{last} من {total}",
    "count": "{shown} من {total}",
    "pages": "صفحات {label}",
    "loaded": "تم تحميل {n} صفوف إضافية، {shown} من {total}",
    "noValue": "(فارغ)",
    "addTo": "إضافة سجل إلى {value}",
    "groupRow": "{value}، مجموعة، {count} {records}",
    "record": "سجل",
    "records": "سجلات",
    "expanded": "موسّع",
    "collapsed": "مطوي",
    "sum": "المجموع",
    "countOf": "العدد",
    "average": "المتوسط",
    "min": "الأدنى",
    "max": "الأقصى",
    "sortText": [
      "فرز من أ إلى ي",
      "فرز من ي إلى أ"
    ],
    "sortNumber": [
      "فرز من 1 إلى 9",
      "فرز من 9 إلى 1"
    ],
    "sortDate": [
      "فرز من الأقدم إلى الأحدث",
      "فرز من الأحدث إلى الأقدم"
    ],
    "sortCheck": [
      "فرز من غير المحدد إلى المحدد",
      "فرز من المحدد إلى غير المحدد"
    ],
    "unread": "غير مقروء ({count})",
    "columnsLabel": "أعمدة {label}",
    "rowsLabel": "صفوف {label}",
    "columnActions": "إجراءات العمود {title}",
    "unreadRow": "{label}، غير مقروء",
    "editCell": "تعديل {title}",
    "editing": "جارٍ تعديل {column}",
    "editMode": "التعديل",
    "editModeInline": "تعديل مضمّن",
    "editModeForm": "تعديل في نموذج",
    "formTitle": "تعديل {name}",
    "emptyValue": "—",
    "formNoValue": "لا توجد قيمة",
    "formSaved": "تم حفظ {name}",
    "formSaveRefused": "تعذّر حفظ {name}. تحقق من القيم وحاول مرة أخرى.",
    "saved": "تم الحفظ",
    "saveRefused": "تعذّر الحفظ. تمت استعادة القيمة السابقة.",
    "fillDown": "تعبئة لأسفل",
    "fillRight": "تعبئة لليمين",
    "fillMenu": "تعبئة",
    "undone": "تم التراجع عن التعديل",
    "redone": "تمت إعادة التعديل"
  },
  "dataPill": {
    "male": "ذكر",
    "female": "أنثى"
  },
  "datePicker": {
    "open": "اختيار التاريخ",
    "dialog": "اختيار التاريخ",
    "time": "الوقت",
    "presets": "الإعدادات المسبقة",
    "today": "اليوم",
    "tomorrow": "غدًا",
    "nextWeek": "بعد أسبوع",
    "last7": "آخر 7 أيام",
    "last30": "آخر 30 يومًا",
    "thisMonth": "هذا الشهر",
    "lastMonth": "الشهر الماضي"
  },
  "confirmAction": {
    "title": "{verb} {name}؟",
    "titleMany": "{verb} {count} {plural}؟",
    "permanent": "لا يمكن التراجع عن هذا.",
    "confirm": "{verb}",
    "cancel": "إلغاء"
  },
  "documentViewer": {
    "document": "المستند",
    "previous": "الصفحة السابقة",
    "next": "الصفحة التالية",
    "page": "الصفحة",
    "zoom": "التكبير",
    "thumbnails": "مصغّرات الصفحات",
    "loading": "جارٍ تحميل المستند",
    "failed": "تعذّر فتح المستند.",
    "failedEngine": "تعذّر تشغيل عارض المستندات. حاول مرة أخرى لاحقًا.",
    "failedAccess": "تعذّر فتح المستند. ربما نُقل أو لا تملك صلاحية الوصول إليه.",
    "failedParse": "تعذّرت قراءة هذا الملف كملف PDF.",
    "failedRender": "تعذّر عرض هذه الصفحة.",
    "empty": "لا يوجد مستند.",
    "retry": "حاول مرة أخرى"
  },
  "downloadButton": {
    "download": "تنزيل",
    "downloading": "جارٍ التنزيل",
    "ready": "التنزيل جاهز"
  },
  "emptyState": {
    "offline": {
      "title": "أنت غير متصل بالإنترنت",
      "text": "تحقق من اتصالك. ستُحدَّث هذه الصفحة عند عودتك إلى الاتصال."
    },
    "degraded": {
      "title": "بعض الميزات لا تعمل",
      "text": "هناك خدمة بطيئة أو لا تستجيب، لذا قد تكون المعلومات المعروضة غير محدّثة."
    },
    "permission-denied": {
      "title": "لا تملك صلاحية الوصول",
      "text": "اطلب من المالك مشاركتها معك."
    },
    "not-found": {
      "title": "هذه الصفحة غير موجودة",
      "text": "ربما نُقلت أو حُذفت. تحقق من العنوان أو ارجع إلى الصفحة السابقة."
    },
    "maintenance": {
      "title": "متوقف للصيانة",
      "text": "يجري تحديث هذه الخدمة. حاول مرة أخرى بعد بضع دقائق."
    },
    "completion": {
      "title": "اكتمل كل شيء",
      "text": "لم يتبقَّ شيء لإنجازه هنا."
    }
  },
  "entityPicker": {
    "placeholderPeople": "ابحث بالاسم أو البريد الإلكتروني",
    "placeholder": "ابحث في {entityName}",
    "empty": "لم يتم العثور على {entityName}",
    "browse": "تصفح كل {entityName}",
    "loading": "جارٍ التحميل…",
    "error": "تعذّر تحميل النتائج",
    "remove": "إزالة {label}",
    "results": {
      "zero": "لا توجد نتائج",
      "one": "نتيجة واحدة",
      "two": "نتيجتان",
      "few": "{n} نتائج",
      "many": "{n} نتيجةً",
      "other": "{n} نتيجة"
    }
  },
  "errorSummary": {
    "one": "توجد مشكلة",
    "many": "توجد {count} مشكلات"
  },
  "file": {
    "folder": "مجلد",
    "items": "{n} عناصر",
    "item": "{n} عنصر"
  },
  "fileInput": {
    "choose": "اختيار ملف",
    "chooseMany": "اختيار ملفات",
    "none": "لم يتم اختيار ملف",
    "count": "{count} ملفات",
    "remove": "إزالة {name}"
  },
  "fileRow": {
    "select": "تحديد {name}",
    "more": "المزيد من الإجراءات لـ {name}",
    "download": "تنزيل {name}",
    "rename": "إعادة تسمية…",
    "delete": "حذف",
    "cancel": "إلغاء",
    "retry": "حاول مرة أخرى",
    "transfer": "{label} {name}",
    "uploading": "جارٍ الرفع",
    "file": "ملف",
    "files": "ملفات",
    "folder": "مجلد",
    "folders": "مجلدات",
    "items": "{n} عناصر",
    "item": "{n} عنصر"
  },
  "generatedContent": {
    "label": "محتوى مُنشأ",
    "helpful": "مفيد",
    "unhelpful": "غير مفيد",
    "regenerate": "إعادة الإنشاء",
    "previous": "الإصدار السابق",
    "next": "الإصدار التالي",
    "version": "الإصدار",
    "feedbackSaved": "تم حفظ الملاحظات",
    "failed": "فشل الإجراء. حاول مرة أخرى.",
    "pending": "جارٍ العمل"
  },
  "image": {
    "error": "الصورة غير متاحة"
  },
  "inlineEdit": {
    "edit": "تعديل",
    "save": "حفظ",
    "cancel": "إلغاء",
    "empty": "إضافة قيمة",
    "saved": "تم الحفظ",
    "failed": "تعذّر حفظ التغيير"
  },
  "link": {
    "newTab": "يفتح في علامة تبويب جديدة"
  },
  "loadMore": {
    "more": "تحميل المزيد",
    "moreCount": "عرض {n} إضافية",
    "loading": "جارٍ التحميل…",
    "end": "وصلت إلى النهاية",
    "count": "{shown} من {total}",
    "added": {
      "zero": "لم يتم تحميل عناصر إضافية",
      "one": "تم تحميل عنصر إضافي واحد",
      "two": "تم تحميل عنصرين إضافيين",
      "few": "تم تحميل {n} عناصر إضافية",
      "many": "تم تحميل {n} عنصرًا إضافيًا",
      "other": "تم تحميل {n} عنصر إضافي"
    }
  },
  "mediaViewer": {
    "label": "معاينة",
    "close": "إغلاق المعاينة",
    "previous": "السابق",
    "next": "التالي",
    "counter": "{index} من {total}"
  },
  "metricCard": {
    "more": "المزيد لـ {title}",
    "up": "لأعلى",
    "down": "لأسفل",
    "good": "جيد",
    "bad": "سيئ",
    "vs": "مقابل",
    "empty": "لا توجد بيانات",
    "loading": "جارٍ تحميل {title}",
    "error": "تعذّر تحميل الأرقام.",
    "retry": "حاول مرة أخرى",
    "stale": "قديم",
    "rank": "#{n}",
    "toCome": "قادم",
    "hit": "تحقق الهدف",
    "missed": "لم يتحقق",
    "weekdays": [
      "ن",
      "ث",
      "ر",
      "خ",
      "ج",
      "س",
      "ح"
    ],
    "weekdayNames": [
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
      "الأحد"
    ],
    "month": "{done} من {days} أيام عمل حتى الآن",
    "parts": "{label} {share}",
    "compare": "{a} {av}، {b} {bv}"
  },
  "millerColumns": {
    "empty": "لا توجد عناصر",
    "resize": "تغيير عرض العمود {label}",
    "preview": "معاينة {label}"
  },
  "navList": {
    "pin": "تثبيت",
    "unpin": "إلغاء التثبيت",
    "pinItem": "تثبيت {label}",
    "unpinItem": "إلغاء تثبيت {label}"
  },
  "notice": {
    "dismiss": "تجاهل"
  },
  "numberInput": {
    "decrease": "نقصان",
    "increase": "زيادة"
  },
  "otpInput": {
    "cell": "الحرف {n} من {total}"
  },
  "persona": {
    "online": "متصل",
    "away": "غائب",
    "busy": "مشغول",
    "dnd": "عدم الإزعاج",
    "offline": "غير متصل"
  },
  "popover": {
    "close": "إغلاق"
  },
  "productOptions": {
    "chosen": "{label}:",
    "unavailable": "غير متوفر في المخزون",
    "quantity": "الكمية",
    "quantityOf": "الكمية، {product}",
    "unavailableName": "{label}، غير متوفر في المخزون",
    "none": "لم يتم اختيار شيء"
  },
  "progressSteps": {
    "step": "الخطوة {n} من {total}",
    "complete": "مكتملة",
    "current": "الخطوة الحالية",
    "upcoming": "لم تبدأ",
    "error": "تحتاج إلى انتباه"
  },
  "relativeDateInput": {
    "custom": "مخصص",
    "none": "أي وقت",
    "amount": "المبلغ",
    "unit": "الوحدة",
    "direction": "الاتجاه",
    "past": "الأخيرة",
    "future": "التالي",
    "units": {
      "day": [
        "يوم",
        "أيام"
      ],
      "week": [
        "أسبوع",
        "أسابيع"
      ],
      "month": [
        "شهر",
        "أشهر"
      ],
      "year": [
        "سنة",
        "سنوات"
      ]
    },
    "presets": {
      "today": "اليوم",
      "yesterday": "أمس",
      "last-7-days": "آخر 7 أيام",
      "last-30-days": "آخر 30 يومًا",
      "last-90-days": "آخر 90 يومًا",
      "last-12-months": "آخر 12 شهرًا",
      "tomorrow": "غدًا",
      "next-7-days": "الأيام السبعة القادمة",
      "next-30-days": "الأيام الثلاثون القادمة",
      "next-90-days": "الأيام التسعون القادمة",
      "next-12-months": "الأشهر الاثنا عشر القادمة"
    }
  },
  "resizable": {
    "width": "عرض {label}",
    "height": "ارتفاع {label}",
    "minWidth": "أصغر عرض لـ {label} ({value}px)",
    "maxWidth": "أكبر عرض لـ {label} ({value}px)",
    "minHeight": "أصغر ارتفاع لـ {label} ({value}px)",
    "maxHeight": "أكبر ارتفاع لـ {label} ({value}px)"
  },
  "richTextEditor": {
    "toolbar": "التنسيق",
    "more": "مزيد من التنسيق",
    "bold": "غامق",
    "italic": "مائل",
    "underline": "تسطير",
    "strike": "يتوسطه خط",
    "code": "رمز مضمّن",
    "subscript": "نص سفلي",
    "superscript": "نص علوي",
    "link": "رابط",
    "bulleted": "قائمة نقطية",
    "numbered": "قائمة مرقّمة",
    "tasks": "قائمة مهام",
    "quote": "اقتباس",
    "codeBlock": "كتلة رمز",
    "rule": "خط أفقي",
    "image": "صورة",
    "table": "جدول",
    "color": "لون النص",
    "highlight": "تمييز",
    "alignLeft": "محاذاة إلى اليسار",
    "alignCenter": "محاذاة إلى الوسط",
    "alignRight": "محاذاة إلى اليمين",
    "alignJustify": "ضبط",
    "clear": "مسح التنسيق",
    "undo": "تراجع",
    "redo": "إعادة",
    "textStyle": "نمط النص",
    "paragraph": "فقرة",
    "font": "الخط",
    "defaultFont": "الخط الافتراضي",
    "size": "الحجم",
    "defaultSize": "الحجم الافتراضي",
    "custom": "مخصص…",
    "customFont": "عائلة الخط",
    "customSize": "حجم الخط",
    "insertTable": "إدراج جدول",
    "rowBefore": "إضافة صف أعلاه",
    "rowAfter": "إضافة صف أدناه",
    "columnBefore": "إضافة عمود قبله",
    "columnAfter": "إضافة عمود بعده",
    "deleteRow": "حذف الصف",
    "deleteColumn": "حذف العمود",
    "headerRow": "صف العناوين",
    "deleteTable": "حذف الجدول",
    "linkAddress": "عنوان الرابط",
    "addLink": "إضافة رابط",
    "imageAddress": "عنوان الصورة",
    "imageAlt": "الوصف",
    "addImage": "إضافة صورة",
    "swatches": "ألوان مقترحة",
    "customColor": "لون مخصص",
    "hex": "قيمة سداسية عشرية",
    "apply": "تطبيق",
    "remove": "إزالة",
    "cancel": "إلغاء",
    "mentions": "اقتراحات",
    "groupMarks": "النص",
    "groupColor": "اللون",
    "groupAlign": "المحاذاة",
    "groupLists": "القوائم",
    "groupInsert": "إدراج",
    "groupHistory": "السجل",
    "leave": "اضغط Tab أو Shift+Tab للخروج من المحرّر",
    "hint": "Escape ثم Tab للخروج من المحرّر",
    "heading": "عنوان {n}",
    "tip": "{name} ({keys})"
  },
  "roleLabel": {
    "owner": "المالك",
    "editor": "محرّر",
    "viewer": "مشاهد"
  },
  "searchField": {
    "suggestions": "اقتراحات",
    "recent": "عمليات البحث الأخيرة",
    "clearRecent": "مسح عمليات البحث الأخيرة",
    "clear": "مسح البحث",
    "results": "{n} اقتراحات",
    "removed": "تمت إزالة {query} من عمليات البحث الأخيرة",
    "remove": "إزالة {query}",
    "placeholder": "بحث",
    "label": "بحث",
    "searching": "جارٍ البحث"
  },
  "sheet": {
    "expand": "توسيع اللوحة",
    "shrink": "تصغير اللوحة",
    "doneLabel": "تم",
    "cancelLabel": "إلغاء",
    "closeLabel": "إغلاق",
    "done": "تم",
    "cancel": "إلغاء",
    "close": "إغلاق"
  },
  "slider": {
    "minimum": "الحد الأدنى",
    "maximum": "الحد الأقصى"
  },
  "splitButton": {
    "more": "مزيد من خيارات {label}"
  },
  "tabs": {
    "more": "المزيد",
    "moreLabel": "مزيد من علامات التبويب"
  },
  "teachingBubble": {
    "close": "إغلاق",
    "step": "{current} من {total}"
  },
  "text": {
    "more": "عرض المزيد",
    "less": "عرض أقل",
    "fullText": "عرض النص كاملًا",
    "fullTextOf": "عرض النص كاملًا: {label}",
    "fullTextTitle": "النص الكامل"
  },
  "timePicker": {
    "hour": "الساعة",
    "minute": "الدقيقة",
    "period": "ص أو م",
    "am": "ص",
    "pm": "م",
    "times": "الأوقات",
    "empty": "--"
  },
  "timeZoneSelect": {
    "placeholder": "اختر منطقة زمنية",
    "empty": "لا توجد نتائج مطابقة",
    "utc": "التوقيت العالمي المنسق",
    "other": "أخرى",
    "regions.Africa": "أفريقيا",
    "regions.America": "الأمريكتان",
    "regions.Antarctica": "القارة القطبية الجنوبية",
    "regions.Arctic": "القطب الشمالي",
    "regions.Asia": "آسيا",
    "regions.Atlantic": "المحيط الأطلسي",
    "regions.Australia": "أستراليا",
    "regions.Europe": "أوروبا",
    "regions.Indian": "المحيط الهندي",
    "regions.Pacific": "المحيط الهادئ",
    "regions": {
      "Africa": "أفريقيا",
      "America": "الأمريكتان",
      "Antarctica": "القارة القطبية الجنوبية",
      "Arctic": "القطب الشمالي",
      "Asia": "آسيا",
      "Atlantic": "المحيط الأطلسي",
      "Australia": "أستراليا",
      "Europe": "أوروبا",
      "Indian": "المحيط الهندي",
      "Pacific": "المحيط الهادئ"
    },
    "results": {
      "zero": "لا توجد مناطق زمنية",
      "one": "منطقة زمنية واحدة",
      "two": "منطقتان زمنيتان",
      "few": "{n} مناطق زمنية",
      "many": "{n} منطقةً زمنية",
      "other": "{n} منطقة زمنية"
    }
  },
  "transferList": {
    "source": "المتاح",
    "target": "المختار",
    "add": "إضافة",
    "addAll": "إضافة الكل",
    "remove": "إزالة",
    "removeAll": "إزالة الكل",
    "up": "نقل لأعلى",
    "down": "نقل لأسفل",
    "search": "بحث في {title}",
    "selectAll": "تحديد كل عناصر {title}",
    "count": "تم تحديد {checked} من {total}",
    "moved": "تم نقل {n} إلى {title}",
    "empty": "لا توجد عناصر",
    "noMatch": "لا توجد نتائج مطابقة",
    "moves": "نقل العناصر"
  },
  "treeSelect": {
    "placeholder": "اختيار",
    "search": "بحث",
    "choose": "اختر عنصرًا",
    "more": "{list} و{n} أخرى",
    "empty": "لا توجد نتائج مطابقة"
  },
  "versionLabel": {
    "version": "الإصدار",
    "prefix": "إ",
    "latest": "الأحدث",
    "draft": "مسودة"
  },
  "virtualList": {
    "loading": "جارٍ التحميل…",
    "empty": "لا توجد عناصر",
    "count": {
      "zero": "لا توجد عناصر",
      "one": "عنصر واحد",
      "two": "عنصران",
      "few": "{n} عناصر",
      "many": "{n} عنصرًا",
      "other": "{n} عنصر"
    },
    "group": {
      "zero": "لا توجد عناصر",
      "one": "عنصر واحد",
      "two": "عنصران",
      "few": "{n} عناصر",
      "many": "{n} عنصرًا",
      "other": "{n} عنصر"
    },
    "unreadRow": "{label}، غير مقروء"
  },
  "aiSearch": {
    "label": "بحث بالذكاء الاصطناعي",
    "query": "عبارة البحث",
    "search": "بحث",
    "semantic": "استخدام البحث الدلالي",
    "results": "نتائج البحث",
    "empty": "لا توجد نتائج.",
    "failed": "فشل البحث. حاول مرة أخرى.",
    "pending": "جارٍ البحث"
  },
  "appShell": {
    "skip": "تخطّي إلى المحتوى الرئيسي",
    "minSize": {
      "title": "حجم الشاشة غير مدعوم",
      "text": "يعرض هذا التطبيق الكثير من المعلومات التفصيلية، ولم يُصمَّم للشاشات الصغيرة بعد. استخدم كمبيوتر سطح المكتب أو كمبيوترًا محمولًا بشاشة لا تقل عن {width} × {height}. نخطط لتصميم للأجهزة المحمولة.",
      "continue": "المتابعة على أي حال"
    },
    "frame": {
      "expand": "توسيع إلى ملء النافذة",
      "restore": "استعادة إلى عرض {width}"
    }
  },
  "assignControl": {
    "assign": "إسناد",
    "assignToMe": "إسناد إليّ",
    "reassign": "إعادة الإسناد",
    "unassign": "إلغاء الإسناد",
    "unassigned": "غير مُسنَد",
    "cancel": "إلغاء",
    "assigned": "مُسنَد إلى {name}",
    "cleared": "تمت إزالة {label}",
    "delegate": "تفويض",
    "change": "التغيير",
    "end": "إنهاء التفويض",
    "delegateTitle": "تفويض {label}",
    "to": "التفويض إلى",
    "dates": "التواريخ",
    "note": "ملاحظة",
    "noteHint": "تظهر للشخص الذي تفوّضه.",
    "needPerson": "اختر شخصًا.",
    "needDates": "اختر اليوم الأول والأخير.",
    "delegatedTo": "تم التفويض إلى {name}",
    "notDelegated": "غير مفوَّض",
    "ended": "انتهى التفويض",
    "label": "المُسنَد إليه"
  },
  "attachmentPicker": {
    "label": "المرفقات",
    "remove": "إزالة {name}",
    "invalid": "اختر ملفًا مدعومًا ضمن الحد المسموح للحجم.",
    "limit": "عدد المرفقات كبير جدًا.",
    "empty": "لا توجد مرفقات."
  },
  "autosave": {
    "saving": "جارٍ الحفظ",
    "saved": "تم الحفظ",
    "offline": "غير متصل",
    "failed": "فشل الحفظ",
    "retry": "إعادة المحاولة",
    "unsaved": "لم يتم حفظ تغييراتك."
  },
  "avatarUpload": {
    "change": "تغيير الصورة",
    "add": "إضافة صورة",
    "remove": "إزالة الصورة",
    "tooLarge": "الصورة أكبر من {max}",
    "notImage": "اختر ملف صورة",
    "picture": "صورة {name}"
  },
  "bottomSheetNav": {
    "title": "التنقل",
    "close": "إغلاق"
  },
  "bulkActions": {
    "selected": "تم تحديد {n}",
    "selectAll": "تحديد الكل",
    "clear": "مسح",
    "allSelected": "كل {noun} محدد",
    "nothingToClear": "لا شيء لمسحه: حدّد {plural} أولًا",
    "why": "حدّد {plural} لـ {action}",
    "single": "حدّد {noun} واحدًا لـ {action}",
    "label": "إجراءات التحديد",
    "more": "المزيد من الإجراءات",
    "noun": "عنصر",
    "plural": "عناصر"
  },
  "columnsMenu": {
    "label": "الأعمدة",
    "manage": "إدارة الأعمدة",
    "first": "العمود الأول",
    "moveMenu": "نقل {name}",
    "moveUp": "نقل {name} لأعلى",
    "moveDown": "نقل {name} لأسفل",
    "up": "نقل لأعلى",
    "down": "نقل لأسفل",
    "find": "البحث عن عمود",
    "showAll": "إظهار الكل",
    "hideAll": "إخفاء الكل",
    "apply": "تطبيق",
    "cancel": "إلغاء",
    "shown": "تم إظهار {name}",
    "hidden": "تم إخفاء {name}",
    "isFirst": "{name} هو العمود الأول",
    "moved": "{name}، الموضع {position} من {total}",
    "row": "{name}{first}. المفتاحان Alt + السهم لأعلى أو لأسفل ينقلانه",
    "firstMark": "، العمود الأول",
    "none": "لا يوجد عمود مطابق"
  },
  "commandBar": {
    "more": "المزيد من الإجراءات",
    "actions": "إجراءات {label}",
    "find": "بحث وعرض",
    "selected": "تم تحديد {n}",
    "hidden": " (مخفي {n} بسبب التصفيات)",
    "clear": "مسح التحديد",
    "clearName": "تم تحديد {n}، مسح التحديد",
    "swapped": "تم تحديد {n}. إجراءات التحديد متاحة.",
    "cleared": "تم مسح التحديد.",
    "why": "حدّد {plural} لـ {action}",
    "single": "حدّد {noun} واحدًا لـ {action}",
    "preset": "أي",
    "moreLabel": "المزيد من الإجراءات",
    "from": "",
    "to": "",
    "reorder": {
      "moved": "تم نقل {name} إلى الموضع {position} من {total}",
      "row": "{name}، {position} من {total}. المفتاحان Alt + السهم لأعلى أو لأسفل ينقلانه",
      "reorder": "إعادة ترتيب {name}",
      "moveUp": "نقل لأعلى",
      "moveDown": "نقل لأسفل"
    }
  },
  "commandPalette": {
    "title": "الأوامر",
    "close": "إغلاق"
  },
  "comparisonView": {
    "label": "المقارنة",
    "modes": "العرض",
    "columns": "جنبًا إلى جنب",
    "matrix": "جدول",
    "slider": "شريط التمرير",
    "onlyDifferences": "عرض الاختلافات فقط",
    "changed": "تم تغييره",
    "attribute": "السمة",
    "position": "الموضع",
    "none": "لا توجد اختلافات",
    "one": "اختلاف واحد",
    "many": "{n} اختلافات",
    "empty": "—"
  },
  "connectedAccounts": {
    "label": "الحسابات المتصلة",
    "connect": "اتصال",
    "disconnect": "قطع الاتصال",
    "reconnect": "إعادة الاتصال",
    "cancel": "إلغاء",
    "connected": "متصل",
    "disconnected": "غير متصل",
    "error": "خطأ في الاتصال",
    "as": "بصفة {account}",
    "since": "منذ {date}",
    "connectTitle": "الاتصال بـ {service}؟",
    "connectMessage": "ستسجّل الدخول إلى {service} للسماح بذلك. سيتمكن Plenix من:",
    "continue": "المتابعة إلى {service}",
    "disconnectTitle": "قطع الاتصال بـ {service}؟",
    "disconnectMessage": "يمكنك الاتصال به مرة أخرى في أي وقت.",
    "done": "تم الاتصال بـ {service}",
    "undone": "تم قطع الاتصال بـ {service}"
  },
  "deleteFlow": {
    "title": "حذف {name}؟",
    "titleMany": "حذف {count} {plural}؟",
    "delete": "حذف",
    "cancel": "إلغاء",
    "permanent": "لا يمكن التراجع عن هذا.",
    "more": "و{count} أخرى",
    "typeLabel": "اكتب {phrase} للتأكيد",
    "typeError": "اكتب {phrase} تمامًا كما هو معروض.",
    "phraseMany": "حذف {count} {plural}",
    "deleted": "تم حذف {what}",
    "trashed": "تم نقل {what} إلى سلة المحذوفات",
    "undo": "تراجع",
    "retention": "استعد {them} من سلة المحذوفات خلال {days} يومًا.",
    "it": "ه",
    "them": "هم",
    "names": "محذوف",
    "noun": "عنصر",
    "plural": "عناصر",
    "items": {
      "zero": "لا عناصر",
      "one": "عنصر واحد",
      "two": "عنصران",
      "few": "{n} عناصر",
      "many": "{n} عنصرًا",
      "other": "{n} عنصر"
    },
    "titleItems": {
      "zero": "حذف لا عناصر؟",
      "one": "حذف عنصر واحد؟",
      "two": "حذف عنصرين؟",
      "few": "حذف {n} عناصر؟",
      "many": "حذف {n} عنصرًا؟",
      "other": "حذف {n} عنصر؟"
    },
    "phraseItems": {
      "zero": "حذف لا عناصر",
      "one": "حذف عنصر واحد",
      "two": "حذف عنصرين",
      "few": "حذف {n} عناصر",
      "many": "حذف {n} عنصرًا",
      "other": "حذف {n} عنصر"
    }
  },
  "duplicateAction": {
    "duplicate": "تكرار",
    "copyOf": "نسخة من {name}",
    "numbered": "{name} ({n})",
    "title": "تكرار {noun}",
    "name": "الاسم",
    "from": "من {name}",
    "also": "انسخ أيضًا",
    "empty": "أدخل اسمًا.",
    "taken": "يوجد {noun} باسم {name} بالفعل.",
    "done": "تم التكرار باسم {name}",
    "undo": "تراجع",
    "cancel": "إلغاء",
    "noun": "عنصر"
  },
  "fileBrowser": {
    "label": "الملفات",
    "root": "المكتبة",
    "newFolder": "مجلد جديد",
    "folderName": "اسم المجلد",
    "create": "إنشاء",
    "upload": "رفع",
    "search": "البحث في هذا المجلد",
    "folders": "المجلدات",
    "path": "الموقع",
    "count": "{n} عناصر",
    "one": "عنصر واحد",
    "empty": "هذا المجلد فارغ",
    "emptyText": "ارفع ملفات أو أنشئ مجلدًا.",
    "noMatch": "لا شيء يطابق «{q}»",
    "download": "تنزيل",
    "moveTo": "نقل إلى",
    "delete": "حذف",
    "noun": "عنصر",
    "plural": "عناصر",
    "drop": "أفلت الملفات لرفعها إلى {folder}",
    "nameTaken": "يوجد ملف أو مجلد باسم «{name}» هنا بالفعل.",
    "nameEmpty": "أعطِ المجلد اسمًا.",
    "items": "{n} عناصر",
    "item": "{n} عنصر"
  },
  "fileList": {
    "sort": "ترتيب",
    "sortBy": "الترتيب حسب {field}",
    "field": "الترتيب حسب",
    "order": "الترتيب",
    "asc": "تصاعدي",
    "desc": "تنازلي",
    "name": "الاسم",
    "size": "الحجم",
    "modified": "تاريخ التعديل",
    "owner": "المالك",
    "status": "الحالة",
    "count": "{n} عناصر",
    "one": "عنصر واحد",
    "empty": "لا يوجد شيء هنا بعد",
    "open": "فتح",
    "download": "تنزيل",
    "rename": "إعادة تسمية…",
    "delete": "حذف",
    "moveTo": "نقل إلى",
    "file": "ملف",
    "files": "ملفات",
    "folder": "مجلد",
    "folders": "مجلدات",
    "items": "{n} عناصر",
    "item": "{n} عنصر"
  },
  "filePicker": {
    "title": "اختيار ملفات",
    "all": "كل الملفات",
    "folders": "المجلدات",
    "search": "البحث في الملفات",
    "empty": "لا توجد ملفات مطابقة.",
    "pick": "اختيار",
    "cancel": "إلغاء",
    "failed": "تعذّر اختيار الملفات. حاول مرة أخرى."
  },
  "filterBar": {
    "label": "عوامل التصفية",
    "more": "مزيد من عوامل التصفية",
    "clearAll": "مسح الكل",
    "one": "{label}: {value}",
    "several": "{label} · {count}"
  },
  "navPane": {
    "browse": "استعراض",
    "expand": "توسيع الشريط الجانبي",
    "collapse": "طي الشريط الجانبي",
    "resize": "تغيير حجم {name}",
    "resizeNavigation": "تغيير حجم شريط التنقل"
  },
  "notificationList": {
    "label": "الإشعارات",
    "empty": "لا توجد إشعارات",
    "markAllRead": "تعليم الكل كمقروء",
    "viewAll": "عرض الكل"
  },
  "peopleGroup": {
    "team": "الفريق",
    "group": "المجموعة",
    "members": "{n} أعضاء",
    "member": "{n} عضو",
    "showMembers": "عرض الأعضاء",
    "membersOf": "أعضاء {name}"
  },
  "permissionSummary": {
    "can": "يمكنه",
    "cannot": "لا يمكنه",
    "manage": "إدارة الوصول",
    "canSentence": "يمكنه {list}",
    "cannotSentence": "لا يمكنه {list}"
  },
  "popconfirm": {
    "cancel": "إلغاء"
  },
  "productCard": {
    "sale": "تخفيض",
    "outOfStock": "غير متوفر في المخزون",
    "addToCart": "أضف إلى السلة",
    "addToCartFor": "أضف {title} إلى السلة",
    "now": "الآن",
    "was": "كان",
    "rating": "التقييم",
    "reviews": "{n} مراجعات",
    "review": "مراجعة واحدة",
    "soldOut": "{title} غير متوفر في المخزون"
  },
  "publish": {
    "publish": "نشر",
    "publishNow": "النشر الآن",
    "schedule": "جدولة",
    "cancelSchedule": "إلغاء الجدولة",
    "unpublish": "إلغاء النشر",
    "cancel": "إلغاء",
    "publishTitle": "نشر {name}؟",
    "publishMessage": "سيصبح مرئيًا لـ {audience}.",
    "unpublishTitle": "إلغاء نشر {name}؟",
    "unpublishMessage": "سيُخفى عن {audience}. يمكنك نشره مرة أخرى.",
    "scheduleTitle": "جدولة {name}",
    "when": "النشر في",
    "whenHint": "التاريخ والوقت، بحسب منطقتك الزمنية.",
    "past": "اختر وقتًا في المستقبل.",
    "empty": "اختر التاريخ والوقت.",
    "publishedLine": "نُشر {at}",
    "publishedBy": "نُشر {at} بواسطة {by}",
    "scheduledLine": "سيُنشر {at}",
    "scheduledBy": "سيُنشر {at}، جدولة {by}",
    "draftLine": "غير منشور",
    "published": "تم نشر {name}",
    "scheduled": "تمت جدولة {name} في {at}",
    "unpublished": "تم إلغاء نشر {name}",
    "undo": "تراجع",
    "everyone": "كل من لديه صلاحية الوصول",
    "actions": "جارٍ النشر"
  },
  "queryBuilder": {
    "builder": "المنشئ",
    "text": "النص",
    "viewLabel": "العرض",
    "where": "حيث",
    "and": "و",
    "or": "أو",
    "andWord": "و",
    "orWord": "أو",
    "join": "المطابقة",
    "all": "كل القواعد",
    "any": "أي قاعدة",
    "addRule": "إضافة قاعدة",
    "addGroup": "إضافة مجموعة",
    "removeRule": "إزالة القاعدة",
    "removeGroup": "إزالة المجموعة",
    "field": "الحقل",
    "operator": "العامل",
    "value": "القيمة",
    "rule": "القاعدة {n}",
    "group": "المجموعة {n}",
    "empty": "لا توجد قواعد: كل السجلات مطابقة.",
    "everything": "كل سجل",
    "matches": "{n} مطابقات",
    "match": "{n} مطابقة",
    "textTitle": "استعلام",
    "added": "تمت إضافة القاعدة",
    "groupAdded": "تمت إضافة المجموعة",
    "removed": "تمت إزالة القاعدة",
    "groupRemoved": "تمت إزالة المجموعة"
  },
  "renameAction": {
    "label": "الاسم",
    "rename": "إعادة تسمية",
    "open": "إعادة تسمية…",
    "title": "إعادة تسمية {name}",
    "cancel": "إلغاء",
    "empty": "أدخل اسمًا",
    "slash": "لا يمكن أن يحتوي الاسم على / أو \\",
    "taken": "يوجد عنصر باسم {name} هنا بالفعل",
    "tooLong": "استخدم {max} حرفًا أو أقل",
    "renamed": "تمت إعادة التسمية إلى {name}",
    "failed": "تعذّر تغيير الاسم"
  },
  "renditionList": {
    "label": "الصيغ المشتقة",
    "name": "الاسم",
    "format": "الصيغة",
    "size": "الحجم",
    "download": "تنزيل",
    "empty": "لا توجد صيغ مشتقة."
  },
  "resourceList": {
    "item": "عنصر",
    "selectAll": "تحديد كل {nouns} ({n})",
    "select": "تحديد {name}",
    "count": "{n} {nouns}",
    "selected": "تم تحديد {n} من {total}"
  },
  "retry": {
    "title": "تعذّر التحميل",
    "retry": "إعادة المحاولة",
    "retryNow": "إعادة المحاولة الآن",
    "retrying": "جارٍ إعادة المحاولة…",
    "waiting": "إعادة المحاولة خلال {time}",
    "attempt": "المحاولة {attempt} من {attempts}",
    "stopped": "توقفت بعد {attempts} محاولات",
    "dismiss": "تجاهل",
    "status": "فشل"
  },
  "roleManager": {
    "roles": "الأدوار",
    "create": "إنشاء دور",
    "createTitle": "إنشاء دور",
    "name": "الاسم",
    "description": "الوصف",
    "descriptionHint": "جملة واحدة عمّا يستطيع أصحاب هذا الدور فعله.",
    "startFrom": "البدء بصلاحيات",
    "empty": "أدخل اسمًا.",
    "taken": "يوجد دور باسم {name} بالفعل.",
    "back": "كل الأدوار",
    "members": "الأعضاء",
    "member": "عضو",
    "membersCount": "{n} أعضاء",
    "memberCount": "{n} عضو",
    "builtIn": "مدمج",
    "custom": "مخصص",
    "permissions": "الصلاحيات",
    "builtInNote": "لا يمكن تغيير الأدوار المدمجة. انسخ أحدها لإنشاء دور خاص بك.",
    "addMember": "إضافة عضو",
    "remove": "إزالة {name}",
    "lastMember": "يحتاج {role} إلى عضو واحد على الأقل. أضف شخصًا آخر أولًا.",
    "noMembers": "لا أحد لديه هذا الدور بعد.",
    "role": "دور",
    "cancel": "إلغاء",
    "delete": "حذف",
    "added": "تمت إضافة {name} إلى {role}",
    "removed": "تمت إزالة {name} من {role}",
    "created": "تم إنشاء {name}",
    "access": "أصحاب دور {role}",
    "people": "{n} أشخاص",
    "peopleOne": "{n} شخص",
    "allowed": "تم السماح بـ {permission} لدور {role}",
    "denied": "لم يعد {permission} مسموحًا لدور {role}"
  },
  "searchWorkspace": {
    "title": "بحث",
    "selectAll": "تحديد الكل",
    "allSelected": "كل {noun} محدد",
    "placeholder": "بحث…",
    "result": "نتيجة",
    "results": "نتائج",
    "searchField": "بحث في {nouns}",
    "save": "حفظ البحث",
    "filters": "عوامل التصفية",
    "activeFilters": "عوامل التصفية النشطة",
    "chip": "{label}: {value}",
    "remove": "إزالة {text}",
    "clearAll": "مسح الكل",
    "view": "العرض",
    "grid": "شبكة",
    "table": "جدول",
    "sort": "ترتيب",
    "sortValue": "الترتيب: {value}",
    "noMatchQuery": "لا شيء يطابق «{query}».",
    "noMatchQueryFilters": "لا شيء يطابق «{query}» مع عوامل التصفية هذه.",
    "noMatchFilters": "لا شيء يطابق عوامل التصفية هذه."
  },
  "secondaryPane": {
    "expand": "توسيع {name}",
    "collapse": "طيّ {name}",
    "resize": "تغيير حجم {name}",
    "close": "إغلاق {name}",
    "back": "العودة إلى {name}"
  },
  "sessionTimeout": {
    "warningTitle": "جلستك على وشك الانتهاء",
    "warning": "سيتم تسجيل خروجك خلال {time} لأنك لم تكن نشطًا.",
    "stay": "البقاء متصلًا",
    "signOut": "تسجيل الخروج",
    "signedOutTitle": "تم تسجيل خروجك",
    "signedOut": "حفاظًا على أمانك، تم تسجيل خروجك بعد {minutes} دقيقة دون نشاط.",
    "signedOutShort": "حفاظًا على أمانك، تم تسجيل خروجك لأنك لم تكن نشطًا.",
    "saved": "تم حفظ تغييراتك.",
    "signIn": "تسجيل الدخول مرة أخرى",
    "left": "متبقي {time}",
    "ended": "تم تسجيل الخروج"
  },
  "sortableList": {
    "moveMenu": "نقل {name}",
    "moveUp": "نقل لأعلى",
    "moveDown": "نقل لأسفل",
    "moveEarlier": "نقل لوقت أبكر",
    "moveLater": "نقل لوقت أحدث",
    "moveFirst": "نقل إلى البداية",
    "moveLast": "نقل إلى النهاية",
    "moveUpNamed": "نقل {name} لأعلى",
    "moveDownNamed": "نقل {name} لأسفل"
  },
  "uploadManager": {
    "dialogTitle": "رفع ملفات",
    "queue": "عمليات الرفع",
    "drop": "اسحب الملفات أو المجلدات وأفلتها هنا",
    "or": "أو",
    "chooseFiles": "اختيار ملفات",
    "chooseFolder": "اختر مجلدًا",
    "uploading": "جارٍ رفع {n} ملفات",
    "uploadingOne": "جارٍ رفع ملف واحد",
    "done": "اكتمل {n} عمليات رفع",
    "doneOne": "اكتملت عملية رفع واحدة",
    "failed": "فشلت {n} عمليات رفع",
    "failedOne": "فشلت عملية رفع واحدة",
    "none": "لا توجد عمليات رفع",
    "progress": "تم رفع {done} من {total}",
    "overall": "التقدم الإجمالي",
    "waiting": "بالانتظار",
    "uploaded": "تم الرفع",
    "canceled": "أُلغي",
    "cancelAll": "إلغاء الكل",
    "clear": "مسح المكتملة",
    "hide": "إخفاء عمليات الرفع",
    "show": "إظهار عمليات الرفع",
    "close": "إغلاق",
    "finish": "تم",
    "remove": "إزالة من القائمة",
    "again": "الرفع مرة أخرى",
    "tooLarge": "هذا الملف أكبر من {max}.",
    "wrongType": "لا يمكن رفع هذا النوع من الملفات هنا.",
    "error": "فشل الرفع. حاول مرة أخرى.",
    "failedNamed": "فشل {name}: {reason}",
    "status": "أُلغي"
  },
  "userCard": {
    "online": "متصل",
    "away": "غائب",
    "busy": "مشغول",
    "dnd": "عدم الإزعاج",
    "offline": "غير متصل"
  },
  "versionCompare": {
    "label": "مقارنة الإصدارات",
    "compare": "مقارنة",
    "with": "مع",
    "swap": "تبديل",
    "swapLabel": "تبديل الإصدارين",
    "view": "العرض",
    "columns": "جنبًا إلى جنب",
    "slider": "شريط التمرير",
    "text": "النص",
    "by": "بواسطة {author}",
    "diff": "التغييرات من {base} إلى {target}",
    "added": "مضاف",
    "removed": "محذوف",
    "same": "لا توجد تغييرات في النص",
    "summary": "أُضيف {added}، وحُذف {removed}",
    "lines": "{n} أسطر",
    "line": "سطر واحد",
    "previous": "التغيير السابق",
    "next": "التغيير التالي",
    "at": "التغيير {n} من {total}",
    "unchanged": "عرض {n} أسطر لم تتغير",
    "empty": "اختر إصدارين للمقارنة."
  },
  "versionHistory": {
    "label": "سجل الإصدارات",
    "preview": "معاينة",
    "restore": "استعادة",
    "confirm": "استعادة هذا الإصدار؟",
    "cancel": "إلغاء",
    "failed": "تعذّرت استعادة الإصدار. حاول مرة أخرى.",
    "restored": "تمت استعادة الإصدار",
    "empty": "لا توجد إصدارات."
  },
  "viewMenu": {
    "editMode": "التعديل",
    "editModeInline": "تعديل مضمّن",
    "editModeForm": "تعديل في نموذج",
    "reset": "إعادة ضبط العرض",
    "label": "العرض",
    "layout": "التخطيط",
    "list": "قائمة",
    "gallery": "معرض",
    "size": "حجم البطاقة (المعرض)",
    "s": "صغير",
    "m": "متوسط",
    "l": "كبير",
    "height": "ارتفاع الصف (القائمة)",
    "short": "قصير",
    "medium": "متوسط",
    "tall": "طويل",
    "extra-tall": "طويل جدًا"
  },
  "widgetGrid": {
    "widget": "أداة",
    "widgetLower": "أداة",
    "move": "نقل {title} (مفاتيح الأسهم)",
    "position": "{title}، الموضع {index} من {total}",
    "earlier": "نقل لوقت أبكر",
    "later": "نقل لوقت أحدث",
    "first": "نقل إلى البداية",
    "last": "نقل إلى النهاية"
  },
  "providers": {
    "UnsavedGuard": {
      "title": "المغادرة دون حفظ؟",
      "message": "ستفقد تغييراتك.",
      "leave": "مغادرة",
      "stay": "متابعة التحرير"
    }
  },
  "templates": {
    "templates": {
      "Templates": {
        "empty": "لا توجد سجلات بعد",
        "emptyDescription": "أنشئ سجلًا للبدء.",
        "pane": "السجلات",
        "sections": "في هذه الصفحة",
        "retry": "حاول مرة أخرى",
        "home": "الذهاب إلى الصفحة الرئيسية",
        "search": "نتائج البحث",
        "tools": "الأدوات",
        "inspector": "الخيارات",
        "detail": "التفاصيل",
        "noSelection": "لم يتم تحديد شيء",
        "noSelectionDescription": "اختر عنصرًا لعرضه هنا."
      }
    },
    "Commerce": {
      "Storefront": {
        "layout": "معرض"
      }
    }
  },
  "utils": {
    "clipboard": {
      "copied": "تم النسخ"
    }
  },
  "aiButton": {
    "label": "إجراءات الذكاء الاصطناعي",
    "failed": "تعذّر إكمال هذا الإجراء. حاول مرة أخرى.",
    "working": "جارٍ العمل"
  },
  "aiDisclaimer": {
    "message": "قد يكون المحتوى المُنشأ بالذكاء الاصطناعي غير دقيق. راجع التفاصيل المهمة.",
    "learn": "حول المحتوى المُنشأ بالذكاء الاصطناعي"
  },
  "announcement": {
    "dismiss": "تجاهل الإعلان",
    "failed": "تعذّر تجاهل هذا الإعلان. حاول مرة أخرى."
  },
  "banner": {
    "dismiss": "تجاهل"
  },
  "chat": {
    "thinking": "جارٍ التفكير",
    "label": "الرسالة",
    "placeholder": "اكتب رسالة",
    "sendLabel": "إرسال",
    "conversation": "المحادثة",
    "message": "الرسالة",
    "send": "إرسال",
    "typing": "جارٍ الكتابة",
    "you": "أنت",
    "sent": "تم الإرسال",
    "read": "تمت القراءة",
    "delivered": "تم التسليم",
    "sending": "جارٍ الإرسال",
    "newMessages": "رسائل جديدة",
    "attach": "إرفاق ملف",
    "image": "إضافة صورة",
    "emoji": "إضافة رمز تعبيري",
    "emojiSoon": "منتقي الرموز التعبيرية قادم قريبًا.",
    "dictate": "إملاء رسالة",
    "listening": "جارٍ الاستماع…",
    "stop": "إيقاف",
    "micBlocked": "الميكروفون محظور. اسمح به في المتصفح للإملاء.",
    "micStopped": "توقف الإملاء.",
    "remove": "إزالة",
    "cancelUpload": "إلغاء الرفع",
    "retry": "إعادة المحاولة",
    "uploading": "جارٍ الرفع {percent}٪",
    "uploadingPlain": "جارٍ الرفع",
    "ready": "جاهز",
    "failed": "تعذر الرفع",
    "dropFiles": "أفلت الملفات لإرفاقها",
    "attachments": "المرفقات",
    "openImage": "فتح الصورة",
    "imageFailed": "تعذر تحميل هذه الصورة",
    "download": "تنزيل",
    "playVoice": "تشغيل الرسالة الصوتية",
    "pauseVoice": "إيقاف الرسالة الصوتية مؤقتا",
    "voiceSeek": "موضع الرسالة الصوتية",
    "voicePosition": "{time} من {total}",
    "voiceSpeed": "سرعة التشغيل، {rate} مرة",
    "voiceFailed": "تعذر تشغيل هذه الرسالة الصوتية",
    "record": "تسجيل رسالة صوتية",
    "recordSoon": "الرسائل الصوتية قريبا",
    "messageActions": "إجراءات الرسالة",
    "react": "تفاعل",
    "reply": "رد",
    "moreActions": "المزيد من الإجراءات",
    "quote": "اقتباس",
    "copyText": "نسخ النص",
    "forward": "إعادة توجيه",
    "edit": "تعديل",
    "delete": "حذف",
    "reactions": "التفاعلات",
    "addReaction": "إضافة تفاعل",
    "moreReactions": "المزيد من التفاعلات",
    "reactionCount": "{name}: {count}",
    "thumbsUp": "إعجاب",
    "heart": "قلب",
    "laugh": "ضحك",
    "wow": "دهشة",
    "sad": "حزن",
    "thanks": "شكرًا",
    "replyingTo": "الرد على {name}",
    "cancelReply": "إلغاء الرد",
    "edited": "مُعدَّل",
    "deleted": "تم حذف هذه الرسالة"
  },
  "checklist": {
    "dismiss": "تجاهل قائمة المهام",
    "progress": "المهام المكتملة"
  },
  "comment": {
    "edit": "تعديل",
    "save": "حفظ",
    "cancel": "إلغاء",
    "resolve": "حلّ",
    "reopen": "إعادة فتح",
    "edited": "مُعدَّل",
    "resolved": "تمت معالجته",
    "message": "تعليق",
    "empty": "أدخل تعليقًا.",
    "failed": "تعذّر الحفظ. حاول مرة أخرى."
  },
  "confidenceIndicator": {
    "high": "ثقة عالية",
    "medium": "ثقة متوسطة",
    "low": "ثقة منخفضة",
    "unknown": "درجة الثقة غير متاحة",
    "label": "الثقة"
  },
  "loadingOverlay": {
    "loading": "جارٍ التحميل",
    "cancel": "إلغاء"
  },
  "mediaPlayer": {
    "rate": "سرعة التشغيل",
    "transcript": "عرض النص المكتوب",
    "hideTranscript": "إخفاء النص المكتوب",
    "pip": "صورة داخل صورة",
    "exitPip": "الخروج من صورة داخل صورة",
    "unsupported": "ميزة صورة داخل صورة غير متاحة.",
    "failed": "تعذّر تشغيل هذا الملف.",
    "pipFailed": "تعذّر تغيير وضع صورة داخل صورة. حاول مرة أخرى.",
    "seek": "الانتقال إلى {time}",
    "fallback": "فتح ملف الوسائط",
    "volume": "مستوى الصوت",
    "mute": "كتم الصوت",
    "audioFailed": "تعذّر تشغيل مسار الصوت المنفصل. يُشغَّل الفيديو دون صوت."
  },
  "mentionInput": {
    "add": "إضافة إشارة",
    "choose": "اختر شخصًا لإشارته"
  },
  "promptSuggestions": {
    "label": "اقتراحات الأوامر",
    "empty": "لا توجد اقتراحات",
    "failed": "تعذّر استخدام هذا الاقتراح. حاول مرة أخرى."
  },
  "refineMenu": {
    "label": "تحسين",
    "shorter": "اختصار النص",
    "longer": "إطالة النص",
    "tone": "تغيير النبرة",
    "formal": "رسمية",
    "casual": "عفوية",
    "neutral": "محايدة",
    "custom": "تعليمات مخصصة",
    "prompt": "التعليمات",
    "apply": "تطبيق التعليمات",
    "cancel": "إلغاء",
    "empty": "أدخل تعليمات.",
    "failed": "تعذّر تحسين هذا النص. حاول مرة أخرى."
  },
  "suggestedEdit": {
    "label": "تعديلات مقترحة",
    "before": "قبل",
    "after": "بعد",
    "accept": "قبول",
    "reject": "رفض",
    "acceptAll": "قبول الكل",
    "accepted": "مقبول",
    "rejected": "مرفوض",
    "empty": "لا توجد تعديلات مقترحة",
    "failed": "تعذّر حفظ هذا القرار. حاول مرة أخرى."
  },
  "time": {
    "now": "الآن"
  },
  "aiExplanation": {
    "label": "لماذا هذا؟",
    "title": "شرح الذكاء الاصطناعي",
    "close": "إغلاق"
  },
  "accessRequest": {
    "title": "طلب الوصول",
    "description": "اطلب من المالك صلاحية الوصول إلى هذا المورد.",
    "message": "رسالة إلى المالك",
    "request": "طلب الوصول",
    "pending": "تم طلب الوصول",
    "approved": "تمت الموافقة على الوصول",
    "denied": "تم رفض الوصول",
    "open": "فتح المورد",
    "failed": "تعذّر إرسال طلبك. حاول مرة أخرى."
  },
  "approvalWorkflow": {
    "approve": "موافقة",
    "changes": "طلب تعديلات",
    "reject": "رفض",
    "comment": "تعليق",
    "reason": "اشرح سبب الحاجة إلى تعديلات.",
    "failed": "تعذّر حفظ هذا القرار. تعليقك ما زال محفوظًا.",
    "steps": "مراحل الموافقة",
    "recorded": "تم تسجيل القرار"
  },
  "archiveRestore": {
    "archive": "أرشفة",
    "restore": "استعادة",
    "archived": "مؤرشف",
    "message": "استعد هذا السجل ليصبح نشطًا مرة أخرى.",
    "failed": "تعذّر تحديث السجل. حاول مرة أخرى."
  },
  "assetGallery": {
    "empty": "لا توجد صور",
    "preview": "معاينة الصورة"
  },
  "auditLog": {
    "actor": "المنفّذ",
    "at": "الوقت",
    "action": "الإجراء",
    "target": "الهدف",
    "changes": "التغييرات",
    "view": "عرض التغييرات",
    "field": "الحقل",
    "before": "قبل",
    "after": "بعد",
    "close": "إغلاق"
  },
  "commentThread": {
    "title": "التعليقات",
    "reply": "رد",
    "send": "إرسال الرد",
    "resolve": "إغلاق النقاش",
    "reopen": "إعادة فتح النقاش",
    "resolved": "تمت معالجته",
    "empty": "أدخل ردًا.",
    "failed": "تعذّر الحفظ. حاول مرة أخرى."
  },
  "downloadManager": {
    "title": "التنزيلات",
    "empty": "لا توجد تنزيلات",
    "queued": "في الانتظار",
    "progress": "جارٍ التنزيل",
    "ready": "جاهز",
    "failed": "فشل التنزيل",
    "actionFailed": "تعذّر إكمال إجراء التنزيل. حاول مرة أخرى."
  },
  "draftState": {
    "draft": "مسودة",
    "resume": "استئناف المسودة",
    "discard": "تجاهل المسودة",
    "confirm": "تجاهل هذه المسودة؟",
    "message": "ستُزال هذه المسودة نهائيًا.",
    "cancel": "الاحتفاظ بالمسودة",
    "failed": "تعذّر تحديث المسودة. حاول مرة أخرى."
  },
  "exportDialog": {
    "title": "تصدير",
    "format": "الصيغة",
    "scope": "النطاق",
    "all": "كل السجلات",
    "selection": "السجلات المحددة",
    "background": "التصدير في الخلفية",
    "export": "تصدير",
    "cancel": "إلغاء",
    "invalid": "اختر صيغة ونطاقًا متاحين.",
    "failed": "تعذّر التصدير. حاول مرة أخرى.",
    "ready": "التصدير جاهز",
    "queued": "التصدير في قائمة الانتظار",
    "download": "تنزيل ملف التصدير",
    "done": "تم"
  },
  "featureIntro": {
    "new": "جديد",
    "whatsNew": "ما الجديد",
    "gotIt": "فهمت",
    "later": "ليس الآن",
    "close": "إغلاق"
  },
  "filterPanel": {
    "label": "تصفية",
    "info": "تُعرض فقط السجلات التي تستوفي الشروط؛ والشرط غير المكتمل لا يؤثر في التصفية.",
    "sub": "في هذا العرض، أظهر السجلات",
    "where": "حيث",
    "and": "و",
    "or": "أو",
    "empty": "لا شروط: تُعرض كل السجلات.",
    "addCondition": "إضافة شرط",
    "addGroup": "إضافة مجموعة شروط",
    "remove": "إزالة {what}",
    "condition": "شرط",
    "group": "مجموعة شروط",
    "value": "أدخل قيمة",
    "choose": "اختر خيارات",
    "field": "الحقل",
    "operator": "العامل",
    "join": "و أو أو",
    "moved": "تم نقل {name} إلى الموضع {position} من {total}",
    "row": "{name}، {position} من {total}. المفتاحان Alt + السهم لأعلى أو لأسفل ينقلانه",
    "reorder": "إعادة ترتيب {name}",
    "moveUp": "نقل لأعلى",
    "moveDown": "نقل لأسفل"
  },
  "formFlow": {
    "create": "إنشاء",
    "save": "حفظ التغييرات",
    "cancel": "إلغاء",
    "failed": "تعذّر الحفظ. حاول مرة أخرى.",
    "invalid": "تحقق من الحقول قبل الحفظ.",
    "saved": "تم الحفظ",
    "unsaved": "ستفقد تغييراتك.",
    "close": "إغلاق"
  },
  "groupPanel": {
    "label": "المجموعة",
    "title": "التجميع حسب",
    "info": "تُجمَّع الصفوف ذات القيمة نفسها تحت عنوان واحد؛ والمجموعة الفرعية تقسّم كل مجموعة مرة أخرى.",
    "empty": "اجمع الصفوف التي تشترك في قيمة تحت عنوان واحد.",
    "add": "إضافة مجموعة",
    "addSub": "إضافة مجموعة فرعية",
    "collapseAll": "طيّ الكل",
    "expandAll": "توسيع الكل",
    "more": "المزيد لـ {name}",
    "hideEmpty": "إخفاء المجموعات الفارغة",
    "remove": "إزالة التجميع حسب {name}",
    "removeTip": "إزالة المجموعة",
    "field": "الحقل",
    "order": "الترتيب",
    "moved": "تم نقل {name} إلى الموضع {position} من {total}",
    "row": "{name}، {position} من {total}. المفتاحان Alt + السهم لأعلى أو لأسفل ينقلانه",
    "reorder": "إعادة ترتيب {name}",
    "moveUp": "نقل لأعلى",
    "moveDown": "نقل لأسفل"
  },
  "helpPanel": {
    "title": "مساعدة",
    "search": "البحث في المساعدة",
    "empty": "لا توجد مقالات مطابقة",
    "back": "العودة إلى المقالات",
    "read": "قراءة المقال كاملًا",
    "close": "طيّ المساعدة"
  },
  "imageAnnotation": {
    "title": "تعليقات توضيحية على الصورة",
    "pin": "تثبيت",
    "region": "المنطقة",
    "location": "الموقع",
    "comment": "تعليق",
    "kind": "نوع التعليق التوضيحي",
    "add": "إضافة تعليق توضيحي",
    "empty": "أدخل موقعًا وتعليقًا.",
    "failed": "تعذّر الحفظ. حاول مرة أخرى.",
    "none": "لا توجد تعليقات توضيحية"
  },
  "importDialog": {
    "title": "استيراد",
    "file": "ملف",
    "paste": "لصق البيانات",
    "url": "رابط URL",
    "choose": "اختر الملف المصدر",
    "drop": "أفلت ملفًا هنا أو اخترْه أدناه.",
    "none": "لم يتم اختيار ملف",
    "import": "استيراد",
    "cancel": "إلغاء",
    "invalid": "اختر ملفًا مدعومًا أو الصق بيانات أو أدخل رابط HTTP.",
    "failed": "تعذّر الاستيراد. مصدرك ما زال متاحًا.",
    "unsaved": "سيُفقد مصدر الاستيراد."
  },
  "importWizard": {
    "title": "استيراد السجلات",
    "mapping": "مطابقة الأعمدة",
    "review": "مراجعة",
    "results": "النتائج",
    "column": "عمود المصدر",
    "choose": "اختر عمودًا",
    "missing": "طابق كل الحقول المطلوبة.",
    "invalid": "لا يحتوي المصدر على أعمدة أو صفوف صالحة للاستخدام.",
    "done": "تم",
    "imported": "اكتمل الاستيراد",
    "source": "المصدر",
    "cancel": "إلغاء",
    "unsaved": "ستُفقد مطابقة الاستيراد."
  },
  "metadataEditor": {
    "save": "حفظ البيانات الوصفية",
    "reset": "إعادة ضبط",
    "apply": "تطبيق {field}",
    "required": "أدخل قيمة.",
    "failed": "تعذّر حفظ البيانات الوصفية. تغييراتك ما زالت متاحة.",
    "saved": "تم حفظ البيانات الوصفية",
    "unsaved": "ستُفقد تغييرات البيانات الوصفية."
  },
  "onboarding": {
    "start": "ابدأ",
    "skip": "تخطّي الترحيب",
    "tour": "جولة تعريفية",
    "checklist": "ابدأ",
    "close": "إغلاق"
  },
  "permissionsEditor": {
    "label": "الصلاحيات",
    "capability": "الإمكانية",
    "subject": "عرض الصلاحيات لـ",
    "save": "حفظ الصلاحيات",
    "failed": "تعذّر حفظ الصلاحيات. حاول مرة أخرى.",
    "unsaved": "لم يتم حفظ تغييرات الصلاحيات."
  },
  "presenceBar": {
    "viewers": "يعرض",
    "editors": "يحرّر",
    "cursors": "المؤشرات",
    "empty": "لا أحد غيرك هنا",
    "view": "عرض الشخص"
  },
  "quickFilter": {
    "preset": "أي",
    "find": "ابحث عن {noun}",
    "none": "لا يوجد {noun} مطابق",
    "clear": "مسح",
    "all": "الكل",
    "custom": "نطاق مخصص",
    "from": "من",
    "to": "إلى"
  },
  "relatedAssets": {
    "empty": "لا توجد أصول مرتبطة"
  },
  "saveAs": {
    "title": "حفظ باسم",
    "name": "الاسم",
    "location": "الموقع",
    "format": "الصيغة",
    "save": "حفظ نسخة",
    "cancel": "إلغاء",
    "required": "أدخل اسمًا واختر موقعًا.",
    "failed": "تعذّر حفظ النسخة. حاول مرة أخرى.",
    "unsaved": "ستفقد تغييراتك."
  },
  "shareDialog": {
    "title": "الحصة",
    "people": "الأشخاص",
    "link": "رابط",
    "person": "الشخص",
    "role": "الدور",
    "add": "إضافة شخص",
    "remove": "إزالة",
    "save": "حفظ الوصول",
    "cancel": "إلغاء",
    "copy": "نسخ الرابط",
    "access": "الوصول عبر الرابط",
    "restricted": "فقط من لديهم صلاحية الوصول",
    "anyone": "يمكن لأي شخص لديه الرابط العرض",
    "nativeShare": "المشاركة عبر الجهاز",
    "failed": "تعذّرت المشاركة. حاول مرة أخرى.",
    "invalid": "اختر شخصًا ودورًا متاحًا.",
    "unsaved": "ستُفقد تغييرات الوصول."
  },
  "shortcutsDialog": {
    "title": "اختصارات لوحة المفاتيح",
    "search": "البحث في الاختصارات",
    "general": "عام",
    "empty": "لا توجد اختصارات مطابقة",
    "close": "إغلاق"
  },
  "sortPanel": {
    "label": "ترتيب",
    "title": "الترتيب حسب",
    "within": "الترتيب داخل المجموعات حسب",
    "info": "تُرتَّب الصفوف حسب الحقل الأول، ثم حسب الحقل التالي عند تساوي الأول.",
    "empty": "لا ترتيب: تحتفظ الصفوف بترتيبها.",
    "add": "إضافة ترتيب",
    "addAnother": "إضافة ترتيب آخر",
    "remove": "إزالة الترتيب حسب {name}",
    "removeTip": "إزالة الترتيب",
    "field": "الحقل",
    "direction": "الاتجاه",
    "moved": "تم نقل {name} إلى الموضع {position} من {total}",
    "row": "{name}، {position} من {total}. المفتاحان Alt + السهم لأعلى أو لأسفل ينقلانه",
    "reorder": "إعادة ترتيب {name}",
    "moveUp": "نقل لأعلى",
    "moveDown": "نقل لأسفل"
  },
  "tour": {
    "next": "التالي",
    "back": "رجوع",
    "finish": "إنهاء الجولة",
    "skip": "تخطّي الجولة",
    "resume": "استئناف الجولة",
    "close": "إغلاق",
    "step": "{current} من {total}"
  },
  "trialUpgrade": {
    "trial": "تجربة",
    "compare": "مقارنة الخطط",
    "title": "اختر خطة",
    "plan": "الخطة",
    "upgrade": "ترقية",
    "cancel": "إلغاء",
    "failed": "تعذّرت الترقية. حاول مرة أخرى.",
    "upgraded": "تم تحديث الخطة"
  },
  "wizard": {
    "back": "رجوع",
    "next": "التالي",
    "complete": "إنهاء",
    "cancel": "إلغاء",
    "summary": "مراجعة",
    "invalid": "تحقق من هذه الخطوة قبل المتابعة.",
    "failed": "تعذّر الحفظ. حاول مرة أخرى.",
    "steps": "الخطوات"
  },
  "wizardDialog": {
    "close": "إغلاق",
    "unsaved": "ستفقد تغييراتك."
  },
  "breadcrumbs": {
    "label": "مسار التنقل"
  },
  "colorSwatch": {
    "label": "اللون",
    "more": "ألوان أخرى",
    "moreChosen": "ألوان أخرى، تم اختيار {name}",
    "colors": {
      "red": "أحمر",
      "green": "أخضر",
      "yellow": "أصفر",
      "blue": "أزرق",
      "orange": "برتقالي",
      "purple": "بنفسجي",
      "cyan": "سماوي",
      "magenta": "أرجواني",
      "lime": "ليموني",
      "pink": "وردي",
      "teal": "أزرق مخضر",
      "lavender": "خزامي",
      "beige": "بيج",
      "maroon": "عنابي",
      "mint": "نعناعي",
      "olive": "زيتوني",
      "apricot": "مشمشي",
      "navy": "كحلي",
      "grey": "رمادي",
      "brown": "بني",
      "gray": "رمادي"
    }
  },
  "dialog": {
    "close": "إغلاق",
    "confirmLabel": "حفظ",
    "cancelLabel": "إلغاء",
    "confirm": "تأكيد",
    "cancel": "إلغاء",
    "save": "حفظ"
  },
  "loading": {
    "label": "جارٍ التحميل"
  },
  "rating": {
    "label": "التقييم",
    "value": "{label}: {value} من {max}",
    "stars": {
      "zero": "لا نجوم",
      "one": "نجمة واحدة",
      "two": "نجمتان",
      "few": "{count} نجوم",
      "many": "{count} نجمة",
      "other": "{count} نجمة"
    }
  },
  "tag": {
    "label": "إضافة وسم",
    "rename": "إعادة تسمية {label}",
    "renameTag": "إعادة تسمية الوسم",
    "remove": "إزالة {label}",
    "removeTag": "إزالة الوسم",
    "removeFilter": "إزالة عامل التصفية"
  },
  "toast": {
    "aria-label": "تجاهل",
    "undo": "تراجع",
    "dismiss": "تجاهل"
  },
  "actionBar": {
    "label": "الإجراءات"
  },
  "appHeader": {
    "aria-label": "التطبيقات",
    "account": {
      "trigger": "الحساب والإعدادات لـ {name}",
      "menu": "الحساب",
      "myAccount": "حسابي",
      "settings": "إعدادات Plenix",
      "appSettings": "إعدادات {app}",
      "app": "التطبيق",
      "density": "كثافة العرض",
      "compact": "مضغوط",
      "standard": "قياسي",
      "comfortable": "مريح",
      "signOut": "تسجيل الخروج"
    },
    "navLabel": "التطبيقات المثبتة",
    "applications": "التطبيقات",
    "search": "بحث",
    "scope": "في {scope}",
    "pin": "تثبيت {app} في الشريط العلوي",
    "unpin": "إلغاء تثبيت {app} من الشريط العلوي",
    "switchApp": "{app}، تبديل التطبيق",
    "cancel": "إلغاء",
    "searchHint": "اكتب ما تبحث عنه، ثم اضغط Enter.",
    "pinnedHeading": "مثبتة في الشريط العلوي"
  },
  "form": {
    "label": "إجراءات النموذج"
  },
  "reviewFlow": {
    "label": "بانتظار المراجعة",
    "noun": "عنصر",
    "plural": "عناصر",
    "queueLabel": "بانتظار المراجعة",
    "flow": {
      "reviewers": "المراجعون",
      "history": "السجل",
      "comment": "تعليق",
      "commentHint": "مطلوب للرفض أو لطلب التعديلات.",
      "approve": "موافقة",
      "changes": "طلب تعديلات",
      "reject": "رفض",
      "waiting": "بالانتظار",
      "human": "محتوى مُنشأ. يراجعه شخص قبل استخدامه.",
      "needReason": "اذكر السبب ليعرف الكاتب ما الذي يجب تغييره.",
      "done": "{decision}: {title}",
      "decisions": "قرارات المراجعة"
    },
    "queue": {
      "name": "الاسم",
      "type": "النوع",
      "submittedBy": "قدّمه",
      "submitted": "تاريخ التقديم",
      "status": "الحالة",
      "approve": "موافقة",
      "changes": "طلب تعديلات",
      "reject": "رفض",
      "rejectTitle": "رفض {what}؟",
      "changesTitle": "طلب تعديلات على {what}؟",
      "reason": "السبب",
      "changesLabel": "ما الذي يجب تغييره",
      "reasonHint": "يراه المؤلفون مع القرار.",
      "needReason": "اذكر السبب ليعرف المؤلفون ما الذي يجب تغييره.",
      "done": "{what} {decision}",
      "count": "{n} {plural}",
      "noun": "عنصر",
      "plural": "عناصر",
      "queueLabel": "بانتظار المراجعة",
      "items": {
        "zero": "لا عناصر",
        "one": "عنصر واحد",
        "two": "عنصران",
        "few": "{n} عناصر",
        "many": "{n} عنصرًا",
        "other": "{n} عنصر"
      },
      "doneItems": {
        "approved": {
          "zero": "لم تتم الموافقة على أي عنصر",
          "one": "تمت الموافقة على عنصر واحد",
          "two": "تمت الموافقة على عنصرين",
          "few": "تمت الموافقة على {n} عناصر",
          "many": "تمت الموافقة على {n} عنصرًا",
          "other": "تمت الموافقة على {n} عنصر"
        },
        "rejected": {
          "zero": "لم يتم رفض أي عنصر",
          "one": "تم رفض عنصر واحد",
          "two": "تم رفض عنصرين",
          "few": "تم رفض {n} عناصر",
          "many": "تم رفض {n} عنصرًا",
          "other": "تم رفض {n} عنصر"
        },
        "changes-requested": {
          "zero": "لم يتم طلب تعديلات على أي عنصر",
          "one": "تم طلب تعديلات على عنصر واحد",
          "two": "تم طلب تعديلات على عنصرين",
          "few": "تم طلب تعديلات على {n} عناصر",
          "many": "تم طلب تعديلات على {n} عنصرًا",
          "other": "تم طلب تعديلات على {n} عنصر"
        }
      }
    },
    "statuses": {
      "draft": "مسودة",
      "in-review": "قيد المراجعة",
      "approved": "تمت الموافقة",
      "changes-requested": "مطلوب تعديلات",
      "rejected": "مرفوض",
      "published": "منشور",
      "scheduled": "مجدول"
    }
  },
  "collection": {
    "selected": {
      "=0": "لم يتم تحديد أي عنصر",
      "one": "تم تحديد عنصر واحد",
      "two": "تم تحديد عنصرين",
      "few": "تم تحديد {count} عناصر",
      "many": "تم تحديد {count} عنصرًا",
      "other": "تم تحديد {count} عنصر"
    }
  },
  "offboarding": {
    "backup": "صدّر بياناتك",
    "export": "تصدير البيانات",
    "review": "أكّد اختيارك",
    "reason": "السبب (اختياري)",
    "confirmName": "اكتب اسم الحساب للتأكيد",
    "mismatch": "أدخل اسم الحساب كما هو تمامًا.",
    "cancel": "الإبقاء على الحساب",
    "deleteAccount": "حذف الحساب",
    "cancelSubscription": "إلغاء الاشتراك"
  },
  "imageUpload": {
    "drop": "اسحب صورة وأفلتها هنا، أو",
    "dropMany": "اسحب الصور وأفلتها هنا، أو",
    "choose": "اختيار صورة",
    "chooseMany": "اختيار صور",
    "replace": "استبدال",
    "remove": "إزالة {name}",
    "alt": "الوصف",
    "altHint": "صِف هذه الصورة لمن لا يستطيعون رؤيتها",
    "tooLarge": "{name} أكبر من {max}",
    "notImage": "{name} ليس صورة",
    "removed": "تمت إزالة {name}",
    "added": {
      "zero": "لم تتم إضافة صور",
      "one": "تمت إضافة صورة واحدة",
      "two": "تمت إضافة صورتين",
      "few": "تمت إضافة {n} صور",
      "many": "تمت إضافة {n} صورة",
      "other": "تمت إضافة {n} صورة"
    },
    "crop": {
      "title": "قصّ الصورة",
      "zoom": "التكبير",
      "frame": "منطقة القص. اسحب الصورة أو حرّكها بمفاتيح الأسهم",
      "apply": "تطبيق",
      "cancel": "إلغاء"
    }
  },
  "voteTally": {
    "approve": "موافقة",
    "deny": "رفض",
    "abstain": "امتناع",
    "turnedOff": "متوقف",
    "notVoted": "لم يصوّتوا",
    "notRecorded": "لم يُسجَّل",
    "voteOf": "تصويت {name}",
    "hiddenUntilClosed": "مخفي حتى يُغلق التصويت",
    "totalsOnly": "المجاميع فقط",
    "reconnecting": "إعادة الاتصال",
    "quorum": "النصاب: حاضر {present}، المطلوب {needed} ({state})",
    "met": "مكتمل",
    "notMet": "غير مكتمل",
    "result": {
      "open": "مفتوح",
      "passing": "في طريقه للإقرار",
      "failing": "في طريقه للرفض",
      "passed": "أُقرّ",
      "failed": "رُفض",
      "tied": "تعادل",
      "no-quorum": "لا نصاب"
    }
  },
  "card": {
    "panel": {
      "collapse": "طيّ {title}",
      "expand": "توسيع {title}",
      "section": "قسم"
    },
    "mediaCard": {
      "select": "تحديد {title}",
      "item": "عنصر",
      "assets": "{n} أصول",
      "asset": "{n} أصل"
    },
    "card": {
      "expand": "توسيع {title}",
      "collapse": "طيّ {title}",
      "card": "بطاقة"
    }
  },
  "field": {
    "counter": {
      "left": "بقي {n} حرفًا",
      "over": "زاد {n} حرفًا"
    },
    "about": "معلومات عن {label}",
    "warning": "تحذير"
  },
  "icon": {
    "status": {
      "info": "معلومة",
      "success": "نجاح",
      "warning": "تحذير",
      "danger": "خطأ",
      "neutral": "ملاحظة"
    }
  },
  "searchResult": {
    "result": {
      "path": "في"
    },
    "group": {
      "more": "إظهار الكل"
    }
  },
  "settingsLayout": {
    "navTitle": "الإعدادات",
    "section": {
      "section": "قسم"
    }
  },
  "commerce": {
    "orders": {
      "label": "الطلبات",
      "search": "البحث في الطلبات",
      "count": "{n} طلبات",
      "one": "طلب واحد",
      "noun": "طلب",
      "plural": "طلبات",
      "number": "الترتيب",
      "date": "التاريخ",
      "customer": "العميل",
      "items": "العناصر",
      "total": "الإجمالي",
      "status": "الحالة",
      "open": "فتح",
      "fulfill": "تنفيذ",
      "refund": "استرداد",
      "cancel": "إلغاء الطلب",
      "cancelMany": "إلغاء الطلبات",
      "cancelTitle": "إلغاء {what}؟",
      "cancelText": "سيُبلَّغ العميل ويُعاد إليه المبلغ كاملًا. لا يمكن التراجع عن ذلك.",
      "keep": "الإبقاء على الطلب",
      "notFulfillable": "يمكن تنفيذ الطلبات غير المنفّذة فقط",
      "notCancelable": "يمكن إلغاء الطلبات غير المنفّذة فقط",
      "fulfilled": "تم وضع علامة شُحن على {what}",
      "canceled": "تم إلغاء {what}"
    },
    "orderDetail": {
      "context": "الترتيب",
      "back": "الطلبات",
      "items": "العناصر",
      "delivery": "التسليم",
      "address": "العنوان",
      "method": "الطريقة",
      "tracking": "رقم التتبع",
      "payment": "الدفع",
      "history": "السجل",
      "fulfill": "تنفيذ",
      "refund": "استرداد",
      "cancel": "إلغاء الطلب",
      "return": "بدء عملية إرجاع",
      "cancelTitle": "إلغاء الطلب {number}؟",
      "cancelText": "سيُبلَّغ العميل ويُعاد إليه المبلغ كاملًا. لا يمكن التراجع عن ذلك.",
      "keep": "الإبقاء على الطلب"
    },
    "subscription": {
      "plan": "خطتك",
      "planName": "الخطة",
      "price": "السعر",
      "status": "الحالة",
      "next": "الدفعة التالية",
      "since": "عضو منذ",
      "ends": "ينتهي الوصول في",
      "perPeriod": "{price} لكل {period}",
      "more": "{amount} أكثر",
      "less": "{amount} أقل",
      "change": "تغيير الخطة",
      "changeTitle": "التغيير إلى {plan}؟",
      "changeText": "ستدفع {price} اعتبارًا من {date}. حتى ذلك الحين تبقى خطتك الحالية كما هي.",
      "changeConfirm": "تغيير الخطة",
      "changed": "ستتغير خطتك إلى {plan} في {date}.",
      "plans": "الخطط",
      "current": "الخطة الحالية",
      "method": "طريقة الدفع",
      "update": "تحديث طريقة الدفع",
      "manage": "إيقاف مؤقت أو إلغاء",
      "manageText": "أوقف مؤقتًا لإيقاف الدفعات فترة مع الاحتفاظ بإعداداتك، أو ألغِ لإنهاء الخطة. في الحالتين يبقى وصولك حتى {date}.",
      "pause": "إيقاف الاشتراك مؤقتًا",
      "pauseTitle": "إيقاف اشتراكك مؤقتًا؟",
      "pauseText": "لا تُسحب أي دفعات أثناء الإيقاف المؤقت. يمكنك استئنافه متى شئت.",
      "resume": "استئناف الاشتراك",
      "cancel": "إلغاء الاشتراك",
      "cancelTitle": "إلغاء اشتراكك؟",
      "cancelText": "يبقى وصولك حتى {date}، ولن تُحاسَب مرة أخرى.",
      "keep": "الإبقاء على خطتي",
      "history": "سجل الفواتير",
      "date": "التاريخ",
      "description": "الوصف",
      "amount": "المبلغ",
      "invoice": "فاتورة",
      "invoiceFor": "فاتورة بتاريخ {date}",
      "paused": "اشتراكك متوقف مؤقتًا.",
      "canceled": "تم إلغاء اشتراكك.",
      "statuses": {
        "active": "نشط",
        "paused": "متوقف مؤقتًا",
        "canceled": "أُلغي",
        "paid": "مدفوعة",
        "refunded": "مُستردة",
        "failed": "فشلت"
      }
    },
    "returns": {
      "label": "إرجاع العناصر",
      "items": "العناصر",
      "reason": "السبب",
      "resolution": "الحل",
      "review": "مراجعة",
      "submit": "طلب إرجاع",
      "cancel": "إلغاء",
      "window": "يمكنك إرجاع معظم العناصر خلال 30 يومًا من التسليم.",
      "choose": "اختر عنصرًا واحدًا على الأقل لإرجاعه.",
      "notReturnable": "لا يمكن إرجاعه",
      "quantity": "كم عدد {title}",
      "why": "لماذا تُرجع العناصر؟",
      "whyRequired": "اختر سببًا.",
      "note": "هل هناك ما يجب أن نعرفه؟ (اختياري)",
      "want": "ماذا تريد؟",
      "wantRequired": "اختر استردادًا أو استبدالًا.",
      "send": "كيف سترسلها؟",
      "sendRequired": "اختر طريقة الإرسال.",
      "refund": "استرداد",
      "refundTiming": "يصل المبلغ المسترد إلى طريقة الدفع الأصلية بعد 5 إلى 10 أيام عمل من وصول العناصر.",
      "requested": "تم طلب الإرجاع",
      "requestedText": "أرسلنا إليك بالبريد الإلكتروني بطاقة الإرجاع والخطوات. وهذه حالة طلب الإرجاع.",
      "status": "حالة الإرجاع",
      "returning": "{n} عناصر",
      "returningOne": "عنصر واحد"
    },
    "cart": {
      "title": "السلة",
      "items": "{n} عناصر",
      "item": "عنصر واحد",
      "lines": "العناصر في سلتك",
      "remove": "إزالة {title}",
      "noun": "عنصر",
      "removed": "تمت إزالة {title} من سلتك.",
      "undo": "تراجع",
      "empty": "سلتك فارغة",
      "emptyText": "اعثر على ما يعجبك وأضفه هنا.",
      "continue": "متابعة التسوق",
      "checkout": "إتمام الشراء",
      "promo": "رمز العرض",
      "apply": "تطبيق",
      "applied": "تم تطبيق رمز العرض {code}",
      "promoError": "لا يمكن استخدام هذا الرمز.",
      "total": "الإجمالي {total}"
    },
    "pay": {
      "method": "طريقة الدفع",
      "newCard": "بطاقة جديدة",
      "number": "رقم البطاقة",
      "accepted": "Visa أو Mastercard أو American Express أو Discover",
      "expiry": "تاريخ الانتهاء",
      "expiryHint": "شهر / سنة",
      "cvc": "رمز الأمان",
      "cvcHint": "الأرقام الثلاثة الأخيرة على ظهر البطاقة، أو أربعة على وجه American Express",
      "name": "الاسم على البطاقة",
      "billingSame": "عنوان الفوترة هو نفسه عنوان التسليم",
      "billing": "عنوان الفوترة",
      "street": "العنوان",
      "city": "المدينة",
      "postal": "الرمز البريدي",
      "secure": "تذهب بيانات بطاقتك مباشرة إلى مزوّد الدفع. ولا تحتفظ هذه الصفحة بها.",
      "charge": "سيتم تحصيل",
      "brands": {
        "visa": "Visa",
        "mastercard": "Mastercard",
        "amex": "American Express",
        "discover": "Discover"
      }
    },
    "payment": {
      "title": "الدفع",
      "description": "اختر طريقة الدفع. لن يُحصَّل أي مبلغ قبل الضغط على «ادفع».",
      "pay": "ادفع {amount}",
      "cancel": "إلغاء",
      "declined": "لم تتم عملية الدفع",
      "declinedText": "تم رفض بطاقتك. تحقق من البيانات أو استخدم بطاقة أخرى.",
      "paid": "تم استلام الدفعة"
    },
    "checkout": {
      "label": "إتمام الشراء",
      "contact": "الاتصال",
      "delivery": "التسليم",
      "payment": "الدفع",
      "review": "مراجعة",
      "placeOrder": "تأكيد الطلب",
      "cancel": "العودة إلى السلة",
      "email": "البريد الإلكتروني",
      "emailHint": "لتأكيد الطلب وتحديثات التسليم.",
      "account": "لديك حساب؟",
      "signIn": "تسجيل الدخول",
      "name": "الاسم الكامل",
      "street": "العنوان",
      "street2": "الشقة أو الجناح أو الوحدة (اختياري)",
      "city": "المدينة",
      "region": "الولاية أو المنطقة",
      "postal": "الرمز البريدي",
      "country": "البلد",
      "phone": "الهاتف (اختياري)",
      "phoneHint": "فقط للأسئلة المتعلقة بالتسليم.",
      "method": "طريقة التسليم",
      "summary": "ملخص الطلب",
      "card": "بطاقة تنتهي بـ {last4}",
      "placed": "تم تقديم الطلب",
      "checkAnswers": "راجع طلبك قبل تأكيده.",
      "items": "العناصر",
      "free": "مجاني"
    },
    "confirm": {
      "title": "شكرًا لك. تم تقديم طلبك.",
      "number": "رقم الطلب",
      "copy": "نسخ رقم الطلب",
      "sent": "أرسلنا تأكيدًا إلى {email}.",
      "next": "ما يحدث بعد ذلك",
      "items": "العناصر",
      "view": "عرض طلبك",
      "continue": "متابعة التسوق",
      "delivery": "التسليم",
      "method": "طريقة التسليم"
    },
    "listing": {
      "label": "المنتجات",
      "search": "البحث في المنتجات",
      "count": "{n} منتجات",
      "one": "منتج واحد",
      "category": "الفئة",
      "noun": "منتج",
      "name": "الاسم",
      "price": "السعر",
      "rating": "التقييم",
      "availability": "التوفر",
      "inStock": "متوفر",
      "outOfStock": "غير متوفر في المخزون",
      "sale": "معروض بسعر مخفّض",
      "yes": "نعم",
      "no": "لا",
      "empty": "لا توجد منتجات مطابقة",
      "emptyText": "أزل عامل تصفية أو ابحث عن شيء آخر.",
      "clear": "مسح عوامل التصفية والبحث",
      "results": "تم عرض {n} منتجات",
      "resultsOne": "تم عرض منتج واحد",
      "none": "لا توجد منتجات معروضة"
    },
    "discovery": {
      "title": "المتجر",
      "search": "البحث في المتجر",
      "categories": "التسوق حسب الفئة",
      "recommended": "موصى به لك",
      "results": "المنتجات",
      "resultsFor": "نتائج «{q}»",
      "count": "{n} منتجات",
      "one": "منتج واحد",
      "suggestions": "جرّب أحد هذه",
      "clear": "مسح البحث"
    },
    "productDetail": {
      "gallery": "صور {title}",
      "reviews": "{n} مراجعات",
      "review": "مراجعة واحدة",
      "inStock": "متوفر",
      "lowStock": "بقي {n} فقط",
      "outOfStock": "غير متوفر في المخزون",
      "addToCart": "أضف إلى السلة",
      "added": "تمت إضافة {title} إلى سلتك",
      "viewCart": "عرض السلة",
      "choose": "اختر {option}.",
      "missing": "اختر خياراتك أولًا.",
      "description": "الوصف",
      "details": "التفاصيل",
      "delivery": "التسليم والإرجاع",
      "detail": "التفاصيل",
      "value": "القيمة",
      "related": "قد يعجبك أيضًا",
      "rating": "التقييم"
    },
    "line": {
      "quantity": "الكمية، {title}",
      "qty": "الكمية {n}",
      "each": "{price} للقطعة"
    },
    "summary": {
      "title": "ملخص الطلب",
      "subtotal": "المجموع الفرعي",
      "discount": "الخصم",
      "shipping": "الشحن",
      "shippingEstimated": "الشحن التقديري",
      "tax": "الضريبة",
      "taxEstimated": "الضريبة التقديرية",
      "total": "الإجمالي",
      "free": "مجاني",
      "items": "{n} عناصر",
      "item": "عنصر واحد",
      "times": "× {n}"
    }
  },
  "dnd": {
    "handle": "نقل {name}",
    "instructions": "اضغط على Space أو Enter لالتقاطه. مفاتيح الأسهم تحرّكه، وSpace أو Enter يُسقطه، وEscape يعيده.",
    "pickedUp": "تم التقاط {name}. الموضع {position} من {total}. مفاتيح الأسهم تحرّكه، وSpace أو Enter يُسقطه، وEscape يعيده.",
    "moved": "{name}، الموضع {position} من {total}",
    "movedTo": "تم نقل {name} إلى {list}، الموضع {position} من {total}",
    "dropped": "تم إسقاط {name} في الموضع {position} من {total}",
    "droppedIn": "تم إسقاط {name} في {list}، الموضع {position} من {total}",
    "canceled": "أُلغي النقل. عاد {name} إلى الموضع {position} من {total}",
    "itemPickedUp": "تم التقاط {name}. يمكن لـ {count} أماكن استقباله. مفاتيح الأسهم تختار مكانًا، وSpace أو Enter يُسقطه، وEscape يعيده.",
    "over": "فوق {target}",
    "overReject": "{target} لا يستقبل {name}",
    "droppedOn": "تم إسقاط {name} على {target}",
    "noTargets": "لا يوجد مكان يستقبل {name}",
    "itemCanceled": "أُلغي النقل. لم يتم نقل {name}",
    "repositionPicked": "تم التقاط {name}. مفاتيح الأسهم تحرّكه، مع Shift لمسافة أكبر؛ وSpace أو Enter يُسقطه، وEscape يعيده.",
    "repositioned": "تم نقل {name}",
    "repositionDropped": "تم إسقاط {name}",
    "repositionCanceled": "أُلغي النقل. عاد {name} إلى مكانه",
    "movable": "قابل للنقل",
    "list": "القائمة"
  },
  "collapsibleSection": {
    "less": "عرض أقل",
    "more": "عرض المزيد",
    "moreCount": "عرض المزيد ({n})"
  },
  "fields": {
    "directions": {
      "text": [
        "أ → ي",
        "ي → أ"
      ],
      "select": [
        "الأول → الأخير",
        "الأخير → الأول"
      ],
      "multi": [
        "الأول → الأخير",
        "الأخير → الأول"
      ],
      "number": [
        "1 → 9",
        "9 → 1"
      ],
      "date": [
        "الأقدم → الأحدث",
        "الأحدث → الأقدم"
      ]
    },
    "operators": {
      "text": {
        "contains": "يحتوي على",
        "ncontains": "لا يحتوي على",
        "is": "هو",
        "isnot": "ليس",
        "empty": "فارغ",
        "nempty": "غير فارغ"
      },
      "select": {
        "any": "هو أحد",
        "none": "ليس أيًّا من",
        "empty": "فارغ",
        "nempty": "غير فارغ"
      },
      "multi": {
        "any": "يحتوي على أي من",
        "none": "لا يحتوي على أي من",
        "empty": "فارغ",
        "nempty": "غير فارغ"
      },
      "number": {
        "eq": "=",
        "ne": "≠",
        "lt": "<",
        "gt": ">",
        "empty": "فارغ",
        "nempty": "غير فارغ"
      },
      "date": {
        "is": "هو",
        "before": "قبل",
        "after": "بعد",
        "within": "خلال",
        "empty": "فارغ",
        "nempty": "غير فارغ"
      }
    },
    "within": {
      "week": "الأسبوع الماضي",
      "month": "الشهر الماضي",
      "year": "العام الماضي"
    },
    "presets": {
      "7": "آخر 7 أيام",
      "30": "آخر 30 يومًا",
      "any": "أي وقت",
      "year": "هذا العام"
    }
  },
  "dateBadge": {
    "today": "اليوم"
  },
  "activityList": {
    "unread": "غير مقروء"
  },
  "sidePanel": {
    "expand": "توسيع اللوحة",
    "pane": "لوحة {name}"
  },
  "splitView": {
    "firstLabel": "اللوحة الأولى",
    "maxWidth": "تحتاج اللوحة الأخرى إلى {n} بكسل على الأقل"
  }
};
