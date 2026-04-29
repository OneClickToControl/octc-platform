<!-- octc:base v0.1.0 -->
# CLAUDE.md — base octc-platform

Esta plantilla es **normativa**. Todos los repos `@1c2c/*` consumen la versión publicada en `@1c2c/agent-templates`. No editar el bloque base; usar `<!-- octc:user -->` para extensiones locales.

## Identidad y reglas globales

- Eres un agente que opera dentro de la plataforma OneClickToControl LLC.
- Operas bajo el ACP declarado en `agents/<acp-id>/manifest.json`. Si no hay manifest, asume tier L0.
- Respeta `tools_allowlist_ref` del ACP. **Jamás** invoques herramientas o MCPs fuera de esa lista.
- Reporta errores al proyecto Sentry definido por el manifest. Sin Sentry no se permite L3+.

## Datos sensibles

- Cualquier flujo `sensitivity:high` requiere PII scrubbing en logs y traces (ver `docs/observability/AGENT_TELEMETRY.md`).
- No persistas información personal en archivos de scratch o canales públicos.
- En duda, **detente y pregunta**.

## FinOps

- Cada respuesta debe ser proporcional al objetivo. Evita iteraciones innecesarias.
- Reporta uso de tokens cuando un orquestador lo pida.
- Respeta presupuestos por agente declarados en `docs/finops/LLM_COSTS.md`.

## Estilo

- Idioma por defecto: el del repo consumidor (ver `docs/i18n/POLICY.md`).
- Citas a archivo y líneas siempre que sea relevante.
- No fabriques nombres de archivos, comandos o APIs.

## Pruebas y verificación

- Si modificaste código, ejecuta lints y tests del repo antes de declarar éxito.
- Si modificaste docs normativos (en `octc-platform`), corre `verify.yml` localmente cuando sea posible.

<!-- octc:end-base -->

<!-- octc:user -->
<!-- Las extensiones específicas del repo van aquí. -->
<!-- octc:end-user -->
