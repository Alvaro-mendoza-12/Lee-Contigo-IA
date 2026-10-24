import { test } from "node:test";
import assert from "node:assert/strict";
import { planRasterScenes } from "../lib/raster-scene-plan.ts";

test("el planificador de escenas usa OpenRouter antes del fallback de Cloudflare", async () => {
  const saved = { ...process.env };
  const fetcher = globalThis.fetch;
  const calls: string[] = [];
  const brief = {
    characters: "A golden turtle with a small blue backpack, consistent design.",
    scenes: Array.from(
      { length: 6 },
      (_, index) =>
        `A golden turtle with a small blue backpack explores scene ${index + 1} in the garden.`,
    ),
  };
  try {
    for (const name of Object.keys(process.env))
      if (/^(OPENROUTER|AI_GATEWAY|VERCEL|CLOUDFLARE)/.test(name))
        delete process.env[name];
    process.env.OPENROUTER_API_KEY = "test-only-router-key";
    process.env.CLOUDFLARE_API_TOKEN = "test-only-cloudflare-token";
    process.env.CLOUDFLARE_ACCOUNT_ID = "a".repeat(32);
    globalThis.fetch = async (input) => {
      const url = String(input);
      calls.push(url);
      assert.ok(url.includes("openrouter.ai"));
      return Response.json({
        choices: [{ message: { content: JSON.stringify(brief) } }],
      });
    };

    const planned = await planRasterScenes({
      description: "Una tortuga dorada explora un jardín con flores.",
      paragraphs: Array.from(
        { length: 6 },
        (_, index) => `La tortuga descubre una flor en la escena ${index + 1}.`,
      ),
      signal: new AbortController().signal,
    });

    assert.equal(calls.length, 1);
    assert.equal(planned.scenes.length, 6);
    assert.match(planned.characters, /turtle/);
  } finally {
    globalThis.fetch = fetcher;
    for (const name of Object.keys(process.env))
      if (!(name in saved)) delete process.env[name];
    Object.assign(process.env, saved);
  }
});
