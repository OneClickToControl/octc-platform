# PR — octc-platform

> Plantilla canónica de PR para `octc-platform` y para cualquier repo que la copie a `.github/PULL_REQUEST_TEMPLATE.md`.

## Tipo de cambio

- [ ] Trivial (typo, redacción, ejemplo)
- [ ] Sustantivo (nueva sección, nueva regla, plantilla minor)
- [ ] Estructural (paquete nuevo, breaking, política nueva — requiere RFC + ADR)
- [ ] Cambio en plantilla `<!-- octc:base -->` (requiere RFC + ADR)
- [ ] Cambio en `schemas/` (requiere RFC + ADR + verificación AJV)
- [ ] Cambio en seguridad/observabilidad/finops (requiere doble revisión)

## Resumen

<!-- Una o dos frases sobre qué hace este PR. -->

## Motivación

<!-- Por qué importa. Issue, RFC o ticket relacionado. -->

## Cambios

<!-- Lista corta de archivos/áreas tocadas. -->

## Riesgos y mitigaciones

<!-- Riesgos del cambio y cómo se mitigan. -->

## Checklist

- [ ] CI verde (`verify.yml`)
- [ ] Cambios documentados (CHANGELOG / docs)
- [ ] Si toca plantillas: marcadores `<!-- octc:base -->` intactos
- [ ] Si toca paquetes: bump SemVer correcto + Changeset
- [ ] Si toca observabilidad/security: PII scrubbing intacto
- [ ] Si introduce nueva integración: añadida a [CATALOG](../../docs/integrations/CATALOG.md)
- [ ] CODEOWNERS aprobaron rutas que requieren su review

## RFC / ADR vinculados

<!-- Enlaces a RFC en discussion/issue y ADR en docs/adr/. -->

## Notas de despliegue

<!-- Si requiere acción coordinada en repos consumidores, listarla aquí. -->
