# Design tokens (v0.1)

Status: written before the visual implementation. Code reads these tokens from
`src/app/globals.css`; change a value there, not in components.

## Mood
A dark "code editor" feel with a warm Java-coffee accent. A light theme follows the
system setting (`prefers-color-scheme`). Dark is the default.

## Colour tokens

| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#0b1020` | `#fbf6ee` | page background |
| `surface` | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.75)` | cards |
| `line` | `rgba(255,255,255,0.12)` | `rgba(27,31,42,0.12)` | borders |
| `ink` | `#e8ecf6` | `#1b1f2a` | main text |
| `muted` | `#9aa4bf` | `#5b6478` | secondary text |
| `accent` | `#f59e0b` | `#c2410c` | links, primary buttons, highlights |
| `accent-2` | `#ea580c` | `#ea580c` | gradient partner for accent |
| `good` | `#22c55e` | `#15803d` | correct answer |
| `bad` | `#f87171` | `#b91c1c` | wrong answer |

Text on `accent` buttons is always `#1a1206` (dark) for contrast.

## Typography
- Headings and code: JetBrains Mono.
- Body: Geist Sans.
- Scale: page title 2.25rem, card title 1.25rem, body 1rem, caption 0.875rem.

## Shape and motion
- Radius: 1rem for cards, 0.75rem for buttons and options.
- Cards use a 1px `line` border and a soft backdrop blur.
- Answer reveal: 150 ms colour transition. Honour `prefers-reduced-motion`.

## Background
Generated inline SVG (no external images, no licensing issues): a navy gradient, two
soft amber glows, faint Java-flavoured code fragments and a coffee-steam curve. It is
fixed behind all content, `aria-hidden`, and never carries information.

## Accessibility
- Body text contrast at least 4.5:1 against its surface in both themes.
- Correct/incorrect states are also conveyed by text ("Correct!" / "Not quite."), not
  colour alone.
- Visible focus ring: 2px `accent`.
