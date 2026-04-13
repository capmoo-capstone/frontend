# Query and API Patterns

## Non-Negotiable Rules

- No direct API calls inside components.
- Queries and mutations must run via feature hooks.
- Query keys must be centralized.
- Mutations must invalidate relevant query keys.

## Query Key Policy

- Define all keys in one `queryKeys.ts` file per feature.
- Use deterministic key factories.
- Reuse the same key factory in both hooks and invalidation logic.

## API Layer Responsibilities

- Request module:
  - Send HTTP requests.
  - Parse responses with schemas.
- Mapper module:
  - Normalize parsed API payloads for UI/domain use.
- API index module:
  - Expose orchestrated feature API methods.

## Hook Split Policy

- `use<Feature>Queries.ts`: read-only hooks.
- `use<Feature>Mutations.ts`: write hooks.
- Additional hook files only for feature-local UI state or filters.

## Error and Loading Handling

- Keep loading/error states in feature-level containers.
- Presentational components should receive already-normalized data.
