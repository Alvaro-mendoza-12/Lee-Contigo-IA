import { generateText, Output } from "ai";
import { z } from "zod";
import { getTextAiFallbackModels, getTextAiModel } from "./ai-models.ts";
import { getGatewayFailureDetails } from "./ai-diagnostics.ts";
import { generateOpenRouterObject, getOpenRouterKeys } from "./openrouter.ts";
import {
  generateCloudflareObject,
  hasCloudflareText,
  openRouterBudget,
} from "./cloudflare-text.ts";

export function hasTextAi() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL === "1" ||
    getOpenRouterKeys().length ||
    hasCloudflareText(),
  );
}

export async function generateStructuredText<T>({
  schema,
  instructions,
  prompt,
  maxOutputTokens,
  timeoutMs,
  feature,
  signal,
}: {
  schema: z.ZodType<T>;
  instructions: string;
  prompt: string;
  maxOutputTokens: number;
  timeoutMs: number;
  feature: string;
  signal?: AbortSignal;
}): Promise<{ output: T }> {
  const started = Date.now();
  const cloudflare = hasCloudflareText();
  const deadline = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
    : AbortSignal.timeout(timeoutMs);
  const keys = getOpenRouterKeys();
  const gatewayConfigured = Boolean(
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL === "1",
  );
  if (gatewayConfigured) {
    const model = getTextAiModel();
    try {
      const result = await generateText({
        model,
        instructions,
        prompt,
        output: Output.object({ schema }),
        reasoning: "low",
        providerOptions: {
          gateway: {
            tags: ["product:lee-contigo", `feature:${feature}`],
            models: getTextAiFallbackModels(model),
          },
        },
        maxOutputTokens,
        maxRetries: 0,
        abortSignal:
          keys.length || cloudflare
            ? AbortSignal.any([
                deadline,
                AbortSignal.timeout(
                  Math.min(
                    feature === "generated-story"
                      ? 15_000
                      : cloudflare
                        ? 2_000
                        : 4_500,
                    Math.floor(timeoutMs * 0.55),
                  ),
                ),
              ])
            : deadline,
      });
      return { output: schema.parse(result.output) };
    } catch (error) {
      if ((!keys.length && !cloudflare) || deadline.aborted) throw error;
      console.warn("text_provider_fallback", {
        feature,
        provider: "gateway",
        ...getGatewayFailureDetails(error),
      });
    }
  }
  const routerMs = cloudflare
    ? openRouterBudget(timeoutMs, Date.now() - started)
    : timeoutMs;
  if (keys.length && routerMs > 250) {
    try {
      return {
        output: await generateOpenRouterObject({
          schema,
          instructions,
          prompt,
          maxOutputTokens,
          signal: cloudflare
            ? AbortSignal.any([deadline, AbortSignal.timeout(routerMs)])
            : deadline,
          keys,
        }),
      };
    } catch (error) {
      if (!cloudflare || deadline.aborted) throw error;
      console.warn("text_provider_fallback", {
        feature,
        provider: "openrouter",
        name: error instanceof Error ? error.name : "unknown",
      });
    }
  }
  if (!cloudflare) throw new Error("TextAiNotConfigured");
  return {
    output: await generateCloudflareObject({
      schema,
      instructions,
      prompt,
      maxOutputTokens,
      signal: deadline,
    }),
  };
}
