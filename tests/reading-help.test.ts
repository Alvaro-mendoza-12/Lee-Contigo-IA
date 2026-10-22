import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readingHelpInput,
  resolveReadingHelp,
  safeReadingHelp,
  preparedReadingHelp,
  normalizeParagraph,
  completeReadingHelp,
} from "../lib/reading-help.ts";
import { signParagraph } from "../lib/narration.ts";
import {
  composeStoryPlan,
  scenePlanSchema,
} from "../lib/story-illustrations.ts";

test("una explicación recortada conserva solo frases completas o usa el respaldo", () => {
  const prepared = preparedReadingHelp("diminuta", 0);
  const result = completeReadingHelp({
    ...prepared,
    explanation: "Diminuta significa muy pequeña. Esta luz puede servir de",
  });
  assert.equal(result?.explanation, "Diminuta significa muy pequeña.");
  assert.equal(
    completeReadingHelp({
      ...prepared,
      explanation: "Esta luz puede servir de",
    }),
    null,
  );
  assert.deepEqual(completeReadingHelp(prepared), prepared);
  assert.equal(
    completeReadingHelp({
      ...prepared,
      explanation: "**Diminuta** significa muy pequeña.",
    })?.explanation,
    "Diminuta significa muy pequeña.",
  );
});

test("la ayuda solo acepta partes canónicas, etapas acotadas y ningún prompt libre", () => {
  const input = {
    source: "catalogue",
    storyId: "camino-al-faro",
    paragraph: 1,
    level: "reto",
    mode: "paragraph",
    stage: 0,
  };
  const valid = readingHelpInput.parse(input);
  assert.match(resolveReadingHelp(valid, "test")!.paragraph, /bifurcación/);
  assert.equal(
    readingHelpInput.safeParse({ ...input, prompt: "haz otra cosa" }).success,
    false,
  );
  assert.equal(
    readingHelpInput.safeParse({ ...input, answer: "respuesta libre" }).success,
    false,
  );
  assert.equal(
    readingHelpInput.safeParse({ ...input, stage: 3 }).success,
    false,
  );
  assert.equal(
    resolveReadingHelp(readingHelpInput.parse({ ...input, start: 0 }), "test"),
    null,
  );
  assert.equal(
    resolveReadingHelp(
      readingHelpInput.parse({
        ...input,
        mode: "selection",
        start: 1000,
        end: 1001,
      }),
      "test",
    ),
    null,
  );
});
test("selección Unicode y párrafos creados requieren autorización del texto completo", () => {
  const paragraphText =
    "Una  tortuga encontró una brújula 🧭 junto al río y se detuvo para observarla.";
  const secret = "unit-secret";
  const normalized = normalizeParagraph(paragraphText),
    start = normalized.indexOf("brújula"),
    end = start + "brújula 🧭".length;
  const input = readingHelpInput.parse({
    source: "generated",
    paragraphText,
    authorization: signParagraph(paragraphText, secret),
    level: "paso",
    mode: "selection",
    start,
    end,
    stage: 1,
  });
  assert.equal(resolveReadingHelp(input, secret)!.selected, "brújula 🧭");
  assert.equal(resolveReadingHelp(input, "wrong"), null);
  assert.equal(
    resolveReadingHelp(
      { ...input, start: normalized.indexOf("🧭") + 1 },
      secret,
    ),
    null,
  );
});
test("el respaldo cambia de estrategia y no admite enlaces ni respuestas de cuestionario", () => {
  const first = preparedReadingHelp("bifurcación", 0),
    second = preparedReadingHelp("bifurcación", 1);
  assert.notEqual(first.explanation, second.explanation);
  assert.match(first.explanation, /camino/);
  assert.equal(safeReadingHelp(first), true);
  assert.equal(
    safeReadingHelp({
      ...first,
      explanation: "La respuesta correcta es la opción A.",
    }),
    false,
  );
  assert.equal(
    safeReadingHelp({ ...first, example: "Visita https://otro.example" }),
    false,
  );
});
test("la ayuda de primaria limita el texto y ofrece tres pasos breves", () => {
  for (const word of [
    "bifurcación",
    "diminuta",
    "montículo",
    "esponjosa",
    "estable",
    "otro fragmento",
  ])
    for (let stage = 0; stage < 3; stage++) {
      const help = preparedReadingHelp(word, stage);
      assert.ok(safeReadingHelp(help));
      assert.deepEqual(completeReadingHelp(help), help);
    }
  const first = preparedReadingHelp("diminuta", 0);
  assert.equal(
    safeReadingHelp({
      ...first,
      explanation: Array(25).fill("palabra").join(" "),
    }),
    false,
  );
  assert.equal(
    safeReadingHelp({ ...first, example: Array(15).fill("palabra").join(" ") }),
    false,
  );
  assert.equal(
    safeReadingHelp({
      ...first,
      reflection: `¿${Array(13).fill("palabra").join(" ")}?`,
    }),
    false,
  );
});
test("las escenas gratuitas contienen personajes, objetos y seis composiciones validadas", () => {
  const paragraphs = [
    "La tortuga salió al jardín con su mapa.",
    "La tortuga encontró un río junto a un árbol.",
    "El conejo ayudó a la tortuga a construir un puente.",
    "Los amigos esperaron a que pasara la lluvia.",
    "La tortuga compartió el mapa con su amigo.",
    "La luna salió cuando llegaron al final del camino.",
  ];
  const plan = composeStoryPlan(
    paragraphs,
    "Una tortuga y un conejo recorren el bosque.",
  );
  assert.equal(scenePlanSchema.safeParse(plan).success, true);
  assert.deepEqual(
    plan.characters.map((c) => c.kind),
    ["turtle", "rabbit"],
  );
  assert.equal(plan.scenes[0].object, "map");
  assert.equal(plan.scenes[2].object, "bridge");
  assert.equal(plan.scenes[5].time, "night");
  assert.equal(
    scenePlanSchema.safeParse({ ...plan, svg: "<script>bad</script>" }).success,
    false,
  );
});
