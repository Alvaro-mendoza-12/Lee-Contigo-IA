import {
  createStore,
  entries,
  set,
  del,
  delMany,
  clear,
  type UseStore,
} from "idb-keyval";
import { z } from "zod";
import {
  generatedStorySchema,
  isAppropriateStory,
  type GeneratedStory,
} from "./story-creator.ts";
import type { Level } from "./stories.ts";

export const BOOK_LIFETIME = 7 * 24 * 60 * 60 * 1000;
export const MAX_SAVED_BOOKS = 6;
const coverSchema = z
  .string()
  .max(4_500_000)
  .refine(
    (value) =>
      /^\/images\/[a-z0-9-]+\.(png|webp|jpg)$/.test(value) ||
      /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value),
  );
const recordSchema = z
  .object({
    version: z.literal(1),
    id: z.string().min(1).max(64),
    createdAt: z.number().finite(),
    expiresAt: z.number().finite(),
    level: z.enum(["paso", "reto"]),
    story: generatedStorySchema,
    cover: coverSchema.nullable(),
    atlas: z.boolean(),
    collection: z.boolean(),
    audioTokens: z.array(z.string().max(200)).length(6).optional(),
  })
  .strict();
export type SavedBook = z.infer<typeof recordSchema>;
let store: UseStore | undefined;
function bookStore() {
  return (store ??= createStore("lee-contigo-books-v1", "books"));
}

export function readSavedBook(
  value: unknown,
  now = Date.now(),
): SavedBook | null {
  const parsed = recordSchema.safeParse(value);
  if (!parsed.success) return null;
  const book = parsed.data;
  if (
    book.createdAt > now + 60_000 ||
    book.expiresAt !== book.createdAt + BOOK_LIFETIME ||
    book.expiresAt <= now ||
    !isAppropriateStory(book.story)
  )
    return null;
  return book;
}
export function makeSavedBook(story: GeneratedStory, level: Level): SavedBook {
  const createdAt = Date.now();
  return {
    version: 1,
    id: crypto.randomUUID(),
    createdAt,
    expiresAt: createdAt + BOOK_LIFETIME,
    level,
    story,
    cover: null,
    atlas: false,
    collection: false,
  };
}
export async function listSavedBooks(): Promise<SavedBook[]> {
  const all = await entries<IDBValidKey, unknown>(bookStore());
  const valid: SavedBook[] = [];
  const discard: IDBValidKey[] = [];
  for (const [key, value] of all) {
    const book = readSavedBook(value);
    if (!book || key !== book.id) discard.push(key);
    else valid.push(book);
  }
  valid.sort((a, b) => b.createdAt - a.createdAt);
  discard.push(...valid.slice(MAX_SAVED_BOOKS).map((book) => book.id));
  if (discard.length) await delMany(discard, bookStore());
  return valid.slice(0, MAX_SAVED_BOOKS);
}
export async function saveBook(book: SavedBook) {
  const valid = readSavedBook(book);
  if (!valid) throw new Error("InvalidSavedBook");
  await set(valid.id, valid, bookStore());
  return listSavedBooks();
}
export async function removeBook(id: string) {
  await del(id, bookStore());
  return listSavedBooks();
}
export async function clearBooks() {
  await clear(bookStore());
}
