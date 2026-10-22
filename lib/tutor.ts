import { z } from "zod";
import { getStory } from "./stories.ts";
export const tutorInput = z
  .object({
    storyId: z.enum(["luz-del-bosque", "semilla-viajera"]),
    level: z.enum(["paso", "reto"]),
    questionId: z.enum(["q1", "q2", "q3"]),
    tier: z.number().int().min(0).max(1).default(0),
    support: z.enum(["explore", "retry"]).default("explore"),
  })
  .strict();
export function getTutorContext(input: z.input<typeof tutorInput>) {
  const story = getStory(input.storyId)!;
  const version = story.versions[input.level];
  const question = version.questions.find((q) => q.id === input.questionId)!;
  return {
    story,
    version,
    question,
    quote: version.paragraphs[question.paragraph],
  };
}
export function getTutorSupport(support: "explore" | "retry") {
  return support === "retry"
    ? "Apoyo para volver a intentarlo: propone una acción concreta sobre la evidencia, como buscar un detalle, comparar o conectar acciones, y termina con una pregunta breve. Cambia el enfoque; no te limites a pedir releer. No asumas la causa del error, no regañes y no resuelvas la pregunta."
    : "Primera exploración: invita a observar un detalle de la evidencia y plantea una pregunta breve que ayude a pensar, sin resolver la pregunta.";
}
export function isUsableHint(hint: string, correctAnswer: string) {
  const text = hint.trim();
  return (
    text.length >= 20 &&
    text.length <= 350 &&
    text.split(/\s+/).length <= 45 &&
    !/https?:\/\/|www\.|@|<[^>]+>/.test(text) &&
    !text
      .toLowerCase()
      .includes(correctAnswer.toLowerCase().replace(/[.!?]$/, "")) &&
    !/opci[oó]n\s+[abc123]|respuesta correcta|como (modelo|ia)/i.test(text)
  );
}
