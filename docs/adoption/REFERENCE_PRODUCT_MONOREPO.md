# Product monorepo pattern (reference)

Human- and agent-readable contract for repos that **materialize** a digital product: multiple execution surfaces, data, quality, and traceability from business context to code.

This does not replace ADRs or PORTFOLIO: **it defines them and links to them**.

## Goals

1. Declare **`active_surfaces`** and **where they live** in the filesystem (`docs/architecture.md` or equivalent).
2. Keep **traceability** brand → strategy → product → features → architecture → ops → audits.
3. Avoid **drift** among repo docs, **CI/observability**, and **internal `PORTFOLIO`** when composition changes.
4. Let **new products** start from templates and checklists, not tribal memory.

## Canonical surfaces (`active_surfaces`)

**OCTC scope (`@1c2c/cli` `octc verify` / `octc add|sync surface`):** these definitions and versioned templates in **`@1c2c/cli`** apply to **product application** repos named **`*-app`** (monorepos delivering web, data, mobile, etc.). **` *-agents`** repos (ACP, skills, agent templates) and **` *-workspace`** repos (runtime/notes or parallel orchestration) have **separate governance**: do not place paths, jobs, or deliverables meant for those repos here without an explicit plan, or you will mix the product `*-app` SSOT.

**Machine-readable vocabulary and default globs:** [`packages/cli/lib/constants.mjs`](https://github.com/OneClickToControl/octc-platform/blob/main/packages/cli/lib/constants.mjs) (`ALLOWED_SURFACES`, `DEFAULT_PATH_GLOBS`). Keep the table below aligned with that file and **`.octc/monorepo.yaml`** in each `*-app`.

| Surface | Role | Typical directories | Notes |
|---------|------|---------------------|-------|
| `landing` | Public site / idea / waitlist | Paths or segmented app in `apps/web`, or `apps/landing` | Often the first deployment surface together with `docs/`. |
| `web` | Product app (auth, user data) | `apps/web` | Next.js WebSocket upgrades usually stay `web`; separate process → `api`. |
| `mobile` | Mobile client | `apps/mobile` | UX parity documented in `docs/design/`. |
| `ml` | Served inference / model | `apps/ml-service`, `services/ml`, … | HTTP contract documented; own deploy (container, PaaS). |
| `api` | Programmatic boundary **outside** `supabase/` | `apps/api`, worker, remote MCP, gRPC, dedicated WS | REST, SSE, gRPC, MCP server (HTTP/SSE). Excludes Edge Functions in `supabase/functions`. |
| `chat` | Conversational UI or backend | Routes, `apps/chat-web`, service | OCTC agent policies when applicable. |
| `data` | Supabase data platform | full `supabase/` tree | Migrations, RLS, **`functions/` (Edge Functions)**, seeds, CLI. |

**Edge Functions** under `supabase/functions` are **`data`**. Use **`api`** only if another programmatic boundary is deployed **outside** that tree.

**`docs/`** is not a deploy surface: it is a **cross-cutting** layer (precedes and informs decisions).

### Machine matrix (parity with `@1c2c/cli`)

| Surface | Role (summary) | Default CLI globs when `paths` omitted |
|---------|----------------|----------------------------------------|
| `landing` | Public / waitlist | `apps/landing/**`, `apps/web/**` |
| `web` | Product app | `apps/web/**` |
| `mobile` | Mobile client | `apps/mobile/**` |
| `ml` | Served inference | `apps/ml-service/**`, `services/ml/**` |
| `api` | Boundary outside `supabase/` | `apps/api/**`, `apps/chat_api/**`, `services/api/**` |
| `chat` | Conversational UI/backend | `apps/chat-web/**`, `apps/chat/**` |
| `data` | Supabase | *(requires `supabase/` directory; `verify` does not use default globs)* |

If the repo has **`packages/`** shared workspaces and declares consumer surfaces (`≠ data`), **`octc verify monorepo`** requires a glob covering `packages/**` in **`paths.<surface>`** for each consumer (see `@1c2c/cli` CHANGELOG).

### Machine-readable format (optional, CLI roadmap)

For **`octc verify monorepo`** (`@1c2c/cli` ≥ 0.2.0); **`octc add surface`** and **`octc sync surface`** from **0.3.0**: create `.octc/monorepo.yaml` from [`templates/monorepo/monorepo.yaml.example`](https://github.com/OneClickToControl/octc-platform/blob/main/templates/monorepo/monorepo.yaml.example); it must mirror the same table as this prose. Direction and schema: [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md) (**accepted**).

## Traceability (minimum chain)

```text
brand | market | research | strategy
    → decisions (ADR) / docs/memory or equivalent organ
    → product (PRD, roadmap, backlog, sync contracts with issue tracker if any)
    → docs/features ↔ code (apps, supabase, packages)
    → docs/architecture + docs/ops + ops/ (runbooks)
    → docs/audits (closure or explicit debt)
```

Rules:

- **Scope** change → update roadmap/backlog **and** link feature/architecture in the same cycle.
- No **sensitive data** or internal customer names in public repos: [`PUBLIC_REPO_POLICY`](../security/PUBLIC_REPO_POLICY.md).

## CI matrix (by surface and cost)

**Multi-surface repo** pattern (reference validated on org product monorepos):

| Pattern | What it covers | Notes |
|---------|----------------|-------|
| **Primary CI with `paths` filters** | Only build/test what changed (mobile, web, ml, RLS validation, etc.) | Document per workflow which paths trigger each job; `workflow_dispatch` can run everything. |
| **Docs-only CI** | When heavy CI skips markdown: parallel workflow for MD links, style, light governance | Catches doc regressions without long builds. |
| **OCTC agents** | Workflow scoped to `AGENTS.md`, `CLAUDE.md`, `.octc/**`, lockfile | `pnpm run octc:agents:verify` (or equivalent). |
| **Web quality** | Lint, unit tests, **e2e** (e.g. Playwright) when required | Scope CI env secrets in ops docs. |
| **Mobile quality** | `analyze`, tests; optional **goldens** with explicit update job | Coverage threshold if applicable — document number and policy in backlog or ADR; **SDK pin** (e.g. FVM/`.fvmrc`) recommended for stable CI. |
| **`ml` quality** | Python linter, tests, image build | Dockerfile and runtime env documented in `docs/ops`. |
| **`data` / RLS** | Tests exercising policies; regenerated client types aligned with migrations | Dedicated job or integrated; `supabase/**` paths + RLS tests in web when applicable. |

The exact matrix is **repo SSOT** (comments in `.github/workflows/*.y` + paragraph in `docs/architecture.md`).

## Observability

- Sentry projects: pattern `octc-<product>-<surface>` with `surface ∈ {landing, web, mobile, ml, api, chat, …}`.
- See [OBSERVABILITY.md](../observability/OBSERVABILITY.md) and templates under `templates/observability/`.

## Adding and removing a surface

**Add:** code + architecture table row + `docs/ops` + CI `paths` jobs + observability project + `PORTFOLIO` (`repo_surfaces`) entry in the same window as the structural change.

**Remove:** ADR if contracts break; remove apps and orphan turbo/workflow tasks; deprecate Sentry projects; no phantom rows in `active_surfaces`.

**Audit:** quarterly (or on release) compare `PORTFOLIO` ↔ `docs/architecture.md`.

## Edge inventory — “capable monorepo” parity

Capabilities already present in **reference product repos** (multi-app + data + automation). Use so new products do not miss gaps; mark N/A with justification per repo.

| Edge | Typical location | Surface / layer | On checklist |
|------|------------------|-----------------|--------------|
| Monorepo (Turborepo/npm/pnpm, engines) | root, `turbo.json` | cross-cutting | ✓ |
| Husky / lint-staged | root | cross-cutting | ✓ |
| Shared packages (types, SDK) | `packages/*` | cross-cutting | ✓ |
| Shared brand assets | `assets/` | cross-cutting | ✓ |
| Scripts: local/remote DB, cloud checks | `scripts/db`, `scripts/supabase` | `data` + dev | ✓ |
| Scripts: governance (MD links, style, repo rules) | `scripts/governance` | cross-cutting | ✓ |
| Scripts: i18n (hard-coded strings) | `scripts/i18n` | `web` + `mobile` | ✓ |
| Scripts: security (e.g. secret scan) | `scripts/security` | cross-cutting | ✓ |
| Scripts: issue tracker / project integration | `scripts/github` or equivalent | product | ✓ |
| Scripts: deploy helpers (e.g. step skipped for docs-only) | `scripts/vercel` or similar | `web` / CI | ✓ |
| Documented labs | `scripts/labs`, `docs/features/labs.md` | optional | ✓ |
| Operator runbooks at root | `ops/` | operations | ✓ |
| Ops docs under `docs/` | `docs/ops/` | operations | ✓ |
| Data dictionary | `docs/db/` | `data` | ✓ |
| Living architecture maps | `docs/architecture/` | cross-cutting | ✓ |
| ADRs / decision memory | `docs/memory`, `docs/decisions` or `docs/adr` | product | ✓ |
| Audits and explicit debt | `docs/audits`, linked items | quality | ✓ |
| Backlog ↔ issues contract | `docs/product/` (+ sync doc if any) | product | ✓ |
| `@1c2c/*` + `octc sync agents` / verify | `package.json`, workflows | platform adoption | ✓ |
| Canonical agent files | `AGENTS.md`, `CLAUDE.md` | platform adoption | ✓ |
| Auxiliary workflows (goldens, docs archival, project sync) | `.github/workflows/*` | quality / product / governance | ✓ (N/A if not used) |
| Edge Functions | `supabase/functions` | `data` | ✓ |
| Next API / light BFF routes | `apps/web/app/api` | `web` (unless separate process → `api`) | ✓ |
| External multi-platform client + parity | `docs/design/` | `mobile` + `web` | ✓ |

Any new repo may **subset** this list; non-negotiable is to **declare** it (architecture README + checklist) and keep **PORTFOLIO** aligned.

## Links

- [REPO_ARCHETYPES.md](REPO_ARCHETYPES.md) — composition shortcuts.
- [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md) — practical verification.
- [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md) — minimal tree and extensions.
- [GOLDEN_PATH.md](GOLDEN_PATH.md) — adoption order.
