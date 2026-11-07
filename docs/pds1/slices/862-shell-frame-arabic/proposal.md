# #862: Arabic proposal, the AppShell frame toggle

For the owner's approval (D-0012). Both strings are phrases, and no standard has them whole (D-0078). Every word in them is a Microsoft term, checked in the Microsoft Terminology Collection (ARABIC.tbx, 2026-11-07). Nothing here is in `platform/i18n/ar.js`; until the owner answers, both show in English.

| # | Key | Where it shows | English | Proposed Arabic | Why | Source |
|---|---|---|---|---|---|---|
| 1 | `appShell.frame.expand` | The AppHeader button that widens a centered app to the whole window (tooltip and screen-reader name) | Expand to full window | توسيع إلى ملء النافذة | Expand = توسيع; window = نافذة; "full" as ملء, as in Microsoft's ملء الشاشة (full screen) | Microsoft: expand, window, full screen; Plenix: `navPane.expand` (توسيع الشريط الجانبي) |
| 2 | `appShell.frame.restore` | The same button once widened: back to the centered frame | Restore to {width} width | استعادة إلى عرض {width} | Restore = استعادة; width = عرض. The width is a placeholder, written in the page's digits (١٣٦٦ in Arabic). PR #867 is asked to change "1366" to `{width}` | Microsoft: restore; Plenix: `versionHistory.restore` (استعادة), `resizable.minWidth` (عرض) |

## The owner's answer

Reply with **Approve both**, or **Approve except** a row number with your word.
