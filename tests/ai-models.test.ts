import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_TEXT_AI_FALLBACK_MODEL,
  DEFAULT_TEXT_AI_MODEL,
  getTextAiFallbackModels,
  getTextAiModel,
} from "../lib/ai-models.ts";

test("uses the current default model and a distinct fallback", () => {
  assert.equal(getTextAiModel(""), DEFAULT_TEXT_AI_MODEL);
  assert.deepEqual(getTextAiFallbackModels(DEFAULT_TEXT_AI_MODEL, ""), [
    DEFAULT_TEXT_AI_FALLBACK_MODEL,
  ]);
});

test("allows a configured fallback without repeating the primary model", () => {
  assert.equal(
    getTextAiModel("  openai/gpt-5.4-nano  "),
    "openai/gpt-5.4-nano",
  );
  assert.deepEqual(
    getTextAiFallbackModels("google/gemini-3.8-flash", " openai/gpt-5.4-nano "),
    ["openai/gpt-5.4-nano"],
  );
  assert.deepEqual(
    getTextAiFallbackModels("openai/gpt-5.4-nano", "openai/gpt-5.4-nano"),
    [],
  );
});
