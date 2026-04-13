# Feature Architecture Standard

## Goal

Keep every feature internally cohesive and externally predictable.

## Required Feature Shape

Each feature should contain these modules when relevant:

- `api/`: request functions, response parsing, mapping.
- `hooks/`: query hooks, mutation hooks, UI state hooks.
- `components/`: feature UI only.
- `types/` or `types.ts`: feature types and schemas.
- `utils/`: reusable business selectors/helpers.
- `index.ts`: public API of the feature.

## Public API Rules

- Export only what other features/pages should use.
- Do not export temporary migration shims.
- Keep private internals unexported.

## Internal Layering

- API layer: fetch and parse backend contracts.
- Mapper layer: convert backend shape to domain/UI shape.
- Hook layer: compose API with TanStack Query.
- Component layer: render and interact; no direct API calls.

## Canonical Pattern For Medium/Large Features

- `api/index.ts`: orchestration exports.
- `api/<feature>.requests.ts`: HTTP and parse.
- `api/<feature>.mappers.ts`: transformation logic.
- `hooks/queryKeys.ts`: centralized query keys.
- `hooks/use<Feature>Queries.ts`: read hooks.
- `hooks/use<Feature>Mutations.ts`: write hooks.
