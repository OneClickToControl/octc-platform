# @1c2c/agent-templates

Canonical agent templates (`CLAUDE.md`, `AGENTS.md`, Cursor rules) and the ACP manifest schema for OneClickToControl LLC repos.

This package mirrors the SSOT in [`octc-platform`](https://github.com/OneClickToControl/octc-platform) under `templates/agents/` and `schemas/`. Repos consume it to scaffold and keep their agent templates drift-free against the platform baseline.

## Install

```bash
pnpm add -D @1c2c/agent-templates
```

Or invoke the CLI directly without installing:

```bash
npx @1c2c/agent-templates init
```

## What's inside

| File                                         | Purpose                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `templates/CLAUDE.md`                        | Normative base for Claude-family agents. Contains `<!-- octc:base ... -->` markers.              |
| `templates/AGENTS.md`                        | Neutral equivalent for Cursor / OpenAI / other coding agents.                                    |
| `templates/cursor/00-octc-base.mdc`          | Cursor rule with the always-applied platform baseline.                                           |
| `templates/cursor/01-octc-tooling.mdc`       | Cursor rule that codifies the platform tooling (TS, ESLint, pnpm, Conventional Commits).         |
| `schemas/octc-agent-provider.manifest.v1.json` | JSON Schema (draft 2020-12) for the ACP manifest validated by `verify.yml`.                    |

## CLI

The package exposes a binary `octc-agents`.

```bash
# scaffold the canonical files in the current repo
npx @1c2c/agent-templates init

# scaffold into a specific dir, overwriting any existing copy
npx @1c2c/agent-templates init --target ./my-repo --force

# report drift versus the canonical version (exits 1 on drift)
npx @1c2c/agent-templates verify

# update drifted files; markdown files keep your <!-- octc:user --> blocks
npx @1c2c/agent-templates sync
```

`init` writes:

```
<target>/CLAUDE.md
<target>/AGENTS.md
<target>/.cursor/rules/00-octc-base.mdc
<target>/.cursor/rules/01-octc-tooling.mdc
<target>/.octc/agents/manifest.schema.json
```

`sync` rewrites only the `<!-- octc:base ... -->` block of `CLAUDE.md` and `AGENTS.md`, preserving any local edits inside `<!-- octc:user --> ... <!-- octc:end-user -->`.

## Programmatic API

```js
import { templates, schemas, VERSION } from "@1c2c/agent-templates";

const claudeMd = templates.claude();
const agentsMd = templates.agents();
const cursorBase = templates.cursorBase();
const cursorTooling = templates.cursorTooling();
const acpSchema = schemas.acpManifestV1();

console.log("agent-templates version:", VERSION);
```

You can also resolve raw file paths via package exports:

```js
import { paths } from "@1c2c/agent-templates/templates";

console.log(paths.claude); // absolute path to CLAUDE.md inside the package
```

Or import the JSON schema directly:

```js
import schema from "@1c2c/agent-templates/schema" with { type: "json" };
```

## Provenance

Published with **npm provenance** via GitHub Actions OIDC (Trusted Publishers). Verify in your CI:

```bash
pnpm dlx audit-signatures || npm audit signatures
```

The release run for each version is linked from the corresponding [GitHub Release](https://github.com/OneClickToControl/octc-platform/releases) and the [npm package page](https://www.npmjs.com/package/@1c2c/agent-templates).

See [`docs/packages/POLICY.md`](../../docs/packages/POLICY.md) for the full supply-chain policy.

## Drift policy

The single source of truth for these files lives in `octc-platform`:

- `templates/agents/CLAUDE.md`
- `templates/agents/AGENTS.md`
- `templates/agents/cursor/*.mdc`
- `schemas/octc-agent-provider.manifest.v1.json`

This package mirrors them at build time via `scripts/sync-from-ssot.mjs` (run by `prepack`). The `agent-templates-drift` job in `verify.yml` blocks any PR where the package copy and the SSOT diverge.

## Versioning

Strict SemVer, Changesets-driven. See [`docs/packages/POLICY.md#versionado-de-1c2cagent-templates-caso-especial`](../../docs/packages/POLICY.md#versionado-de-1c2cagent-templates-caso-especial):

- **Major** — breaking structural change, removed sections, or anything that breaks tooling that parses the files.
- **Minor** — new sections, additional non-breaking rules, support for new runtimes.
- **Patch** — wording fixes, examples, typos.
