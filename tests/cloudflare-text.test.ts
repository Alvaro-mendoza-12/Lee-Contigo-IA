import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import {
  generateCloudflareObject,
  openRouterBudget,
} from "../lib/cloudflare-text.ts";

test("el respaldo de Cloudflare conserva esquema, cancelación y una única llamada", async () => {
  let calls = 0;
  const signal = new AbortController().signal;
  const input = {
    schema: z.object({ action: z.string().min(3) }).strict(),
    instructions: "Instrucciones de tutor",
    prompt: "Pasaje ficticio",
    maxOutputTokens: 500,
    signal,
    token: "test-only",
    accountId: "a".repeat(32),
  };
  const result = await generateCloudflareObject({
    ...input,
    fetcher: (async (url, options) => {
      calls++;
      assert.match(String(url), /llama-3.3-70b-instruct-fp8-fast$/);
      assert.equal(options?.signal, signal);
      const body = JSON.parse(String(options?.body));
      assert.equal(body.response_format.type, "json_schema");
      assert.equal(body.max_tokens, 500);
      assert.equal(body.messages.length, 2);
      return Response.json({
        success: true,
        result: { response: { action: "Vuelve al pasaje" } },
      });
    }) as typeof fetch,
  });
  assert.deepEqual(result, { action: "Vuelve al pasaje" });
  assert.equal(calls, 1);
  await assert.rejects(
    generateCloudflareObject({
      ...input,
      fetcher: (async () =>
        Response.json({
          success: true,
          result: { response: { arbitrary: "no" } },
        })) as typeof fetch,
    }),
  );
  assert.equal(openRouterBudget(10500, 2000), 0);
  assert.equal(openRouterBudget(12500, 2000), 2000);
  assert.equal(openRouterBudget(50000, 15000), 17000);
});
