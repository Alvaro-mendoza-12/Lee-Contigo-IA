import type { ReadingHelpOutput } from "./reading-help.ts";

export function helpNarrationText(value: ReadingHelpOutput) {
  return `${value.explanation} ${value.example} ${value.reflection}`;
}

const glossary: Record<string, [string, string]> = {
  bifurcacion: [
    "Una bifurcación es donde el camino se divide.",
    "Un camino va al río y otro al árbol.",
  ],
  diminuta: [
    "Diminuta significa muy pequeña.",
    "Una semilla diminuta cabe en la punta de tu dedo.",
  ],
  monticulo: [
    "Un montículo es un montón pequeño de tierra o arena.",
    "Si juntas arena en la playa, formas un montículo.",
  ],
  esponjosa: [
    "Esponjosa significa suave y blandita, como una esponja.",
    "La miga del pan está blandita cuando la tocas.",
  ],
  estable: [
    "Estable significa que está firme y no se mueve fácilmente.",
    "Una mesa que no se tambalea es estable.",
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
            "Vamos por partes. Mira quién aparece y qué hace.",
            "Lee la frase de antes. Allí puede haber una pista.",
            "Busca una acción del personaje. Cuéntala con tus palabras.",
          ][stage],
    example:
      stage === 0 && definition
        ? definition[1]
        : [
            "El gato busca sombra. Tiene calor.",
            "El gato se esconde del sol para estar fresco.",
            "El gato sale del sol y se pone bajo el árbol.",
          ][stage],
    reflection: [
      "¿Qué hace el personaje en esta parte?",
      "¿Qué pasa justo antes?",
      "¿Qué palabra te da una pista?",
    ][stage],
  };
}
