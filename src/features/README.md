# Frontend Feature Alignment Rules

This file is the baseline rulebook for all folders under `src/features`.
Use it when creating, updating, or reviewing any feature.

## 1. Scope and Purpose

- Every domain must live in its own feature folder.
- A feature folder must own its UI, data hooks, API integration, and feature-specific types.
- Shared cross-feature UI belongs in `src/components` only if it is domain-agnostic.

## 2. Required Feature Shape

Each feature should follow this structure when applicable:

- `api/`: request functions, API parsing, and mappers.
- `hooks/`: TanStack Query hooks and feature state hooks.
- `components/`: feature UI components.
- `types/` or `types.ts`: schemas and feature types.
- `index.ts`: public feature exports only.

Recommended API split for medium/large features:

- `api/project.requests.ts`-style file for HTTP requests and response parsing.
- `api/project.mappers.ts`-style file for API-to-domain mapping.
- `api/index.ts` for orchestration and exported API functions.

## 3. Import Boundary Rules

- Feature internals must use local relative imports for internal modules.
- Do not import a feature from its own public barrel inside that feature.
  - Bad: `@/features/projects` from a file inside `features/projects`.
  - Good: local import such as `../types/index`.
- Other features may import from the target feature public barrel (`@/features/<feature>`).
- Avoid compatibility shim paths after migration. Use canonical modules.

## 4. Types and Schemas

- Use Zod schemas at API and form boundaries.
- Keep feature-specific types inside the feature.
- Prefer shared canonical types from the feature `types/index` barrel.
- Avoid duplicate literal unions when a feature type already exists.

## 5. Data Fetching Rules

- No direct API calls in components.
- Components must consume hooks from the same feature.
- Read operations belong in query hooks.
- Write operations belong in mutation hooks.
- Mutations must invalidate related query keys.
- Keep query keys centralized in a dedicated file (for example `hooks/queryKeys.ts`).

## 6. Component Rules

- Components should remain presentation-focused.
- Business decision logic should move to selectors/utils when reused.
- Shared table render logic should be extracted into helper modules if repeated.

## 7. Naming Rules

- Folders: kebab-case.
- React component files: PascalCase.tsx.
- Hook files: camelCase and start with `use`.
- Utility/API/type files: camelCase.ts.
- `index.ts` files are for exports only.

## 8. Feature Public API Contract

Each feature `index.ts` should export:

- Public components needed by pages or other features.
- Public hooks used outside the feature.
- Public types intentionally shared across features.

Each feature `index.ts` should not export:

- Temporary migration shims.
- Private internals used only within the feature.

## 9. Validation Checklist (Before Merge)

Run these checks for the changed feature:

1. No TypeScript errors in the feature folder.
2. No self-import from the same feature barrel.
3. No stale imports to removed compatibility files.
4. Query keys and invalidation paths are consistent.
5. New types are exported from canonical type entry points.

## 10. Migration Rule

When refactoring a feature:

1. Introduce new canonical modules.
2. Migrate all consumers.
3. Remove compatibility layer only after search and diagnostics are clean.
4. Re-run diagnostics for the full feature folder.

This document is the default alignment rule for all current and future frontend features.
