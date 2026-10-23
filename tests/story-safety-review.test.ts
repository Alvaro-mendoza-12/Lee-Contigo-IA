import { test } from "node:test";
import assert from "node:assert/strict";
import { reviewStorySafety } from "../lib/story-safety-review.ts";

test("la moderación usa Cloudflare cuando OpenRouter no responde, sin omitir la revisión", async () => {
  const saved = { ...process.env };
  const fetcher = globalThis.fetch;
  const calls: string[] = [];
  try {
    for (const name of Object.keys(process.env))
      if (/^(OPENROUTER|AI_GATEWAY|VERCEL|CLOUDFLARE)/.test(name))
        delete process.env[name];
    process.env.OPENROUTER_API_KEY = "test-only-router-key";
    process.env.CLOUDFLARE_API_TOKEN = "test-only-cloudflare-token";
    process.env.CLOUDFLARE_ACCOUNT_ID = "a".repeat(32);
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      calls.push(url);
      assert.ok(init?.signal);
      if (url.includes("openrouter.ai"))
        return Response.json({ error: { code: 429 } }, { status: 429 });
      assert.ok(url.includes("api.cloudflare.com"));
      return Response.json({
        success: true,
        result: { response: { safe: true, category: "safe" } },
      });
    };
    assert.deepEqual(
      await reviewStorySafety("Un armadillo arma un juguete de cartón", {
        timeoutMs: 8000,
      }),
      { safe: true, category: "safe" },
    );
    assert.equal(calls.length, 2);

    // Invalid/absent provider output is never silently interpreted as safe.
    globalThis.fetch = async () =>
      Response.json({
        success: true,
        result: { response: { safe: true, category: "inventada" } },
      });
    delete process.env.OPENROUTER_API_KEY;
    await assert.rejects(
      reviewStorySafety("Una tortuga ayuda a una nube", { timeoutMs: 8000 }),
    );
    delete process.env.CLOUDFLARE_API_TOKEN;
    await assert.rejects(
      reviewStorySafety("Una tortuga ayuda a una nube", { timeoutMs: 8000 }),
    );
  } finally {
    globalThis.fetch = fetcher;
    for (const name of Object.keys(process.env))
      if (!(name in saved)) delete process.env[name];
    Object.assign(process.env, saved);
  }
});
