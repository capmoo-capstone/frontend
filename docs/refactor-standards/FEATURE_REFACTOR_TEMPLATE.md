# Feature Refactor Template

Copy this template into your PR description when refactoring a feature.

## 1. Scope

- Feature: `<feature-name>`
- Goal: `<what is being standardized>`
- Out of scope: `<explicit exclusions>`

## 2. Architectural Changes

- New canonical modules:
  - `<file>`
- Updated modules:
  - `<file>`
- Removed compatibility modules:
  - `<file>`

## 3. Boundary Changes

- Internal imports normalized: Yes/No
- External consumers migrated: Yes/No
- Public barrel reviewed: Yes/No

## 4. Validation

- Type diagnostics result:
- Search checks performed:
  - self-import check
  - compatibility-path check
  - legacy-hook-path check

## 5. Risk Review

- Behavioral risks:
- Deferred follow-ups:

## 6. Rollback Notes

- Files to revert if needed:
- Compatibility restore plan (if required):
