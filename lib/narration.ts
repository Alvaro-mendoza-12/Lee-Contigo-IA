import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getStory, storyIds } from "./stories.ts";
import { narrationVoiceIds } from "./narration-voices.ts";

const range = {
  voice: z.enum(narrationVoiceIds).optional(),
  start: z.number().int().min(0),
  end: z.number().int().min(1).max(1000),
};
export const narrationInput = z.discriminatedUnion("source", [
  z
    .object({
      source: z.literal("catalogue"),
      storyId: z.enum(storyIds),
      level: z.enum(["paso", "reto"]),
      paragraph: z.number().int().min(0).max(20),
      ...range,
    })
    .strict(),
  z
    .object({
      source: z.literal("generated"),
      paragraphText: z.string().min(1).max(700),
      authorization: z
        .string()
        .max(200)
        .regex(/^\d{13}\.[a-f0-9]{64}$/),
      ...range,
    })
    .strict(),
  z
    .object({
      source: z.literal("help"),
      helpText: z.string().trim().min(15).max(500),
      authorization: z
        .string()
        .max(200)
        .regex(/^\d{13}\.[a-f0-9]{64}$/),
      ...range,
    })
    .strict(),
]);
export type NarrationInput = z.infer<typeof narrationInput>;

export function signParagraph(
  text: string,
  secret: string,
  expires = Date.now() + 7 * 86400_000,
) {
  return `${expires}.${createHmac("sha256", secret).update(`${expires}:${text}`).digest("hex")}`;
}
export function verifyParagraph(
  text: string,
  token: string,
  secret: string,
  now = Date.now(),
) {
  const [expires, signature] = token.split(".");
  if (
    !/^\d+$/.test(expires ?? "") ||
    !/^[a-f0-9]{64}$/.test(signature ?? "") ||
    Number(expires) <= now ||
    Number(expires) > now + 7 * 86400_000 + 60000
  )
    return false;
  const expected = signParagraph(text, secret, Number(expires)).split(".")[1];
  return timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex"),
  );
}
export function signHelpNarration(
  text: string,
  secret: string,
  expires = Date.now() + 600_000,
) {
  return signParagraph(`reading-help-v1:${text}`, secret, expires);
}
export function resolveNarration(input: NarrationInput, secret: string) {
  let paragraph: string | undefined;
  if (input.source === "catalogue")
    paragraph = getStory(input.storyId)?.versions[input.level].paragraphs[
      input.paragraph
    ];
  else if (
    input.source === "generated" &&
    verifyParagraph(input.paragraphText, input.authorization, secret)
  )
    paragraph = input.paragraphText;
  else if (
    input.source === "help" &&
    verifyParagraph(
      `reading-help-v1:${input.helpText}`,
      input.authorization,
      secret,
    )
  )
    paragraph = input.helpText;
  if (!paragraph) return null;
  const words = paragraph.split(/\s+/);
  if (input.start >= input.end || input.end > words.length) return null;
  return words.slice(input.start, input.end).join(" ");
}
