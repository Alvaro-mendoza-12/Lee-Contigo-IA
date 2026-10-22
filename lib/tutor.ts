import { z } from "zod";
import { getStory, storyIds } from "./stories.ts";

export type TutorSkill =
  "localizar" | "inferir" | "idea_principal" | "vocabulario";

export const tutorHintSchema = z
  .object({
    action: z.string().trim().min(16).max(170),
    reflection: z
      .string()
      .trim()
      .min(12)
      .max(140)
      .refine((value) => /^¿.+\?$/.test(value)),
  })
  .strict();

export const tutorInput = z
  .object({
    storyId: z.enum(storyIds),
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
export function getTutorSkill(skill: string): TutorSkill {
  const normalized = skill.toLocaleLowerCase("es");
  if (normalized.includes("vocab")) return "vocabulario";
  if (normalized.includes("infer") || normalized.includes("entre líneas"))
    return "inferir";
  if (normalized.includes("idea")) return "idea_principal";
  return "localizar";
}

export function getTutorStrategy(
  skill: string,
  level: "paso" | "reto",
  tier: number,
  support: "explore" | "retry",
) {
  const strategies: Record<TutorSkill, string> = {
    localizar:
      "Para localizar información, ayuda a encontrar en el párrafo la frase que responde a la pregunta; no añadas una inferencia.",
    inferir:
      "Para inferir, guía al lector a conectar una acción o pista del relato con su consecuencia; no inventes causas externas.",
    idea_principal:
      "Para descubrir la idea principal, guía al lector a relacionar el problema del inicio con el cambio del final y distinguirlo de un detalle.",
    vocabulario:
      "Para comprender vocabulario en contexto, guía al lector a observar las palabras cercanas y probar qué significado encaja en la escena.",
  };
  const turn =
    support === "retry"
      ? "Ya hubo un intento: cambia el enfoque, reduce el paso y ofrece una acción distinta; no supongas por qué se equivocó."
      : "Es la primera ayuda: invita a probar una estrategia breve sin resolver la pregunta.";
  const depth =
    tier === 0
      ? "Empieza con una pista amplia sobre dónde mirar."
      : "Haz la pista más concreta: orienta a comparar o conectar dos señales del relato.";
  const language =
    level === "paso"
      ? "Usa palabras cotidianas, una sola acción y una pregunta corta."
      : "Usa lenguaje claro e invita a conectar dos pistas, sin aumentar la dificultad con vocabulario innecesario.";
  return `${strategies[getTutorSkill(skill)]} ${turn} ${depth} ${language}`;
}

function normalizePhrase(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function isUsableHint(
  hint: string,
  correctAnswer: string,
  options: readonly string[] = [],
) {
  const text = hint.trim();
  const normalizedText = normalizePhrase(text);
  const answerPhrases = [correctAnswer, ...options]
    .map(normalizePhrase)
    .filter((phrase) => phrase.length >= 12);
  return (
    text.length >= 20 &&
    text.length <= 350 &&
    text.split(/\s+/).length <= 45 &&
    !/https?:\/\/|www\.|@|<[^>]+>/.test(text) &&
    !answerPhrases.some((phrase) => normalizedText.includes(phrase)) &&
    !/opci[oó]n\s+[abc123]|respuesta correcta|la respuesta es|marca la correcta|como (modelo|ia)/i.test(
      text,
    )
  );
}

export function buildTutorHint(
  candidate: unknown,
  correctAnswer: string,
  options: readonly string[],
) {
  const parsed = tutorHintSchema.safeParse(candidate);
  if (!parsed.success) return undefined;

  const action = parsed.data.action.trim();
  const reflection = parsed.data.reflection.trim();
  const hint = `${action} ${reflection}`;
  if (!isUsableHint(hint, correctAnswer, options)) return undefined;
  return { action, reflection, hint };
}
