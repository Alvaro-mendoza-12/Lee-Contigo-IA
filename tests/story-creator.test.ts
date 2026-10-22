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
      skill: "localizar",
      prompt: "¿Qué encontró la tortuga junto al jardín?",
      options: ["Un mapa", "Una campana", "Una flor"],
      correctIndex: 0,
      evidenceParagraph: 0,
      evidenceQuote: "Una tortuga curiosa encontró un mapa junto al jardín",
      explanation:
        "El primer párrafo cuenta que la tortuga encontró un mapa junto al jardín.",
      hints: [
        "Busca qué objeto llamó la atención de la tortuga junto al jardín.",
        "Vuelve a la primera oración y localiza lo que encontró allí.",
      ],
    },
    {
      skill: "inferir",
      prompt: "¿Por qué parecía confundida la visitante de la colina?",
      options: [
        "Porque no encontraba el camino de regreso.",
        "Porque quería llegar a la colina.",
        "Porque buscaba la luz de la luna.",
      ],
      correctIndex: 0,
      evidenceParagraph: 2,
      evidenceQuote: "buscaba el camino de regreso a casa y parecía confundida",
      explanation:
        "La visitante buscaba el camino de regreso y no sabía cómo encontrarlo.",
      hints: [
        "Fíjate qué estaba intentando encontrar la visitante en la colina.",
        "Relaciona su búsqueda con la emoción que muestra en ese momento.",
      ],
    },
    {
      skill: "idea_principal",
      prompt: "¿Qué idea deja el final sobre ayudar a alguien?",
      options: [
        "Que una ayuda pequeña puede ser importante.",
        "Que la luna debe guiar a todos.",
        "Que los grillos pueden cruzar cualquier río.",
      ],
      correctIndex: 0,
      evidenceParagraph: 3,
      evidenceQuote:
        "La tortuga compartió el mapa y caminaron juntas bajo las estrellas",
      explanation:
        "El último párrafo muestra cómo compartir una ayuda permitió que ambas siguieran juntas.",
      hints: [
        "Recuerda qué cambió para las dos después de encontrarse.",
        "Compara el problema del comienzo con lo que pudieron hacer al final.",
      ],
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

  const quoteFromWrongParagraph = {
    ...parsed.data,
    questions: parsed.data.questions.map((question, index) =>
      index === 0
        ? {
            ...question,
            evidenceQuote:
              "El camino subía hasta una colina y la tortuga avanzó despacio.",
          }
        : question,
    ),
  };
  assert.equal(isAppropriateStory(quoteFromWrongParagraph), false);

  const repeatedSkill = {
    ...parsed.data,
    questions: parsed.data.questions.map((question, index) =>
      index === 2 ? { ...question, skill: "inferir" as const } : question,
    ),
  };
  assert.equal(isAppropriateStory(repeatedSkill), false);

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

  const personalDataInHint = {
    ...parsed.data,
    questions: parsed.data.questions.map((question, index) =>
      index === 0
        ? {
            ...question,
            hints: [
              "Escribe a nina@example.com para saber qué encontró allí.",
              question.hints[1],
            ],
          }
        : question,
    ),
  };
  assert.equal(isAppropriateStory(personalDataInHint), false);

  const hintRevealsAnswer = {
    ...parsed.data,
    questions: parsed.data.questions.map((question, index) =>
      index === 1
        ? {
            ...question,
            hints: [
              "La respuesta es porque no encontraba el camino de regreso.",
              question.hints[1],
            ],
          }
        : question,
    ),
  };
  assert.equal(isAppropriateStory(hintRevealsAnswer), false);

  assert.equal(
    generatedStorySchema.safeParse({ ...parsed.data, questions: [] }).success,
    false,
  );
});
