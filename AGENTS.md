# Site Theme Guide

This document captures the visual language inferred from `src/app/cart/page.jsx` so future agents can build new pages that feel native to the site.

## Overall Feel

- Calm, minimal, and refined
- E-commerce focused with a soft editorial touch
- Neutral base colors with a single warm accent color
- Clean structure, light borders, and restrained motion

## Color Palette

- Page background: `#faf9f6`
- Card / panel background: `#ffffff`
- Soft surface / image placeholder: `#f0efed`
- Primary text: `gray-800` to `gray-900`
- Secondary text: `gray-500` to `gray-700`
- Muted text / metadata: `gray-400`
- Borders: `gray-200` to `gray-400`
- Primary accent / CTA: `#b5433a`
- Accent hover / active: `#9b3830`
- Success / free shipping: green text (`green-600`)

## Typography

- Headings use a serif family for a more premium, editorial look
- Body text uses a clean sans-serif style
- Section labels and buttons often use:
  - small font sizes
  - uppercase text
  - wide letter spacing
  - medium or semibold weight
- Product names are serif, compact, and slightly leading-tight
- Supporting details are smaller, muted, and lightweight

## Layout

- Page uses a soft off-white full-screen background
- Content sits inside a centered max-width container
- Generous vertical spacing between sections
- Desktop layouts often split into:
  - main content area on the left
  - summary / totals card on the right
- Panels are boxed with subtle borders rather than heavy shadows
- Use responsive stacking on small screens

## Common Components

- White card containers with light gray borders
- Thin divider lines between list items
- Uppercase micro-label headers
- Solid brick-red buttons for primary actions
- White or neutral bordered buttons for secondary actions
- Small icon buttons in muted gray
- Product rows with compact images and text metadata

## Interaction Style

- Hover states are subtle and color-driven
- Buttons shift slightly darker on hover
- Inputs use a simple border-focus treatment in the accent color
- Disabled controls reduce opacity rather than changing structure
- Motion is minimal and functional

## Spacing And Density

- The design is airy, but not sparse
- Use moderate padding inside cards
- Keep list items compact and readable
- Use consistent gaps between icon, image, text, and totals
- Text alignment matters, especially for cart-style summary rows

## Responsive Behavior

- Mobile should stack content vertically
- Desktop can use horizontal alignment and column headers
- On smaller screens, reduce complexity and keep actions easy to tap
- Preserve readability with smaller image sizes and tighter row layouts

## Reusable Page Pattern

When creating new pages for this site, prefer:

- soft neutral backgrounds
- serif display headings
- muted grayscale text hierarchy
- brick-red primary actions
- light borders instead of shadows
- clean, premium, editorial e-commerce styling

Avoid:

- bright saturated color palettes
- heavy gradients
- loud shadows
- overly futuristic or playful UI treatments
- dense layouts with too many competing accents
