# Release train hacia repos producto (Fase 4)

Los pasos de diseño y el backlog viven en el companion privado:

- [docs/backlog/OCTC_RELEASE_TRAIN.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/backlog/OCTC_RELEASE_TRAIN.md) (`octc-platform-internal`)

Este repo público publica los paquetes `@1c2c/*` vía [`.github/workflows/release.yml`](../../.github/workflows/release.yml) (Changesets + npm); el camino operativo (PR de versión, revisiones, OIDC) está en [`docs/packages/RELEASE_RUNBOOK.md`](../packages/RELEASE_RUNBOOK.md). Tras cada publicación, los productos hoy actualizan versiones mediante **Dependabot** y checklist manual ([merge train](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_MERGE_TRAIN_CHECKLIST.md)).

Una automatización que abra PRs en varios repos requerirá PAT u organización GitHub App; ver sección *Opciones de implementación* en el backlog enlazado arriba.
