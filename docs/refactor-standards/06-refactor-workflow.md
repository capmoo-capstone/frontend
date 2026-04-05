# Refactor Workflow Standard

## Phase 1: Design and Scope

1. Define target architecture and boundaries.
2. Identify compatibility layers that may be temporary.
3. Define migration order for consumers.

## Phase 2: Build Canonical Modules

1. Add canonical modules (types index, split hooks, query keys, mapper/request layers).
2. Keep old compatibility modules only if required for staged migration.

## Phase 3: Migrate Consumers

1. Migrate internal feature consumers first.
2. Migrate external feature consumers second.
3. Keep changes incremental and verifiable.

## Phase 4: Remove Compatibility Artifacts

1. Search for remaining references.
2. Delete compatibility files only when no references remain.
3. Re-run diagnostics after deletion.

## Phase 5: Validation and Documentation

1. Verify no TypeScript errors for touched feature(s).
2. Verify boundary rules by search.
3. Update docs and feature public exports.

## Commit Strategy

Use small commits per phase:

1. Canonical module introduction.
2. Consumer migration.
3. Compatibility cleanup.
4. Docs and final validation.
