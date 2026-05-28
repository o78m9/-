# Aooda (عودة) — Brand Bible

> "نعيد المرضى. لا أعذار." — We return patients. No excuses.

---

## 1. Mission

Aooda helps clinic owners recover lost revenue by reactivating dormant patients through AI-powered WhatsApp outreach. Every design decision serves one goal: **make the clinic owner trust us enough to give us access to their most valuable asset — their patient list**.

---

## 2. Personality

| Trait             | What it means                                               |
| ----------------- | ----------------------------------------------------------- |
| **Precise**       | Numbers, not vague promises. Exact percentages, exact cost  |
| **Calm**          | Never hype. Never exclamation marks. Let results speak      |
| **Premium**       | Expensive-looking, not expensive-feeling. Accessible luxury |
| **Arabic-first**  | RTL is the default. Arabic is not a translation             |
| **Medical-grade** | Conservative palette. No gaming aesthetics                  |

---

## 3. Color System

### Primary Palette

```
Gold     #D4A574  — Primary action, highlight, CTA. Warm trust.
Gold dim  #8A6040  — Subdued state, text on dark
Sage     #7FB5A8  — Secondary, success, data positive
Forest   #0A1F1C  — Dark background, depth
Forest2  #142B27  — Slightly lighter dark
Forest3  #0E2420  — Slightly deeper dark
```

### Light-Mode Palette

```
Ink      #1A1815  — Body text
Cream    #F5F1E8  — Page background
Paper    #FFFCF5  — Card background
Moss     #4A6B5C  — Mid-tone green
Copper   #B8743D  — Warm accent
Mute     #6B6359  — Secondary text
Line     #E8DFD0  — Borders, dividers
```

### 11-Shade Scales

**Gold** (primary action):

- 50: #FDF8F2
- 100: #F9EDD9
- 200: #F2D8B0
- 300: #E8BC7E
- 400: #DCA654 ← base light
- 500: #D4A574 ← brand gold
- 600: #C08840
- 700: #8A6040
- 800: #6B4A30
- 900: #4A3220
- 950: #2A1C10

**Sage** (secondary/data):

- 50: #F0F7F6
- 100: #D8EDEA
- 200: #B4DAD4
- 300: #8AC5BC
- 400: #7FB5A8 ← brand sage
- 500: #5EA090
- 600: #468A7A
- 700: #326B5C
- 800: #224A40
- 900: #142B27
- 950: #0A1F1C

**Forest** (dark UI):

- 50: #E6F0EE
- 100: #BDDAD4
- 200: #8EC2B9
- 300: #5EA89C
- 400: #3D9082
- 500: #2A7068
- 600: #1A5550
- 700: #0F3D38
- 800: #0A2B27
- 900: #071A18
- 950: #030D0B

---

## 4. Typography

### Hierarchy

| Level   | Font                 | Size                           | Weight     | Use            |
| ------- | -------------------- | ------------------------------ | ---------- | -------------- |
| Hero    | Tajawal              | clamp(3rem, 6vw, 5rem)         | 900 Black  | H1 only        |
| Section | IBM Plex Sans Arabic | clamp(2rem, 4vw, 3rem)         | 700 Bold   | H2             |
| Subhead | IBM Plex Sans Arabic | clamp(1.25rem, 2.5vw, 1.75rem) | 600        | H3             |
| Body    | IBM Plex Sans Arabic | 1rem / 1.125rem                | 400        | Paragraphs     |
| Label   | IBM Plex Sans Arabic | 0.875rem                       | 500 Medium | Badges, labels |
| Mono    | Geist Mono           | 0.875rem                       | 400        | Code, data     |

### Rules

- `text-balance` on all headings (prevents orphaned words)
- `text-pretty` on all body paragraphs
- Heading `letter-spacing: -0.025em` for all sizes >24px
- Arabic line-height: 1.75 for body, 1.2 for headings
- Never mix Tajawal + IBM Plex in the same heading
- Tabular numerals via `font-variant-numeric: tabular-nums` on all data

---

## 5. Motion System

### Curves

```
ease-out-expo:      cubic-bezier(0.16, 1, 0.3, 1)   — Most UI entrances
ease-in-out-quart:  cubic-bezier(0.76, 0, 0.24, 1)  — Accordion, panels
ease-spring:        cubic-bezier(0.34, 1.56, 0.64, 1) — Playful elements
```

### Duration Scale

```
fast:    150ms  — Hover states, focus rings
base:    250ms  — Button transitions, color changes
medium:  400ms  — Card entrances, modal open
slow:    600ms  — Page sections, hero
xslow:   900ms  — Complex orchestrated sequences
```

### Rules

- **Always** add `prefers-reduced-motion` fallback
- Never animate `width`, `height`, `top`, `left` — use `transform` only
- Stagger between list items: 80-120ms max
- Hero animation: runs once on mount, never loops
- Loop animations (orbs, glow): must be `ease-in-out`, 4-8s cycle

---

## 6. Spacing

Base unit: 4px

```
1  → 4px
2  → 8px
3  → 12px
4  → 16px
5  → 20px
6  → 24px
8  → 32px
10 → 40px
12 → 48px
16 → 64px
20 → 80px
24 → 96px
32 → 128px
```

Section padding: `py-24` (96px) desktop, `py-16` (64px) mobile

---

## 7. Elevation

| Level  | Shadow                                                      | Use                   |
| ------ | ----------------------------------------------------------- | --------------------- |
| E0     | none                                                        | Cards on colored bg   |
| E1     | `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)`    | Default cards         |
| E2     | `0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)`   | Hover state           |
| E3     | `0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)`   | Dropdowns             |
| E4     | `0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.06)` | Modals                |
| E-glow | `0 0 40px rgba(212,165,116,0.3)`                            | CTA, focused elements |

---

## 8. Voice & Tone

### What we say

- Short sentences. Max 12 words.
- Active voice: "يكتشف النظام" not "يتم اكتشاف"
- First-person CTAs: "أبدأ مجاناً" not "ابدأ مجاناً" (softer imperative)
- Numbers always: "٢٣٪ يعودون" not "كثير من المرضى يعودون"
- Lead with the benefit: result first, mechanism second

### What we never say

- "مجاناً تماماً" (implies too good to be true)
- Superlatives without proof ("الأفضل", "الأقوى")
- Passive voice
- Ellipsis (...)
- Exclamation marks

---

## 9. Forbidden Patterns

- Purple→pink gradients
- Particle backgrounds
- Auto-rotating carousels
- Scroll hijacking
- Pure black (#000000) — use forest (#0A1F1C) instead
- Red color anywhere in UI (error states: amber/copper only)
- Orange + Teal combined
- `glass morphism` on solid backgrounds
- `ease`, `ease-in-out`, `linear` — use named cubic-bezier only
- Letter-by-letter text animation
- One giant shadow — use stacked micro-shadows

---

## 10. Component Baseline

### Button States

```
Idle    → [label]
Loading → [spinner · label]
Success → [✓ label]  (holds 1.5s then reverts)
```

### Card Hover

```
Default: E1 shadow, translateY(0)
Hover:   E2 shadow, translateY(-4px), transition: 250ms ease-out-expo
```

### Focus Ring

```
outline: 2px solid #D4A574
outline-offset: 2px
border-radius: 4px
```
