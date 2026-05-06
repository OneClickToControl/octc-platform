# Public repo policy — `octc-platform`

> **Hard rule:** `octc-platform` is a **public** repo. Everything committed here is visible on the internet, including files and commits. Separation from [`octc-platform-internal`](https://github.com/OneClickToControl/octc-platform-internal) is intentional and enforced by CI.

## What **does** belong in this repo

- Shareable `@1c2c/*` packages (`packages/*`).
- Schemas (`schemas/*`).
- Neutral templates (`templates/agents/`, `templates/observability/sentry/`, `templates/governance/`, `templates/governance/privacy-guard/` to adopt the anti-leak stack when publishing a repo).
- Policies, ADRs, RFCs, **generic** runbooks (not tied to customers or one-off projects).
- CI workflows, release configuration, lockfiles.
- Onboarding, contributing, code of conduct.

## What **does not** belong in this repo (zero exceptions)

| Category | Examples | Where it goes |
|---|---|---|
| **Product / customer inventories** | `PORTFOLIO.md`, lists of private repos, customer maps, “MVP X”, etc. | `octc-platform-internal/docs/PORTFOLIO.md` |
| **Org Sentry identifiers** | `o45109…`, concrete DSNs, Sentry org names, ingest URLs, project IDs | `octc-platform-internal/docs/observability/SENTRY_PROJECTS.md` |
| **Audit findings / postmortems** | `AUDIT-*.md` with open findings, concrete RCAs | `octc-platform-internal/docs/audit/*` |
| **Machine / human identities** | tokens, API keys, cookies, session IDs, npm tokens, GitHub PATs, OAuth secrets, `.env*`, `*.pem`, `*.key` | GitHub Secrets / Vault |
| **Commercial and financial contracts** | real pricing, ARR, contracts, GTM, leads | `octc-platform-internal` or business repo |
| **PII** | personal emails (beyond `ops@oneclicktocontrol.com` in commits), phones, addresses | never in any repo |
| **Production data** | dumps, real logs, DB snapshots, raw Sentry events | corresponding production storage |
| **Unannounced product names** | NDA features, stealth project internal names | `octc-platform-internal` until announcement |
| **Sensitive geographic / customer names** | unannounced markets, customer names | `octc-platform-internal` |

## References to private repos (specific rule)

- **Do not enumerate slugs or names of private org repos** in this repo’s documentation (README, ADRs, adoption examples, sample tables).
- **Sentry scripts** (`setup-sentry-projects.sh`, `setup-sentry-alerts.sh`): the `team|project|platform` table lives in `scripts/sentry-org-projects.spec` (**gitignored**), generated or copied from internal runbooks; the public repo only has [`scripts/sentry-org-projects.spec.example`](../../scripts/sentry-org-projects.spec.example) without product slugs.
- **Technical patterns** that detect identifiers in history/docs live **only** in the privacy-guard chain: `.gitleaks.toml`, `scripts/precommit-privacy-check.sh`, and the equivalent template under `templates/governance/privacy-guard/`. Keep those files **aligned** with each other.
- Whenever there is a **new private repo** whose name must not appear in public, update those three artifacts **before** mentioning the project elsewhere.
- Use generic references in prose (`<private-product-repo>`, `<acp-id>`, etc.) when illustrating without naming.
- Published git history is not rewritten by default; **new** improper references must be blocked by CI.

> The handle `1click2control` is public (GitHub owner) and may appear in `CODEOWNERS`, runbooks, and onboarding.

## Defense stack (in this order; all mandatory)

1. **This policy** + training for committers.
2. **Local pre-commit hook**: `scripts/precommit-privacy-check.sh` (denylist regex). Install with `pnpm run install-hooks`.
3. **CI workflow `privacy-guard.yml`** (branch protection **blocking** status check):
   - `gitleaks` with custom rules in `.gitleaks.toml`.
   - `denylist-regex` via `precommit-privacy-check.sh --staged-mode=tree`.
   - `denylist-paths`: block `**/*.private.*`, `**/INTERNAL_*`, `**/SECRETS*`, `*.env*` (except `.env.example`).
4. **CODEOWNERS**: changes to `.gitleaks.toml`, `.github/workflows/privacy-guard.yml`, `docs/security/PUBLIC_REPO_POLICY.md` require `@1click2control` approval.
5. **Branch protection** on `main`: PRs required, `privacy-guard` must pass, no force-push, no branch deletion.
6. **PR template**: explicit anti-leak checklist marked mandatory.

## If a secret leaks (incident)

1. **Do not “fix” it with a new commit**. It is in public history.
2. Rotate the secret / DSN / token / credential immediately.
3. Request GitHub cache purge (no simple `gh api` for this; open a support request if critical).
4. Rewrite history with `git filter-repo --invert-paths --path <file>` and force-push (requires coordination; breaks public SHAs). **IMPORTANT**: if you use `--replace-text`, exclude privacy-guard files (`.gitleaks.toml`, `scripts/precommit-privacy-check.sh`, templates under `templates/governance/privacy-guard/`) or they will be mangled; use `--path-glob` with exclusions or restore files manually afterward.
5. Assume compromise: the secret may already be indexed (Wayback, scrapers, etc.). Rotation is non-negotiable.
6. Document the incident in `octc-platform-internal/docs/audit/INCIDENT-YYYY-MM-DD.md`.

## Cadence

- **Quarterly**: `1click2control` reviews this policy and the **technical list** in `.gitleaks.toml` / `precommit-privacy-check.sh` against new or renamed private repos.
- **Each relevant new private repo**: update the three technical artifacts before documenting it in other public repos.
