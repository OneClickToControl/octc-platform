# Template: privacy-guard (public repo)

Reference copy of the stack used in the public **OneClickToControl/octc-platform** repo before making a previously private repo public (or to keep a public repo free of operational leaks).

## Contents

| File in this folder | Destination in adopting repo |
|-------------------------|--------------------------------|
| `gitleaks.toml` | `.gitleaks.toml` (root) |
| `precommit-privacy-check.sh` | `scripts/precommit-privacy-check.sh` (adjust paths and regex) |
| `privacy-guard.yml` | `.github/workflows/privacy-guard.yml` |

## Adoption steps

1. **Policy:** write `PUBLIC_REPO_POLICY.md` (or equivalent) defining what must not appear in the public repo.
2. **Rules:** edit `gitleaks.toml` — custom rules (Sentry org id, private repo names, tokens) and `[allowlist].paths` for files that *may* cite those terms (policy definition, this template, etc.).
3. **Pre-commit:** edit `ALLOWLIST_REGEX` and `PATTERNS` in `precommit-privacy-check.sh` to match your policy and paths.
4. **CI:** copy the workflow; ensure jobs call `.gitleaks.toml` and the script at real paths.
5. **Branch protection:** require the `privacy-guard` workflow on `main` (or `trunk`).
6. **Local hook** (optional): install a hook that runs `scripts/precommit-privacy-check.sh` in `git` mode before commit.

## Notes

- Example files may contain **OneClickToControl-specific** names/resolutions in rules (as a pattern). Replace with your org’s before reusing the template elsewhere.
- Keep the **allowlist** in sync between `gitleaks.toml` and the bash script; otherwise one will pass and the other fail.
- For Apache-2.0, this repo invokes the `gitleaks` binary in CI instead of the commercial action that requires an org license.

## Updates

The canonical version evolves in **OneClickToControl/octc-platform**. After merging improvements there, copy applicable files again or diff against this template.
