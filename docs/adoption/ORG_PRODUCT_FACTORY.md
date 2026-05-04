# Org product factory — public boundaries

OCTC operates **multiple product families** (`*-app`, `*-agents`, `*-workspace`) plus shared **public** standards in this repo (`@1c2c/*`, ADRs, reusable workflows, surface templates). A **meta-layer** ties those pieces together so the org can:

- stage initiatives (idea → explore → validation → productization → scale),
- choose **lanes** and **surfaces** deliberately,
- bootstrap families mechanically where scripts exist,
- record **lessons and drift** without polluting product repos.

## What stays public (`octc-platform`)

- **Contracts:** ADR-0003 monorepo / surfaces, ACP schemas, CLI behavior for `*-app` and public `init` scaffolds.
- **Reusable automation:** callable workflows (portfolio, ACP dispatch, workspace verify), scripts referenced by pins.
- **Documentation** that external consumers could need — **not** org secret names, **not** procedural guides that belong in private operational repositories.

## What stays outside this public repo

- **Disk bootstrap orchestration** (`bootstrap-product-family.sh`, materialize scripts), PORTFOLIO tables, allowlists, org-facing runbooks — maintained in operational repos in the same GitHub org (not hyperlinked from here per publication policy).
- **Org-factory repos** (agents + workspace for the *factory itself*) are **private org repositories** `octc-platform-agents` and `octc-platform-workspace`, materialized from operational templates in the same GitHub org; create and push them when activating the meta-layer (not hyperlinked procedural detail from here).

## Declarative control plane (`octc-paperclip`)

- **`companies/`** — declarative **line** configuration (budgets, roster, adapters) — **runtime not deployed** today; this is still honest versioned config.
- **`factory/initiatives/`** — **product-factory** declarations: lifecycle stage, lanes, surfaces, expectations. Consumed by companion tooling to suggest bootstrap commands — **no execution** from this data alone.

## Mental model

| Layer | Role |
|-------|------|
| **octc-platform** | Published standards & packages |
| **octc-paperclip** | Declarative policies + factory initiative manifests |
| **Operational repos (same org)** | Bootstrap scripts, lifecycle stage definitions, runbooks |
| **octc-platform-agents** | Org-level roles that analyze / propose factory evolution (not product behavioral SSOT) |
| **octc-platform-workspace** | Org factory memory: decisions, drift backlog, initiative state (not `<product>-workspace`) |
| **`<product>-agents`** | Behavioral truth per product |
| **`<product>-workspace`** | Product identity / memory / pointers |

## Related

- [ADR-0003 — monorepo / surfaces](../adr/ADR-0003-monorepo-cli-machine-ssot.md)
- [WORKSPACE_LANE — product workspace lane](WORKSPACE_LANE.md)
- [PRODUCT_FAMILY_INTERNAL — companion bootstrap scope](PRODUCT_FAMILY_INTERNAL.md)
