# PR — octc-platform

> Canonical PR template for `octc-platform` and for any repo that copies it to `.github/PULL_REQUEST_TEMPLATE.md`.

## Change type

- [ ] Trivial (typo, copy edit, example)
- [ ] Substantive (new section, new rule, minor template tweak)
- [ ] Structural (new package, breaking change, new policy — requires RFC + ADR)
- [ ] Change to `<!-- octc:base -->` template (requires RFC + ADR)
- [ ] Change to `schemas/` (requires RFC + ADR + AJV check)
- [ ] Change in security / observability / finops (requires double review)

## Summary

<!-- One or two sentences describing what this PR does. -->

## Motivation

<!-- Why it matters. Related issue, RFC, or ticket. -->

## Changes

<!-- Short list of files / areas touched. -->

## Risks and mitigations

<!-- Risks introduced and how they are mitigated. -->

## Privacy guard (mandatory — public repo)

> This repo is **public**. Before approving, explicitly confirm:

- [ ] I am not adding OneClickToControl Sentry DSNs or org IDs.
- [ ] I am not naming private org repos (see canonical list in policy) except in allowlisted files.
- [ ] I am not adding inventories, audit findings, customer postmortems, or any data that belongs in `octc-platform-internal`.
- [ ] I am not committing `.env`, `*.pem`, `*.key`, or `*.private.*` / `INTERNAL_*` patterns.
- [ ] `privacy-guard` CI is green.

Full policy: [docs/security/PUBLIC_REPO_POLICY.md](../docs/security/PUBLIC_REPO_POLICY.md).

## Technical checklist

- [ ] CI is green (`verify.yml` + `privacy-guard.yml`)
- [ ] Changes are documented (CHANGELOG / docs)
- [ ] If templates changed: `<!-- octc:base -->` markers intact
- [ ] If packages changed: correct SemVer bump + Changeset
- [ ] If observability / security touched: PII scrubbing intact
- [ ] If a new integration is introduced: added to [CATALOG](../docs/integrations/CATALOG.md)
- [ ] CODEOWNERS approved paths that require their review

## Linked RFC / ADR

<!-- Links to RFC discussion/issue and ADR under docs/adr/. -->

## Deployment notes

<!-- If consumers need coordinated action, list it here. -->
