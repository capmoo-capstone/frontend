# Development Guide

This guide explains how we write code in this repository.
If you are junior or new to React + TypeScript, this is your safe starting point.

## 1) Core TypeScript Conventions

### 1.1 Use strict typing everywhere

- Strict TypeScript is enabled
- Avoid `any` unless there is a strong, reviewed reason
- Prefer:
  - explicit interfaces/types for props and payloads
  - union types for controlled values
  - `unknown` + safe narrowing when needed

### 1.2 Type props clearly

Preferred pattern:

```tsx
type StatusBadgeProps = {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

export function StatusBadge({ label, tone = 'default' }: StatusBadgeProps) {
  return <span>{label}</span>;
}
```

Why:

- Easier for teammates to understand component API
- Safer refactors and better autocomplete

### 1.3 Keep feature types near the feature

- Put domain types in feature `types`
- Re-export from feature `index.ts` only when intended for wider use

### 1.4 Validate server data at boundaries

- Use Zod schemas in feature API/type layers
- Parse responses before UI consumes data

Why:

- Prevents malformed backend data from silently breaking UI
- Gives safer assumptions in components and hooks

### 1.5 Use path aliases

- Import from `@/...` rather than deep relative chains

## 2) Practical Example: Create a New Component

Scenario: add a reusable card in the projects feature.

### Step 1: Create the component file

Path: `src/features/projects/components/ProjectSummaryCard.tsx`

```tsx
import { cn } from '@/lib/utils';

type ProjectSummaryCardProps = {
  title: string;
  value: string | number;
  helperText?: string;
  className?: string;
};

export function ProjectSummaryCard({
  title,
  value,
  helperText,
  className,
}: ProjectSummaryCardProps) {
  return (
    <section className={cn('bg-card rounded-md border p-4', className)}>
      <h3 className="text-muted-foreground text-sm">{title}</h3>
      <p className="text-primary mt-1 text-2xl font-semibold">{value}</p>
      {helperText ? <p className="text-muted-foreground mt-2 text-xs">{helperText}</p> : null}
    </section>
  );
}
```

### Step 2: Export it from feature index

Update `src/features/projects/index.ts` and include `ProjectSummaryCard` in component exports.

### Step 3: Use it in a page or feature container

Use in one of these places:

- `src/pages/projects/ProjectList.tsx`
- Another projects component that orchestrates section-level UI

### Step 4: Keep data flow clean

- Fetch data in TanStack Query hooks
- Pass typed values into presentational components as props
- Avoid direct API calls inside small display-only components

## 3) Common Pitfalls in This Repository

### 3.1 Known lint configuration issue

At the moment, `npm run lint` may fail with:

- `TypeError: tseslint is not a function`

What to do:

- Use `npm run build` as the reliable validation gate for now
- Coordinate ESLint config fixes in a dedicated PR

### 3.2 Missing query invalidation after mutations

If a mutation succeeds but keys are not invalidated, stale data remains on screen.

Always ask:

- Which list/detail queries are affected?
- Which query keys need invalidation?

### 3.3 API configuration confusion

If behavior seems wrong, verify:

- `.env` values
- API base URL
- Expected backend environment

### 3.4 Missing `enabled` guards in queries

Queries that require IDs/dates should use `enabled` to avoid invalid calls.

### 3.5 Auth payload shape mismatch

Auth state is loaded from `localStorage` (`nexus_user`) and validated.
Unexpected payload shape can break auth behavior.

## 4) Formatting, Checks, and Pull Request Workflow

### 4.1 Format code

```bash
npm run format
```

Note: this script currently formats `src` only.

### 4.2 Run quality checks

Recommended order:

```bash
npm run build
npm run lint
```

Current reality:

- `build` is the reliable must-pass check
- `lint` may fail due to the known config issue above

### 4.3 Before opening a Pull Request

Checklist:

- New code is placed in the correct feature module
- Types are explicit and `any` is avoided
- Loading and error states are handled for async screens
- Related TanStack Query keys are invalidated after mutations
- `npm run build` passes
- `npm run format` has been run
- Key user flows were manually tested

### 4.4 PR description template

```md
## What changed

-

## Why this change

-

## How I tested

- [ ] npm run build
- [ ] npm run format
- [ ] Manual test steps listed

## Screenshots or recordings

-

## Risks / follow-up

-
```

## 5) Team Mindset

Ask questions early. Small clarifications now prevent expensive bugs later.
If something is unclear, write your current understanding and ask for confirmation.
That is excellent engineering practice.
