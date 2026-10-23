import { test } from "node:test";
import assert from "node:assert/strict";
import {
  composeStoryPlan,
  createScenePrompt,
  scenePlanSchema,
} from "../lib/story-illustrations.ts";
import {
  authorizeIllustrations,
  verifyIllustrationPolicy,
} from "../lib/illustration-authorization.ts";
import { signParagraph } from "../lib/narration.ts";

test("las especies y personajes de cada escena proceden del relato, sin sustitutos humanos", () => {
  const paragraphs = [
    "La tortuga empieza su aventura en el jardín y busca su mapa.",
    "La tortuga encuentra el mapa y lo comparte con una gata.",
    "Las dos siguen juntas el camino hasta el río.",
    "En el jardín descansan las plantas bajo el sol.",
    "La niña aparece y saluda a la gata junto al río.",
    "Una gata se despide y vuelve a su jardín al atardecer.",
  ];
  const plan = scenePlanSchema.parse(
    composeStoryPlan(
      paragraphs,
      "Una tortuga y una gata junto al jardín; no hay pájaros ni perros.",
    ),
  );
  const visible = (index: number) =>
    plan.scenes[index].characterIndexes!.map((i) => plan.characters[i].kind);
  assert.deepEqual(visible(0), ["turtle"]);
  assert.deepEqual(visible(1), ["turtle", "cat"]);
  assert.deepEqual(visible(2), ["turtle", "cat"]);
  assert.deepEqual(visible(3), []);
  assert.deepEqual(visible(4), ["child", "cat"]);
  assert.equal(plan.scenes[1].setting, "garden"); // "comparte" is not "mar".
  assert.equal(plan.scenes[1].object, "map");
  assert.equal(
    plan.characters.some((c) => c.kind === "bird" || c.kind === "dog"),
    false,
  );

  const unsupported = composeStoryPlan(
    Array(6).fill("El elefante pasea por la sabana y busca agua."),
    "Un elefante gris en la sabana.",
  );
  assert.deepEqual(unsupported.characters, []);
  assert.equal(scenePlanSchema.safeParse(unsupported).success, true);
  assert.equal(
    scenePlanSchema.safeParse({
      ...plan,
      scenes: plan.scenes.map((s) => ({ ...s, characterIndexes: [2, 2] })),
    }).success,
    false,
  );
});

test("la generación raster usa el pasaje exacto, no los sustitutos del plan vectorial", () => {
  const paragraph = "Una niña y una tortuga encuentran un mapa junto al río.";
  const description =
    "Una niña de cabello azul y una tortuga verde, en cuerpos separados.";
  const plan = composeStoryPlan(Array(6).fill(paragraph), description);
  const mismatchedPlan = {
    ...plan,
    characters: [{ kind: "fox" as const, color: "gold" as const }],
  };
  const prompt = createScenePrompt(mismatchedPlan, description, paragraph, 0);
  assert.match(prompt, /No human-animal hybrids/);
  const data = JSON.parse(prompt.slice(prompt.indexOf("{")));
  assert.equal(data.passage, paragraph);
  assert.equal(data.characterReference, description);
  assert.equal(prompt.includes('"fox"'), false);
  assert.equal(prompt.includes("sceneDirection"), false);
  const hybrid = createScenePrompt(
    plan,
    "Un centauro amable busca su mapa.",
    "El centauro, mitad humano y mitad caballo, recorre el bosque.",
    0,
    true,
  );
  assert.match(
    hybrid,
    /Only depict the human-animal hybrid explicitly described/,
  );
  assert.doesNotMatch(hybrid, /No human-animal hybrids/);
});

test("el permiso de híbridos está firmado junto al cuento y no se puede reutilizar ni ampliar", () => {
  const paragraphs = Array(6).fill(
    "Una niña y su gata buscan un libro en el jardín.",
  );
  const description =
    "Una niña y una gata buscan un libro juntas, cada una con su cuerpo.";
  const secret = "test-only-illustration-secret";
  const policy = authorizeIllustrations(paragraphs, description, false, secret);
  assert.equal(
    verifyIllustrationPolicy(paragraphs, description, policy, secret),
    true,
  );
  assert.equal(
    verifyIllustrationPolicy(
      paragraphs,
      description,
      { ...policy, allowHumanAnimalHybrids: true },
      secret,
    ),
    false,
  );
  assert.equal(
    verifyIllustrationPolicy(
      [...paragraphs.slice(0, 5), "Otro cuento distinto."],
      description,
      policy,
      secret,
    ),
    false,
  );
  assert.equal(
    verifyIllustrationPolicy(
      paragraphs,
      "Una niña con cabeza de gata.",
      policy,
      secret,
    ),
    false,
  );
  assert.equal(
    verifyIllustrationPolicy(
      paragraphs,
      description,
      { ...policy, authorization: signParagraph(paragraphs[0], secret) },
      secret,
    ),
    false,
  );
  const requested = authorizeIllustrations(
    paragraphs,
    description,
    true,
    secret,
  );
  assert.equal(
    verifyIllustrationPolicy(paragraphs, description, requested, secret),
    true,
  );
});
