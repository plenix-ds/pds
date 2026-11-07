/* Plenix · BarActions
   (platform/patterns/CommandBar; internal, not part of the public API: the commands of a bar, shared by CommandBar, the
   page's actions, and BulkActions, the selection's actions.)
   Usage:
     <BarActions actions={actions} iconOnly={step >= 1} fold={Math.max(0, step - 2)} moreLabel="More actions" dangerClass="plx-command-bar__danger" />
   Summary: A row of commands drawn by the button rule (owner, 2026-10-14): ghost buttons with their icon and label; icons
     only (each with its tooltip) when the bar does not fit; then the commands fold into "More actions" (⋮) one at a time
     from the end, the danger commands last. More shows only when something has folded.
   Props:
     actions: [{ id, label, icon, onSelect, items, danger, disabled, why, primary, priority, single, toggle, pressed, choices, value, onChange, loading, tooltip, panel }]
   actions[].priority: "high" | "normal" | "low" (default "normal"): low folds into More first, then normal, then high; within a priority the last
     command first, the danger ones last of theirs (utils/foldOrder.ts; platform/standards/fit-and-overflow.md); the primary command never folds
     actions[].toggle: an on/off command (owner, 2026-10-15, the Fluent model): a pressed button (pressed true or false);
       onSelect(next) runs with the new state; folded into More it is a checked menu item
     actions[].choices: a command that picks one of [{ value, label, icon }]: a menu button showing the current choice
       (named "label: choice"), onChange(value) runs on a pick; folded into More it is a submenu of radio items
     actions[].confirm: { name, count, plural (a word, or a plural object { one, other } / { zero, one, two, few, many, other } the count picks from), consequence, permanent, title, body, confirmLabel }: the command opens the destructive Dialog before it runs (docs/adr/0004).
     The words come from the catalog's confirmAction strings: the title "{verb} {name}?" (or "{verb} {count} {plural}?"), the verb being the command's label, the
     consequence (one sentence, required for a danger command), "This cannot be undone." with permanent, and the button repeating the verb. A title, body or
     confirmLabel the application gives wins. Focus starts on Cancel, Escape cancels, and focus returns to the command; folded into More it confirms the same way.
   actions[].items: a menu: Menu children (MenuItem…) or [{ id, label, icon, danger, disabled, single, onSelect }]
     actions[].why: the tooltip of a disabled command, saying why (owner, 2026-10-14: commands are never hidden by state,
       only disabled, with a why-tooltip)
     actions[].loading: uses the existing Button spinner and busy state; folded commands are busy and cannot be chosen
     actions[].tooltip: additional help on hover and keyboard focus, with labels or icons; disabled why takes precedence
     actions[].panel({ close }): returns a small form in the existing Popover; Escape returns focus to the action
     iconOnly: draw the commands as icons with tooltips
     fold: how many commands are in More (from the end: the others first, the danger commands last)
     off(action): whether a command (or a menu item) is disabled now; default action.disabled
     why(action): the tooltip of a disabled command; default action.why
     moreLabel: the More button's name ("More actions")
     dangerClass: the class that draws a ghost button in the danger color
     extra: more menu nodes for More, after the folded commands (the bar's folded quick filters); More shows for them too
   Notes:
     The danger commands come last, after a divider. A primary command (the page's one, when it marks one) stays filled
     and keeps its label. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Menu, MenuItem, MenuGroup, MenuDivider, MenuRadioGroup, MenuSub } from '../../components/Menu/Menu.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { Popover } from '../../components/Popover/Popover.tsx';
import { Spinner } from '../../components/Loading/Loading.tsx';
import { ConfirmDialog } from '../../components/Dialog/Dialog.tsx';
import { focusables } from '../../utils/layer.ts';
import { foldOrder, menuOrder } from '../../utils/foldOrder.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import MoreIcon from 'plenix-platform/icons/plenix/more';


// Composite triggers do not all forward arbitrary props. Keep Tooltip's description on the real control.
function HintTarget({ children, 'aria-describedby': description }: any) {
  const wrap = React.useRef<any>(null);
  React.useLayoutEffect(() => {
    const button = wrap.current && wrap.current.querySelector('button,a[href]');
    if (!button || !description) return undefined;
    const before = button.getAttribute('aria-describedby');
    const ids = [...new Set((before || '').split(' ').concat(description.split(' ')).filter(Boolean))];
    button.setAttribute('aria-describedby', ids.join(' '));
    return () => { if (before) button.setAttribute('aria-describedby', before); else button.removeAttribute('aria-describedby'); };
  });
  return <span ref={wrap} className="plx-bar-actions__hint-target">{children}</span>;
}
function ActionHint({ content, children, className }: any) {
  return <Tooltip content={content} className={className}><HintTarget>{children}</HintTarget></Tooltip>;
}

// MenuItem intentionally has no public ref. This adapter exposes its real button to Popover's focus/anchor handling.
const PanelMenuTrigger = React.forwardRef<any, any>(function PanelMenuTrigger(props: any, ref) {
  const wrap = React.useRef<any>(null);
  React.useImperativeHandle(ref, () => wrap.current && wrap.current.querySelector('[data-plx-menu-item]'));
  return <span ref={wrap} className="plx-bar-actions__panel-item"><MenuItem {...props} keepOpen /></span>;
});
function ActionPanel({ action, trigger }: any) {
  const [open, setOpen] = React.useState(false);
  const holder = React.useRef<any>(null);
  const unavailable = !!action.disabled || !!action.loading;
  const show = open && !unavailable;
  const close = () => setOpen(false);
  // If dismissing a narrow sheet also closes More, its item is gone: return to the surviving More trigger.
  React.useEffect(() => {
    if (!show) return undefined;
    const menu = holder.current && holder.current.closest('[role="menu"]');
    const more = menu && menu.parentElement.querySelector(':scope > button');
    return () => { requestAnimationFrame(() => { if (more && more.isConnected && document.activeElement === document.body) more.focus({ preventScroll: true }); }); };
  }, [show]);
  React.useEffect(() => { if (unavailable) setOpen(false); }, [unavailable]);
  const contain = (e: any) => {
    const dialog = e.target.closest('[role="dialog"]');
    if (!dialog) return;
    // The non-modal form is outside the toolbar's roving order. Tab past its last control leaves the whole bar.
    if (e.type === 'keydown' && e.key === 'Tab' && !e.shiftKey && dialog.getAttribute('aria-modal') !== 'true') {
      const controls = focusables(dialog).filter((el) => el.tabIndex >= 0);
      const toolbar = holder.current && holder.current.closest('[role="toolbar"]');
      if (toolbar && e.target === controls[controls.length - 1]) {
        const next = focusables(document.body).find((el) => el.tabIndex >= 0 && !toolbar.contains(el) && !el.closest('[role="menu"],[role="dialog"],[inert]') && (toolbar.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
        if (next) { e.preventDefault(); next.focus(); }
      }
    }
    e.stopPropagation();
  };
  const leave = (e: any) => {
    const next = e.relatedTarget, menu = e.currentTarget.closest('[role="menu"]');
    if (!menu || !next || menu.contains(next) || next.closest('[role="dialog"]')) return;
    const more = menu.parentElement.querySelector(':scope > button');
    if (more) more.click();
  };
  return <span ref={holder} className="plx-bar-actions__panel" onKeyDown={contain} onFocus={contain} onMouseDown={contain} onBlur={leave}><Popover trigger={trigger} title={action.label} closeButton open={show}
    onOpenChange={(next) => { if (!next || !unavailable) setOpen(next); }}
    >
    {show ? action.panel({ close }) : null}
  </Popover></span>;
}

// a menu's items: Menu children, or descriptors drawn as MenuItems
const itemsOf = (a: any, off: any) => {
  const list = a.items;
  if (!Array.isArray(list) || !list.length || React.isValidElement(list[0])) return list;
  return list.map((it) => <MenuItem key={it.id || it.label} icon={it.icon} danger={it.danger} disabled={off(it)} onSelect={it.onSelect}>{it.label}</MenuItem>);
};

// the commands that fold, in their folding order (utils/foldOrder.ts): low priority first, the last command first within a priority, the danger ones last of theirs
export { foldOrder };

export function BarActions({ actions = [] as any[], iconOnly = false, fold = 0, off = (a: any) => !!a.disabled, why = (a: any) => a.why, moreLabel,
  dangerClass, size = 'sm', extra = [], selectionKeys = null }: any) {
  const t = useStrings('commandBar'),
    C = useStrings('confirmAction'),
    { plural: pluralOf, format } = useLocale(),
    [pending, setPending] = React.useState<any>(null);
  moreLabel = moreLabel ?? t.moreLabel;
  // a command with confirm opens the destructive Dialog first (ADR 0004); the others run at once
  const ask = (a: any, run: any) => (a.confirm ? () => setPending({ a, run }) : run);
  // confirm.plural: one string, or a plural object ({ one, other }; Arabic { zero, one, two, few, many, other }) whose form the locale's plural rules pick for the count
  // (an exact count key such as "=0" wins), so a noun agrees with its number in every language (#630)
  const nounFor = (plural: any, count: any) => {
    if (plural === undefined || plural === null) return '';
    if (typeof plural !== 'object') return plural;
    const exact = plural['=' + Number(count)];
    return exact !== undefined ? exact : plural[pluralOf(count)] ?? plural.other ?? '';
  };
  // the count is written in the locale's digits (ar-EG: Arabic-Indic, docs/i18n/arabic.md); the noun form still picks by the number (#649)
  const words = (a: any) => {
    const c: any = a.confirm || {}, fill = (text: any, values: any) => text.replace(/\{(\w+)\}/g, (m: any, k: any) => (values[k] === undefined ? m : values[k]));
    const verb = a.label;
    return {
      title: c.title ?? (c.count !== undefined ? fill(C.titleMany, { verb, count: typeof c.count === 'number' ? format.number(c.count) : c.count, plural: nounFor(c.plural, c.count) }) : fill(C.title, { verb, name: c.name ?? '' })),
      message: c.body ?? [c.consequence, c.permanent ? C.permanent : null].filter(Boolean).join(' '),
      confirmLabel: c.confirmLabel ?? fill(C.confirm, { verb })
    };
  };
  // selectionKeys (CommandBar add mode, D-0068): the ids of the selection's group; the page's commands fold first, then the selection's
  const inSel = (a: any) => !!selectionKeys && selectionKeys.has(a.id || a.label);
  const order = selectionKeys ? foldOrder(actions.filter((a: any) => !inSel(a))).concat(foldOrder(actions.filter(inSel))) : foldOrder(actions);
  const folded = new Set(order.slice(0, fold).map((a) => a.id || a.label));
  const kept = actions.filter((a: any) => !folded.has(a.id || a.label));
  const away: any[] = menuOrder<any>(actions.filter((a: any) => folded.has(a.id || a.label)));   // in More: the others in the bar's order, then the danger ones after a divider
  // a choices command: its options as radio items, and the current one's label
  const radios = (a: any) => (
    <MenuRadioGroup label={a.label} value={a.value} onChange={(v) => a.onChange && a.onChange(v)}>
      {(a.choices || []).map((c: any) => <MenuItem key={c.value} value={c.value} icon={c.icon}>{c.label}</MenuItem>)}
    </MenuRadioGroup>
  );
  const current = (a: any) => { const c = (a.choices || []).find((x: any) => x.value === a.value); return c ? c.label : ''; };
  const one = (a: any) => {
    const disabled = off(a), loading = !!a.loading;
    const filled = !!a.primary;
    const only = iconOnly && !filled && !!a.icon;
    const panel = typeof a.panel === 'function';
    const menu = !!a.items || !!a.choices;
    // a choices command shows its current choice and is named by both ("Profile: Jordan")
    const name = a.choices ? a.label + ': ' + current(a) : a.label;
    const text = a.choices ? current(a) || a.label : a.label;
    const click = panel ? undefined : a.toggle ? () => a.onSelect && a.onSelect(!a.pressed) : menu ? undefined : a.confirm ? ask(a, () => a.onSelect && a.onSelect()) : a.onSelect;
    const button = (
      <Button size={size} variant={filled ? 'primary' : 'ghost'} icon={a.icon} iconOnly={only} label={only || a.choices ? name : undefined} caret={menu && !only}
        aria-haspopup={panel ? 'dialog' : menu ? 'menu' : undefined} expanded={loading && (panel || menu) ? false : undefined}
        pressed={a.toggle ? !!a.pressed : undefined} disabled={disabled} loading={loading} className={a.danger && !filled ? dangerClass : undefined} onClick={click}>{text}</Button>
    );
    const el = loading ? button : panel ? <ActionPanel action={Object.assign({}, a, { disabled })} trigger={button} /> : a.choices ? <Menu label={a.label} trigger={button}>{radios(a)}</Menu> : a.items ? <Menu label={a.label} trigger={button}>{itemsOf(a, off)}</Menu> : button;
    const tip = (disabled && why(a)) || a.tooltip || (only ? name : null);
    return <React.Fragment key={a.id || a.label}>{tip ? <ActionHint content={tip}>{el}</ActionHint> : el}</React.Fragment>;
  };
  const plain = kept.filter((a: any) => !a.danger), danger = kept.filter((a: any) => a.danger);
  const allOff = away.length > 0 && !extra.length && away.every((a) => off(a));
  const more = away.length || extra.length ? (
    <Tooltip key="plx-more" content={allOff ? why(away[0]) : moreLabel}>
      <Menu label={moreLabel} placement="bottom-end" trigger={<Button size={size} variant="ghost" icon={MoreIcon} iconOnly label={moreLabel} disabled={allOff} />}>
        {away.map((a, i) => {
          const sep = a.danger && i > 0 && !away[i - 1].danger ? <MenuDivider key={(a.id || a.label) + '-sep'} /> : selectionKeys && i > 0 && !a.danger && !away[i - 1].danger && inSel(a) !== inSel(away[i - 1]) ? <MenuDivider key={(a.id || a.label) + '-sep'} /> : null;
          // folded (the Fluent model): a toggle is a checked item, a choices command a submenu of radio items
          const busy = !!a.loading, disabled = off(a) || busy;
          const item = busy ? <MenuItem key={a.id || a.label} icon={<Spinner size="sm" label={a.label} />} danger={a.danger} checked={a.toggle ? !!a.pressed : undefined} aria-label={a.choices ? a.label + ': ' + current(a) : a.label} aria-busy disabled>{a.choices ? a.label + ': ' + current(a) : a.label}</MenuItem>
            : typeof a.panel === 'function' ? <ActionPanel key={a.id || a.label} action={Object.assign({}, a, { disabled })}
                trigger={<PanelMenuTrigger icon={a.icon} danger={a.danger} disabled={disabled}>{a.label}</PanelMenuTrigger>} />
            : a.choices ? <MenuSub key={a.id || a.label} label={a.label + ': ' + current(a)} icon={a.icon} disabled={off(a)}>{radios(a)}</MenuSub>
            : a.toggle ? <MenuItem key={a.id || a.label} icon={a.icon} checked={!!a.pressed} disabled={off(a)} onSelect={() => a.onSelect && a.onSelect(!a.pressed)}>{a.label}</MenuItem>
            : a.items ? <MenuGroup key={a.id || a.label} label={a.label}>{itemsOf(a, off)}</MenuGroup>
            : <MenuItem key={a.id || a.label} icon={a.icon} danger={a.danger} disabled={off(a)} onSelect={a.confirm ? ask(a, () => a.onSelect && a.onSelect()) : a.onSelect}>{a.label}</MenuItem>;
          const tip = (off(a) && why(a)) || a.tooltip;
          const described = tip ? <ActionHint key={a.id || a.label} content={tip} className="plx-bar-actions__tooltip">{item}</ActionHint> : item;
          return sep ? [sep, described] : described;
        })}
        {away.length && extra.length ? <MenuDivider key="plx-extra-sep" /> : null}
        {extra}
      </Menu>
    </Tooltip>
  ) : null;
  return (
    <>
      {pending ? (
        <ConfirmDialog
          open
          destructive={!!pending.a.danger}
          {...(words(pending.a) as any)}
          cancelLabel={C.cancel}
          onConfirm={() => {
            const run = pending.run;
            setPending(null);
            run();
          }}
          onCancel={() => setPending(null)}
        />
      ) : null}
      {plain.map((a: any, i: any) => (selectionKeys && i > 0 && inSel(a) !== inSel(plain[i - 1]) ? [<span key={(a.id || a.label) + '-split'} className={cx('plx-bar-actions__divider')} aria-hidden="true" />, one(a)] : one(a)))}
      {more}
      {danger.length && (plain.length || more) ? <span key="plx-danger-divider" className={cx('plx-bar-actions__divider')} aria-hidden="true" /> : null}
      {danger.map(one)}
    </>
  );
}
