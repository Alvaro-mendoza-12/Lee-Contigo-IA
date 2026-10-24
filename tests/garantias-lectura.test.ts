import { test } from "node:test";
import assert from "node:assert/strict";
import { stories } from "../lib/stories.ts";
import { fontSteps } from "../lib/reading.ts";

// Garantías verificables del objetivo de LeeContigo IA.
// Ya cubierto en tests/tutor.test.ts: 3 preguntas por versión, índice de la
// respuesta válido, párrafo existente y 2 pistas por pregunta.
// Ya cubierto en tests/progreso.test.ts (G4): sin duplicados, una recompensa
// por pregunta y como máximo 3 cuentos creados con experiencia.

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim();
}

const versiones = stories.flatMap((story) =>
  (["paso", "reto"] as const).map((nivel) => ({
    id: `${story.id}/${nivel}`,
    version: story.versions[nivel],
  })),
);

test("G2 · cada pregunta tiene una sola respuesta correcta y explicación", () => {
  for (const { id, version } of versiones)
    for (const pregunta of version.questions) {
      const opciones = pregunta.options.map(normalizar);
      assert.equal(
        new Set(opciones).size,
        opciones.length,
        `${id} ${pregunta.id}: opciones repetidas`,
      );
      assert.ok(
        pregunta.explanation.trim().length > 0,
        `${id} ${pregunta.id}: sin explicación`,
      );
    }
});

test("G2 · la evidencia apunta a un párrafo real y no vacío", () => {
  // El catálogo no guarda una cita: la evidencia es el párrafo indicado.
  for (const { id, version } of versiones)
    for (const pregunta of version.questions) {
      assert.ok(
        Number.isInteger(pregunta.paragraph) &&
          pregunta.paragraph >= 0 &&
          pregunta.paragraph < version.paragraphs.length,
        `${id} ${pregunta.id}: párrafo ${pregunta.paragraph} fuera de rango`,
      );
      assert.ok(
        version.paragraphs[pregunta.paragraph].trim().length > 0,
        `${id} ${pregunta.id}: párrafo vacío`,
      );
    }
});

test("G2 · las 3 preguntas de cada versión practican habilidades distintas", () => {
  for (const { id, version } of versiones) {
    const habilidades = version.questions.map((pregunta) => pregunta.skill);
    assert.equal(
      new Set(habilidades).size,
      habilidades.length,
      `${id}: ${habilidades.join(", ")}`,
    );
  }
});

test("G2 · ninguna pista contiene la respuesta correcta", () => {
  for (const { id, version } of versiones)
    for (const pregunta of version.questions) {
      const respuesta = ` ${normalizar(pregunta.options[pregunta.correct])} `;
      pregunta.hints.forEach((pista, indice) =>
        assert.ok(
          !` ${normalizar(pista)} `.includes(respuesta),
          `${id} ${pregunta.id}: la pista ${indice + 1} contiene «${pregunta.options[pregunta.correct]}»`,
        ),
      );
    }
});

test("G5 · el texto del cuento nunca baja de 16 px", () => {
  assert.ok(Math.min(...fontSteps.map((paso) => paso.pixels)) >= 16);
});
