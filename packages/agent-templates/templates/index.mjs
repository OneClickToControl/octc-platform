// Re-export the file paths so consumers can resolve them via package exports.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const paths = {
  claude: join(__dirname, "CLAUDE.md"),
  agents: join(__dirname, "AGENTS.md"),
  cursorBase: join(__dirname, "cursor/00-octc-base.mdc"),
  cursorTooling: join(__dirname, "cursor/01-octc-tooling.mdc"),
};
