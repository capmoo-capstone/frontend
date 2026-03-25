# Component Structure Guide

This guide explains how we organize React components in this repository.
The aim is to help you decide quickly where to create a component and how complex it should be.

## Component Layers in This Project

We use three layers of components:

1. Shared UI primitives
2. Shared app components
3. Feature-specific components

This layering keeps business logic close to features while keeping base UI reusable.

## 1) Shared UI Primitives (`src/components/ui`)

Purpose:

- Build blocks used throughout the app
- Usually style-focused and low business logic

Examples already in this repo:

- form and input controls (`input`, `select`, `checkbox`, `textarea`)
- containers (`card`, `dialog`, `sheet`, `tabs`, `table`)
- feedback and display (`badge`, `skeleton`, `tooltip`, `sonner`)

Rules:

- Keep these generic and reusable
- Avoid feature-specific terms like project, vendor, budget
- Prefer typed props and small APIs

## 2) Shared App Components (`src/components`)

Purpose:

- Reusable components that are broader than one feature but not low-level primitives

Current examples:

- `guards/PermissionGuard.tsx`
- `sidebar/app-sidebar.tsx`
- cross-feature helpers like date range filter and export toolbar

Rules:

- Good place for app-level composition
- Avoid embedding feature-only business logic

## 3) Feature Components (`src/features/<feature>/components`)

Purpose:

- UI and interactions tied to one domain

Example feature patterns from `projects`:

- page sections (`ProjectToolbar`, `ProjectStats`, `ProjectFilterPanel`)
- dialogs (`dialogs/AddAssigneeDialog`, `dialogs/EditProjectDialog`)
- table modules (`tables/SharedColumns`, `tables/DataTable`, assigned/unassigned table folders)

Rules:

- Keep feature logic inside feature components
- Use feature hooks for API/state orchestration
- Reuse shared primitives from `src/components/ui`

## Suggested Component Taxonomy

Use these categories when naming and placing components:

- Presentational components
  - mostly props in, JSX out
  - no direct API calls
- Container components
  - wires hooks, transforms data, handles states
- Dialog/overlay components
  - grouped under `components/dialogs`
- Data grid components
  - grouped under `components/tables`
- Guard components
  - route/action access rules, usually shared or feature guard folders

## Recommended Folder Shape for Complex Features

```text
components/
  dialogs/
  guards/
  tables/
  index.ts
  <feature-section>.tsx
```

When to create subfolders:

- Create `dialogs` when a feature has multiple modals
- Create `tables` when table logic and columns grow large
- Create `guards` when feature-level permission/access checks are needed

## Component Design Guidelines

### Keep components focused

- One clear responsibility per component
- If a component is too large, split it into a container + presentational parts

### Keep data flow explicit

- Fetch data in hooks (usually in feature `hooks`)
- Pass data down as props
- Keep mutation and invalidation near container-level components

### Handle loading and error states consistently

- Show loading fallback for async sections
- Show clear error UI instead of failing silently

### Type props strictly

- Use explicit prop types
- Avoid `any`
- Prefer unions for constrained variants

## Example Decision Guide

You need a new project card used only on project pages:

- Place it in `src/features/projects/components`

You need a generic button-like control used across many features:

- Place it in `src/components/ui`

You need a role-based route blocker used by multiple modules:

- Place it in `src/components/guards`

## Import and Export Convention

- Export commonly used feature components from `src/features/<feature>/index.ts`
- Avoid deeply importing private internals from outside the feature
- Use alias imports with `@/...`

## Common Mistakes to Avoid

- Putting feature-specific business logic in shared UI primitives
- Calling APIs directly in many small presentational components
- Repeating similar dialog/table implementations without extracting reusable parts
- Creating very generic components too early without real reuse

## Final Rule of Thumb

Start specific, then generalize only after real reuse appears.
This keeps code simple for juniors and prevents over-engineering.