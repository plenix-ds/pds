### Breaking

- **Breaking:** CommandBar with rows selected now **adds** the selection's commands instead of swapping them in (owner, 2026-10-19, D-0068, #140): "× N selected" first, the selection's commands, a divider, then the page's commands; search and filters stay. When the bar narrows, the page's commands fold into More before the selection's. `selection.mode: "swap"` keeps the earlier behavior. A command can say `selection: "also" | "only" | "never"`.
  Apps that rely on the swap set `selection.mode: "swap"` (ADR 0018).
