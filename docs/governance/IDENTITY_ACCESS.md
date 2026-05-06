# Identity & Access (IAM)

Identity and access policy across all platforms and SaaS connected to OneClickToControl LLC.

## Principles

- **SSO required** on all critical SaaS.
- **2FA enforced** for all members, no exceptions.
- **Least privilege** access reviewed periodically.
- **Human vs machine** accounts separated and labeled.

## Connected systems

| system          | auth method            | 2FA      | token rotation                             |
| --------------- | ---------------------- | -------- | ------------------------------------------- |
| GitHub (org)    | SSO + 2FA app/hardware | enforced | OIDC for CI; **GitHub App installation tokens** (ephemeral) for documented cases; **long-lived PAT is not the preferred model** (transient exception only for mechanical release-merge, see [RELEASE_RUNBOOK](../packages/RELEASE_RUNBOOK.md)) |
| Sentry          | SSO                    | enforced | OIDC for CI                                 |
| Vercel          | SSO                    | enforced | OIDC for CI                                 |
| Supabase        | SSO                    | enforced | service roles rotated quarterly              |
| Cloudflare      | SSO                    | enforced | API tokens rotated quarterly                |
| npm             | SSO + provenance       | enforced | OIDC for publish                            |
| Resend / email  | SSO or local 2FA       | enforced | API keys rotated quarterly                  |
| Slack           | SSO                    | enforced | n/a                                         |
| Notion / Linear | SSO                    | enforced | API tokens rotated                          |

## Roles

- **Platform Admin**: full access to `octc-platform` and org configuration.
- **Product Owner**: admin on product repos and associated Sentry projects.
- **Contributor**: read/write on assigned repos; no org-wide configuration access.
- **CI Bot (OIDC)**: ephemeral identities per workflow for publish / deploy.

## Onboarding

1. Invite to SSO IdP (Google Workspace or equivalent).
2. Assign to required access groups.
3. Verify 2FA with second factor.
4. Onboarding doc: [PLATFORM_TOUR](../onboarding/PLATFORM_TOUR.md).

## Offboarding

- Revoke SSO access within ≤ 1h of separation.
- Rotate any secret the person had access to.
- Audit last 30 days of activity.

## Reviews

- **Quarterly**: review org members, remove inactive users, rotate tokens.
- **Annual**: light pen-test / SaaS surface review.

## Machine accounts

- Identified with `bot-` prefix or `-ci` suffix.
- **Preferred on GitHub:** OIDC (`GITHUB_TOKEN`, npm publish) and **GitHub App** with **installation access token** generated in the job (short-lived; see `actions/create-github-app-token`).
- **Long-lived PAT:** do not use by default; **only** a documented explicit exception (e.g. `OCTC_RELEASE_MERGE_CREDENTIAL_MODE=pat` in [RELEASE_RUNBOOK](../packages/RELEASE_RUNBOOK.md)) until fully migrated to App; rotation and minimum scope required.
- **GitHub App private key** lives as a repo secret (static material scoped to one provider); it is not equivalent to a user PAT.
- Document in `docs/governance/MACHINE_IDENTITIES.md` (create when the first appears).

## Git identity for commits

| Repo / context                                       | `user.name`           | `user.email`                                                             |
| ----------------------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| **Public** repos (`octc-platform`, future OSS)        | `OneClickToControl`   | Author GitHub privacy email: `<id>+<login>@users.noreply.github.com`      |
| **Private** product repos (`<product>-app`, etc.)    | `OneClickToControl`   | same author privacy email                                                |
| `octc-platform-internal`                              | `OneClickToControl`   | same author privacy email                                                |
| GitHub Actions (releases, automated PRs)              | `github-actions[bot]` | `41898282+github-actions[bot]@users.noreply.github.com` (GitHub default) |
| GitHub App **OCTC release merge** (optional; merges mechanical Changesets PR only) | `<app-slug>[bot]` | see slug on App installation; runbook [RELEASE_RUNBOOK.md](../packages/RELEASE_RUNBOOK.md) |

### Why privacy email

The `<id>+<login>@users.noreply.github.com` format (example: `15200377+1click2control@users.noreply.github.com`) is GitHub’s standard convention to:

- Keep the author’s personal email out of public git history.
- Ensure every commit is **linked to the GitHub account** (Vercel, GitLeaks, GitHub badges all recognize it).
- Work without maintaining an extra domain or real alias.

### Recommended local setup

```bash
# Per repo (recommended for OneClickToControl projects; keeps global personal config intact)
cd <repo>
git config user.name "OneClickToControl"
git config user.email "$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')"

# Verify
git config user.email   # should end with @users.noreply.github.com
```

### Anti-patterns

- Do **not** invent generic domains that do not exist (e.g. `ops@<org-slug>.com` when the real domain differs). Vercel and others may fail silently.
- Do **not** rewrite already-pushed history only to fix identity (breaks OIDC attestations and tags). Configure correctly from repo start.
- Do **not** put personal emails (`user@…`) in public repo commits when avoidable — use privacy email.
