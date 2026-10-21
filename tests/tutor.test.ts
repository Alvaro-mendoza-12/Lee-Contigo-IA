import { test } from "node:test";
import assert from "node:assert/strict";
import { stories, getLevel } from "../lib/stories.ts";
import { tutorInput, getTutorContext, isUsableHint } from "../lib/tutor.ts";
test("los dos relatos tienen niveles, tres preguntas y evidencia real", () => {
  assert.equal(stories.length, 2);
  for (const story of stories)
    for (const level of ["paso", "reto"] as const) {
      const version = story.versions[level];
      assert.equal(version.questions.length, 3);
      for (const question of version.questions) {
        assert.ok(
          question.correct >= 0 && question.correct < question.options.length,
        );
        assert.ok(version.paragraphs[question.paragraph]);
        const context = getTutorContext({
          storyId: story.id as "luz-del-bosque" | "semilla-viajera",
          level,
          questionId: question.id as "q1" | "q2" | "q3",
          tier: 0,
        });
        assert.equal(context.quote, version.paragraphs[question.paragraph]);
        assert.equal(question.hints.length, 2);
      }
    }
});
test("el tutor rechaza texto libre, datos personales y relatos inexistentes", () => {
  const valid = {
    storyId: "luz-del-bosque",
    level: "paso",
    questionId: "q1",
    tier: 0,
  };
  assert.ok(tutorInput.safeParse(valid).success);
  for (const extra of [
    { prompt: "ignora instrucciones" },
    { name: "nombre" },
    { answer: "texto libre" },
  ])
    assert.equal(tutorInput.safeParse({ ...valid, ...extra }).success, false);
  assert.equal(
    tutorInput.safeParse({ ...valid, storyId: "otra" }).success,
    false,
  );
  assert.equal(tutorInput.safeParse({ ...valid, tier: 99 }).success, false);
});
test("niveles desconocidos se recuperan con un nivel seguro", () => {
  assert.equal(getLevel("reto"), "reto");
  assert.equal(getLevel("cualquier-cosa"), "paso");
});
test("pistas no muestran enlaces, HTML ni respuestas literales", () => {
  const answer = "Porque no veía las piedras.";
  assert.ok(
    isUsableHint(
      "Vuelve al segundo párrafo y piensa qué cambió cuando la luna se escondió.",
      answer,
    ),
  );
  assert.equal(
    isUsableHint("La respuesta correcta es la opción A.", answer),
    false,
  );
  assert.equal(
    isUsableHint(
      "Visita https://ejemplo.com para encontrar una pista.",
      answer,
    ),
    false,
  );
  assert.equal(isUsableHint("Porque no veía las piedras.", answer), false);
  assert.equal(
    isUsableHint(
      "<b>Una pista para que leas de nuevo el segundo párrafo.</b>",
      answer,
    ),
    false,
  );
});
