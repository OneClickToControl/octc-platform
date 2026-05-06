# Agent Capability Provider — REGISTRY

Inventory of OneClickToControl LLC **Agent Capability Providers (ACP)**. Each productive row must match a manifest validated by [`schemas/octc-agent-provider.manifest.v1.json`](../../schemas/octc-agent-provider.manifest.v1.json) and CI [`.github/workflows/verify.yml`](../../.github/workflows/verify.yml).

## Conventions

- `id` must match the ACP manifest.
- `tier_target` and `tier_actual` update when [CONFORMANCE.md](CONFORMANCE.md) checklists close.
- `sensitivity:high` requires at least `L2`.
- `tools_allowlist_ref` is required for `L2+` and must be versioned.
- `sentry_project` required for `L3+`.
- In **internal** documentation, the `REGISTRY.md` table includes **`manifest_version`**: it must match the manifest `version` field (semver) in the `*-agents` repo.

## Organization inventory

**Not published here:** the list of real ACPs or private repo names (see [PUBLIC_REPO_POLICY.md](../security/PUBLIC_REPO_POLICY.md)). The **`octc-platform-internal`** companion (restricted) hosts three layers, all aligned to [PORTFOLIO.md](../PORTFOLIO.md):

| Layer | Location (internal) | Role |
|------|----------------------|-----|
| Manifest in each **`*-agents`** repo | `agents/<acp-id>/manifest.json` | **Normative SSOT** of the ACP (public JSON Schema). |
| **Automated** registry | `docs/agents/registry/<acp-id>.json` | **Operational / machine SSOT**: snapshot from `octc_acp_sync` (automated PRs). Does not replace the manifest; reflects it + sync metadata. |
| **Human** REGISTRY | [`docs/agents/REGISTRY.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/agents/REGISTRY.md) | Summary table for the org (includes **`manifest_version`** column, semver of manifest `version`); updated at milestones or when tiers, semver, or notable pointers change. |

**This file** (`octc-platform`) holds **policy, conventions, and examples** only; it does not duplicate productive rows or catalog JSON.

Operational runbook (smoke, merging registry PRs): [`ACP_REGISTRY_OPERATIONS.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/ACP_REGISTRY_OPERATIONS.md) in internal.

## Illustrative row (syntax only)

| id | owning_product | runtimes | tier_target | tier_actual | sensitivity | tools_allowlist_ref | sentry_project | owner | manifest_version | notes |
|----|----------------|----------|-------------|-------------|-------------|---------------------|----------------|-------|------------------|-------|
| example-product-acp | *(example; not a real ACP)* | cursor, http | L0 | L0 | low | `docs/agents/TOOLS_ALLOWLIST_L2.md` (path in ACP repo) | n/a | @1click2control | **0.1.0** | Manifest at `agents/example-product-acp/manifest.json` in the ACP repo. In internal, align `manifest_version` with that field. |

## How to register a new ACP

1. Create `agents/<acp-id>/manifest.json` in the ACP repo following the schema.
2. Add the row to the **internal REGISTRY** (human table) and align **PORTFOLIO** via PR to the private repo; **`docs/agents/registry/<acp-id>.json`** appears **only** when the `*-agents` repo is allowlisted and `octc_acp_sync` dispatch has run (automated PR on internal).
3. Set a realistic `tier_target` per [CONFORMANCE.md](CONFORMANCE.md).
4. Document sources/destinations in `docs/agents/RUNTIME_SYNC.md` when applicable.
5. If `sensitivity:high`, complete the corresponding section of [AGENT_THREAT_MODEL](../security/AGENT_THREAT_MODEL.md) first.
