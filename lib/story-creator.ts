import { z } from "zod";

export const comprehensionSkillSchema = z.enum([
  "localizar",
  "inferir",
  "idea_principal",
]);
export type ComprehensionSkill = z.infer<typeof comprehensionSkillSchema>;
export const comprehensionSkillLabels: Record<ComprehensionSkill, string> = {
  localizar: "Encuentra información",
  inferir: "Lee entre líneas",
  idea_principal: "Descubre la idea principal",
};

export const createStoryInput = z
  .object({
    idea: z.string().trim().min(12).max(220),
    level: z.enum(["paso", "reto"]),
    adultReviewed: z.literal(true),
  })
  .strict();

export const generatedStorySchema = z.object({
  title: z.string().trim().min(3).max(70),
  subtitle: z.string().trim().min(8).max(120),
  paragraphs: z.array(z.string().trim().min(120).max(700)).length(6),
  artDescription: z.string().trim().min(20).max(280),
  questions: z
    .array(
      z.object({
        skill: comprehensionSkillSchema,
        prompt: z.string().trim().min(12).max(180),
        options: z.array(z.string().trim().min(1).max(100)).length(3),
        correctIndex: z.number().int().min(0).max(2),
        evidenceParagraph: z.number().int().min(0).max(5),
        evidenceQuote: z.string().trim().min(20).max(150),
        explanation: z.string().trim().min(20).max(260),
        hints: z.array(z.string().trim().min(20).max(180)).length(2),
      }),
    )
    .length(3),
});
export type GeneratedStory = z.infer<typeof generatedStorySchema>;

export const coverInput = z
  .object({
    artDescription: z.string().trim().min(20).max(280),
    scenes: z.array(z.string().trim().min(20).max(700)).length(4).optional(),
    adultReviewed: z.literal(true),
  })
  .strict();

const personalDataPatterns = [
  /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,
  /https?:\/\/|www\./i,
  /\+?\d[\d\s().-]{8,}\d/,
  /\b(?:me llamo|mi nombre es|mi direcci[oó]n|mi tel[eé]fono|mi colegio|mi escuela|vivo en|soy de)\b/i,
];

const unsafeStoryPattern =
  /pornograf|sexual|desnud|suicid|autolesi|mutil|sangrient|arma de fuego|drogas? ilegales|odio racial/i;

export function containsPersonalDetails(value: string) {
  return personalDataPatterns.some((pattern) => pattern.test(value));
}

export function isAppropriateStory(
  story: z.infer<typeof generatedStorySchema>,
) {
  const skills = new Set(story.questions.map((question) => question.skill));
  if (skills.size !== 3) return false;

  const text = [
    story.title,
    story.subtitle,
    story.artDescription,
    ...story.paragraphs,
    ...story.questions.flatMap((question) => [
      question.prompt,
      ...question.options,
      question.evidenceQuote,
      question.explanation,
      ...question.hints,
    ]),
  ].join(" ");

  const hintsDoNotGiveAnswers = story.questions.every((question) => {
    const answer = normalizeForComparison(
      question.options[question.correctIndex],
    );
    return question.hints.every((hint) => {
      const normalizedHint = normalizeForComparison(hint);
      return (
        hint.trim().split(/\s+/).length <= 32 &&
        !/https?:\/\/|www\.|<[^>]+>/i.test(hint) &&
        (answer.length < 12 || !normalizedHint.includes(answer))
      );
    });
  });

  const evidenceQuotesAreGrounded = story.questions.every((question) => {
    const paragraph = normalizeForComparison(
      story.paragraphs[question.evidenceParagraph],
    );
    const quote = normalizeForComparison(question.evidenceQuote);
    return quote.length >= 20 && paragraph.includes(quote);
  });

  return (
    hintsDoNotGiveAnswers &&
    evidenceQuotesAreGrounded &&
    !containsPersonalDetails(text) &&
    !unsafeStoryPattern.test(text)
  );
}

export function getIllustrationScene(
  paragraph: number,
  paragraphCount: number,
) {
  return Math.min(3, Math.floor((paragraph * 4) / Math.max(1, paragraphCount)));
}

function normalizeForComparison(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAppropriateArtDescription(value: string) {
  return !containsPersonalDetails(value) && !unsafeStoryPattern.test(value);
}
