# Arabic proposal: the other strings with no Arabic (2026-11-06)

For the owner's approval (D-0012). Nothing here is in `platform/i18n/ar.js`; until the owner answers, these show in English on an Arabic page. The DataGrid editing strings are on #476.

| # | Key | Where it shows | English | Proposed Arabic | Why | Glossary |
|---|---|---|---|---|---|---|
| 1 | `appShell.minSize.title` | AppShell, a screen narrower than the app supports | Screen size not supported | حجم الشاشة غير مدعوم | Supported = مدعوم | `importDialog.invalid` (ملفًا مدعومًا) |
| 2 | `appShell.minSize.text` | same | This app shows a lot of detailed information and isn't designed for small screens yet. Use a desktop or laptop with a screen of at least {width} × {height}. A design for mobile is planned. | يعرض هذا التطبيق الكثير من المعلومات التفصيلية، ولم يُصمَّم للشاشات الصغيرة بعد. استخدم كمبيوترًا مكتبيًا أو محمولًا بشاشة لا تقل عن {width} × {height}. نخطط لتصميم للأجهزة المحمولة. | Microsoft: desktop = كمبيوتر مكتبي, laptop = كمبيوتر محمول | |
| 3 | `appShell.minSize.continue` | same, button | Continue anyway | المتابعة على أي حال | Continue = المتابعة | `connectedAccounts.continue` |
| 4 | `combobox.moreChips` | Combobox, the "+3" tag, read aloud | {count} more | {count} إضافية | Same as the avatar group's "{n} more" | `avatarGroup.moreLabel` |
| 5 | `confirmAction.title` | CommandBar, the confirm dialog before a destructive command | {verb} {name}? | {verb} {name}؟ | The command's label (حذف) then the name; Arabic question mark | |
| 6 | `confirmAction.titleMany` | same, several items | {verb} {count} {plural}? | {verb} {count} {plural}؟ | **Wiring problem, see below** | |
| 7 | `confirmAction.permanent` | same | This cannot be undone. | لا يمكن التراجع عن هذا. | Same sentence | `deleteFlow.permanent` |
| 8 | `confirmAction.confirm` | same, button | {verb} | {verb} | The command's own label; no word to translate | |
| 9 | `confirmAction.cancel` | same, button | Cancel | إلغاء | Same word | `wizard.cancel` |
| 10 | `voteTally.notRecorded` | VoteTally, a seat with no vote recorded | Not recorded | لم يُسجَّل | Record (verb) = سجّل | `voteTally.notVoted` |

**Row 6, wiring problem (not a word choice):** the title joins a count to a plural word the app passes (`plural`). Arabic needs a different noun form for 1, 2, 3 to 10 and 11 or more, so "حذف 11 ملفات" comes out wrong. The fix is a plural-aware `plural` (one value per count form), which is an API change for the CommandBar's owner. Until then the Arabic is the joined form above.

## The owner's answer

Reply on the issue with **Approve all**, or **Approve all except** row numbers with your word.
