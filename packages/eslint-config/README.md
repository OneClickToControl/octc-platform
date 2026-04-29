# @1c2c/eslint-config

Shared ESLint flat configs (ESLint 9+) for OneClickToControl LLC repos.

## Install

```bash
pnpm add -D @1c2c/eslint-config eslint typescript \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

For Next.js apps add:

```bash
pnpm add -D @next/eslint-plugin-next
```

## Use

### Generic TS / JS

```js
// eslint.config.js
import config from "@1c2c/eslint-config";
export default config;
```

### Next.js

```js
// eslint.config.js
import nextConfig from "@1c2c/eslint-config/next";
export default nextConfig;
```

### Publishable library

```js
// eslint.config.js
import libConfig from "@1c2c/eslint-config/library";
export default libConfig;
```

## Provenance

Published with npm provenance. Verify in your CI:

```bash
pnpm dlx audit-signatures || npm audit signatures
```

See [docs/packages/POLICY.md](../../docs/packages/POLICY.md).

## Versioning

Strict SemVer. Changesets-driven. Breaking rule changes will land in major bumps with documented migrations.
