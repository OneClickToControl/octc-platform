# Agent templates adoption

Cómo cada repo (producto o ACP) adopta y mantiene actualizadas las plantillas `CLAUDE.md`, `.cursor/rules/`, `AGENTS.md` provistas por `@1c2c/agent-templates`.

## Versionado de `@1c2c/agent-templates`

- Sigue **SemVer estricto** (ver [POLICY.md](../packages/POLICY.md#versionado-de-1c2cagent-templates-caso-especial)).
- **Major:** cambios incompatibles en estructura de plantilla, secciones eliminadas o renombradas.
- **Minor:** secciones nuevas o reglas adicionales no breaking.
- **Patch:** correcciones, redacción, ejemplos.
- Cada release minor/major abre una issue en repos con `agent_templates_pin` desactualizado. SLAs definidos en POLICY.

## Adopción

1. El repo declara la versión consumida en su `package.json` y la fija como `agent_templates_pin` en [PORTFOLIO.md](../PORTFOLIO.md).
2. Las plantillas se aplican con un comando del paquete (ej. `npx @1c2c/agent-templates apply`) que regenera los archivos base, manteniendo los marcadores `<!-- octc:user -->` para extensiones locales.
3. Las extensiones locales **nunca** alteran el contenido entre marcadores `<!-- octc:base -->` y `<!-- octc:end-base -->`.

## Mantenimiento

- Cada release minor/major del paquete dispara una **issue** automática en cada repo con `agent_templates_pin` desactualizado.
- El owner del repo tiene **30 días** para actualizar (mayor) o **90 días** (menor) antes de aparecer en alerta del SCORECARD.

## Compatibilidad

- Una versión major se mantiene con parches durante al menos 6 meses tras el lanzamiento de la siguiente major.
- Las plantillas viejas se eliminan del registro tras un periodo de gracia y entrada en [docs/governance/DEPRECATION.md](../governance/DEPRECATION.md).
