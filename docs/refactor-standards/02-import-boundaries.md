# Import Boundary Rules

## Core Rule

Feature internals must not import from their own feature public barrel.

- Bad inside `features/projects/*`: `@/features/projects`
- Good inside `features/projects/*`: local relative imports such as `../types/index`

## Allowed Import Directions

- Pages can import from feature public barrel.
- Other features can import from feature public barrel.
- Feature internals can import from:
  - local modules in same feature.
  - shared app modules (`@/components`, `@/lib`, `@/context`, etc.).

## Forbidden Patterns

- Self-import from same feature barrel.
- Imports to removed compatibility files.
- Deep cross-feature internals access (for example importing another feature's private file paths).

## Refactor Safety Checks

Search patterns to clean before merge:

1. `from '@/features/<same-feature>'` inside same feature.
2. Known deprecated paths (for example old `types.ts` compatibility paths).
3. Legacy hook module paths replaced by split query/mutation modules.
