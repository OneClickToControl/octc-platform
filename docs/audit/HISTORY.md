# Audit history

> **Internal — moved to private companion repo.**

Audit findings, severity, owners and remediation history live in:

- [`OneClickToControl/octc-platform-internal/docs/audit/`](https://github.com/OneClickToControl/octc-platform-internal/tree/main/docs/audit) (**access-restricted**)

The public-facing template that any new audit follows is at [`_TEMPLATE.md`](_TEMPLATE.md).

## Cadence

- One audit per quarter.
- Findings tracked from `open` → `in_progress` → `closed` with date and commit reference.
- Closed findings carry forward as historical record; never deleted.

## Why this isn't public

Open audit findings (e.g. "X budget not declared", "Y drill not executed") describe internal gaps that must be addressed but should not be advertised externally. The template and cadence are public; the data is not.
