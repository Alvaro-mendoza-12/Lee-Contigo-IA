export const fontSteps = [
  { label: "Pequeño", pixels: 18 },
  { label: "Mediano", pixels: 22 },
  { label: "Grande", pixels: 26 },
] as const;

export const defaultFontSize = 1;
export const fontPreferenceKey = "lee-contigo-reading-font-v2";
const legacyFontPixels = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44];

/** Old preferences store an index; v2 stores pixels so future sizes can migrate. */
export function nearestFontSize(pixels: number) {
  if (!Number.isFinite(pixels)) return defaultFontSize;
  return fontSteps.reduce(
    (best, step, index) =>
      Math.abs(step.pixels - pixels) < Math.abs(fontSteps[best].pixels - pixels)
        ? index
        : best,
    0,
  );
}

export function migrateFontSize(index: number) {
  return Number.isInteger(index) &&
    index >= 0 &&
    index < legacyFontPixels.length
    ? nearestFontSize(legacyFontPixels[index])
    : defaultFontSize;
}

export type ReadingPage = {
  text: string;
  paragraph: number;
  start: number;
  end: number;
};
export function paginateStory(
  paragraphs: string[],
  _size = defaultFontSize,
  _compact = false,
): ReadingPage[] {
  // A narrative scene stays on one page at every font size and viewport.
  // The paper grows with the paragraph instead of duplicating its illustration.
  return paragraphs.flatMap((paragraph, index) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    return words.length
      ? [
          {
            text: words.join(" "),
            paragraph: index,
            start: 0,
            end: words.length,
          },
        ]
      : [];
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
