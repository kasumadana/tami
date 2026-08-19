---
name: tami
description: AI Smart Tutor and interactive cybersecurity defense platform
colors:
  primary: "#d87a4a"
  primary-hover: "#c2653a"
  secondary: "#3d7a6b"
  surface: "#ffffff"
  surface-dark: "#1a1a1f"
  background: "#faf5f0"
  background-dark: "#0f0f12"
  text: "#2c2220"
  text-dark: "#f5ede4"
  safe: "#2e7d32"
  warning: "#e65100"
  danger: "#c62828"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "0.75rem 1.5rem"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: tami (Teman Aman Media Internet)

## 1. Overview

**Creative North Star: "The Friendly Guardian Lab"**

tami balances warm, welcoming educational companionship with clear, tactile cyber defense utilities. The design serves students (ages 8–15) by transforming complex digital security concepts into engaging Socratic discussions, interactive forensic inspections, and adaptive practice challenges. Rather than creating fear through hacker cliches or treating young learners like toddlers with babyish cartoon clutter, tami offers a grounded, reassuring workshop feel where curiosity is rewarded and mistakes are safe learning moments.

The interface prioritizes clarity, high touch ergonomics, and immediate feedback. Visual hierarchy is crisp and structured, utilizing purposeful color anchors (Red Panda Amber for active learning engagement and Sage Teal for shielding protection) over neutral canvas backgrounds in both light and dark themes.

**Key Characteristics:**

- **Approachable Confidence:** Warm, non-intimidating tones anchored by the inquisitive persona of Tami the Red Panda.
- **Socratic Layout Flow:** Interfaces emphasize guided questions, progressive disclosures, and interactive inspection tools before displaying summary verdicts.
- **Tactile State Semantics:** Unambiguous visual indicators for threat risk levels (`SAFE`, `SUSPICIOUS`, `DANGEROUS`) with multi-sensory feedback (badges, icons, and micro-animations).
- **Adaptive Ergonomics:** Generous touch targets ($\ge 44 \times 44\text{px}$), dynamic viewport scaling (`100dvh`), and full dark mode compatibility.

## 2. Colors

The palette combines organic warm amber tones with protective sage greens and crisp high-contrast neutrals.

### Primary

- **Red Panda Amber** (`#d87a4a` / `oklch(64.5% 0.145 42)`): Primary brand accent, primary buttons, interactive focus rings, active step indicators, and celebratory milestones.
- **Deep Amber Hover** (`#c2653a` / `oklch(58.2% 0.155 41)`): Primary hover and active interaction state.

### Secondary

- **Sage Shielding** (`#3d7a6b` / `oklch(52.8% 0.082 175)`): Protective security indicators, secondary actions, verified badges, and successful defense indicators.
- **Sage Muted** (`#2b574c` / `oklch(41.5% 0.075 174)`): Dark mode secondary accent and borders.

### Tertiary & Semantic Status

- **Risk Safe Green** (`#2e7d32` / `oklch(52.0% 0.145 142)`): Verified safe links, passed practice challenges, and validated security checks.
- **Risk Suspicious Amber** (`#e65100` / `oklch(59.5% 0.185 55)`): Warning badges, potential social engineering triggers, and prompt questions.
- **Risk Dangerous Red** (`#c62828` / `oklch(48.5% 0.210 28)`): Severe phishing indicators, dark pattern warnings, and malicious link detections.

### Neutral

- **Canvas Light** (`#faf5f0` / `oklch(96.8% 0.012 60)`): Warm off-white page background in light mode.
- **Canvas Dark** (`#0f0f12` / `oklch(15.2% 0.008 280)`): Deep dark neutral page background in dark mode.
- **Surface Light** (`#ffffff` / `oklch(100% 0 0)`): Elevated card and container background in light mode.
- **Surface Dark** (`#1a1a1f` / `oklch(20.5% 0.010 280)`): Elevated card and container background in dark mode.
- **Text Ink Light** (`#2c2220` / `oklch(24.5% 0.018 35)`): High-contrast primary body text in light mode.
- **Text Ink Dark** (`#f5ede4` / `oklch(94.2% 0.012 60)`): High-contrast primary body text in dark mode.
- **Border Subtle** (`#e7ded6` / `oklch(90.2% 0.012 60)`): Clean structural divider lines in light mode (`#2d2c33` in dark mode).

### Named Rules

**The Protective Accent Rule.** Primary amber is reserved for active engagement, interactive decisions, and student achievements; Sage Green is reserved for protective shield status.
**The High-Contrast Legibility Rule.** All text must exceed WCAG AA contrast (≥4.5:1 for body text, ≥3:1 for large display). Never use low-contrast muted gray for readable text.

## 3. Typography

**Display Font:** Geist Sans (`var(--font-geist-sans)`, with `system-ui, sans-serif` fallback)
**Body Font:** Geist Sans (`var(--font-geist-sans)`, with `system-ui, sans-serif` fallback)
**Label/Mono Font:** Geist Mono (`var(--font-geist-mono)`, with `monospace` fallback)

**Character:** Clean, precise, and highly legible contemporary grotesque typography paired with a dedicated technical mono font for URLs, code snippets, and threat metadata.

### Hierarchy

- **Display** (Bold 700, `clamp(2rem, 5vw, 3.25rem)`, Line Height: 1.15, Letter Spacing: `-0.02em`): Hero landing titles and major celebration banners.
- **Headline** (SemiBold 600, `clamp(1.5rem, 3.5vw, 2.25rem)`, Line Height: 1.25, Letter Spacing: `-0.015em`): Section headings and major feature titles.
- **Title** (SemiBold 600, `1.25rem` / 20px, Line Height: 1.4, Letter Spacing: `normal`): Card titles, module headers, and modal headings.
- **Body** (Regular 400, `1rem` / 16px, Line Height: 1.6, Letter Spacing: `normal`): Primary conversational AI text, curriculum reading content, and explanations. Capped at 65–75ch line length.
- **Label / Code** (Medium 500, `0.875rem` / 14px, Line Height: 1.4, Letter Spacing: `0.02em`): Badges, risk level tags, timestamps, code snippets, URL forensic displays.

### Named Rules

**The Balanced Reading Rule.** Apply `text-wrap: balance` on H1–H3 headings for even line distribution; apply `text-wrap: pretty` on educational articles to prevent orphans.

## 4. Elevation

tami uses clean tonal layering and subtle 1px border framing rather than heavy, blurry drop shadows. Depth is communicated through surface lightness shifts and crisp ambient bounding borders.

### Shadow Vocabulary

- **Card Ambient** (`box-shadow: 0 2px 8px -2px rgba(44, 34, 32, 0.06)`): Default subtle lift for interactive cards in light mode.
- **Floating Modal / Dropdown** (`box-shadow: 0 12px 32px -4px rgba(44, 34, 32, 0.12)`): High-priority dialogs, popovers, and floating inspector overlays.
- **Dark Surface Glow** (`box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08)`): Clean perimeter border replacement for dark mode surfaces.

### Named Rules

**The Layer-Over-Shadow Rule.** Surfaces rest flat with clean 1px borders (`border-tami-border`). Shadows appear only on floating overlays (dialogs, popovers) or upon hover/focus elevation.

## 5. Components

Components are built on `@cloudflare/kumo` primitives combined with Tailwind CSS v4 tokens for high consistency.

### Buttons

- **Shape:** Rounded corners (`1rem` / 16px radius, `rounded-2xl` / `rounded-xl`).
- **Primary:** Background `var(--tami-orange)`, text `#ffffff`, padding `0.75rem 1.5rem`, font-weight 600.
- **Hover / Focus:** Hover background `var(--tami-orange-hover)`, accessible outline focus ring (`2px solid var(--tami-orange)` with `2px offset`).
- **Secondary / Outline:** Background `var(--tami-surface)`, border `1px solid var(--tami-border)`, text `var(--tami-text)`, hover background `var(--tami-cream)`.
- **Ghost:** Transparent background, text `var(--tami-text)`, hover background `rgba(216, 122, 74, 0.08)`.

### Cards & LayerCards

- **Corner Style:** `1rem` (16px) radius (`rounded-2xl`).
- **Background:** `var(--tami-surface)`.
- **Border:** `1px solid var(--tami-border)` in light mode, `1px solid rgba(255, 255, 255, 0.1)` in dark mode.
- **Internal Padding:** `1.5rem` (24px) for standard containers; `1rem` (16px) for compact mobile cards.

### Chat Streamer & Socratic Tutor Bubble

- **Tami Persona Bubble:** Background `var(--tami-surface)`, border `1px solid var(--tami-border)`, subtle left avatar accent with Red Panda mascot badge. Rich Markdown rendering with sanitized HTML.
- **User Bubble:** Background `var(--tami-orange)`, text `#ffffff`, aligned right, rounded with comfortable speech-bubble corners (`rounded-2xl rounded-br-sm`).

### Threat Inspector Card (`/detector`)

- **Inspection View:** Dropzone with dashed border and drag-over highlight.
- **Result Badge:** Pill chip (`rounded-full`, font-mono uppercase) with semantic risk coloring (`bg-green-100 text-green-800` for SAFE, `bg-amber-100 text-amber-900` for SUSPICIOUS, `bg-red-100 text-red-900` for DANGEROUS).
- **OCR & Anomaly Highlights:** Interactive bounding boxes over suspicious visual regions with tooltip explanations.

### Inputs & Fields

- **Style:** Height `2.75rem` (44px min touch target), background `var(--tami-surface)`, border `1px solid var(--tami-border)`, radius `0.75rem` (12px).
- **Focus:** Border `var(--tami-orange)`, subtle ring `0 0 0 3px rgba(216, 122, 74, 0.2)`.

### Navigation & Top Bar

- **Style:** Fixed or sticky top navigation with subtle backdrop-filter blur (`backdrop-blur-md bg-opacity-80`), brand logo with Tami mascot icon, locale switcher (`ID` / `EN`), and theme toggle.

## 6. Do's and Don'ts

### Do:

- **Do** maintain strict WCAG AA contrast ratios (≥4.5:1 for body text) across both Light and Dark modes.
- **Do** ensure all interactive buttons and inputs meet the minimum 44x44px touch target size.
- **Do** frame AI chat interactions with Socratic guiding questions before giving any direct answers.
- **Do** keep every user-facing string internationalized through `next-intl` (zero hardcoded strings).
- **Do** use `@phosphor-icons/react` icons paired with clear text labels for status indicators.
- **Do** respect `prefers-reduced-motion` across all transition effects.

### Don't:

- **Don't** use dark-hacker clichés (green terminal text, matrix rain, skull icons, scary cyber sirens).
- **Don't** use generic AI cream/parchment monoculture with unreadable washed-out gray text.
- **Don't** use decorative side-stripe borders (`border-l-4`) or gradient text fills (`bg-clip-text`).
- **Don't** infantilize young teens (8–15 years) with toddler-level cartoon clutter or babyish language.
- **Don't** display raw, unformatted cybersecurity acronyms without intuitive contextual definitions.
- **Don't** invent arbitrary z-index values (use semantic z-index scale: dropdown, sticky, modal, toast).
