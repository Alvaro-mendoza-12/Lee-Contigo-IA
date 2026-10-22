export const fontSteps = [
  { label: "Diminuta", pixels: 12, words: 80 },
  { label: "Muy pequeña", pixels: 14, words: 72 },
  { label: "Pequeña", pixels: 16, words: 64 },
  { label: "Normal", pixels: 18, words: 64 },
  { label: "Cómoda", pixels: 20, words: 60 },
  { label: "Grande", pixels: 24, words: 38 },
  { label: "Muy grande", pixels: 28, words: 30 },
  { label: "Extra grande", pixels: 32, words: 24 },
  { label: "Máxima", pixels: 36, words: 18 },
  { label: "Inmensa", pixels: 40, words: 15 },
  { label: "Monumental", pixels: 44, words: 12 },
] as const;

export type ReadingPage = {
  text: string;
  paragraph: number;
  start: number;
  end: number;
};
export function paginateStory(
  paragraphs: string[],
  size: number,
  compact = false,
): ReadingPage[] {
  const baseLimit =
    fontSteps[Math.max(0, Math.min(size, fontSteps.length - 1))].words;
  const mobileScale = 0.45;
  const limit = compact
    ? Math.max(size >= 8 ? 4 : 8, Math.floor(baseLimit * mobileScale))
    : baseLimit;
  return paragraphs.flatMap((paragraph, index) => {
    const words = paragraph.split(/\s+/);
    const pages: ReadingPage[] = [];
    for (let start = 0; start < words.length;) {
      let end = Math.min(start + limit, words.length);
      if (end < words.length) {
        // Prefer a sentence boundary without making very short fragments.
        for (
          let candidate = end;
          candidate >= start + Math.ceil(limit * 0.55);
          candidate--
        ) {
          if (/[.!?…][»”\"]?$/.test(words[candidate - 1])) {
            end = candidate;
            break;
          }
        }
      }
      pages.push({
        text: words.slice(start, end).join(" "),
        paragraph: index,
        start,
        end,
      });
      start = end;
    }
    return pages;
  });
}

export const readingGoals = {
  imaginar: {
    title: "Imaginar juntos",
    description: "Conversar sobre el lugar y los personajes.",
    prompts: [
      "Antes de seguir, imaginen el lugar. ¿Qué creen que podría pasar?",
      "Hagan una pausa: ¿cómo imaginan que se siente el personaje?",
      "Busquen una acción que les haya llamado la atención. ¿Qué imaginan al leerla?",
      "¿Qué cambió al final? Cuéntenlo con sus propias palabras.",
    ],
  },
  evidencia: {
    title: "Buscar pistas",
    description: "Encontrar una frase que apoye lo que pensamos.",
    prompts: [
      "Busquen una frase que presente al personaje. ¿Qué nos cuenta?",
      "¿Qué detalle del texto ayuda a entender lo que ocurre? Léanlo juntos.",
      "Antes de explicar lo que piensan, busquen una frase que lo apoye.",
      "¿Qué frase les ayuda a entender el final? Compárenla con el comienzo.",
    ],
  },
  explicar: {
    title: "Explicar lo leído",
    description: "Relacionar lo que pasa y contar por qué.",
    prompts: [
      "Después de leer, cuenten qué acaba de pasar, sin repetir todas las palabras.",
      "¿Qué problema aparece? Expliquen qué parte del relato se lo muestra.",
      "¿Por qué creen que el personaje actúa así? Relacionen dos hechos del texto.",
      "Cuenten la historia en dos frases: qué ocurrió y qué aprendió el personaje.",
    ],
  },
} as const;
export type ReadingGoal = keyof typeof readingGoals;
export function getReadingGoal(value?: string): ReadingGoal {
  return value === "evidencia" || value === "explicar" ? value : "imaginar";
}
