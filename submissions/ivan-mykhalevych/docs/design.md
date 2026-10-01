# Design tokens (v0.1)

Status: describes the design as implemented. The code is the source of truth; colour values are in
`src/app/globals.css`, so change a value there, not in components or here.

## Mood
A dark "code editor" feel with a warm Java-coffee accent. A light theme follows the
system setting (`prefers-color-scheme`). Dark is the default.

## Colour tokens
The values live only in `src/app/globals.css` (a dark set, and a light set under
`prefers-color-scheme: light`); this file does not repeat them, so they cannot drift. The tokens
and their use: `bg` page background, `surface` cards, `line` borders, `ink` main text, `muted`
secondary text, `accent` links, primary buttons and highlights, `accent-2` gradient partner of
`accent`, `on-accent` text on accent buttons, `good` correct answers, `bad` wrong answers and errors.

Every text and background pairing must reach a 4.5:1 contrast ratio in both themes; a measured
audit on 2026-10-01 found the light-theme button label at 3.58:1, which is why `on-accent` and the
light `accent-2` exist. Native dropdown option lists are themed too (`select option` and
`select option:checked` in `globals.css`), because the browser's default white list made the
selected language unreadable.

## Typography
- Headings and code: JetBrains Mono. Body: Geist Sans.
- Scale as used in the components: page title `text-3xl` (1.875rem), home hero `text-4xl`,
  `sm:text-5xl`, card title `text-xl` (1.25rem), body 1rem, captions and controls `text-sm` (0.875rem).

## Shape and motion
- Radius: 1rem (`rounded-2xl`) for cards, 0.75rem (`rounded-xl`) for buttons, options, inputs and menus.
- Cards use a 1px `line` border and a soft backdrop blur.
- Colour and opacity changes use Tailwind's default 150 ms transition; `prefers-reduced-motion`
  switches transitions and animations off.

## Background
Generated inline SVG (no external images, no licensing issues): a navy gradient, two
soft amber glows, faint Java-flavoured code fragments and a coffee-steam curve. It is
fixed behind all content, `aria-hidden`, and never carries information.

## Language switcher
A select in the header, left of the profile switcher, with the options "English" and
"Українська". Ukrainian text is about 15-25% longer than English, so every layout must wrap
instead of overflowing; level names (Junior, Middle, Senior) stay in Latin letters.

## Accessibility
- Body text contrast at least 4.5:1 against its surface in both themes.
- Correct/incorrect states are also conveyed by text ("Correct!" / "Not quite."), not
  colour alone.
- Visible focus ring: 2px `accent`.
