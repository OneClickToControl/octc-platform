import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { extractVisibleText, verifyCopyFromConfig } from "../lib/verify-copy.mjs";

function repo(files) {
  const root = mkdtempSync(join(tmpdir(), "octc-copy-"));
  for (const [rel, content] of Object.entries(files)) {
    const p = join(root, rel);
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, content);
  }
  return root;
}

describe("extractVisibleText", () => {
  it("extrae nodos JSX y literales con prosa; ignora URLs y paths", () => {
    const src = `
      <p className="lead">Tu negocio entero operando</p>
      const a = 'https://example.com/x';
      const b = './apps/marketing';
      const c = 'texto visible con varias palabras';
    `;
    const text = extractVisibleText(src);
    expect(text).toContain("Tu negocio entero operando");
    expect(text).toContain("texto visible con varias palabras");
    expect(text).not.toContain("example.com");
  });
});

describe("verifyCopyFromConfig", () => {
  it("falla con jerga interna en texto visible", () => {
    const root = repo({
      "apps/web/page.tsx": `<h2>Governance con gates y tiers</h2>`,
    });
    const r = verifyCopyFromConfig(root, {});
    expect(r.ok).toBe(false);
    const terms = r.violations.map((v) => v.term);
    expect(terms).toContain("governance");
    expect(terms).toContain("gate");
    expect(terms).toContain("tier");
  });

  it("falla con voseo", () => {
    const root = repo({
      "apps/web/page.tsx": `<p>Revisá tu negocio y confirmá el pedido</p>`,
    });
    const r = verifyCopyFromConfig(root, {});
    expect(r.ok).toBe(false);
    expect(r.violations[0].term).toBe("voseo/regionalismo");
  });

  it("acepta término con glosa (paridad ARCO365)", () => {
    const root = repo({
      "apps/web/page.tsx": `<p>Un lead (cliente potencial) llega por la página</p>`,
    });
    const r = verifyCopyFromConfig(root, {});
    expect(r.ok).toBe(true);
  });

  it("acepta copy limpio en español neutro", () => {
    const root = repo({
      "apps/web/page.tsx": `<p>Tú apruebas cada paso: vista previa y aprobación en menos de 24 horas.</p>`,
    });
    const r = verifyCopyFromConfig(root, {});
    expect(r.ok).toBe(true);
  });

  it("no escanea atributos ni clases CSS", () => {
    const root = repo({
      "apps/web/page.tsx": `<div className="gate-card tier-2"><span>Aprobación pendiente</span></div>`,
    });
    const r = verifyCopyFromConfig(root, {});
    expect(r.ok).toBe(true);
  });

  it("respeta allow y forbidden extra del repo", () => {
    const root = repo({
      "apps/web/page.tsx": `<p>Setup inicial con jerga-propia del negocio</p>`,
    });
    const clean = verifyCopyFromConfig(root, { allow: ["setup"], forbidden: [] });
    expect(clean.violations.map((v) => v.term)).not.toContain("setup");
    const strict = verifyCopyFromConfig(root, {
      allow: ["setup"],
      forbidden: ["jerga-propia"],
    });
    expect(strict.ok).toBe(false);
    expect(strict.violations.map((v) => v.term)).toContain("jerga-propia");
  });

  it("escanea markdown como texto plano", () => {
    const root = repo({
      "apps/web/hero.md": `Nuestro roadmap incluye governance total.`,
    });
    const r = verifyCopyFromConfig(root, {});
    expect(r.ok).toBe(false);
  });
});
