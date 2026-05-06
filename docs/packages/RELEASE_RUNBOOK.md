# Runbook — publishing `@1c2c/*` (Changesets + `release.yml`)

This document describes the **actual operational path** in this repository. It does **not** claim “fully automatic release” while policy locks exist (required reviews, CODEOWNERS, rulesets) that code cannot override.

## Bottleneck report (summary)

### A. Already automated (no human step at that stage)

- Push to `main` → `release.yml` installs, tests, builds, runs `changesets/action`.
- With pending `.changeset/*.md` files on `main`: the action versions on `changeset-release/main` and keeps a PR to `main` with fixed title **`chore: release packages`**.
- With no pending changesets and local package versions ahead of the registry: `changeset publish` via **OIDC** + provenance.

### B. Still blocking low friction

- The mechanical PR must be **merged** into `main`; it touches `packages/**` (CODEOWNERS).
- Org rules may require **approval** before merge; `GITHUB_TOKEN` **cannot** substitute that approval for the dedicated mode that merges with another identity.
- **`--admin` / administrative merge** is **not** part of the intended design: only **incidents** or explicit policy outside this runbook. The intended path is **GitHub App** (preferred) or a narrowly scoped PAT (residual).

### C. Under repository control (implemented or documented here)

- Bounded mechanical PR: `changeset-release/main` → `main`, title **`chore: release packages`**, author **`github-actions[bot]`**, not a fork ([`release-pr-automerge.yml`](../../.github/workflows/release-pr-automerge.yml)).
- Default auto-merge with `GITHUB_TOKEN`, or dedicated mode with a **GitHub App installation token** generated per run (preferred), or a static PAT (second choice).

### D. Policy only / outside YAML

- Registration of the **App bot** (e.g. `your-app-slug[bot]`) with **effective** permission to merge to `main` (e.g. “allow specific actors to bypass required pull request reviews”, as GitHub permits).
- Rules blocking merges until checks pass (the workflow waits on checks with `gh pr checks --watch`).

## Governance comparison (explicit recommendation)

| | **1) GitHub App + installation token in CI (preferred)** | **2) Broad ruleset exception (not recommended first)** |
|---|----------------------------------------------------------|--------------------------------------------------------|
| **Risk** | Medium: App private key in secret; short (~1h) token per run. | High if the rule is not surgical (GitHub rarely filters by exact PR shape). |
| **Audit** | Strong: installed App, `slug[bot]` actor, workflow logs. | Depends on rule design; often weaker traceability. |
| **Friction** | Medium (create App, install, secrets/variables, align policy). | Low after agreeing the rule; higher maintenance/risk. |
| **Blast radius** | Limited if the App is installed only on this repo with minimal permissions; stolen private key is still severe. | Often larger if the exception hits more PRs than intended. |
| **Recommendation** | **OCTC default.** | Only if an App is impossible; document owner and review. |

**GitHub limits:** In classic branch protection, a bypass-listed actor can often merge **any** PR when using **that actor’s** credentials. The operational approach is: **only** this workflow calls `gh pr merge` with the App token **under** the strict predicate (branch/title/author); do not relax reviews for normal human contributions.

## Current chain (two phases)

### Phase A — Changes arrive with a changeset

1. Work on a normal branch; add a file under `.changeset/` (`pnpm exec changeset` or equivalent).
2. Open PR → `main`, pass CI (e.g. `verify.yml`, `privacy-guard` when applicable).
3. Merge to `main` (per org policy: approvals, CODEOWNERS, etc.).

### Phase B — `release.yml` on `main`

Each push to `main` runs [`.github/workflows/release.yml`](../../.github/workflows/release.yml).

| State of `.changeset/` on `main` | What the `changesets` job does |
|----------------------------------|--------------------------------|
| **Has** unversioned `.changeset/*.md` files | Runs `changeset version`, commits on **`changeset-release/main`**, opens/updates a PR titled **`chore: release packages`** to `main` (usual actor: `github-actions[bot]`). **Does not publish to npm yet.** |
| **No** pending changesets; local package versions ahead of registry | Runs `changeset publish` with **OIDC → npm** and provenance (`NPM_CONFIG_PROVENANCE`). Creates package tags in Git. |

Therefore **npm only updates after the version PR lands on `main`**. That PR is mechanical (bumps + changelogs + removes changeset files).

## Canonical secrets and variables (mechanical release merge)

**Do not** use the legacy numeric “App ID” as this flow’s variable: **`actions/create-github-app-token` v3** uses the **Client ID**. Standard names:

| Kind | Name | Value |
|------|------|--------|
| Variable | `OCTC_RELEASE_MERGE_ENABLED` | `true` to enable the dedicated merge job; any other value or unset → auto-merge with `GITHUB_TOKEN` only. |
| Variable | `OCTC_RELEASE_MERGE_APP_CLIENT_ID` | GitHub App **Client ID** (App settings page). |
| Secret | `OCTC_RELEASE_MERGE_APP_PRIVATE_KEY` | App private key PEM. |
| Variable | `OCTC_RELEASE_MERGE_CREDENTIAL_MODE` | **Only** for transitional mode: `pat`. If unset or not `pat`, the path is **GitHub App**. |
| Secret | `OCTC_RELEASE_MERGE_TOKEN` | PAT **only** when `OCTC_RELEASE_MERGE_CREDENTIAL_MODE=pat` (second-class IAM; rotate and scope). |

## `release-pr-automerge.yml` — exact mechanical shape

The workflow applies **only** when the PR satisfies **all**:

| Field | Required value |
|--------|----------------|
| Base | `main` |
| Head | `changeset-release/main` |
| Title | `chore: release packages` (exact; aligned with `release.yml` / `changesets/action` `title`) |
| PR author | `github-actions[bot]` |
| Origin | Same repo (not a fork) |

**No other PR qualifies**, even if it touches `packages/**`.

### Mode 1 — Default auto-merge

If **`OCTC_RELEASE_MERGE_ENABLED`** is not `true`: only the `enable-auto-merge` job runs, calling `gh pr merge --auto --squash` with `GITHUB_TOKEN`. Branch policy (reviews + checks) must still allow the merge when GitHub evaluates it.

### Mode 2 — Dedicated identity (merges after green checks)

If **`OCTC_RELEASE_MERGE_ENABLED=true`**:

| Path | `OCTC_RELEASE_MERGE_CREDENTIAL_MODE` | Credentials |
|------|--------------------------------------|-------------|
| **Preferred: GitHub App** (default when not `pat`) | absent or ≠ `pat` | Variable **`OCTC_RELEASE_MERGE_APP_CLIENT_ID`**, secret **`OCTC_RELEASE_MERGE_APP_PRIVATE_KEY`**. Job **`merge-mechanical-pr-github-app`**. |
| **Transitional: PAT** | `pat` (exact) | Secret **`OCTC_RELEASE_MERGE_TOKEN`**. Job **`merge-mechanical-pr-pat-fallback`**. |

On the **App** path, the workflow uses [`actions/create-github-app-token`](https://github.com/actions/create-github-app-token) to mint a short-lived **installation access token** (revoked when the job ends unless the action is configured otherwise). That token feeds `gh pr checks --watch` and `gh pr merge --squash`.

The **PAT** path exists only if the org **cannot** deploy an App; it is the **second choice** (long-lived token, larger rotation and leak surface).

## GitHub App (preferred) — provisioning

1. **Create a GitHub App** in the org (or account) with narrowly scoped repo permissions:
   - **Contents:** Read and write  
   - **Pull requests:** Read and write  
   Install **only** on `OneClickToControl/octc-platform` (or the minimal repo list if org policy forbids single-repo install; document exceptions).
2. Record the App **Client ID** (modern GitHub UI; do not confuse with legacy numeric “App ID” unless you have explicit action compatibility).
3. Generate **Private key**; store as secret **`OCTC_RELEASE_MERGE_APP_PRIVATE_KEY`** on the repo.
4. Repo variable **`OCTC_RELEASE_MERGE_APP_CLIENT_ID`** = **Client ID**.
5. Variable **`OCTC_RELEASE_MERGE_ENABLED`** = `true`.
6. Do **not** set **`OCTC_RELEASE_MERGE_CREDENTIAL_MODE`** (default is GitHub App). Set `pat` only during transition.

### GitHub policy alignment (outside the repo; required to merge without `--admin`)

Org/repo admins must grant the **App actor** (`<app-slug>[bot]`, visible after install) **effective** permission to merge the mechanical PR. Typical pattern: include that actor under **“Allow specified actors to bypass required pull request reviews”** (or rulesets equivalent) on the rule that protects `main`.

**The repository cannot apply that policy by itself.** Without it, `gh pr merge` fails on permissions or pending reviews.

**`--admin`:** not the routine OCTC operating mode; do not use it as a permanent substitute for the above.

### Why this beats a generic ruleset carve-out

- Workflow-enforced **PR predicate** (branch/title/author) is auditable in Git.
- Tokens are **short-lived** and revocable by rotating the App key or removing the App.
- Overly broad **rules** are usually **less precise** than “this actor + this workflow + this PR shape”.

## Policy dependency (contract text)

Until the App actor (or residual PAT) can **effectively** merge to `main` under org rules:

- **What blocks:** required reviews / CODEOWNERS / unsatisfied checks / actor lacks bypass where needed.
- **Who changes it:** org or repo admins with governance authority.
- **Meanwhile:** `OCTC_RELEASE_MERGE_ENABLED` off + `GITHUB_TOKEN` auto-merge + **human approval** per rules, or manual merge without a dedicated identity.
- **After alignment:** `merge-mechanical-pr-github-app` can complete the merge **without** `--admin` once checks pass.

## Residual PAT (second choice)

Only when **`OCTC_RELEASE_MERGE_CREDENTIAL_MODE=pat`**:

- Secret **`OCTC_RELEASE_MERGE_TOKEN`**: fine-grained or classic PAT with **minimum** scope to this repo; agreed rotation.
- Same **policy** requirement so that user/bot can merge.
- Residual risk: PAT exfiltration enables merges outside this workflow if the actor has broad permissions.

## Maintainer checklist (releases)

1. After merging work with changesets: wait for the **`chore: release packages`** PR.
2. Review diffs (versions/changelogs / removal of `.changeset`).
3. Green CI on that PR.
4. Default mode (no `OCTC_RELEASE_MERGE_ENABLED`): approve per rules; auto-merge completes when GitHub allows.
5. App/PAT dedicated mode: confirm **`merge-mechanical-pr-github-app`** or **`merge-mechanical-pr-pat-fallback`** succeeds.
6. Verify the next `release.yml` on `main` (`changeset publish` and npm version).

## Known drift vs other documents

Some historical docs list SBOM (`syft`), Sentry `releases` integration, or signed tags as part of package release. **The current `release.yml` does not run those steps.** Until implemented in CI, this runbook and the *Releases* section of [POLICY.md](POLICY.md) prevail for actual behavior.
