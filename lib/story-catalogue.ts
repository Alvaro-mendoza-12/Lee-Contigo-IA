import type { Level, Story } from "./stories.ts";

export type CatalogueStory = Pick<
  Story,
  "id" | "title" | "category" | "shelf" | "art" | "minutes"
> & {
  pageWordCounts: Record<Level, number[]>;
};

/** The shelf needs covers and page lengths, not the stories and their answers. */
export function storyCatalogue(stories: readonly Story[]): CatalogueStory[] {
  return stories.map(
    ({ id, title, category, shelf, art, minutes, versions }) => ({
      id,
      title,
      category,
      shelf,
      art,
      minutes,
      pageWordCounts: {
        paso: versions.paso.paragraphs.map(
          (text) => text.trim().split(/\s+/).filter(Boolean).length,
        ),
        reto: versions.reto.paragraphs.map(
          (text) => text.trim().split(/\s+/).filter(Boolean).length,
        ),
      },
    }),
  );
}
