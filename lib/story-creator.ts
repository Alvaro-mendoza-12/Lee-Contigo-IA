import { z } from "zod";

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
  paragraphs: z.array(z.string().trim().min(60).max(520)).length(4),
  artDescription: z.string().trim().min(20).max(280),
  questions: z
    .array(
      z.object({
        prompt: z.string().trim().min(12).max(180),
        options: z.array(z.string().trim().min(1).max(100)).length(3),
        correctIndex: z.number().int().min(0).max(2),
        evidenceParagraph: z.number().int().min(0).max(3),
        explanation: z.string().trim().min(20).max(260),
      }),
    )
    .length(3),
});
export type GeneratedStory = z.infer<typeof generatedStorySchema>;

export const coverInput = z
  .object({
    artDescription: z.string().trim().min(20).max(280),
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
  const text = [
    story.title,
    story.subtitle,
    story.artDescription,
    ...story.paragraphs,
    ...story.questions.flatMap((question) => [
      question.prompt,
      ...question.options,
      question.explanation,
    ]),
  ].join(" ");

  return !containsPersonalDetails(text) && !unsafeStoryPattern.test(text);
}

export function isAppropriateArtDescription(value: string) {
  return !containsPersonalDetails(value) && !unsafeStoryPattern.test(value);
}
