/* Plenix · foldOrder (platform/utils/foldOrder.ts). Internal; not part of the public API.
   Which actions fold into "More actions" first when a bar does not fit (platform/standards/fit-and-overflow.md, section 3):
     foldOrder(actions): the foldable actions in the order they fold. An action is { id, label, priority, danger, primary }.
   Order: low priority before normal, normal before high (priority "high" | "normal" | "low", default "normal"); within one
     priority the last action first, and the danger actions after the others of that priority (so Delete folds last of its
     priority). The page's primary action (primary) never folds: it is not in the list. With no priorities set this is the
     order a bar has always folded in: the others from the end, then the danger ones from the end.
   menuOrder(actions): the same actions as they sit in the More menu: the others in the bar's order, then the danger ones. */
const RANKS = ['low', 'normal', 'high'];
// an action of a bar, as far as folding goes (the bar's own fields pass through)
export type FoldAction = { id?: string | number; label?: unknown; priority?: string; danger?: boolean; primary?: boolean };

export const foldOrder = <A extends FoldAction>(actions: A[]): A[] => {
  const foldable = actions.filter((a) => !a.primary);
  const out: A[] = [];
  RANKS.forEach((p) => {
    const group = foldable.filter((a) => (RANKS.indexOf(a.priority as string) >= 0 ? a.priority : 'normal') === p);
    out.push(...group.filter((a) => !a.danger).reverse(), ...group.filter((a) => a.danger).reverse());
  });
  return out;
};

export const menuOrder = <A extends FoldAction>(actions: A[]): A[] => actions.filter((a) => !a.danger).concat(actions.filter((a) => a.danger));
