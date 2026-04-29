# Deprecation policy

Cómo se deprecan paquetes `@1c2c/*`, plantillas, ACPs e integraciones.

## Paquetes `@1c2c/*`

1. RFC con justificación y plan de migración.
2. Major release con `console.warn` (o equivalente) en la API a remover.
3. Mínimo 6 meses de soporte con parches críticos.
4. Major siguiente: remover.
5. Tag final `vX.Y.Z-final` y entrada en este archivo.

## Plantillas (`@1c2c/agent-templates`)

- Cambios major exigen herramienta de migración (`octc-templates migrate`) o instrucciones explícitas en CHANGELOG.
- Repos consumidores tienen 90 días para adoptar; antes de eso pasan a alerta del SCORECARD.

## ACPs

- Un ACP se puede archivar tras 90 días sin uso y con confirmación en REGISTRY.
- Sus manifests permanecen versionados; el código pasa a `archived/`.

## Integraciones (CATALOG)

- Eliminar de CATALOG con nota en [HISTORY.md](../audit/HISTORY.md) y migración documentada.

## Registro

Cada deprecación abre una entrada con fecha, tipo, ámbito y enlace al RFC/ADR correspondiente.

| fecha | item | tipo | enlace |
|-------|------|------|--------|
|       |      |      |        |
