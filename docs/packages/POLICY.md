# Packages POLICY — `@1c2c/*`

Política de ingeniería para los paquetes publicables bajo el scope `@1c2c/*`.

## Principios

- **SemVer estricto**: cualquier cambio breaking exige major.
- **Conventional Commits** + **Changesets** generan changelog y bump automático.
- Tests obligatorios en cada PR (mínimo unit; integration cuando aplique).
- Cobertura de tipos al 100% del API público.
- Política de deprecación documentada en [DEPRECATION.md](../governance/DEPRECATION.md).

## Releases

- Workflow `release.yml`:
  1. `pnpm build` y `pnpm test`.
  2. `npm publish --provenance --access public` con OIDC (sin tokens long-lived).
  3. SBOM (`syft`) adjuntada a la GitHub Release.
  4. `sentry-cli releases new` + `set-commits` + `finalize` para asociar errores al paquete.
  5. Etiqueta git firmada.

## Provenance — consumer-side

Todos los repos consumidores deben validar la provenance de cualquier paquete `@1c2c/*` en CI:

```yaml
- name: Verify provenance of @1c2c packages
  run: |
    pnpm install --frozen-lockfile
    pnpm dlx audit-signatures || npm audit signatures
```

- Si la verificación falla, el job se corta y se abre issue automática.
- `verify.yml` chequea que cada repo en PORTFOLIO con `at1c2c_pin` tiene este step.

## Versionado de `@1c2c/agent-templates` (caso especial)

- **Major**: cambios incompatibles en la estructura, eliminación de secciones marcadas `<octc:base>`, o cambios que rompen herramientas que parsean los archivos.
- **Minor**: secciones nuevas, reglas adicionales no breaking, soporte para nuevos runtimes.
- **Patch**: correcciones, redacción, ejemplos.
- Cada release minor/major dispara una **issue automática** en cada repo con `agent_templates_pin` desactualizado.
- SLAs:
  - Major: 30 días para adoptar antes de aparecer en alerta del SCORECARD.
  - Minor: 90 días.
- Una versión major se mantiene con parches durante mínimo 6 meses tras el lanzamiento de la siguiente major (overlap window).
- La política de adopción detallada vive en [docs/agents/ADOPTION.md](../agents/ADOPTION.md).

## Tests obligatorios por paquete

- Unit: cobertura mínima 80% de líneas en código nuevo.
- Type tests donde aplique (`tsd` o `vitest typecheck`).
- Snapshot tests para plantillas que generan archivos (`agent-templates`, `sentry-config`).

## Documentación obligatoria

- README con propósito, instalación, ejemplos.
- CHANGELOG generado por Changesets.
- Sección "When to use / when not to use" para evitar adopciones inadecuadas.

## Catálogo inicial de paquetes

| paquete | propósito |
|---------|-----------|
| `@1c2c/eslint-config` | ESLint compartido. |
| `@1c2c/tsconfig` | base TS estricta. |
| `@1c2c/agent-templates` | plantillas CLAUDE/AGENTS/cursor rules. |
| `@1c2c/sentry-config` (opcional) | configs Sentry empaquetadas. |
| `@1c2c/cli` (futuro) | `octc-sync` y otros utilitarios. |
