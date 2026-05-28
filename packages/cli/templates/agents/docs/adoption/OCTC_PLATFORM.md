# Adopción OCTC — repo `*-agents`

## Contrato

| Familia | CLI / contrato principal |
|---------|---------------------------|
| `*-app` | `octc verify monorepo`, `octc add|sync surface`, portfolio dispatch |
| `*-agents` | `octc sync agents` (baseline), manifest ACP en `agents/<acp-id>/manifest.json`, validación schema, ACP dispatch |
| `*-workspace` | Sin `monorepo.yaml`; memoria/identidad — ver plantilla `templates/workspace-repo` |

## Referencias

- [ADR-0002 — ACP](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adr/ADR-0002-acp-pattern.md)
- Schema: `schemas/octc-agent-provider.manifest.v1.json` en `octc-platform`
- Runbook dispatch interno: en el repo `octc-platform-internal`, `docs/runbooks/ACP_DISPATCH_SETUP.md`

## Registro interno

Los metadatos del manifest se reflejan en `octc-platform-internal` bajo `docs/agents/registry/<acp-id>.json` vía `repository_dispatch` (`octc_acp_sync`). El catálogo narrativo público en `octc-platform` (p. ej. REGISTRY) es documentación humana hasta que exista generación automática desde el JSON interno.
