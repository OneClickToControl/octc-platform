# @1c2c/tsconfig

Shared TypeScript configurations for OneClickToControl LLC repos.

## Install

```bash
pnpm add -D -w @1c2c/tsconfig typescript
```

## Use

### Library (NodeNext, declaration files)

```jsonc
{
  "extends": "@1c2c/tsconfig/library.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Next.js app

```jsonc
{
  "extends": "@1c2c/tsconfig/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Generic ESM project

```jsonc
{
  "extends": "@1c2c/tsconfig/base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Provenance

Published with npm provenance. Verify in your CI:

```bash
pnpm dlx audit-signatures || npm audit signatures
```

See [docs/packages/POLICY.md](../../docs/packages/POLICY.md).

## Versioning

Strict SemVer. Changesets-driven. Major bumps notified to consumers via automated issues (see [docs/agents/ADOPTION.md](../../docs/agents/ADOPTION.md) for the analogous template policy).
