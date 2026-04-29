# Supply chain

Cadena de confianza de software para OneClickToControl LLC. Cubre paquetes `@1c2c/*`, productos consumidores, source maps y dependencias.

## Identidad y secretos

- **OIDC en GitHub Actions** para publicar en npm y para subir source maps a Sentry. Ningún token long-lived persistido.
- Secretos en gestor centralizado (GitHub Encrypted Secrets / Doppler / Vault según repo). Rotación trimestral mínima.
- SSO + 2FA enforced (ver [IDENTITY_ACCESS.md](../governance/IDENTITY_ACCESS.md)).
- **Procedimiento exacto de rotación** por sistema en el runbook privado [`octc-platform-internal/docs/runbooks/CRED_ROTATION.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/CRED_ROTATION.md) (access-restricted).

## Publicación de paquetes `@1c2c/*`

- **OIDC Trusted Publishers de npm** activado por paquete: GitHub Actions intercambia un OIDC token efímero por un token de publicación `npm`. **Ningún `NPM_TOKEN` persistido** en GitHub Secrets ni en `.npmrc` del runner.
- Workflow `.github/workflows/release.yml` declara `permissions: id-token: write` y usa Node 24 + `npm install -g npm@latest` para garantizar npm CLI ≥ 11.5.1 (mínimo OIDC).
- Cada `npm publish` corre con `--provenance` (vía `NPM_CONFIG_PROVENANCE=true`), generando attestation SLSA v1 firmada por Sigstore.
- Provenance verificable por consumidores con `npm audit signatures` o `pnpm audit signatures`.
- Tags firmados (`tag.gpg.sign=true` o sigstore).
- SBOM generada con `syft` y adjuntada a la GitHub Release.

### Configuración del Trusted Publisher (uno por paquete)

En [https://www.npmjs.com/package/@1c2c/<pkg>/access](https://www.npmjs.com/package/) → "Publishing access" → "Add trusted publisher":

| Campo | Valor |
|---|---|
| Publisher | GitHub Actions |
| Organization or user | `OneClickToControl` |
| Repository | `octc-platform` |
| Workflow filename | `release.yml` |
| Environment name | (vacío) |

> Si en algún momento mueves el job a un environment protegido (recomendado para releases major), añade el nombre del environment en el campo correspondiente y exígelo también en `release.yml` con `environment: <name>`.

### Por qué OIDC y no PAT/granular tokens

- Sin secret persistido → no hay nada que filtrar ni rotar manualmente.
- El attestation OIDC liga el publish al **commit SHA + workflow + repo + actor** del runner, lo que hace imposible publicar fuera del workflow.
- npm rechaza intentos de publicación que no traen un OIDC matching → fail-closed por defecto.

## Provenance consumer-side

Cualquier producto que consuma `@1c2c/*` ejecuta en CI:

```bash
pnpm install --frozen-lockfile
pnpm dlx audit-signatures || npm audit signatures
```

Si la verificación falla, el build se corta. Esto se valida automáticamente desde `verify.yml` cuando el repo se registra en PORTFOLIO con tier ≥ L1.

## Source maps {#source-maps}

- En cada release (web/python/mobile) se ejecuta:
  ```bash
  sentry-cli releases new "$SENTRY_RELEASE"
  sentry-cli releases set-commits "$SENTRY_RELEASE" --auto
  sentry-cli sourcemaps inject --release "$SENTRY_RELEASE" <build-dir>
  sentry-cli sourcemaps upload --release "$SENTRY_RELEASE" <build-dir>
  sentry-cli releases finalize "$SENTRY_RELEASE"
  ```
- Autenticación de `sentry-cli` mediante OIDC (sin DSN/token en repo).
- Para Flutter usar `sentry-cli upload-dif` en lugar de sourcemaps.

## Dependencias

- **Dependabot** o **Renovate** activado en cada repo (PRs automáticos semanales para minors/patches).
- Major upgrades exigen RFC.
- Lockfile commiteado en main (sin excepciones).
- `pnpm` con `overrides` y `auditLevel=high` mínimo en `verify.yml`.

## GitHub Actions

- **Pinning**: usar `actions/checkout@<sha>` por SHA (40 chars) con comentario `# vX.Y.Z` para legibilidad. Dependabot bumpea automáticamente.
- **Node runtime**: todas las actions deben soportar Node 24 (Node 20 deprecado por GitHub en Sep 2026, Node 22 LTS aceptable para jobs no críticos).
- **Permissions**: `permissions: contents: read` por defecto, sub-jobs y workflows que escriben (release, PR-creation) declaran scopes adicionales explícitos.
- **OIDC**: para npm y Sentry.
- **Secret scanning** activado en todos los repos.

## Auditoría

- Revisión trimestral de `tools_allowlist_ref` por ACP en tier L4.
- Revisión semestral del CATALOG y de las dependencias críticas.
- Hallazgos se registran en [docs/audit/HISTORY.md](../audit/HISTORY.md).

## Build reproducibility

- Builds de producción con commit SHA inmutable.
- Imágenes Docker (cuando aplique) con digests pinneados.

## Respuesta a incidentes

- Si se detecta dependencia comprometida: [DR_BCP.md](../ops/DR_BCP.md) clase A.
- Vulnerabilidades reportadas: ver `SECURITY.md` (planeado en cada repo).
