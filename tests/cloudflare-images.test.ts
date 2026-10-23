import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { generateCloudflareScenes } from "../lib/cloudflare-images.ts";
import {
  composeStoryPlan,
  pageImagesSchema,
  createScenePrompt,
} from "../lib/story-illustrations.ts";

const paragraphs = Array.from(
  { length: 6 },
  (_, i) =>
    `La tortuga visita el jardín y descubre una flor en la escena ${i + 1}.`,
);
const description =
  "Una tortuga dorada con una pequeña mochila azul en el jardín.";
const plan = composeStoryPlan(paragraphs, description);

test("Cloudflare genera seis escenas acotadas, con personajes y hasta dos llamadas simultáneas", async () => {
  let active = 0,
    peak = 0;
  const prompts: string[] = [];
  const png = await sharp({
    create: { width: 8, height: 8, channels: 3, background: "#78ad81" },
  })
    .png()
    .toBuffer();
  const fetcher = (async (url, init) => {
    assert.match(
      String(url),
      /accounts\/[a-f0-9]{32}\/ai\/run\/@cf\/black-forest-labs\/flux-1-schnell$/,
    );
    active++;
    peak = Math.max(peak, active);
    const input = JSON.parse(String(init?.body));
    prompts.push(input.prompt);
    assert.equal(input.steps, 4);
    await new Promise((resolve) => setTimeout(resolve, 3));
    active--;
    return Response.json({
      success: true,
      result: { image: png.toString("base64") },
    });
  }) as typeof fetch;
  const images = await generateCloudflareScenes({
    plan,
    description,
    paragraphs,
    token: "test-only",
    accountId: "a".repeat(32),
    signal: new AbortController().signal,
    fetcher,
  });
  assert.equal(images.filter(Boolean).length, 6);
  assert.equal(pageImagesSchema.safeParse(images).success, true);
  assert.equal(new Set(prompts).size, 6);
  assert.equal(peak, 2);
  for (let i = 0; i < 6; i++) {
    assert.match(prompts[i], /tortuga/);
    assert.ok(prompts[i].length <= 2048);
    assert.ok(prompts[i].includes(`escena ${i + 1}`));
    const meta = await sharp(
      Buffer.from(images[i]!.split(",")[1], "base64"),
    ).metadata();
    assert.equal(meta.format, "webp");
  }
});

test("una cuota agotada detiene nuevas solicitudes y una configuración incompleta no llama al proveedor", async () => {
  let calls = 0;
  const fetcher = (async () => {
    calls++;
    return new Response("quota", { status: 429 });
  }) as typeof fetch;
  const params = {
    plan,
    description,
    paragraphs,
    token: "test-only",
    accountId: "a".repeat(32),
    signal: new AbortController().signal,
    fetcher,
  };
  const result = await generateCloudflareScenes(params);
  assert.equal(
    result.every((image) => image === null),
    true,
  );
  assert.ok(calls <= 2);
  calls = 0;
  await generateCloudflareScenes({ ...params, accountId: "" });
  assert.equal(calls, 0);
  assert.equal(
    pageImagesSchema.safeParse(
      Array(6).fill("https://untrusted.example/image.svg"),
    ).success,
    false,
  );
  assert.ok(
    createScenePrompt(plan, description, paragraphs[0], 0).includes(
      "characters",
    ),
  );
});
