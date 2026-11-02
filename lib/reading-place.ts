import { z } from "zod";
import type { Level } from "./stories.ts";
import { modoDemo } from "./progreso.ts";

export const readingPlaceKey = "lee-contigo-reading-place-v1";
export const readingPlaceLifetime = 7 * 24 * 60 * 60 * 1000;
export const maxReadingPlaces = 8;
export const readingPlaceEvent = "reading-place:changed";

const placeSchema = z
  .object({
    source: z.enum(["catalogue", "created"]),
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
    level: z.enum(["paso", "reto"]),
    paragraph: z.number().int().min(0).max(100),
    word: z.number().int().min(0).max(5000),
    updatedAt: z.number().finite().nonnegative(),
  })
  .strict();
const placesSchema = z
  .object({
    version: z.literal(1),
    places: z.array(placeSchema).max(maxReadingPlaces),
  })
  .strict();

export type ReadingPlace = z.infer<typeof placeSchema>;
export type ReadingBook = Pick<ReadingPlace, "source" | "id" | "level">;

function key() {
  return modoDemo() ? `${readingPlaceKey}-demo` : readingPlaceKey;
}

function sameBook(a: ReadingBook, b: ReadingBook) {
  return a.source === b.source && a.id === b.id && a.level === b.level;
}

export function parseReadingPlaces(
  raw: string | null,
  now = Date.now(),
): ReadingPlace[] {
  if (!raw) return [];
  try {
    const parsed = placesSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    const valid: ReadingPlace[] = [];
    for (const place of parsed.data.places.sort(
      (a, b) => b.updatedAt - a.updatedAt,
    )) {
      if (
        place.updatedAt > now + 60_000 ||
        now - place.updatedAt >= readingPlaceLifetime
      )
        continue;
      if (!valid.some((item) => sameBook(item, place))) valid.push(place);
    }
    return valid;
  } catch {
    return [];
  }
}

function writePlaces(places: ReadingPlace[]) {
  try {
    if (places.length)
      localStorage.setItem(key(), JSON.stringify({ version: 1, places }));
    else localStorage.removeItem(key());
    window.dispatchEvent(new Event(readingPlaceEvent));
  } catch {
    // Returning to a page is optional; storage restrictions never block reading.
  }
}

export function readReadingPlaces(now = Date.now()) {
  try {
    const raw = localStorage.getItem(key());
    const places = parseReadingPlaces(raw, now);
    // Expired or invalid positions are removed on the next visit.
    const normalized = places.length
      ? JSON.stringify({ version: 1, places })
      : null;
    if (raw !== normalized) {
      if (normalized) localStorage.setItem(key(), normalized);
      else localStorage.removeItem(key());
    }
    return places;
  } catch {
    return [];
  }
}

export function readReadingPlace(book: ReadingBook, paragraphs: string[]) {
  const place = readReadingPlaces().find((item) => sameBook(item, book));
  if (!place) return null;
  const words = paragraphs[place.paragraph]
    ?.trim()
    .split(/\s+/)
    .filter(Boolean);
  return words?.length && place.word < words.length ? place : null;
}

export function saveReadingPlace(
  book: ReadingBook,
  position: { paragraph: number; word: number },
  now = Date.now(),
) {
  // Select fields explicitly: no title, story text, idea or answer is stored.
  const result = placeSchema.safeParse({
    source: book.source,
    id: book.id,
    level: book.level,
    paragraph: position.paragraph,
    word: position.word,
    updatedAt: now,
  });
  if (!result.success) return;
  if (position.paragraph === 0 && position.word === 0) {
    removeReadingPlace(book);
    return;
  }
  const places = readReadingPlaces(now).filter((item) => !sameBook(item, book));
  writePlaces([result.data, ...places].slice(0, maxReadingPlaces));
}

export function removeReadingPlace(book: ReadingBook) {
  writePlaces(readReadingPlaces().filter((item) => !sameBook(item, book)));
}

export function clearReadingPlaces(
  source?: ReadingPlace["source"],
  id?: string,
) {
  writePlaces(
    source
      ? readReadingPlaces().filter(
          (item) =>
            item.source !== source || (id !== undefined && item.id !== id),
        )
      : [],
  );
}

export function catalogueReadingBook(id: string, level: Level): ReadingBook {
  return { source: "catalogue", id, level };
}
