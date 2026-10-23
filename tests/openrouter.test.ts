import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import {
  generateOpenRouterObject,
  getFreeOpenRouterModels,
  getOpenRouterKeys,
  shouldTryNextKey,
  OpenRouterError,
} from "../lib/openrouter.ts";

test("OpenRouter loads numbered and bulk server credentials beyond nine without duplicates", () => {
  const environment = {
    OPENROUTER_API_KEY: " example-1 ",
    OPENROUTER_API_KEY_10: "example-10",
    OPENROUTER_API_KEY_2: "example-2",
    OPENROUTER_API_KEY_60: "example-60",
    OPENROUTER_API_KEY_01: "ignore-leading-zero",
    NEXT_PUBLIC_OPENROUTER_API_KEY: "ignore-public",
    OPENROUTER_API_KEYS: JSON.stringify([
      "example-2",
      " bulk-example ",
      "",
      42,
    ]),
  };
  assert.deepEqual(getOpenRouterKeys(environment), [
    "example-1",
    "example-2",
    "example-10",
    "example-60",
    "bulk-example",
  ]);
  const sixty = Object.fromEntries(
    Array.from({ length: 60 }, (_, index) => [
      index === 0 ? "OPENROUTER_API_KEY" : `OPENROUTER_API_KEY_${index + 1}`,
      `example-${index + 1}`,
    ]),
  );
  assert.equal(getOpenRouterKeys(sixty).length, 60);
});

test("an invalid optional pool preserves the configured server credentials", () => {
  for (const pool of ["not-json", '{"key":"example"}', '"example"', "null"]) {
    assert.deepEqual(
      getOpenRouterKeys({
        OPENROUTER_API_KEY: "example-1",
        OPENROUTER_API_KEYS: pool,
      }),
      ["example-1"],
    );
  }
  assert.deepEqual(getOpenRouterKeys({}), []);
});

test("OpenRouter permits only free models and does not rotate account rate limits", () => {
  assert.ok(
    getFreeOpenRouterModels().every(
      (model) => model.endsWith(":free") || model === "openrouter/free",
    ),
  );
  assert.throws(() => getFreeOpenRouterModels("openai/gpt-5.4"));
  assert.equal(shouldTryNextKey(401), true);
  assert.equal(shouldTryNextKey(402, "api_key"), true);
  assert.equal(shouldTryNextKey(402, "account"), false);
  assert.equal(shouldTryNextKey(429), false);
  assert.equal(shouldTryNextKey(403), false);
});

test("OpenRouter uses the next credential after invalid authentication and validates the result", async () => {
  const authorization: string[] = [];
  const output = await generateOpenRouterObject({
    schema: z.object({ action: z.string() }),
    instructions: "fictional instructions",
    prompt: "fictional text",
    maxOutputTokens: 100,
    signal: AbortSignal.timeout(1000),
    keys: ["example-1", "example-2"],
    fetcher: (async (_url, options) => {
      authorization.push(
        (options?.headers as Record<string, string>).Authorization,
      );
      const body = JSON.parse(options?.body as string);
      assert.deepEqual(body.provider.max_price, { prompt: 0, completion: 0 });
      assert.equal(body.provider.data_collection, "deny");
      assert.deepEqual(body.reasoning, { enabled: false, exclude: true });
      return authorization.length === 1
        ? Response.json({ error: { code: 401 } }, { status: 401 })
        : Response.json({
            choices: [
              {
                message: {
                  content: JSON.stringify({ action: "Vuelve al texto" }),
                },
              },
            ],
          });
    }) as typeof fetch,
  });
  assert.deepEqual(output, { action: "Vuelve al texto" });
  assert.equal(authorization.length, 2);
});

test("OpenRouter stops on rate limits without trying other credentials", async () => {
  let calls = 0;
  await assert.rejects(
    generateOpenRouterObject({
      schema: z.object({ action: z.string() }),
      instructions: "fictional",
      prompt: "fictional",
      maxOutputTokens: 100,
      signal: AbortSignal.timeout(1000),
      keys: ["example-1", "example-2"],
      fetcher: (async () => {
        calls++;
        return Response.json({ error: { code: 429 } }, { status: 429 });
      }) as typeof fetch,
    }),
    (error: unknown) =>
      error instanceof OpenRouterError && error.status === 429,
  );
  assert.equal(calls, 1);
});
