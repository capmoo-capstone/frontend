# Types and Validation Standards

## Type Sources

- Use Zod schemas for API/form boundaries.
- Infer TypeScript types from schemas when possible.
- Keep feature-specific types in the feature.
- Place shared global types only in `src/types` when truly cross-cutting.

## Naming Rules

- Schema names: `XSchema`.
- Inferred types: `X` or explicit contract names like `XPayload`.
- Avoid ad-hoc literal unions when canonical feature types already exist.

## Canonical Exports

- Export feature type contracts from `types/index` (or feature type entrypoint).
- Keep one canonical type per concept (status, urgency, payloads).

## Migration Guidance

- During migration, avoid dual definitions of the same domain type.
- Replace duplicated literals with canonical exported type aliases.
- Remove compatibility type shims only after all imports migrate.
