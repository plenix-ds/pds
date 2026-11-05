---
name: pds1-owner-interview
description: How the PDS 1.0 Product Lead asks the owner about intent without stopping the work - one batched GitHub comment of 3-5 questions with Known/Inferred/Unknown, a recommended option applied at once, and each answer recorded as a decision issue plus a decisions.yaml entry with its enforcing check. Use when a spec has an open intent question or new owner feedback would change a recorded decision.
---

# Owner interview (Product Lead)

Adapted from JacobLinCool/ux-discovery-interviewer-skill (MIT): Known /
Inferred / Unknown labels and "what changed / what stays the same", in the
PDS 1.0 form (plan §5a, §6): **agents never ask permission and never wait.**

## Before asking anything

- Read `decisions.yaml`, `DESIGN.md`, the issue thread, the spec and the code.
  **Never ask what those already answer.** Never ask twice.
- Ask only about **intent**: what the owner wants, for whom, what matters more.
  Not permission, not "shall I proceed", not implementation details the team owns.
- Cheap to reverse? Apply the default and say so; no question.

## One round

- **3-5 questions**, all in **one batched comment** on the issue, signed by
  `pds-product-lead[bot]`. No drip-feeding.
- Open with what we understood, labelled:
  `Known:` (owner said it / recorded) · `Inferred:` (our reading, with why) · `Unknown:` (what the questions settle).
- Each question is a decision card with options and a recommendation that is
  **already applied**:

```
D-0123 · <area>: <one-line question>
Context: one sentence of what we understood.
A (Recommended) - <choice> - risk: ...
B - <choice> - risk: ...
Applied: A. To switch, reply B. If switched, we redo: <cost>.
```

- Options in words. **Pictures only if the owner asked** ("show me", "options");
  then use real PDS components, not mock-ups.
- Work continues on the applied option immediately. Next round only if answers
  open new Unknowns; "Other" is mapped back to options in the next card.

## Record (same PR as the change it drives)

1. Open an issue labelled `decision` (title = card id + question), linked from the owner's issue.
2. Add a `decisions.yaml` entry: `id`, `date`, `area` (design, tokens,
   components, i18n, release, process), `decision`, `why`, `options`, `chosen`,
   `decided_by` (`agent:product-lead` for an applied default, `owner` once he
   answers), `status` (active / superseded / retired), `issue`, and **`check`**:
   the test or lint rule that enforces it, or `review_only: <reason>`.
   CI fails an entry with neither.
3. Track each owner comment in the feedback register: open -> accepted -> applied (link to the changed file).

## When the owner replies

- Picks another option: new entry, old one `superseded` with a link; redo the
  listed work. Never edit or delete past entries (the guard hook blocks it).
- Later feedback on a recorded decision: reply with **What changed / What stays
  the same**, record it as a new card. An unrecorded reversal fails review.
- Report decisions made in the pinned "Daily summary" issue.
