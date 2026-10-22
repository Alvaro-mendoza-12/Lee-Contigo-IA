import { z } from "zod";

export const CLOUDFLARE_TEXT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export function hasCloudflareText() {
  return Boolean(
    process.env.CLOUDFLARE_API_TOKEN &&
    /^[a-f0-9]{32}$/i.test(process.env.CLOUDFLARE_ACCOUNT_ID ?? ""),
  );
}
export function openRouterBudget(total: number, elapsed: number) {
  return Math.max(
    0,
    total - elapsed - Math.min(18000, Math.max(8500, total * 0.4)),
  );
}

export async function generateCloudflareObject<T>({
  schema,
  instructions,
  prompt,
  maxOutputTokens,
  signal,
  fetcher = fetch,
  token = process.env.CLOUDFLARE_API_TOKEN,
  accountId = process.env.CLOUDFLARE_ACCOUNT_ID,
}: {
  schema: z.ZodType<T>;
  instructions: string;
  prompt: string;
  maxOutputTokens: number;
  signal: AbortSignal;
  fetcher?: typeof fetch;
  token?: string;
  accountId?: string;
}): Promise<T> {
  if (!token || !/^[a-f0-9]{32}$/i.test(accountId ?? ""))
    throw new Error("CloudflareTextNotConfigured");
  const response = await fetcher(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_TEXT_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: prompt },
        ],
        max_tokens: maxOutputTokens,
        response_format: {
          type: "json_schema",
          json_schema: z.toJSONSchema(schema),
        },
      }),
      signal,
      cache: "no-store",
    },
  );
  if (!response.ok) {
    console.warn("cloudflare_text_unavailable", { status: response.status });
    throw new Error("CloudflareTextUnavailable");
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error("CloudflareTextBodyMissing");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 120_000) throw new Error("CloudflareTextTooLarge");
      chunks.push(part.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (body.success !== true) throw new Error("CloudflareTextUnavailable");
  const output = body.result?.response;
  return schema.parse(typeof output === "string" ? JSON.parse(output) : output);
}
