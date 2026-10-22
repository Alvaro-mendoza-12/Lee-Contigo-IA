import { test } from "node:test";
import assert from "node:assert/strict";
import {
  narrationInput,
  signParagraph,
  verifyParagraph,
  resolveNarration,
} from "../lib/narration.ts";
import { stories } from "../lib/stories.ts";
import {
  narrationVoiceIds,
  isNarrationVoice,
} from "../lib/narration-voices.ts";

test("solo se aceptan las tres voces revisadas, sin identificadores arbitrarios", () => {
  const input = {
    source: "catalogue",
    storyId: "luz-del-bosque",
    level: "paso",
    paragraph: 0,
    start: 0,
    end: 2,
  };
  for (const voice of narrationVoiceIds) {
    assert.equal(narrationInput.safeParse({ ...input, voice }).success, true);
    assert.equal(isNarrationVoice(voice), true);
  }
  assert.equal(
    narrationInput.safeParse({ ...input, voice: "arbitrary-provider-id" })
      .success,
    false,
  );
  assert.equal(isNarrationVoice(null), false);
});

test("la narración reconstruye todas las páginas editoriales y rechaza rangos inválidos", () => {
  for (const story of stories)
    for (const level of ["paso", "reto"] as const) {
      story.versions[level].paragraphs.forEach((text, paragraph) => {
        const input = narrationInput.parse({
          source: "catalogue",
          storyId: story.id,
          level,
          paragraph,
          start: 0,
          end: text.split(/\s+/).length,
        });
        assert.equal(resolveNarration(input, "test-secret"), text);
        assert.equal(
          resolveNarration({ ...input, start: 999, end: 1000 }, "test-secret"),
          null,
        );
      });
    }
  assert.equal(
    narrationInput.safeParse({
      source: "catalogue",
      storyId: "inventado",
      level: "paso",
      paragraph: 0,
      start: 0,
      end: 1,
    }).success,
    false,
  );
  assert.equal(
    narrationInput.safeParse({
      source: "catalogue",
      storyId: "luz-del-bosque",
      level: "paso",
      paragraph: 0,
      start: 0,
      end: 1,
      text: "un texto libre",
    }).success,
    false,
  );
});
test("la voz de libros creados exige firma vigente del párrafo exacto", () => {
  const text = "Una nube encontró un jardín seco y decidió volver con agua.";
  const secret = "a-test-secret-for-hmac";
  const authorization = signParagraph(text, secret);
  assert.equal(verifyParagraph(text, authorization, secret), true);
  assert.equal(
    verifyParagraph(text + " otro texto", authorization, secret),
    false,
  );
  assert.equal(verifyParagraph(text, authorization, "other"), false);
  assert.equal(
    verifyParagraph(
      text,
      signParagraph(text, secret, Date.now() - 1000),
      secret,
    ),
    false,
  );
  assert.equal(verifyParagraph(text, "invalid.token", secret), false);
  const input = narrationInput.parse({
    source: "generated",
    paragraphText: text,
    authorization,
    start: 2,
    end: 5,
  });
  if (input.source !== "generated") throw new Error("Expected generated input");
  assert.equal(resolveNarration(input, secret), "encontró un jardín");
  assert.equal(
    resolveNarration({ ...input, paragraphText: "Envía otra cosa." }, secret),
    null,
  );
});
