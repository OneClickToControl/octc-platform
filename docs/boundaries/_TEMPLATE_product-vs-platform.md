# Frontera producto vs plataforma — TEMPLATE

Plantilla para documentar, por producto, qué pertenece a `octc-platform` y qué al repo del producto. Copiar este archivo a `docs/boundaries/<producto>.md` al inicio de cada producto.

## Producto

`<nombre del producto>` — repo `<org/repo>` — owner `<handle>`.

## En octc-platform

- [ ] Plantillas (`@1c2c/agent-templates`)
- [ ] Reglas Cursor base
- [ ] Schemas y políticas comunes
- [ ] Workflows base (verify, release)
- [ ] Observabilidad: convención de naming Sentry
- [ ] Supply chain: provenance, SBOM, source maps

## En el repo del producto

- [ ] Roadmap y PRD
- [ ] Diseño y branding propios
- [ ] ACP local con manifest y skills
- [ ] Configuración Sentry específica (DSNs, environments)
- [ ] Integraciones específicas y secretos
- [ ] Tests y evals propios

## Excepciones

Documentar cualquier excepción al modelo plataforma vs producto, con justificación y plan de migración hacia el modelo canónico.

## Decisiones relevantes

| fecha | decisión | adr |
|-------|----------|-----|
|       |          |     |
