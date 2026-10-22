import { z } from "zod";

const defaultModels = [
  "openrouter/free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3.5-super-vl:free",
];

export function getOpenRouterKeys() {
  return [
    ...new Set(
      Array.from(
        { length: 9 },
        (_, index) =>
          process.env[
            index === 0
              ? "OPENROUTER_API_KEY"
              : `OPENROUTER_API_KEY_${index + 1}`
          ],
      )
        .map((key) => key?.trim())
        .filter((key): key is string => Boolean(key)),
    ),
  ];
}

export function getFreeOpenRouterModels(
  configured = process.env.OPENROUTER_MODELS,
) {
  const models =
    configured
      ?.split(",")
      .map((model) => model.trim())
      .filter(Boolean) ?? defaultModels;
  // A paid model must never be selected through this free fallback.
  if (
    !models.length ||
    models.some(
      (model) => !model.endsWith(":free") && model !== "openrouter/free",
    )
  ) {
    throw new Error("OpenRouterFreeModelsRequired");
  }
  return [...new Set(models)];
}

export class OpenRouterError extends Error {
  status: number;
  category: string;
  constructor(status: number, category: string) {
    super("OpenRouterUnavailable");
    this.name = "OpenRouterError";
    this.status = status;
    this.category = category;
  }
}

export function shouldTryNextKey(status: number, limitSource?: string) {
  // General rate limits and account balance are shared: do not rotate on 429.
  return (
    status === 401 ||
    (status === 402 &&
      ["key", "api_key", "key_limit"].includes(limitSource ?? ""))
  );
}

export async function generateOpenRouterObject<T>({
  schema,
  instructions,
  prompt,
  maxOutputTokens,
  signal,
  fetcher = fetch,
  keys = getOpenRouterKeys(),
}: {
  schema: z.ZodType<T>;
  instructions: string;
  prompt: string;
  maxOutputTokens: number;
  signal: AbortSignal;
  fetcher?: typeof fetch;
  keys?: string[];
}): Promise<T> {
  const models = getFreeOpenRouterModels();
  for (let index = 0; index < keys.length; index++) {
    const response = await fetcher(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keys[index]}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lee-contigo-ia.vercel.app",
          "X-OpenRouter-Title": "LeeContigo IA",
        },
        body: JSON.stringify({
          models,
          messages: [
            { role: "system", content: instructions },
            { role: "user", content: prompt },
          ],
          max_tokens: maxOutputTokens,
          reasoning: { enabled: false, exclude: true },
          provider: {
            require_parameters: true,
            data_collection: "deny",
            max_price: { prompt: 0, completion: 0 },
          },
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "reading_response",
              strict: true,
              schema: z.toJSONSchema(schema),
            },
          },
        }),
        signal,
        cache: "no-store",
      },
    );
    const data = await response.json();
    if (!response.ok || data.error) {
      const status = response.ok
        ? Number(data.error?.code) || 502
        : response.status;
      const source = data.error?.metadata?.limit_source;
      if (shouldTryNextKey(status, source) && index < keys.length - 1) continue;
      // Never retain upstream messages: they may include request content.
      throw new OpenRouterError(
        status,
        status === 429 ? "rate_limit" : status === 402 ? "credits" : "provider",
      );
    }
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.length > 32_000)
      throw new OpenRouterError(502, "format");
    try {
      return schema.parse(JSON.parse(content));
    } catch {
      throw new OpenRouterError(502, "validation");
    }
  }
  throw new OpenRouterError(503, "not_configured");
}
