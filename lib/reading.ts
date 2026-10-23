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
  const minimumReadableWords = 12;
  const mobileScale = 0.72;
  const limit = compact
    ? Math.max(minimumReadableWords, Math.floor(baseLimit * mobileScale))
    : baseLimit;
  return paragraphs.flatMap((paragraph, index) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    const pages: ReadingPage[] = [];
    if (words.length === 0) return pages;
    for (let start = 0; start < words.length;) {
      const remaining = words.length - start;
      const pageMinimum =
        remaining >= minimumReadableWords * 2
          ? minimumReadableWords
          : remaining;
      let end = words.length;
      if (remaining > limit && remaining >= minimumReadableWords * 2) {
        // Share a short final section between two pages instead of leaving a
        // few words on their own. A pair may exceed the target slightly.
        const balancedPair = remaining <= limit * 2;
        end = start + (balancedPair ? Math.ceil(remaining / 2) : limit);
        if (remaining - (end - start) < minimumReadableWords)
          end = words.length - minimumReadableWords;
      }
      // Long words need more room than the word count alone suggests.
      // Keep whole words so selection and narration share the same offsets.
      const characters = limit * 7;
      while (
        end - start > pageMinimum &&
        words.slice(start, end).join(" ").length > characters
      ) {
        end--;
      }
      if (
        pageMinimum === minimumReadableWords &&
        words.length - end > 0 &&
        words.length - end < minimumReadableWords
      )
        end = words.length - minimumReadableWords;
      if (
        end - start < pageMinimum &&
        words.length - start >= pageMinimum
      )
        end = start + pageMinimum;
      if (end < words.length) {
        // Prefer a sentence boundary without making very short fragments.
        for (
          let candidate = end;
          candidate >=
          start + Math.max(pageMinimum, Math.ceil(limit * 0.55));
          candidate--
        ) {
          if (
            words.length - candidate >= pageMinimum &&
            /[.!?…][»”\"]?$/.test(words[candidate - 1])
          ) {
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
