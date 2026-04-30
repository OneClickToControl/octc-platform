/** Vocabulario canónico (ADR-0003, REFERENCE_PRODUCT_MONOREPO). */
export const ALLOWED_SURFACES = Object.freeze(
  new Set([
    "landing",
    "web",
    "mobile",
    "ml",
    "api",
    "chat",
    "data",
  ]),
);

/**
 * Glob sugeridos por superficie si `paths` omite esa clave.
 * Basta que coincida uno (existencia de al menos un archivo o directorio bajo el prefijo).
 */
export const DEFAULT_PATH_GLOBS = Object.freeze({
  landing: ["apps/landing/**", "apps/web/**"],
  web: ["apps/web/**"],
  mobile: ["apps/mobile/**"],
  ml: ["apps/ml-service/**", "services/ml/**"],
  api: ["apps/api/**", "apps/chat_api/**", "services/api/**"],
  chat: ["apps/chat-web/**", "apps/chat/**"],
});
