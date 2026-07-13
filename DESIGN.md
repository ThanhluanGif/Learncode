# Design law — buildflow projects

This file is LAW for every UI card in this project — the UI mock card and every
frontend card MUST be built and reviewed against it. If a change conflicts with a rule
here, the rule wins (or the rule is changed deliberately, in this file, with a dated note).

Two layers, treat them differently:
- **Structure is law**: the affordance ladder, object-first pattern, forms rules, and the
  never-do list apply to any product. Don't relitigate these per project.
- **Tokens are taste**: the colors, fonts, and gradients below are one good default.
  A project MAY replace them — deliberately, in this file, all at once, with a dated
  note — never ad-hoc per component.

## North Star

**Simple stupid UI for non-technical users; full power kept available — but never in the way.**

Users think in *their* objects ("my workshop", "my ticket", "my booking") — never in
engine concepts. Engine words (workflow, trigger, action, job, queue, webhook, agent,
prompt…) NEVER appear in user-facing copy. Define this project's vocabulary in the
table below and use it everywhere.

### Project vocabulary

| Engine concept | This project's user word |
|---|---|
| study session | phiên học |
| problem attempt | lần làm bài |
| learning reflection | rút kinh nghiệm |
| progress aggregate | tiến độ học tập |
| pilot feedback | góp ý bản thử nghiệm |

## Five rules that override everything

1. **Object-first, not feature-first.** The home page of a thing IS the thing. Tabs are
   lenses on the same object — the user never navigates "out" to reach something related.
2. **WYSIWYG, edited in place.** The daily 80% of edits happen inline on the object's own
   page (see the affordance ladder). A separate Edit page exists only for the structural 20%.
3. **Defaults beat configuration.** Creatable in ≤6 visible fields; everything else behind
   one "More options" disclosure. If a default serves 80%, ship it and demote the toggle.
4. **Plain language beats power syntax.** "4 days after it ends" — never cron. A field-picker
   chip — never `{{ raw.templates }}`. No JSON in any simple surface.
5. **Power behind a door.** If a power surface exists, it's a `Simple | Pro` toggle that
   never loses data, plus a visible "switch to simple" path back. 95% never flip it.

## Edit-affordance ladder (inline ↔ popup is a spectrum, not a switch)

Choose by the field's SEMANTIC SHAPE — always the lightest rung the shape allows.
Decision rule: count the inputs the user must touch to finish the edit.

| Rung | Field shape | Interaction |
|---|---|---|
| 1. Inline text | one free-text value | click → input in place → save on blur/Enter (optimistic) |
| 2. Inline control | one value, known set/format | click → the right native control in place (date picker, stepper, select) |
| 3. Popover composite | ONE displayed line composed of 2–4 sub-choices | click → popover anchored to the field, type-switch + matching input → "Done" writes one line |
| 4. Modal | a multi-field object, or a collection | "+ Add" / "Edit" → centered dialog with all fields |

- Popover edits **one display value**, dims nothing. Modal edits **an object or list**, dims the page.
  Finishing produces one chip → popover. A new row in a list → modal. Never swap them.
- Inline-editable fields: text by default; hover reveals dotted underline + a 12px pencil;
  click becomes the right affordance.
- **Empty state rides the same ladder**: a missing value renders as a dashed `+ Add {label}`
  that opens its own rung. No field is ever a dead-end.

## Object page pattern (the Luma pattern)

Every object-detail page:
- **Pulse strip** — at-a-glance metrics inline (calm, no stat-tile cards, no shadows).
- **Up to 3 hero action cards** — the top things a user does on this object. Big targets,
  gradient-tinted, one click. NOT a kebab menu.
- **Tabs as lenses** — all on the same object. Active tab: 2px bottom border `var(--fg-base)`.
- **Modal-first sub-actions** — small focused modals, one CTA. No multi-screen flows.
- **The overview shows less, not more.** Heavy lifting goes to specialized tabs.

## Academic Focus tokens (locked 2026-07-14)

The owner requested a deliberate whole-cluster redesign using the project-local Taste
skills. This replaces the original Editorial Minimal font/palette cluster. The product is
a dense learning workspace, so readability and trust take priority over decorative style.

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#F6F7FA` | page background |
| `--surface` | `#FFFFFF` | primary surfaces |
| `--bg-subtle` | `#F0F2F7` | secondary surfaces and hover |
| `--fg-base` | `#172033` | primary text and primary buttons |
| `--fg-muted` | `#566074` | body and descriptions |
| `--fg-subtle` | `#7B8495` | helper text and timestamps |
| `--border` | `#DDE2EA` | all 1px borders |
| `--accent` | `#3148C8` | focus rings, active lens, primary action |
| `--accent-soft` | `#EEF1FF` | selected and contextual surfaces |
| `--success` | `#197A55` | verified source and completed state only |
| `--warning` | `#A45B17` | attention state only |
| `--danger` | `#B13A3A` | error state only |

**Typography**: `Be Vietnam Pro` for all Vietnamese headings, body, labels, and buttons.
`JetBrains Mono` is reserved for identifiers, dates, timers, counts, and code. Minimum
visible supporting text is 12px; body text is 14-16px. No decorative serif.

**Borders**: 1px `var(--border)`. No drop shadows except focus rings, active sidebar item,
and hero-card hover lift. One purposeful elevation, never shadow noise.

## Calm tints (highlight, not decorate)

Use solid tinted surfaces on hero actions, selected rows, source provenance, and status
messages. Never tint form inputs, body rows, or the whole page. Gradients are not part of
this workspace's visual system.

```css
--tint-accent: #EEF1FF;
--tint-success: #EAF7F1;
--tint-warning: #FFF4E7;
--tint-danger: #FDEEEE;
```

Hover on a primary action may lift `translateY(-1px)` with one soft shadow. Other
surfaces rely on border and spacing rather than elevation.

## Forms

- Max 6 visible fields on any create/edit page; more → disclosure.
- One column, max-width 640px for focused forms. No multi-step wizards for editing.
- Sticky savebar: white, 1px top border, optional 4px gradient accent strip.
- Labels 12px / 500 / `var(--fg-muted)`. Inputs 38px tall, 1px border, accent focus ring.

## Iconography

Stroke line icons (Heroicons/Lucide style), stroke-width 1.6–2, no fill.
**No emojis. Anywhere. Ever.** Use SVGs.

## VN conventions (when the project is Vietnamese-facing)

- Vietnamese copy throughout the user surface — written natively, not translated.
- Prices: `₫750,000` — symbol leading, comma groups. Never "VND 750000.00".
- VietQR scan-to-pay as the default payment presentation; cards demoted to "Thẻ quốc tế".
- Zalo as a first-class support-channel option, not only email.

## What to never do

- Never leak engine words into user-facing copy (see vocabulary table).
- Never show raw `{{ }}` templates or JSON outside a power-user surface.
- Never use multi-step wizards for editing.
- Never gradient form inputs, body backgrounds, or table rows.
- Never stack shadows. Never add emojis. Never write design comments in HTML.

## How this binds the cards

- The **UI mock card** renders these tokens/patterns in static HTML — the mock IS the
  design review; the operator approves against this file.
- Every **frontend card**'s review checks the diff against this file the same way it
  checks shapes against `flow/05-contract.md`. DESIGN.md is to pixels what the contract
  is to shapes.
