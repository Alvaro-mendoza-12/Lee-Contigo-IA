export type Level = "paso" | "reto";
export type StoryArtVariant =
  | "night"
  | "seed"
  | "lighthouse"
  | "kite"
  | "bridge"
  | "cloud"
  | "drum"
  | "soundmap"
  | "bread"
  | "sea"
  | "tracks"
  | "mail"
  | "dragon"
  | "ocean"
  | "space"
  | "farm"
  | "rain"
  | "music"
  | "boat";
export const storyCategories = [
  { id: "amigos", title: "Amigos" },
  { id: "naturaleza", title: "Naturaleza" },
  { id: "aventuras", title: "Aventuras" },
] as const;
export type StoryCategory = (typeof storyCategories)[number]["id"];
export const storyIds = [
  "luz-del-bosque",
  "semilla-viajera",
  "camino-al-faro",
  "cometa-en-equipo",
  "puente-de-ardillas",
  "nube-perdida",
  "tambor-lluvia",
  "mapa-sonidos",
  "pan-abuela",
  "botella-mar",
  "sendero-huellas",
  "buzon-bosque",
  "dragon-de-flores",
  "estrella-de-mar",
  "cohete-de-carton",
  "gallina-cuenta",
  "paraguas-de-colores",
  "orquesta-del-bosque",
  "barco-de-papel",
] as const;
export type StoryId = (typeof storyIds)[number];
export type Question = {
  id: string;
  skill: string;
  prompt: string;
  options: string[];
  correct: number;
  paragraph: number;
  explanation: string;
  hints: [string, string];
};
export type StoryVersion = { paragraphs: string[]; questions: Question[] };
export type Story = {
  id: string;
  title: string;
  category: StoryCategory;
  shelf?: Level;
  subtitle: string;
  theme: string;
  art: StoryArtVariant;
  minutes: number;
  description: string;
  versions: Record<Level, StoryVersion>;
};
export const levels: Record<Level, { label: string; description: string }> = {
  paso: {
    label: "Paso a paso",
    description: "Frases cortas, grandes descubrimientos.",
  },
  reto: {
    label: "Un nuevo reto",
    description: "Un poco más de historia para explorar.",
  },
};

export function getLevel(value?: string | string[]): Level {
  return value === "reto" ? "reto" : "paso";
}
