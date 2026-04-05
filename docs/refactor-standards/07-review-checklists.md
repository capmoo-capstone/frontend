# Refactor Review Checklists

## Author Checklist

1. Feature internals do not self-import from feature barrel.
2. No stale compatibility import paths remain.
3. Query keys are centralized and reused.
4. Mutations invalidate relevant keys.
5. Types come from canonical feature type exports.
6. No duplicated domain literal unions remain.
7. Removed compatibility files have zero references.
8. TypeScript diagnostics are clean for touched feature(s).

## Reviewer Checklist

1. Layering is respected (component -> hook -> api).
2. Request, parse, and mapping concerns are separated.
3. Public feature barrel exports only intended contracts.
4. New utilities/selectors are correctly colocated.
5. Table helper extractions preserve behavior.
6. Existing feature behavior is unchanged unless explicitly requested.

## Fast Search Commands

Use these before approval:

1. Search for self-imports inside feature folders.
2. Search for deprecated compatibility paths.
3. Search for legacy hook module paths.

## Validation Gate

- TypeScript diagnostics must be clean for touched feature folders.
- If lint is temporarily broken in tooling, document lint blocker and rely on type diagnostics + focused runtime checks.
