# Channels

Canales internos oficiales para OneClickToControl LLC. Toda comunicación operativa pasa por estos canales; conversaciones puntuales en otros medios no son consideradas decisiones.

## Slack (o sustituto declarado)

| canal | propósito | suscriptores |
|-------|-----------|--------------|
| `#general` | Anuncios al equipo. | toda la org |
| `#ops` | Operación diaria, incidentes nivel C. | owners de productos |
| `#ops-incidents` | Incidentes nivel A/B (ver [DR_BCP.md](../ops/DR_BCP.md)). | on-call |
| `#ops-agents` | Heartbeats y alertas de agentes IA. | owners de ACPs |
| `#ops-finops` | Alertas de coste LLM y FinOps. | owners de productos + finanzas |
| `#release` | Anuncios de releases `@1c2c/*` y de productos. | toda la org |
| `#platform` | Discusión de plataforma, ADRs, RFCs. | mantenedores de plataforma |
| `#security` | Alertas de seguridad y supply chain. | mantenedores + on-call |

## GitHub

- Discusiones técnicas vinculantes: PRs y RFCs en `octc-platform/discussions`.
- Tickets operativos: issues en el repo afectado.

## Otras herramientas

- **Linear/Jira/Trello**: planificación de productos. Linkear desde issues GitHub.
- **Notion/Wiki**: solo material no normativo (notas, brainstorms). La normativa vive en los repos.
- **Email**: comunicación con terceros y formal externa.

## Cadencia

- Standup async diario en `#general` (opcional).
- Weekly review viernes: cierre de tickets y SCORECARD.
- Monthly: release notes plataforma en `#release`.
- Quarterly: revisión del plan + auditoría visible.
