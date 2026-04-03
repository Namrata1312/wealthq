# WealthQ Design System

**Version:** 2.0 — Emerald
**Last updated:** March 29, 2026
**Status:** Foundation

---

## Design Principles

1. **Clarity first** — Every element should communicate its purpose immediately. No decorative clutter.
2. **Earned trust** — The visual language should feel secure, precise, and institutional-grade. People are trusting us with their financial future.
3. **Quiet confidence** — Let content and data breathe. Restrained use of color, generous whitespace, strong typography.
4. **Accessible by default** — WCAG 2.1 AA minimum. Financial tools must work for everyone.
5. **Progressive disclosure** — Show what matters now, reveal complexity on demand.

---

## Design Tokens

### Color — Emerald Scale (Primary)

| Token | Hex | Usage |
|-------|-----|-------|
| `emerald-950` | `#022C22` | Deepest brand — hero text, dark sections |
| `emerald-900` | `#064E3B` | Primary brand — logo, nav CTA |
| `emerald-800` | `#065F46` | Primary buttons, key headings |
| `emerald-700` | `#047857` | Accent emphasis, italic headings |
| `emerald-600` | `#059669` | Overlines, active indicators |
| `emerald-500` | `#10B981` | Status dots, highlights |
| `emerald-400` | `#34D399` | Gradient endpoints, hover accents |
| `emerald-300` | `#6EE7B7` | Focus rings, connecting lines |
| `emerald-100` | `#D1FAE5` | Badge borders, hover borders |
| `emerald-50` | `#ECFDF5` | Tinted backgrounds, badge fills |

### Color — Warm Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | `#D4A853` | Premium accent — badges, special highlights |
| `gold-light` | `#F5ECD7` | Gold backgrounds |

### Color — Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `semantic-success` | `#059669` | Positive outcomes, gains, confirmations |
| `semantic-success-bg` | `#ECFDF5` | Success background |
| `semantic-warning` | `#D4870E` | Caution states, pending items |
| `semantic-warning-bg` | `#FEF7E6` | Warning background |
| `semantic-error` | `#C43E3E` | Errors, losses, destructive actions |
| `semantic-error-bg` | `#FDE8E8` | Error background |
| `semantic-info` | `#2B6CB0` | Informational callouts |
| `semantic-info-bg` | `#E8F0FE` | Info background |

### Color — Warm Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `warm-900` | `#1C1917` | Primary text |
| `warm-800` | `#292524` | Strong headings |
| `warm-700` | `#44403C` | Secondary text |
| `warm-600` | `#57534E` | Nav links |
| `warm-500` | `#78716C` | Body text, descriptions |
| `warm-400` | `#A8A29E` | Placeholders, muted labels |
| `warm-300` | `#D6D3D1` | Decorative dots |
| `warm-200` | `#E7E5E4` | Borders, dividers |
| `warm-100` | `#F5F5F4` | Secondary surfaces |
| `warm-50` | `#FAFAF9` | Subtle backgrounds |

### Typography

**Display typeface:** Playfair Display — serif, used for hero headlines and section titles. Adds warmth and editorial elegance.
**Body typeface:** Inter (primary), system-ui fallback stack

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `heading-xl` | 32px / 2rem | 600 (Semibold) | 1.25 | Page titles |
| `heading-lg` | 24px / 1.5rem | 600 | 1.3 | Section headers |
| `heading-md` | 20px / 1.25rem | 600 | 1.35 | Card titles, subsections |
| `heading-sm` | 16px / 1rem | 600 | 1.4 | Widget headers |
| `body-lg` | 16px / 1rem | 400 (Regular) | 1.6 | Primary body text |
| `body-md` | 14px / 0.875rem | 400 | 1.5 | Secondary body text, table cells |
| `body-sm` | 12px / 0.75rem | 400 | 1.5 | Captions, metadata, labels |
| `label` | 12px / 0.75rem | 500 (Medium) | 1.3 | Form labels, overlines |
| `mono` | 14px / 0.875rem | 400 | 1.5 | Numbers, financial data, codes |

**Monospace typeface:** JetBrains Mono or SF Mono — used for all financial figures to ensure digit alignment.

### Spacing Scale

Based on a 4px grid. All spacing uses multiples of 4.

| Token | Value | Common Usage |
|-------|-------|-------------|
| `space-1` | 4px | Tight inner padding, icon gaps |
| `space-2` | 8px | Compact element spacing |
| `space-3` | 12px | Default inner padding |
| `space-4` | 16px | Standard element gap |
| `space-5` | 20px | Medium section spacing |
| `space-6` | 24px | Card padding, form group gaps |
| `space-8` | 32px | Section separation |
| `space-10` | 40px | Large section separation |
| `space-12` | 48px | Page section breaks |
| `space-16` | 64px | Major layout divisions |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Buttons, badges, small elements |
| `radius-md` | 8px | Cards, inputs, dropdowns |
| `radius-lg` | 12px | Modals, large containers |
| `radius-full` | 9999px | Avatars, pills, toggles |

### Elevation (Shadows)

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift — buttons, inputs |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)` | Cards, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)` | Modals, popovers |
| `shadow-focus` | `0 0 0 3px rgba(43,108,176,0.25)` | Focus ring (keyboard navigation) |

### Motion

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 100ms | Hover states, toggles |
| `duration-normal` | 200ms | Transitions, collapses |
| `duration-slow` | 300ms | Modals, page transitions |
| `easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `easing-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `easing-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |

---

## Component Specifications

### Button

**Description:** Primary interactive element for triggering actions.

| Variant | Use When | Background | Text Color | Border |
|---------|----------|-----------|------------|--------|
| Primary | Main CTAs, confirmations | `brand-primary` | `#FFFFFF` | none |
| Secondary | Supporting actions | `neutral-0` | `brand-primary` | `neutral-300` |
| Ghost | Tertiary actions, inline links | transparent | `brand-primary` | none |
| Danger | Destructive actions | `semantic-error` | `#FFFFFF` | none |

**Sizes:**

| Size | Height | Padding (h) | Font | Radius |
|------|--------|-------------|------|--------|
| sm | 32px | 12px | `body-sm` | `radius-sm` |
| md | 40px | 16px | `body-md` | `radius-sm` |
| lg | 48px | 24px | `body-lg` | `radius-sm` |

**States:** Default, Hover (darken 8%), Active (darken 12%), Disabled (40% opacity, no pointer), Loading (spinner replaces label, maintains width)

**Accessibility:** `role="button"`, keyboard Enter/Space to activate, visible focus ring using `shadow-focus`.

### Input

**Description:** Text input for forms and data entry.

| Property | Value |
|----------|-------|
| Height | 40px (md), 32px (sm), 48px (lg) |
| Background | `neutral-0` |
| Border | 1px `neutral-300` |
| Border (focus) | 1px `brand-primary` + `shadow-focus` |
| Border (error) | 1px `semantic-error` |
| Placeholder | `neutral-500` |
| Text | `neutral-900`, `body-md` |
| Label | `label` token, `neutral-700` |
| Padding | `space-3` horizontal |
| Radius | `radius-md` |

**States:** Default, Focus (blue border + ring), Error (red border + error message below), Disabled (background `neutral-100`, 60% opacity)

**Variants:** Text, Password (with show/hide toggle), Number (with stepper), Search (with icon + clear), Textarea (min 3 rows)

### Card

**Description:** Contained surface for grouping related content.

| Property | Value |
|----------|-------|
| Background | `neutral-0` |
| Border | 1px `neutral-200` |
| Radius | `radius-md` |
| Padding | `space-6` |
| Shadow | `shadow-md` (elevated variant) or none (flat variant) |

**Variants:** Flat (border only, no shadow — default), Elevated (shadow, no border), Interactive (hover lifts to `shadow-lg`, cursor pointer)

### Table

**Description:** Data display for financial information, transactions, holdings.

| Property | Value |
|----------|-------|
| Header background | `neutral-50` |
| Header text | `label` token, `neutral-700`, uppercase |
| Row height | 48px minimum |
| Cell padding | `space-3` vertical, `space-4` horizontal |
| Border | 1px `neutral-200` between rows |
| Hover row | `neutral-50` background |
| Numerical data | `mono` token, right-aligned |
| Positive values | `semantic-success` |
| Negative values | `semantic-error` |

### Badge / Tag

| Variant | Background | Text |
|---------|-----------|------|
| Default | `neutral-100` | `neutral-700` |
| Success | `semantic-success-bg` | `semantic-success` |
| Warning | `semantic-warning-bg` | `semantic-warning` |
| Error | `semantic-error-bg` | `semantic-error` |
| Info | `semantic-info-bg` | `semantic-info` |

Height 24px, padding `space-1` vertical / `space-2` horizontal, `body-sm` font, `radius-full`.

### Toast / Notification

Position: top-right, stacked. Auto-dismiss after 5s (info/success) or persistent (error/warning). Shadow `shadow-lg`, radius `radius-md`, max-width 400px. Includes icon, message, optional action link, and close button.

### Modal / Dialog

Centered overlay with `rgba(0,0,0,0.4)` backdrop. Max-width 480px (sm), 640px (md), 800px (lg). Padding `space-8`. Close on Escape key, trap focus within modal. Radius `radius-lg`, shadow `shadow-lg`.

---

## Layout System

### Grid

12-column grid, 1200px max content width, 24px gutters, 24px page margin on desktop.

| Breakpoint | Width | Columns | Gutter |
|------------|-------|---------|--------|
| Mobile | < 640px | 4 | 16px |
| Tablet | 640–1024px | 8 | 20px |
| Desktop | 1024–1280px | 12 | 24px |
| Wide | > 1280px | 12 | 24px |

### Sidebar Navigation

Width: 240px collapsed to 64px (icon-only). Background `neutral-0` with right border `neutral-200`. Active item: `brand-primary-light` background with `brand-primary` text and left 3px accent bar.

---

## Patterns

### Financial Data Display

- Always use monospace for dollar amounts, percentages, and numerical data
- Right-align all numerical columns in tables
- Use `semantic-success` for gains/positive and `semantic-error` for losses/negative
- Include the sign (+ / –) explicitly, never rely on color alone (accessibility)
- Format currency: `$12,345.67` — always two decimal places
- Format percentages: `+3.42%` or `–1.18%`

### Empty States

Centered in the content area. Include: a subtle illustration or icon (muted `neutral-300`), a heading explaining what goes here, a body line with guidance, and a primary CTA button.

### Loading States

Skeleton screens for initial page loads (pulsing `neutral-200` blocks matching content shape). Inline spinners for actions (16px for buttons, 24px standalone). Never block the full screen — keep navigation visible.

### Form Patterns

Labels always above inputs. Required fields marked with `*` after label (in `semantic-error` color). Error messages appear below the input in `body-sm` + `semantic-error`. Group related fields with `space-6` between groups. Action buttons right-aligned: primary right, secondary left.

---

## Iconography

Style: 24px default, 1.5px stroke, rounded caps and joins. Source recommendation: Lucide Icons (open source, consistent, clean). Use `neutral-500` for decorative icons, `neutral-900` for interactive icons, semantic colors for status icons.

---

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Use the navy `brand-primary` for main CTAs | Use bright or saturated colors for primary actions |
| Let data breathe with generous spacing | Cram financial data into tight spaces |
| Use monospace for all numbers and amounts | Mix proportional and monospace in data tables |
| Show + / – signs alongside color for gains/losses | Rely on color alone to indicate positive/negative |
| Keep the interface quiet — highlight only what matters | Add decorative gradients, shadows, or animations |
| Use sentence case for UI labels | Use ALL CAPS except for table headers and labels |

---

## Reference Palette — Quick Visual

```
Deep Emerald  ██ #022C22   — Authority, depth
Emerald 800   ██ #065F46   — Primary CTAs, trust
Emerald 600   ██ #059669   — Active, success
Emerald 400   ██ #34D399   — Highlights, gradients
Gold          ██ #D4A853   — Premium accents
Warm 900      ██ #1C1917   — Primary text
Warm 500      ██ #78716C   — Body copy
Warm 200      ██ #E7E5E4   — Borders
Warm 50       ██ #FAFAF9   — Backgrounds
White         ██ #FFFFFF   — Primary surface
```

---

## Next Steps

1. **Choose a tech stack** — React + Tailwind, Vue + custom CSS, or Figma-first
2. **Build a component library** — Start with Button, Input, Card, Table, Badge
3. **Create a Storybook or Figma file** — Living documentation for the team
4. **Define dark mode tokens** — Map each light token to a dark equivalent
5. **Set up linting** — Enforce token usage, flag hardcoded values
