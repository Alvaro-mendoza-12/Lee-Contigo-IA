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
  paragraphs: z
    .array(
      z
        .string()
        .trim()
        .min(80)
        .max(360)
        .refine((text) => {
          const words = text.split(/\s+/).filter(Boolean).length;
          return words >= 14 && words <= 50;
        }, "Cada escena debe tener entre 14 y 50 palabras."),
    )
    .length(6),
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

const unsafeStoryPatterns = [
  /\b(?:pornograf\w*|sexo|sexual\w*|desnud\w*|genital\w*|sexting|grooming)\b/,
  /\b(?:violaci\w*|abuso sexual|tocamientos|explotaci\w* sexual)\b/,
  /\b(?:suicid\w*|autolesi\w*|matarme|quitarme la vida|hacerme dano|hacerse dano|lastimarse|cortarme)\b/,
  /\b(?:matar\w*|asesin\w*|apunal\w*|dispar\w*|pistola\w*|rifle\w*|bomba\w*|tortur\w*|decapit\w*|sangrient\w*)\b/,
  /\b(?:cocaina|heroina|metanfetamina|fentanilo|drogas? ilegales|vender drogas?)\b/,
  /\b(?:secuestro|secuestr\w*|trata de personas|robar\w*|allanamiento)\b/,
  /\b(?:beber|bebe|tomar|tome) lejia\b|\b(?:comer|come) detergente\b|\b(?:mezclar productos de limpieza|jugar con fuego|encender fuego|saltar desde el techo|cruzar la calle sin mirar|reto viral peligroso)\b/,
];

function normalizeSafetyText(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasUnsafeStoryContent(value: string) {
  const normalized = normalizeSafetyText(value);
  return unsafeStoryPatterns.some((pattern) => pattern.test(normalized));
}

export function containsPersonalDetails(value: string) {
  return personalDataPatterns.some((pattern) => pattern.test(value));
}

export type StoryQualityIssue =
  | "distinct_skills"
  | "answer_leaking_hint"
  | "ungrounded_quote"
  | "personal_data"
  | "unsafe_content";

export function storyQualityIssues(
  story: z.infer<typeof generatedStorySchema>,
): StoryQualityIssue[] {
  const issues: StoryQualityIssue[] = [];
  const skills = new Set(story.questions.map((question) => question.skill));
  if (skills.size !== 3) issues.push("distinct_skills");

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

  if (!hintsDoNotGiveAnswers) issues.push("answer_leaking_hint");
  if (!evidenceQuotesAreGrounded) issues.push("ungrounded_quote");
  if (containsPersonalDetails(text)) issues.push("personal_data");
  if (hasUnsafeStoryContent(text)) issues.push("unsafe_content");
  return issues;
}

/** Keep the model's selected evidence paragraph, but derive the displayed quote
 * from its exact story text so the tutor never highlights an invented phrase. */
export function groundStoryEvidence(
  story: z.infer<typeof generatedStorySchema>,
) {
  return {
    ...story,
    questions: story.questions.map((question) => {
      const paragraph = story.paragraphs[question.evidenceParagraph];
      if (!paragraph) return question;
      const paragraphText = normalizeForComparison(paragraph);
      if (
        paragraphText.includes(normalizeForComparison(question.evidenceQuote))
      )
        return question;

      const sentences = paragraph.match(/[^.!?]+(?:[.!?]+|$)/gu) ?? [];
      const candidates = sentences.flatMap((sentence) => {
        const trimmed = sentence.trim();
        if (trimmed.length <= 150) return [trimmed];
        const fragments: string[] = [];
        let fragment = "";
        for (const word of trimmed.split(/\s+/)) {
          if (fragment && `${fragment} ${word}`.length > 150) {
            fragments.push(fragment);
            fragment = word;
          } else {
            fragment = fragment ? `${fragment} ${word}` : word;
          }
        }
        if (fragment) fragments.push(fragment);
        return fragments;
      }).filter((sentence) => sentence.length >= 20 && sentence.length <= 150);
      const keywords = new Set(
        normalizeForComparison(
          `${question.prompt} ${question.options[question.correctIndex]} ${question.explanation}`,
        )
          .split(" ")
          .filter((word) => word.length > 3),
      );
      const quote = candidates
        .map((sentence) => ({
          sentence,
          score: normalizeForComparison(sentence)
            .split(" ")
            .filter((word) => keywords.has(word)).length,
        }))
        .sort((a, b) => b.score - a.score)[0]?.sentence;
      return quote ? { ...question, evidenceQuote: quote } : question;
    }),
  };
}

export function isAppropriateStory(
  story: z.infer<typeof generatedStorySchema>,
) {
  return storyQualityIssues(story).length === 0;
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
  return !containsPersonalDetails(value) && !hasUnsafeStoryContent(value);
}
