# Deprecation policy

How `@1c2c/*` packages, templates, ACPs, and integrations are deprecated.

## `@1c2c/*` packages

1. RFC with rationale and migration plan.
2. Major release with `console.warn` (or equivalent) on APIs to be removed.
3. Minimum 6 months of support with critical patches.
4. Next major: remove.
5. Final tag `vX.Y.Z-final` and entry in this file.

## Templates (`@1c2c/agent-templates`)

- Major changes require a migration tool (`octc-templates migrate`) or explicit CHANGELOG instructions.
- Consumers have 90 days to adopt; before that they move to SCORECARD alert.

## ACPs

- An ACP may be archived after 90 days without use and REGISTRY confirmation.
- Manifests stay versioned; code moves under `archived/`.

## Integrations (CATALOG)

- Remove from CATALOG with a note in [HISTORY.md](../audit/HISTORY.md) and documented migration.

## Register

Each deprecation gets a dated entry with type, scope, and link to the RFC/ADR.

| date | item | type | link |
|-------|------|------|--------|
|       |      |      |        |
