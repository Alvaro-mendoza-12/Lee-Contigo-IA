export const DEFAULT_TEXT_AI_MODEL = "google/gemini-3.8-flash";
export const DEFAULT_TEXT_AI_FALLBACK_MODEL = "openai/gpt-5.4-nano";

export function getTextAiModel(configuredModel = process.env.AI_MODEL) {
  return configuredModel?.trim() || DEFAULT_TEXT_AI_MODEL;
}

export function getTextAiFallbackModels(
  primaryModel: string,
  configuredFallback = process.env.AI_FALLBACK_MODEL,
) {
  const fallback = configuredFallback?.trim() || DEFAULT_TEXT_AI_FALLBACK_MODEL;
  return fallback === primaryModel ? [] : [fallback];
}
