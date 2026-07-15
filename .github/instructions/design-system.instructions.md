---
description: "Use when writing UI components, styling, or working with the design system. Enforces consistent colors, spacing, typography, and component patterns across the application."
applyTo: "**/*.{tsx,jsx,css,scss}"
---
# Design System Instructions

## Consistency Rules
- ALWAYS use design tokens/CSS variables for colors, spacing, and typography
- NEVER use hardcoded hex/rgb values — reference the design system
- Use the project's component library before creating custom components
- Follow the established layout patterns (grid, flex configurations)

## Color System
- Use semantic color variables: `--color-primary`, `--color-secondary`, `--color-error`, `--color-success`, `--color-warning`
- Use surface colors for backgrounds: `--color-surface`, `--color-surface-elevated`
- Use text colors: `--color-text-primary`, `--color-text-secondary`, `--color-text-disabled`
- Dark mode: ensure all colors reference CSS variables that adapt to theme

## Spacing
- Use spacing scale: `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (16px), `--spacing-lg` (24px), `--spacing-xl` (32px), `--spacing-2xl` (48px)
- Maintain consistent padding/margin using the scale
- Use gap property for flex/grid layouts

## Typography
- Use type scale variables: `--font-size-xs`, `--font-size-sm`, `--font-size-md`, `--font-size-lg`, `--font-size-xl`
- Use font weight variables: `--font-weight-regular`, `--font-weight-medium`, `--font-weight-bold`
- Headings use defined hierarchy (h1-h6 with consistent sizing)

## Component Patterns
- Buttons: use existing Button component with variant props (`primary`, `secondary`, `danger`, `ghost`)
- Forms: use form field wrappers with consistent label/error styling
- Cards: use Card component with consistent padding and border-radius
- Modals: use Modal component with consistent overlay and animation
- Tables: use Table component with consistent headers and row styling

## Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Use responsive utilities consistently
- Test all components at each breakpoint

## Do NOT
- Create one-off color values
- Use inline styles for things the design system covers
- Override component library styles with `!important`
- Mix different spacing systems in the same view
