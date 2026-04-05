# Component and Table Patterns

## Component Boundaries

- Presentational components should focus on rendering.
- Move repeated decision logic to selectors/utils.
- Keep dialogs/forms typed with schema-backed models.

## Shared UI Rules

- Domain-agnostic UI belongs in `src/components`.
- Feature-specific UI belongs in `src/features/<feature>/components`.

## Table Patterns

- Use TanStack Table for data grids.
- Extract repeated table header/cell rendering into helpers.
- Keep row-action authorization/business checks in selectors/utils.

## Editable Table Rule

- For editable cells, use local state and commit on blur.
- Avoid writing to parent table state on each keystroke.

## Styling Rule

- Use Tailwind utility classes.
- Use `cn()` for conditional class merging.
- Avoid inline styles unless truly dynamic values are required.
