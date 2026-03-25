# Project Structure Guide

This guide explains where code should live in this frontend project and why.
If you are new to the codebase, use this as your map before writing new files.

## Goals of This Structure

- Keep related code together so changes are easier to make safely
- Reduce confusion about where new files should be created
- Make onboarding faster for junior developers
- Keep feature work isolated and maintainable

## Root-Level Frontend Structure

The frontend folder is organized around build tooling, docs, and source code:

- `docs` - onboarding and engineering documentation
- `public` - static files served directly
- `src` - all application source code
- `package.json` - scripts and dependencies
- `vite.config.ts` - Vite setup and alias config
- `tsconfig.*.json` - TypeScript settings
- `eslint.config.js` and `.prettierrc` - code quality and formatting rules

## Source Structure (`src`)

### `src/main.tsx`

- Application entry point
- Sets up providers such as TanStack Query

### `src/App.tsx`

- Top-level app shell
- Wires app-wide providers and router

### `src/routes`

- Route configuration and flow control
- Splits public and private route trees

### `src/pages`

- Route-level pages
- Pages should orchestrate feature components, not contain all business logic

### `src/features`

- Domain modules (for example `projects`, `organization`, `dashboard`, `vendors`)
- This is where most business logic and feature UI belong

### `src/components`

- Shared components reused by multiple features
- Includes shared guards, sidebar, and base UI primitives

### `src/context`

- App-wide React context providers
- Current example: authentication/session context

### `src/lib`

- Shared utilities and app services
- Examples: axios setup, class name helper, permission helpers

### `src/api`

- Cross-feature API helpers when needed
- Prefer feature-local API modules first; keep global API layer minimal

### `src/types`

- Shared type definitions used across multiple features

### `src/hooks`

- Cross-feature hooks
- Prefer feature-local hooks inside `src/features/<feature>/hooks` when hook is feature-specific

### `src/layouts`

- Reusable page layouts (`AppLayout`, `PublicLayout`)

### `src/assets`

- Static app assets imported by source files

## Recommended Feature Module Pattern

When creating or expanding a feature, use this shape:

```text
src/features/<feature>/
  api/
  components/
  hooks/
  types/
  index.ts
```

What each folder does:

- `api` - request functions and response parsing/validation
- `components` - feature-specific UI
- `hooks` - query/mutation hooks and feature state helpers
- `types` - feature data models and payload types
- `index.ts` - controlled exports for easier imports in pages

## Where to Add New Code

- New screen-level route page: `src/pages`
- New business logic for a domain: `src/features/<feature>`
- New reusable primitive UI: `src/components/ui`
- New shared utility/helper: `src/lib`
- New app-level provider: `src/context`
- New route definitions/guards: `src/routes` or `src/components/guards`

## Practical Rules for Consistency

- Keep API calls out of presentational UI components
- Keep route pages focused on composition and screen flow
- Keep feature exports explicit in each feature `index.ts`
- Keep shared components generic; feature-specific UI should stay in the feature
- Prefer path alias imports (`@/...`) over long relative paths

## Quick Checklist Before Creating a File

- Is this used in one feature only?
  - Put it in that feature module
- Is this reused across multiple features?
  - Put it in shared `src/components` or `src/lib`
- Is this tied to one route/screen?
  - Put the page in `src/pages` and compose feature components

Following this guide keeps the project predictable and easier for everyone to maintain.