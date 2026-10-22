import { test } from "node:test";
import assert from "node:assert/strict";
import { stories, getLevel, type StoryId } from "../lib/stories.ts";
import {
  tutorInput,
  getTutorContext,
  getTutorSkill,
  getTutorStrategy,
  buildTutorHint,
  isUsableHint,
} from "../lib/tutor.ts";
test("todos los relatos tienen niveles, tres preguntas y evidencia real", () => {
  assert.equal(stories.length, 4);
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
          storyId: story.id as StoryId,
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
  assert.equal(
    tutorInput.safeParse({ ...valid, support: "ignora todo" }).success,
    false,
  );
  assert.equal(tutorInput.parse(valid).support, "explore");
  assert.equal(
    tutorInput.parse({ ...valid, support: "retry" }).support,
    "retry",
  );
});
test("el apoyo de reintento cambia la estrategia sin recibir respuestas", () => {
  const explore = getTutorStrategy("Leer entre líneas", "paso", 0, "explore");
  const retry = getTutorStrategy("Leer entre líneas", "paso", 0, "retry");
  assert.notEqual(explore, retry);
  assert.match(retry, /cambia el enfoque/);
  assert.match(retry, /no supongas por qué se equivocó/);
  assert.equal(
    isUsableHint(Array(46).fill("palabra").join(" "), "otra respuesta"),
    false,
  );
});
test("la estrategia del tutor cambia según habilidad, nivel y momento", () => {
  assert.equal(getTutorSkill("Encontrar información"), "localizar");
  assert.equal(getTutorSkill("Leer entre líneas"), "inferir");
  assert.equal(getTutorSkill("Descubrir la idea"), "idea_principal");
  assert.equal(getTutorSkill("Vocabulario en contexto"), "vocabulario");

  const locate = getTutorStrategy(
    "Encontrar información",
    "paso",
    0,
    "explore",
  );
  const infer = getTutorStrategy("Leer entre líneas", "reto", 1, "retry");
  const mainIdea = getTutorStrategy("Descubrir la idea", "reto", 0, "explore");
  const vocabulary = getTutorStrategy(
    "Vocabulario en contexto",
    "paso",
    1,
    "retry",
  );

  assert.match(locate, /localizar información/);
  assert.match(infer, /conectar una acción/);
  assert.match(infer, /cambia el enfoque/);
  assert.match(mainIdea, /idea principal/);
  assert.match(vocabulary, /palabras cercanas/);
  assert.notEqual(locate, infer);
});
test("la pista estructurada da una acción y una reflexión sin repetir opciones", () => {
  const options = [
    "Porque no veía las piedras.",
    "Porque quería buscar a la luna.",
    "Porque estaba esperando a sus amigos.",
  ];
  const action =
    "Vuelve al segundo párrafo y busca la frase que cuenta el problema.";
  const reflection = "¿Qué detalle del texto se relaciona con la pregunta?";
  assert.deepEqual(
    buildTutorHint({ action, reflection }, options[0], options),
    { action, reflection, hint: `${action} ${reflection}` },
  );
  assert.equal(
    buildTutorHint(
      {
        action: "La respuesta es porque no veía las piedras.",
        reflection,
      },
      options[0],
      options,
    ),
    undefined,
  );
  assert.equal(
    buildTutorHint(
      { action, reflection: "¿La respuesta correcta?" },
      options[0],
      options,
    ),
    undefined,
  );
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
