# Frontend Architecture Guide

This document explains how the frontend is structured and why we made these choices.
The goal is to help you understand the system quickly, not just memorize file locations.

## 1) High-Level Folder Structure

Main application code is in `src`.

### `src/api`

- API helpers and data-access functions
- Why: keeps HTTP and backend contracts out of UI components

### `src/features`

- Domain-focused modules (`projects`, `organization`, `auth`, `budgets`, `vendors`, etc.)
- Why: feature-first organization scales better than one giant shared folder

Typical feature layout includes:

- `api`
- `hooks`
- `components`
- `types`
- `index.ts` exports

### `src/pages`

- Route-level pages
- Why: pages compose features into full screens

### `src/components`

- Shared reusable UI and cross-feature components
- Includes guards, sidebar, and base UI wrappers

### `src/routes`

- Routing configuration
- Splits public and private app flows

### `src/context`

- Global React context providers (currently auth/session)

### `src/lib`

- Shared utilities and helpers (`axios`, permissions, class helpers)

### `src/types`

- Shared types used across multiple features

## 2) State Management Strategy

We separate state by responsibility.

### Server state: TanStack Query

Used for data from APIs (projects, departments, units, budgets, and more).

Why this matters:

- API data can become stale
- Multiple screens may need the same data
- Caching and refetch behavior should be consistent

How it works in this repo:

- Query client is created once in `src/main.tsx`
- Default query options include:
  - `staleTime = 5 minutes`
  - `retry = 1`
- Query hooks live inside each feature, for example:
  - `src/features/projects/hooks/useProjects.ts`
  - `src/features/organization/hooks/useOrganization.ts`
- Mutations invalidate related query keys after success

Common pattern:

1. Read data with `useQuery` using clear query keys
2. Write data with `useMutation`
3. In `onSuccess`, invalidate related keys so UI refreshes automatically

### Client/UI state

Used for local interactions like dialog visibility, sort order, search text, and filter panel toggles.

Common tools:

- `useState` for local state
- `useMemo` and `useCallback` for stable derived values and handlers
- `AuthContext` for app-level session state

Why this split helps:

- Prevents mixing temporary UI state with server caching concerns
- Makes components easier to reason about and test

## 3) Routing Overview

Routing lives in `src/routes`.

Main flow:

1. `AppRouter` checks auth state from `AuthContext`
2. If authenticated, app renders `PrivateRoutes`
3. If not authenticated, app renders `PublicRoutes`

### Public routes

- Login and vendor form
- Wrapped with `PublicLayout`

### Private routes

- Main app pages under `/app/*`
- Wrapped with `AppLayout`
- Route-level permission checks via guard components (for example `PermissionGuard`)

Why this design:

- New developers can quickly see where access decisions happen
- Public and private experiences are separated clearly
- Lazy loading helps reduce initial app startup work

## 4) Complex UI Pattern: Data Grids with TanStack Table

For data-heavy screens, we use TanStack Table.

How tables are usually built:

1. Define typed row model and columns
2. Keep sorting/pagination/filter state in component state
3. Build table instance with `useReactTable`
4. Render through shared table shell components

What this gives us:

- Strong typing for column cells and row data
- Reusable table shell with feature-specific columns
- Consistent sorting and pagination behavior across pages

Examples in this repo:

- `src/features/projects/components/AllProjectTable.tsx`
- `src/features/projects/components/tables/assigned-table/AssignedTable.tsx`
- `src/features/finance/components/FinanceTable.tsx`

Why we chose it:

- Procurement workflows are data-heavy and table-centric
- TanStack Table is headless, so we keep full control of UX while reusing logic

## 5) Practical Architecture Rules

- Add domain behavior under the correct feature folder
- Keep API calls and Zod parsing in feature API/type layers
- Keep query and mutation hooks inside feature hooks
- Keep page components mostly orchestration/composition
- Use guards for permission access instead of scattered redirect logic

Following these rules keeps the codebase predictable for everyone.
