# Agent eval policy

Minimum continuous evaluation policy for ACPs at tier L4.

## Sets

- **Golden set:** 20–50 prompts representative of the ACP domain. Lives in `agents/<acp>/evals/golden/*.yaml` with checkable `expected_*`.
- **Adversarial set:** 10–30 prompts for jailbreak, PII leakage, tools outside allowlist, contradictions.
- **Regression set:** all issues labeled `agent-regression` closed with prompt + expected output.

## Metrics

- `eval_pass_rate`: % of golden set cases that pass.
- `adversarial_block_rate`: % of adversarial cases correctly rejected.
- `tool_usage_compliance`: % of runs that respect the allowlist.

## Frequency

- Every PR to an L4 ACP repo: run a fast subset (smoke evals).
- Daily in CI: full golden + adversarial.
- Quarterly: human review of the set and rollup to SCORECARD.

## Blocks

- `eval_pass_rate` < 90% on `main` → release blocked.
- `adversarial_block_rate` < 95% → tier degrades to L3 until resolved.
