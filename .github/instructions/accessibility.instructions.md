---
description: "Use when writing UI components, forms, or interactive elements. Enforces WCAG 2.1 AA accessibility standards for keyboard navigation, screen readers, and inclusive design."
applyTo: "**/*.{tsx,jsx}"
---
# Accessibility Instructions

## Semantic HTML
- Use semantic elements: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>`
- Use `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- Use heading hierarchy (h1 → h2 → h3) without skipping levels
- Use `<ul>/<ol>` for lists, `<table>` for tabular data

## Keyboard Navigation
- All interactive elements must be focusable and operable via keyboard
- Logical tab order (avoid positive `tabIndex` values)
- Visible focus indicators on all focusable elements
- Escape key should close modals, dropdowns, and popups
- Arrow keys for navigation within composite widgets (tabs, menus)
- Enter/Space to activate buttons and links

## ARIA Labels
- Add `aria-label` or `aria-labelledby` to elements without visible text
- Use `aria-describedby` for supplementary descriptions
- Use `aria-live` regions for dynamic content updates
- Use `role` attributes only when semantic HTML is insufficient
- Add `aria-expanded` for collapsible content
- Add `aria-current` for current page in navigation

## Forms
- Every input MUST have an associated `<label>` (use `htmlFor`/`id`)
- Error messages linked with `aria-describedby`
- Required fields marked with `aria-required="true"`
- Group related fields with `<fieldset>` and `<legend>`
- Provide clear, specific error messages (not just "Invalid input")

## Images & Media
- All `<img>` tags must have descriptive `alt` text (or `alt=""` for decorative)
- Complex images need detailed descriptions
- Video requires captions and transcripts
- Audio requires transcripts

## Color & Contrast
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Never convey information through color alone
- Provide additional indicators (icons, patterns, text)

## Testing Checklist
- Navigate entire page using only keyboard
- Test with screen reader (VoiceOver on macOS)
- Verify focus management in modals and dynamic content
- Check color contrast with browser dev tools
- Validate with axe-core or similar automated tool
