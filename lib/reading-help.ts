import { z } from "zod";
import { getStory, storyIds } from "./stories.ts";
import { verifyParagraph } from "./narration.ts";
import { containsPersonalDetails } from "./story-creator.ts";

const target = {
  mode: z.enum(["selection", "paragraph"]),
  start: z.number().int().min(0).max(10000).optional(),
  end: z.number().int().min(1).max(10000).optional(),
  stage: z.number().int().min(0).max(2),
  level: z.enum(["paso", "reto"]),
};
export const readingHelpInput = z.discriminatedUnion("source", [
  z
    .object({
      source: z.literal("catalogue"),
      storyId: z.enum(storyIds),
      paragraph: z.number().int().min(0).max(20),
      ...target,
    })
    .strict(),
  z
    .object({
      source: z.literal("generated"),
      paragraphText: z.string().min(1).max(700),
      authorization: z.string().regex(/^\d{13}\.[a-f0-9]{64}$/),
      ...target,
    })
    .strict(),
]);
export type ReadingHelpInput = z.infer<typeof readingHelpInput>;
export const readingHelpOutput = z
  .object({
    explanation: z.string().trim().min(15).max(180),
    example: z.string().trim().min(10).max(110),
    reflection: z
      .string()
      .trim()
      .min(12)
      .max(90)
      .regex(/^¿[^¿?]+\?$/),
  })
  .strict();
export type ReadingHelpOutput = z.infer<typeof readingHelpOutput>;
export function completeReadingHelp(
  value: ReadingHelpOutput,
): ReadingHelpOutput | null {
  function complete(text: string) {
    text = text.replace(/\*\*|__|\u0060/g, "").trim();
    if (/[.!?…][»”]?$/u.test(text)) return text;
    const endings = [...text.matchAll(/[.!?…][»”]?(?=\s|$)/gu)];
    const end = endings.at(-1);
    return end ? text.slice(0, end.index + end[0].length).trim() : "";
  }
  const result = readingHelpOutput.safeParse({
    ...value,
    reflection: value.reflection.replace(/\*\*|__|\u0060/g, "").trim(),
    explanation: complete(value.explanation),
    example: complete(value.example),
  });
  return result.success ? result.data : null;
}
export function normalizeParagraph(text: string) {
  return text.trim().split(/\s+/).join(" ");
}
export function resolveReadingHelp(input: ReadingHelpInput, secret: string) {
  const raw =
    input.source === "catalogue"
      ? getStory(input.storyId)?.versions[input.level].paragraphs[
          input.paragraph
        ]
      : verifyParagraph(input.paragraphText, input.authorization, secret)
        ? input.paragraphText
        : undefined;
  if (!raw) return null;
  const paragraph = normalizeParagraph(raw);
  if (input.mode === "paragraph")
    return input.start !== undefined || input.end !== undefined
      ? null
      : { paragraph, selected: paragraph };
  if (
    input.start === undefined ||
    input.end === undefined ||
    input.start >= input.end ||
    input.end > paragraph.length ||
    input.end - input.start > 180
  )
    return null;
  const selected = paragraph.slice(input.start, input.end).trim();
  const cutsSurrogate = (offset: number) =>
    offset > 0 &&
    /[\uD800-\uDBFF]/.test(paragraph[offset - 1]) &&
    /[\uDC00-\uDFFF]/.test(paragraph[offset] ?? "");
  if (cutsSurrogate(input.start) || cutsSurrogate(input.end)) return null;
  if (!selected || selected.split(/\s+/).length > 35) return null;
  return { paragraph, selected };
}
export function safeReadingHelp(value: ReadingHelpOutput) {
  const text = Object.values(value).join(" ");
  return (
    readingHelpOutput.safeParse(value).success &&
    value.explanation.split(/\s+/).length <= 24 &&
    value.example.split(/\s+/).length <= 14 &&
    value.reflection.split(/\s+/).length <= 12 &&
    !/\bverdad\s*\?/i.test(value.reflection) &&
    !containsPersonalDetails(text) &&
    !/<[^>]+>|https?:|www\.|@|respuesta correcta|opci[oó]n [abc123]/i.test(text)
  );
}
export { preparedReadingHelp, helpNarrationText } from "./reading-help-copy.ts";
