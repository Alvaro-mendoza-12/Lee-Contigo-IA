import { test } from "node:test";
import assert from "node:assert/strict";
import {
  containsPersonalDetails,
  coverInput,
  createStoryInput,
  generatedStorySchema,
  isAppropriateStory,
} from "../lib/story-creator.ts";

const validStory = {
  title: "La tortuga y la luz",
  subtitle: "Una aventura pequeña con un gran descubrimiento",
  paragraphs: [
    "Una tortuga curiosa encontró un mapa junto al jardín y quiso saber adónde llevaba el sendero.",
    "El camino subía hasta una colina. La tortuga avanzó despacio y escuchó el viento entre las hojas.",
    "Al llegar arriba, vio que una luciérnaga buscaba el camino de regreso a casa y parecía confundida.",
    "La tortuga compartió el mapa y caminaron juntas bajo las estrellas, felices por haber encontrado compañía.",
  ],
  artDescription:
    "Una tortuga amable y una luciérnaga luminosa comparten un mapa en una colina verde al atardecer",
  questions: [
    {
      prompt: "¿Qué encontró la tortuga junto al jardín?",
      options: ["Un mapa", "Una campana", "Una flor"],
      correctIndex: 0,
      evidenceParagraph: 0,
      explanation:
        "El primer párrafo cuenta que la tortuga encontró un mapa junto al jardín.",
    },
    {
      prompt: "¿A quién encontró la tortuga en la colina?",
      options: ["A un conejo", "A una luciérnaga", "A una abeja"],
      correctIndex: 1,
      evidenceParagraph: 2,
      explanation:
        "En la colina, la tortuga vio a una luciérnaga que buscaba el camino de regreso.",
    },
    {
      prompt: "¿Qué hicieron al final?",
      options: ["Compartieron el mapa", "Se escondieron", "Volvieron al jardín"],
      correctIndex: 0,
      evidenceParagraph: 3,
      explanation:
        "El último párrafo dice que la tortuga compartió el mapa y caminaron juntas.",
    },
  ],
};

test("el creador acepta solo ideas cortas con revisión adulta", () => {
  assert.equal(
    createStoryInput.safeParse({
      idea: "Una tortuga llega al faro al atardecer",
      level: "paso",
      adultReviewed: true,
    }).success,
    true,
  );
  assert.equal(
    createStoryInput.safeParse({
      idea: "Una tortuga llega al faro al atardecer",
      level: "paso",
      adultReviewed: false,
    }).success,
    false,
  );
  assert.equal(
    createStoryInput.safeParse({
      idea: "Una tortuga llega al faro al atardecer",
      level: "paso",
      adultReviewed: true,
      name: "Nora",
    }).success,
    false,
  );
});

test("el detector reconoce formatos comunes de datos personales", () => {
  assert.equal(containsPersonalDetails("escríbeme a nina@example.com"), true);
  assert.equal(containsPersonalDetails("mi teléfono es +51 987 654 321"), true);
  assert.equal(containsPersonalDetails("mi colegio se llama Sol"), true);
  assert.equal(containsPersonalDetails("una tortuga visita el faro"), false);
});

test("la portada exige una confirmación adulta explícita", () => {
  const artDescription =
    "Una luciérnaga y una tortuga leen un mapa en un jardín tranquilo";
  assert.equal(
    coverInput.safeParse({ artDescription, adultReviewed: true }).success,
    true,
  );
  assert.equal(coverInput.safeParse({ artDescription }).success, false);
  assert.equal(
    coverInput.safeParse({ artDescription, adultReviewed: false }).success,
    false,
  );
});

test("valida cuentos con estructura de lectura y bloquea datos o contenido inadecuado", () => {
  const parsed = generatedStorySchema.safeParse(validStory);
  assert.equal(parsed.success, true);
  if (!parsed.success) return;
  assert.equal(isAppropriateStory(parsed.data), true);

  const withEmail = {
    ...parsed.data,
    paragraphs: [
      "Escribe a nina@example.com para buscar una pista y descubrir juntos cómo continúa el viaje por el bosque.",
      ...parsed.data.paragraphs.slice(1),
    ],
  };
  assert.equal(generatedStorySchema.safeParse(withEmail).success, true);
  assert.equal(isAppropriateStory(withEmail), false);

  const withUnsafeText = {
    ...parsed.data,
    title: "Una aventura sexual",
  };
  assert.equal(generatedStorySchema.safeParse(withUnsafeText).success, true);
  assert.equal(isAppropriateStory(withUnsafeText), false);

  assert.equal(
    generatedStorySchema.safeParse({ ...parsed.data, questions: [] }).success,
    false,
  );
});
