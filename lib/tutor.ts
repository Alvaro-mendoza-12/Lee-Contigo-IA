import { z } from "zod";
import { getStory } from "./stories.ts";
export const tutorInput = z
  .object({
    storyId: z.enum(["luz-del-bosque", "semilla-viajera"]),
    level: z.enum(["paso", "reto"]),
    questionId: z.enum(["q1", "q2", "q3"]),
    tier: z.number().int().min(0).max(1).default(0),
  })
  .strict();
export function getTutorContext(input: z.infer<typeof tutorInput>) {
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
export function isUsableHint(hint: string, correctAnswer: string) {
  const text = hint.trim();
  return (
    text.length >= 20 &&
    text.length <= 350 &&
    !/https?:\/\/|www\.|@|<[^>]+>/.test(text) &&
    !text
      .toLowerCase()
      .includes(correctAnswer.toLowerCase().replace(/[.!?]$/, "")) &&
    !/opci[oó]n\s+[abc123]|respuesta correcta|como (modelo|ia)/i.test(text)
  );
}
