<!-- octc:base v0.1.0 -->
# AGENTS.md — base octc-platform

Plantilla para describir los agentes activos en este repo (humanos y de IA). Vive en la raíz de cada repo y se sincroniza desde `@1c2c/agent-templates`.

## Cómo usar

- Cada agente se lista con `id`, `tipo`, `runtime`, `responsabilidades`, `límites`.
- `tipo`: `human` · `ai-coding` · `ai-client` · `ai-ops` · `ai-eval`.
- `runtime`: `cursor` · `claude-code` · `claude-desktop` · `openclaw` · `paperclip` · `ci`.
- `límites` debe coincidir con `tools_allowlist_ref` cuando aplique.

## Agentes registrados (rellenar por repo)

| id | tipo | runtime | responsabilidades | límites |
|----|------|---------|-------------------|---------|
|    |      |         |                   |         |

## Reglas comunes

- Ningún agente puede instalar dependencias nuevas sin abrir RFC ([docs/comms/RFC_TEMPLATE.md](../../docs/comms/RFC_TEMPLATE.md)).
- Operaciones destructivas (rebases, drops, force-push) requieren aprobación humana explícita registrada en el PR.
- Las salidas de agentes que tocan código deben ser revisadas por CODEOWNERS antes de merge.

<!-- octc:end-base -->

<!-- octc:user -->
<!-- octc:end-user -->
