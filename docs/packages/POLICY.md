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

El paquete cubre dos superficies, ambas con SemVer estricto:

1. **Contenido normativo** — `templates/CLAUDE.md`, `templates/AGENTS.md`, `templates/cursor/*.mdc`, `schemas/octc-agent-provider.manifest.v1.json`.
2. **API JS / CLI** — `index.mjs`, `templates/index.mjs`, `bin/octc-agents.mjs`.

Reglas de bump:

- **Major**
  - Cambios incompatibles en la estructura del bloque `<!-- octc:base -->` (secciones eliminadas o renombradas).
  - Eliminación o rename de exports JS (`templates`, `schemas`, `paths`, `VERSION`).
  - Cambio breaking en flags o subcomandos de `octc-agents` (`init` / `verify` / `sync`).
  - Cambio breaking del JSON Schema (campos requeridos nuevos, tipos cambiados).
- **Minor**
  - Secciones nuevas en CLAUDE/AGENTS que se añaden sin romper consumidores existentes.
  - Reglas adicionales no breaking, soporte para nuevos runtimes.
  - Nuevos exports JS o subcomandos CLI no destructivos.
  - Campos opcionales nuevos en el JSON Schema.
- **Patch**
  - Typos, correcciones de redacción, ejemplos.
  - Mejoras de output del CLI sin cambiar contratos.

Adopción y SLAs:

- Cada release minor/major dispara una **issue automática** en cada repo con `agent_templates_pin` desactualizado.
- Major: 30 días para adoptar antes de aparecer en alerta del SCORECARD.
- Minor: 90 días.
- Una versión major se mantiene con parches durante mínimo 6 meses tras el lanzamiento de la siguiente major (overlap window).
- La política de adopción detallada vive en [docs/agents/ADOPTION.md](../agents/ADOPTION.md).

Sincronización con el SSOT:

- El SSOT de los archivos normativos vive en `templates/agents/` y `schemas/` de `octc-platform`.
- `packages/agent-templates/` los espeja vía `scripts/sync-from-ssot.mjs` (`prepack`).
- El job `agent-templates-drift` en `verify.yml` bloquea PRs donde el espejo y el SSOT divergen.

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
| `@1c2c/cli` | CLI `octc` (sync agentes hoy; governance y ACP en roadmap). |
| `@1c2c/sentry-config` (opcional) | configs Sentry empaquetadas. |

## Versionado de `@1c2c/cli`

- **Dependencia:** declara rango semver de `@1c2c/agent-templates` en `dependencies` (hoy `^0.1.0`).
- **Major:** cambios breaking en flags o subcomandos de `octc` (p. ej. renombrar `sync agents`), o eliminación de rutas soportadas.
- **Minor:** nuevos subcomandos no breaking (p. ej. `octc sync governance`), nuevas flags opcionales.
- **Patch:** ayudas, mensajes, delegación interna sin cambiar contrato.

Registro de versiones: Changesets igual que el resto de `@1c2c/*`.
