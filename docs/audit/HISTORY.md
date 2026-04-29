# Audit history

Registro vivo de auditorías de la plataforma. Cada auditoría se archiva en un documento `AUDIT-<YYYY>-<Qx>.md` y se referencia desde aquí.

## Cadencia

- **Trimestral**: revisión completa siguiendo Apéndice C del plan fundacional.
- **Tras incidente clase A o B**: post-mortem + ajustes documentados.
- **Tras release major** de un paquete `@1c2c/*` core: revisión del impacto agéntico.

## Índice

| trimestre | documento | estado | resumen |
|-----------|-----------|--------|---------|
| 2026-Q2 | [AUDIT-2026-Q2.md](AUDIT-2026-Q2.md) | abierto | Auditoría inicial post-bootstrap. |

## Cómo registrar una auditoría

1. Copiar [_TEMPLATE.md](_TEMPLATE.md) (a crear cuando aparezca el segundo audit).
2. Documentar hallazgos: severidad, recomendación, owner, fecha objetivo.
3. Cerrar hallazgos con PR y referencia al ADR/RFC correspondiente.
4. Marcar estado `cerrado` en el índice.

## Severidades

- **crítica**: bloquea producción o expone PII. Requiere acción inmediata.
- **alta**: degrada postura de seguridad o calidad agéntica.
- **media**: mejora estructural recomendada en el trimestre.
- **baja**: cosmética o documental.
