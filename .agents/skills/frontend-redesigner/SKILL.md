---
name: frontend-redesigner
description: Layout-only frontend redesign workflow for existing apps, pages, dashboards, components, and screens. Use when asked to improve UI/UX, redesign a frontend, make an interface less generic, reduce AI slop, improve hierarchy, spacing, responsive behavior, density, navigation, or visual polish while preserving the existing color theme, design tokens, font family, functionality, routes, forms, state, API calls, permissions, accessibility semantics, and user workflows.
---

# Frontend Redesigner

## Goal

Improve the layout and information architecture of an existing frontend without rebranding it or changing what it does.

Treat the current colors, typography, data flow, and feature set as constraints. The output should feel more intentional, easier to scan, and more usable while remaining recognizably the same product.

## Hard Constraints

- Preserve the existing color theme, CSS variables, design tokens, dark/light mode behavior, and brand accents.
- Preserve the existing font family stack. Adjust size, weight, line height, spacing, and hierarchy only when needed.
- Preserve all functionality: routes, navigation targets, form fields, validation, filters, sorting, actions, permissions, API calls, state transitions, keyboard behavior, and empty/loading/error states.
- Do not remove controls, links, data columns, status indicators, labels, or affordances unless the user explicitly asks.
- Do not replace working components with static mockups.
- Do not introduce a landing page when the existing screen is an app, tool, dashboard, editor, or workflow surface.
- Do not add decorative gradients, blobs, glassmorphism, stock-like imagery, oversized cards, or generic marketing sections just to make the UI look redesigned.

## Workflow

1. Inventory the current screen before editing.
   Identify the routes/components involved, existing design tokens, font stack, responsive breakpoints, data dependencies, user actions, and current state coverage.

2. Define the layout problem.
   Look for weak hierarchy, poor grouping, awkward alignment, excessive whitespace, cramped controls, unclear primary actions, inconsistent spacing, low scanability, bad mobile stacking, or controls that move unexpectedly.

3. Redesign structure first.
   Improve page regions, navigation placement, toolbars, grids, table layout, filter placement, form grouping, panel widths, sticky areas, and responsive ordering before touching visual styling.

4. Preserve theme while improving polish.
   Reuse existing tokens and classes. If new spacing or layout tokens are needed, derive them from nearby conventions. Keep colors and fonts aligned with the existing system.

5. Keep every behavior wired.
   When moving UI, carry event handlers, refs, form registration, accessibility labels, loading/error rendering, disabled states, test ids, and analytics hooks with it.

6. Verify visually and functionally.
   Run available tests and linters. For UI work, start the app when practical and inspect desktop and mobile viewports for overlap, clipped text, broken controls, missing states, or layout shifts.

## Layout Standards

- Prefer dense, organized, work-focused layouts for operational tools and dashboards.
- Use clear page regions: header or toolbar, primary content, supporting panels, and contextual actions.
- Align related controls and data. Avoid scattered buttons and isolated filters.
- Make primary actions easy to find without making every action visually loud.
- Use cards only for repeated items, modals, or genuinely framed tools. Avoid cards inside cards.
- Use stable dimensions for boards, grids, tiles, icon buttons, tabs, toolbars, and tables so hover states and dynamic content do not resize the layout.
- Ensure labels and values fit their containers at mobile and desktop sizes. Prefer wrapping or layout changes over tiny text.
- Preserve accessibility semantics when changing markup. Keep headings in logical order and keep labels associated with controls.

## Verification Checklist

Before finishing, confirm:

- Existing user workflows still work end to end.
- No route, control, form field, column, state, or action disappeared.
- Existing colors, theme variables, and font family are still in use.
- Desktop and mobile layouts are usable without overlap or clipped text.
- Loading, empty, disabled, error, and success states still render.
- Tests, type checks, and lint commands that are available and relevant have been run, or any inability to run them is reported.
