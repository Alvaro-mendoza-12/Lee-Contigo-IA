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
    explanation: z.string().trim().min(15).max(300),
    example: z.string().trim().min(10).max(200),
    reflection: z
      .string()
      .trim()
      .min(12)
      .max(180)
      .regex(/^¿.+\?$/),
  })
  .strict();
export type ReadingHelpOutput = z.infer<typeof readingHelpOutput>;
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
    !containsPersonalDetails(text) &&
    !/<[^>]+>|https?:|www\.|@|respuesta correcta|opci[oó]n [abc123]/i.test(text)
  );
}
const glossary: Record<string, [string, string]> = {
  bifurcacion: [
    "Una bifurcación es un lugar donde un camino se divide en dos o más direcciones.",
    "Por ejemplo: un sendero se separa y puedes ir hacia un árbol o hacia una fuente.",
  ],
  diminuta: [
    "Diminuta significa muy pequeña. En el relato describe el tamaño de la luz.",
    "Por ejemplo: una semilla diminuta cabe en la punta de un dedo.",
  ],
  monticulo: [
    "Un montículo es una pequeña elevación del terreno, como un montón de arena.",
    "Por ejemplo: al juntar arena en la playa formas un pequeño montículo.",
  ],
  esponjosa: [
    "Esponjosa describe algo suave, ligero y con pequeños espacios en su interior.",
    "Por ejemplo: una miga de pan esponjosa cede un poco al apretarla con cuidado.",
  ],
  estable: [
    "Estable significa que se mantiene firme y no pierde fácilmente su posición.",
    "Por ejemplo: una mesa con todas sus patas bien apoyadas es estable.",
  ],
};
export function preparedReadingHelp(
  selected: string,
  stage: number,
): ReadingHelpOutput {
  const key = selected
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const definition = glossary[key];
  return {
    explanation:
      stage === 0 && definition
        ? definition[0]
        : [
            "Lee esa parte despacio y después la frase que viene antes. Busca quién hace algo y qué ocurre.",
            "Separa la frase en dos partes: quién aparece y qué le pasa. Relaciona ambas con lo que acabas de leer.",
            "Vuelve al párrafo y busca un detalle que puedas señalar. Cuéntalo con tus propias palabras; puedes pedir compañía para leerlo.",
          ][stage],
    example:
      stage === 0 && definition
        ? definition[1]
        : "Ejemplo de estrategia: en «El gato buscó sombra porque tenía calor», la segunda parte explica la primera.",
    reflection: [
      "¿Qué palabra cercana o acción del personaje te ayuda a entender esa parte?",
      "¿Qué relación encuentras entre lo que ocurre antes y lo que pasa después?",
      "¿Qué detalle del párrafo podrías señalar para explicar lo que piensas?",
    ][stage],
  };
}
