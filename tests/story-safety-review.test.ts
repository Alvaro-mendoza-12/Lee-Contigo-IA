import { test } from "node:test";
import assert from "node:assert/strict";
import {
  reviewGeneratedStory,
  reviewStorySafety,
  storyConsistencyIssues,
} from "../lib/story-safety-review.ts";
import type { GeneratedStory } from "../lib/story-creator.ts";

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

test("la revisión compara idea, cuento e ilustración y falla si faltan las decisiones de coherencia", async () => {
  const saved = { ...process.env };
  const fetcher = globalThis.fetch;
  try {
    for (const name of Object.keys(process.env))
      if (/^(OPENROUTER|AI_GATEWAY|VERCEL|CLOUDFLARE)/.test(name))
        delete process.env[name];
    process.env.CLOUDFLARE_API_TOKEN = "test-only";
    process.env.CLOUDFLARE_ACCOUNT_ID = "a".repeat(32);
    const story: GeneratedStory = {
      title: "La niña y su gata",
      subtitle: "Un mapa junto al río",
      paragraphs: Array(6).fill(
        "Una niña y su gata encuentran un mapa junto al río.",
      ),
      artDescription:
        "Una niña humana y una gata, cada una con su cuerpo, junto al río.",
      questions: [],
    };
    const approved = {
      category: "safe",
      matchesIdea: true,
      internallyConsistent: true,
      artMatchesStory: true,
      explicitHybridRequest: false,
      hybridPolicyRespected: true,
    };
    let result: unknown = approved;
    let sent: Record<string, unknown> | undefined;
    globalThis.fetch = async (_input, init) => {
      sent = JSON.parse(String(init?.body));
      return Response.json({ success: true, result: { response: result } });
    };
    const idea =
      "Una niña y su gata encuentran un mapa junto al río, sin mezclas de cuerpos.";
    const review = await reviewGeneratedStory(idea, story, { timeoutMs: 7000 });
    assert.deepEqual(storyConsistencyIssues(review), []);
    const messages = sent!.messages as { role: string; content: string }[];
    assert.deepEqual(JSON.parse(messages[1].content), {
      originalIdea: idea,
      story,
    });
    assert.match(messages[0].content, /EXCLUSIVAMENTE de la idea original/);
    assert.match(messages[0].content, /negaciones/);

    result = {
      ...approved,
      matchesIdea: false,
      artMatchesStory: false,
      hybridPolicyRespected: false,
    };
    const rejected = await reviewGeneratedStory(idea, story, {
      timeoutMs: 7000,
    });
    assert.equal(storyConsistencyIssues(rejected).length, 3);

    result = { ...approved, explicitHybridRequest: true };
    const requested = await reviewGeneratedStory(
      "Un centauro ayuda a su amiga a encontrar un mapa.",
      story,
      { timeoutMs: 7000 },
    );
    assert.equal(requested.explicitHybridRequest, true);

    result = { category: "safe" };
    await assert.rejects(
      reviewGeneratedStory(idea, story, { timeoutMs: 7000 }),
    );
  } finally {
    globalThis.fetch = fetcher;
    for (const name of Object.keys(process.env))
      if (!(name in saved)) delete process.env[name];
    Object.assign(process.env, saved);
  }
});
