# FinOps LLM

Política de control de costes en uso de LLMs y agentes para OneClickToControl LLC.

## Objetivos

- Predecibilidad mensual del gasto.
- Visibilidad por agente / ACP / producto.
- Disuasión de bucles caros y modelos sobredimensionados.
- Decisiones de modelo guiadas por **calidad / coste**, no por hábito.

## Presupuestos

### Niveles

- **Org budget** (mensual): tope global agregado.
- **Product budget** (mensual): por producto del [PORTFOLIO](../PORTFOLIO.md).
- **Agent budget** (por ejecución): tope por ejecución de un agente.

Los presupuestos se declaran como variables de entorno y validan en runtime.

### Tier mapping (orientativo)

| Tier ACP | Modelo recomendado por defecto | Excepciones |
|----------|--------------------------------|-------------|
| L0–L1 | modelos de coste medio (sonnet-class) | tareas exploratorias one-off. |
| L2 | sonnet-class para implementación, modelos pequeños para clasificación. | rags pesados pueden subir a opus-class con justificación. |
| L3 | sonnet-class por defecto. | endpoints user-facing time-sensitive: modelos rápidos. |
| L4 | sonnet-class baseline + evals con modelos opus-class para validación. | revisar trimestralmente. |

## Métricas

- Coste USD por agente / día.
- Coste USD por tarea / petición.
- Tokens IN/OUT por modelo.
- `tokens_per_resolution`: media de tokens hasta resolver una tarea.
- `cost_overrun_rate`: % de ejecuciones que superan el presupuesto por agente.

Reportadas vía Sentry AI Monitoring (atributos en spans `agent.llm.call`) y agregadas en el SCORECARD.

## Alertas

- Coste org diario > 1.2× baseline 7 días → alerta crítica al canal `#ops-finops`.
- `cost_overrun_rate` por agente > 5% / día → ticket de optimización al owner del ACP.
- Aparición de modelo no aprobado en spans → alerta crítica.

## Optimizaciones

- Caching de prompts (`@1c2c/prompt-cache` planeado).
- Reuso de retrievals via vector store.
- Truncado agresivo del contexto histórico cuando aplique.
- Selección dinámica del modelo según complejidad detectada.

## Reportes

- Semanal: top 5 agentes por coste, top 5 ACPs por coste/tarea.
- Mensual: cierre vs presupuesto por producto en [comms/RELEASE_NOTES](../comms/RELEASE_NOTES_TEMPLATE.md).
- Trimestral: revisión de tier mapping y modelos aprobados.

## Modelos aprobados

Se mantiene una lista versionada por proveedor. Cualquier modelo nuevo entra mediante RFC. Modelos no aprobados son bloqueados por configuración del orquestador y/o gateway central (planeado).
