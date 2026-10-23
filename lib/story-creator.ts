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

export const storySafetyCategories = [
  "safe",
  "profanity",
  "adult_content",
  "sexual_content",
  "violence",
  "self_harm",
  "dangerous_activity",
  "hate_or_bullying",
  "extremist_violence",
  "bypass_attempt",
  "personal_data",
  "uncertain",
] as const;
export type StorySafetyCategory = (typeof storySafetyCategories)[number];

const unsafeStoryRules: Array<{
  category: Exclude<
    StorySafetyCategory,
    "safe" | "personal_data" | "uncertain"
  >;
  pattern: RegExp;
}> = [
  {
    category: "bypass_attempt",
    pattern:
      /\b(?:evadir|evita|eludir|burlar|saltarse|pasar|ignora|omite|desactiva|parafrasea|disfraza)\b.{0,55}\b(?:filtros?|bloqueos?|moderaci[oó]n|reglas? de seguridad|protecciones?|restricciones?|instrucciones? anteriores|pol[ií]ticas?)\b/u,
  },
  {
    category: "adult_content",
    pattern: /\b(?:pornograf\w*|contenido adulto|er[oó]tic\w*)\b/u,
  },
  {
    category: "sexual_content",
    pattern:
      /\b(?:sexo|sexual\w*|desnud\w*|genital\w*|sexting|grooming|violaci\w*|abuso sexual|tocamientos|explotaci[oó]n sexual|prostituci[oó]n)\b/u,
  },
  {
    category: "self_harm",
    pattern:
      /\b(?:suicid\w*|autolesi\w*|matarme|quitarme la vida|hacerme dano|hacerse dano|lastimarse|cortarme|cortarse)\b/u,
  },
  {
    category: "violence",
    pattern:
      /\b(?:asesin\w*|apunal\w*|pistola\w*|rifle\w*|arma\w*|bomba\w*|explosiv\w*|detonar\w*|tortur\w*|decapit\w*|sangrient\w*|bombard\w*)\b/u,
  },
  {
    category: "violence",
    pattern:
      /\b(?:matar|disparar|golpear|atacar)\w*\b.{0,45}\b(?:a|al|contra|con)\s+(?:(?:un|una|unos|unas|su|sus|el|la|los|las)\s+)?(?:persona|alguien|nino|nina|companero|companera|amigo|amiga|hermano|hermana|vecino|vecina|animal|perro|gato|mascota)\b/u,
  },
  {
    category: "extremist_violence",
    pattern:
      /\b(?:glorific\w*|alab\w*|celebr\w*|imitar\w*|ser como|hacer una historia de|protagonista)\b.{0,60}\b(?:hitler|nazi\w*|nazismo|terrorista\w*|genocid\w*)\b/u,
  },
  {
    category: "extremist_violence",
    pattern:
      /\b(?:hitler|nazi\w*|nazismo|holocausto)\b.{0,75}\b(?:bombard\w*|bomba\w*|guerra\w*|matar\w*|atacar\w*|invadir\w*|extermin\w*|genocid\w*|arma\w*)\b/u,
  },
  {
    category: "hate_or_bullying",
    pattern:
      /\b(?:humill\w*|acos\w*|hostig\w*|amenaz\w*|insult\w*|odiar\w*|golpear\w*)\b.{0,45}\b(?:companer\w*|persona\w*|nino\w*|nina\w*|grupo\w*|raza\w*|religion\w*|discapacidad|origen)\b/u,
  },
  {
    category: "dangerous_activity",
    pattern:
      /\b(?:cocaina|heroina|metanfetamina|fentanilo|drogas? ilegales|vender drogas?|secuestro|secuestr\w*|trata de personas|robar\w*|allanamiento|bomba casera|bomba atomica|bomba molotov|fabricar explosivos|mezclar productos de limpieza|jugar con fuego|encender fuego|saltar desde el techo|cruzar la calle sin mirar|reto viral peligroso)\b/u,
  },
  {
    category: "profanity",
    pattern:
      /\b(?:mierd\w*|put[oa]s?|jod\w*|cabr[oó]n\w*|pendej\w*|verg\w*|chingad\w*|caraj\w*|gonorre\w*|malparid\w*|cojone\w*|maric[oó]n\w*|imb[eé]cil\w*|est[uú]pid\w*|idiot\w*)\b/u,
  },
];

const obfuscationMap: Record<string, string> = {
  а: "a",
  е: "e",
  і: "i",
  ј: "j",
  к: "k",
  м: "m",
  н: "h",
  о: "o",
  р: "p",
  с: "c",
  т: "t",
  у: "y",
  х: "x",
  в: "b",
};

function normalizeSafetyText(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200F\uFEFF]/g, "")
    .replace(
      /[аевікмнорстухј]/g,
      (character) => obfuscationMap[character] ?? character,
    )
    .replace(
      /[013457@$]/g,
      (character) =>
        ({
          "0": "o",
          "1": "i",
          "3": "e",
          "4": "a",
          "5": "s",
          "7": "t",
          "@": "a",
          $: "s",
        })[character] ?? character,
    )
    .replace(/(\p{L})\1{2,}/gu, "$1")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function termPattern(terms: string[]) {
  const variants = terms.map((term) =>
    [...term]
      .map((character) => character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("\\s*"),
  );
  return new RegExp(
    `(?:^|[^\\p{L}\\p{N}])(?:${variants.join("|")})(?=$|[^\\p{L}\\p{N}])`,
    "u",
  );
}

const profanityTerms = [
  "mierda",
  "puta",
  "puto",
  "joder",
  "jodido",
  "jodida",
  "cabron",
  "pendejo",
  "verga",
  "chingada",
  "carajo",
  "gonorrea",
  "malparido",
  "cojones",
  "maricon",
  "imbecil",
  "estupido",
  "estupida",
  "idiota",
  "cagar",
  "cagada",
  "hijueputa",
  "fuck",
  "fucked",
  "fucker",
  "fucking",
  "shit",
  "bullshit",
  "bitch",
  "bastard",
  "asshole",
  "motherfucker",
];
const adultTerms = ["porno", "pornografia", "erotico", "contenido adulto"];
const sexTerms = [
  "sexo",
  "sexual",
  "desnudo",
  "genital",
  "sexting",
  "grooming",
  "violacion",
  "tocamientos",
];
const selfHarmTerms = [
  "suicidio",
  "suicidarse",
  "autolesion",
  "matarme",
  "quitarme la vida",
  "hacerme dano",
  "hacerse dano",
  "lastimarse",
  "cortarme",
  "cortarse",
];
const violenceTerms = [
  "asesinar",
  "apunalar",
  "pistola",
  "rifle",
  "arma",
  "bomba",
  "explosivo",
  "detonar",
  "torturar",
  "decapitar",
  "sangriento",
  "bombardear",
  "bombardea",
  "bombardeando",
  "bombardeaba",
  "bombardeo",
];
const crimeTerms = [
  "secuestro",
  "secuestrar",
  "trata de personas",
  "robar",
  "allanamiento",
  "cocaina",
  "heroina",
  "metanfetamina",
  "fentanilo",
];
const bypassPattern =
  /\b(?:evadir|evita|eludir|burlar|saltarse|pasar|ignora|omite|desactiva|parafrasea|disfraza)\b.{0,55}\b(?:filtros?|bloqueos?|moderaci[oó]n|reglas? de seguridad|protecciones?|restricciones?|instrucciones? anteriores|pol[ií]ticas?)\b/u;
const harmfulTerms = [
  "violacion",
  "abuso sexual",
  "explotacion sexual",
  "bomba casera",
  "bomba atomica",
  "bomba molotov",
  "fabricar explosivos",
  "mezclar productos de limpieza",
  "jugar con fuego",
  "encender fuego",
  "saltar desde el techo",
  "cruzar la calle sin mirar",
  "reto viral peligroso",
];

function matchesTerms(text: string, terms: string[]) {
  const variants = [text, text.replace(/(\p{L})\1+/gu, "$1")];
  const pattern = termPattern(terms);
  return variants.some((variant) => pattern.test(variant));
}

function storyContentCategory(
  value: string,
): Exclude<StorySafetyCategory, "safe" | "personal_data" | "uncertain"> | null {
  // These common figurative expressions and benign objects should stay usable.
  const normalized = normalizeSafetyText(value)
    .replace(
      /\bmatarse? (?:el tiempo|de risa|la sed|el hambre|el aburrimiento)\b/gu,
      " ",
    )
    .replace(/\bbomba de (?:agua|semillas|chocolate|confeti)\b/gu, " ")
    .replace(/\bdisparar (?:una )?foto\b/gu, " ");
  const compact = normalized.replace(/(\p{L})\1+/gu, "$1");
  const variants = [normalized, compact];
  if (variants.some((text) => bypassPattern.test(text)))
    return "bypass_attempt";
  if (matchesTerms(normalized, profanityTerms)) return "profanity";
  if (matchesTerms(normalized, adultTerms)) return "adult_content";
  if (matchesTerms(normalized, sexTerms)) return "sexual_content";
  if (matchesTerms(normalized, selfHarmTerms)) return "self_harm";
  if (matchesTerms(normalized, harmfulTerms)) return "dangerous_activity";
  if (matchesTerms(normalized, crimeTerms)) return "dangerous_activity";
  const extremist = matchesTerms(normalized, [
    "hitler",
    "nazi",
    "nazismo",
    "holocausto",
  ]);
  if (
    extremist &&
    matchesTerms(normalized, [
      "bombardear",
      "bombardea",
      "bombardeando",
      "bombardeaba",
      "bombardeo",
      "bomba",
      "guerra",
      "asesinar",
      "atacar",
      "invadir",
      "exterminar",
      "genocidio",
      "arma",
    ])
  )
    return "extremist_violence";
  if (matchesTerms(normalized, violenceTerms)) return "violence";
  const matchedRule = unsafeStoryRules.find((rule) =>
    variants.some((text) => rule.pattern.test(text)),
  );
  if (matchedRule) return matchedRule.category;
  return null;
}

export function getStoryIdeaSafetyIssue(
  value: string,
): StorySafetyCategory | null {
  if (containsPersonalDetails(value)) return "personal_data";
  return storyContentCategory(value);
}

export function storySafetyMessage(category: StorySafetyCategory) {
  switch (category) {
    case "profanity":
      return "Cambiemos esas palabras por otras amables para crear el cuento.";
    case "adult_content":
    case "sexual_content":
      return "Ese tema no es adecuado para un cuento infantil. Prueba con una aventura para niños.";
    case "violence":
    case "extremist_violence":
    case "self_harm":
      return "Esta idea incluye algo que puede hacer daño. Elige una aventura tranquila y segura.";
    case "dangerous_activity":
      return "No podemos crear cuentos que enseñen algo peligroso. Prueba una misión segura.";
    case "hate_or_bullying":
      return "En nuestros cuentos tratamos a todas las personas con respeto. Cambia la idea y prueba otra vez.";
    case "bypass_attempt":
      return "No podemos saltarnos las reglas de cuidado. Escribe una idea distinta y amable.";
    case "personal_data":
      return "No escribas nombres, dirección, colegio ni otros datos personales. Inventa un personaje.";
    case "uncertain":
      return "No pudimos comprobar que esta idea sea adecuada. Prueba con una aventura sencilla y segura.";
    case "safe":
      return "";
  }
}

export function hasUnsafeStoryContent(value: string) {
  return storyContentCategory(value) !== null;
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
      const candidates = sentences
        .flatMap((sentence) => {
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
        })
        .filter((sentence) => sentence.length >= 20 && sentence.length <= 150);
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
