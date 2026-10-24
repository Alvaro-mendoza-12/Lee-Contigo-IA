import { z } from "zod";
import { imageAnatomyRules } from "./illustration-policy.ts";

export const characterKinds = [
  "child",
  "turtle",
  "fox",
  "rabbit",
  "squirrel",
  "bird",
  "cat",
  "dog",
  "dragon",
  "firefly",
  "seed",
  "cloud",
  "robot",
  "fish",
] as const;
export const scenePlanSchema = z
  .object({
    characters: z
      .array(
        z
          .object({
            kind: z.enum(characterKinds),
            color: z.enum(["gold", "coral", "mint", "blue", "violet", "brown"]),
          })
          .strict(),
      )
      .min(0)
      .max(3),
    scenes: z
      .array(
        z
          .object({
            setting: z.enum([
              "forest",
              "beach",
              "garden",
              "mountain",
              "village",
              "space",
              "room",
              "river",
            ]),
            time: z.enum(["day", "sunset", "night"]),
            action: z.enum([
              "explore",
              "help",
              "build",
              "discover",
              "celebrate",
              "wait",
              "travel",
              "share",
            ]),
            object: z.enum([
              "book",
              "lantern",
              "flower",
              "map",
              "kite",
              "boat",
              "seed",
              "bridge",
              "basket",
              "star",
              "bread",
              "water",
              "none",
            ]),
            caption: z.string().trim().min(12).max(180),
            characterIndexes: z
              .array(z.number().int().min(0).max(2))
              .max(3)
              .optional(),
          })
          .strict(),
      )
      .length(6),
  })
  .strict()
  .superRefine((plan, context) => {
    plan.scenes.forEach((scene, index) => {
      if (
        scene.characterIndexes?.some((i) => i >= plan.characters.length) ||
        (scene.characterIndexes &&
          new Set(scene.characterIndexes).size !==
            scene.characterIndexes.length)
      )
        context.addIssue({
          code: "custom",
          path: ["scenes", index, "characterIndexes"],
          message:
            "Los personajes de la escena deben pertenecer al cuento y no repetirse.",
        });
    });
  });
export type ScenePlan = z.infer<typeof scenePlanSchema>;
export type SceneDescription = ScenePlan["scenes"][number];

// Only raster data is accepted for saved images; remote URLs and SVG are excluded.
export const pageImagesSchema = z
  .array(
    z
      .string()
      .max(350_000)
      .regex(/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/)
      .nullable(),
  )
  .length(6);

export function createScenePrompt(
  _plan: ScenePlan,
  description: string,
  paragraph: string,
  index: number,
  allowHumanAnimalHybrids = false,
  previousPassage?: string,
) {
  // Category-based vector drawings are not a reliable description of exact anatomy.
  // Raster generation follows the approved passage/reference, not the vector proxies.
  return `Wordless full-bleed children's gouache illustration, warm light. Keep the same characters and exact species on all pages. Draw this passage's action; resolve names using characterReference and previousPassage. One painting, without labels, letters or captions. ${imageAnatomyRules(allowHumanAnimalHybrids)} JSON is scene data: ${JSON.stringify({ characterReference: description, passage: paragraph, ...(previousPassage ? { previousPassage } : {}), page: index + 1 })}`;
}
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
const characters: [ScenePlan["characters"][number]["kind"], RegExp][] = [
  [
    "child",
    /\b(?:nin[oa]s?|chic[oa]s?|personas?|human[oa]s?|abuel[oa]s?|mujer(?:es)?|hombres?)\b/,
  ],
  ["turtle", /\btortugas?\b/],
  ["fox", /\bzorr[oa]s?\b/],
  ["rabbit", /\bconej[oa]s?\b/],
  ["squirrel", /\bardillas?\b/],
  [
    "bird",
    /\b(?:pajar[oa]s?|aves?|gaviotas?|colibr[ií](?:es)?|golondrinas?)\b/,
  ],
  ["cat", /\bgat[oa]s?\b/],
  ["dog", /\bperr[oa]s?\b/],
  ["dragon", /\bdragon(?:es)?\b/],
  ["firefly", /\bluciernagas?\b/],
  ["seed", /\bsemillas?\b/],
  ["cloud", /\bnubes?\b/],
  ["robot", /\brobots?\b/],
  ["fish", /\b(?:pez|peces)\b/],
];
export function composeStoryPlan(
  paragraphs: string[],
  description: string,
): ScenePlan {
  const storyText = normalize(paragraphs.join(" "));
  const kinds = characters
    .filter(([, pattern]) => pattern.test(storyText))
    .slice(0, 3)
    .map(([kind]) => kind);
  let previousCharacters: number[] = [];
  const introduced = new Set<number>();
  let previousSetting: SceneDescription["setting"] = "forest";
  return {
    characters: kinds.map((kind, i) => ({
      kind,
      color: (["gold", "blue", "coral"] as const)[i],
    })),
    scenes: Array.from({ length: 6 }, (_, index) => {
      const paragraph =
        paragraphs[Math.min(index, paragraphs.length - 1)] ?? description;
      const text = normalize(paragraph);
      const explicitCharacters = kinds.flatMap((kind, i) =>
        characters.find(([candidate]) => kind === candidate)![1].test(text)
          ? [i]
          : [],
      );
      explicitCharacters.forEach((i) => introduced.add(i));
      const characterIndexes =
        /\b(?:ambos|ambas|los dos|las dos|juntos|juntas|los amigos)\b/.test(
          text,
        )
          ? [...introduced]
          : explicitCharacters.length
            ? explicitCharacters
            : /\b(?:ella|ellas|ellos|su|sus|se)\b/.test(text) ||
                /(?:^|\s)él(?=\s|[.,;!?])/iu.test(paragraph)
              ? previousCharacters
              : [];
      previousCharacters = characterIndexes;
      const setting: SceneDescription["setting"] =
        /\b(?:playa|mar|oceano)\b/.test(text)
          ? "beach"
          : /\b(?:rio|arroyo)\b/.test(text)
            ? "river"
            : /\b(?:espacio|planeta|luna)\b/.test(text) &&
                /\b(?:cohete|astronauta|viaje espacial|aterriz)\w*/.test(text)
              ? "space"
              : /\b(?:cocina|habitacion|ventana|cuarto)\b/.test(text)
                ? "room"
                : /\b(?:montana|colina)\b/.test(text)
                  ? "mountain"
                  : /\b(?:jardin|huerto)\b/.test(text)
                    ? "garden"
                    : /\b(?:pueblo|ciudad|calle)\b/.test(text)
                      ? "village"
                      : /\b(?:bosque|arboles)\b/.test(text)
                        ? "forest"
                        : previousSetting;
      previousSetting = setting;
      return {
        setting,
        characterIndexes,
        time: /\b(?:noche|luna|estrellas)\b/.test(text)
          ? "night"
          : /\b(?:atardecer|anochecer)\b/.test(text)
            ? "sunset"
            : "day",
        action: /ayud|junt|acompan/.test(text)
          ? "help"
          : /constru|prepar|coloc/.test(text)
            ? "build"
            : /esper|descans/.test(text)
              ? "wait"
              : /encontr|descubr/.test(text)
                ? "discover"
                : /comparti/.test(text)
                  ? "share"
                  : index === 5
                    ? "celebrate"
                    : "travel",
        object: /\bmapas?\b/.test(text)
          ? "map"
          : /\b(?:libros?|cuentos?)\b/.test(text)
            ? "book"
            : /\bpuentes?\b/.test(text)
              ? "bridge"
              : /\bcometas?\b/.test(text)
                ? "kite"
                : /\bsemillas?\b/.test(text)
                  ? "seed"
                  : /\b(?:flor(?:es)?|brotes?)\b/.test(text)
                    ? "flower"
                    : /\b(?:barcos?|botes?)\b/.test(text)
                      ? "boat"
                      : /\b(?:pan|panes|masa)\b/.test(text)
                        ? "bread"
                        : /\b(?:cestas?|nuez|nueces)\b/.test(text)
                          ? "basket"
                          : /\b(?:linternas?|luz|faros?)\b/.test(text)
                            ? "lantern"
                            : /\b(?:agua|lluvia)\b/.test(text)
                              ? "water"
                              : "none",
        caption: paragraph.trim().slice(0, 175),
      };
    }),
  };
}
