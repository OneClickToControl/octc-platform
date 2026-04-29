# Supply chain

Cadena de confianza de software para OneClickToControl LLC. Cubre paquetes `@1c2c/*`, productos consumidores, source maps y dependencias.

## Identidad y secretos

- **OIDC en GitHub Actions** para publicar en npm y para subir source maps a Sentry. Ningún token long-lived persistido.
- Secretos en gestor centralizado (GitHub Encrypted Secrets / Doppler / Vault según repo). Rotación trimestral mínima.
- SSO + 2FA enforced (ver [IDENTITY_ACCESS.md](../governance/IDENTITY_ACCESS.md)).

## Publicación de paquetes `@1c2c/*`

- Workflow `release.yml` (cada paquete) publica con `npm publish --provenance --access public`.
- Provenance verificable por consumidores con `npm audit signatures` o `pnpm audit signatures`.
- Tags firmados (`tag.gpg.sign=true` o sigstore).
- SBOM generada con `syft` y adjuntada a la GitHub Release.

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

- **Pinning**: usar `actions/checkout@<sha>` por SHA y bumpear con Dependabot.
- **Permissions**: `permissions: read-all` por defecto, sub-jobs explícitos.
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
