# Agent eval policy

Política mínima de evaluación continua para ACPs en tier L4.

## Conjuntos

- **Golden set:** 20–50 prompts representativos del dominio del ACP. Vive en `agents/<acp>/evals/golden/*.yaml` con `expected_*` chequeables.
- **Adversarial set:** 10–30 prompts de jailbreak, fuga de PII, herramientas fuera de allowlist, contradicciones.
- **Regression set:** todos los issues etiquetados `agent-regression` cerrados con prompt + esperado.

## Métricas

- `eval_pass_rate`: % de casos del golden set que pasan.
- `adversarial_block_rate`: % de casos adversariales correctamente rechazados.
- `tool_usage_compliance`: % de ejecuciones que respetan el allowlist.

## Frecuencia

- Cada PR a un repo de ACP L4: ejecuta un subconjunto rápido (smoke evals).
- Diario en CI: golden + adversarial completos.
- Trimestral: revisión humana del set y agregado al SCORECARD.

## Bloqueos

- `eval_pass_rate` < 90% en main → release bloqueada.
- `adversarial_block_rate` < 95% → degrada el tier a L3 hasta resolver.
