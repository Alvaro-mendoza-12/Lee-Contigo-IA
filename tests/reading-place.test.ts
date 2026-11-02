import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import {
  clearReadingPlaces,
  maxReadingPlaces,
  parseReadingPlaces,
  readReadingPlace,
  readReadingPlaces,
  readingPlaceKey,
  readingPlaceLifetime,
  removeReadingPlace,
  saveReadingPlace,
  type ReadingBook,
} from "../lib/reading-place.ts";

class Memory {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}
let storage: Memory;
let browser: EventTarget & { location: { search: string } };
const book: ReadingBook = {
  source: "catalogue",
  id: "puente-de-ardillas",
  level: "paso",
};
const position = { paragraph: 1, word: 0 };

function define(name: string, value: unknown) {
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  storage = new Memory();
  browser = Object.assign(new EventTarget(), { location: { search: "" } });
  define("localStorage", storage);
  define("sessionStorage", new Memory());
  define("window", browser);
});

test("solo conserva identificadores y una posición, nunca el texto o las respuestas", () => {
  const extraPosition = { ...position, answer: "No guardar" };
  saveReadingPlace(
    { ...book, title: "No guardar" } as ReadingBook,
    extraPosition,
  );
  const raw = storage.getItem(readingPlaceKey)!;
  assert.ok(!raw.includes("No guardar"));
  assert.deepEqual(
    Object.keys(JSON.parse(raw).places[0]).sort(),
    ["source", "id", "level", "paragraph", "word", "updatedAt"].sort(),
  );
  assert.equal(
    readReadingPlace(book, ["Inicio del cuento", "Continúa el cuento"])
      ?.paragraph,
    1,
  );
});

test("ignora registros rotos, rutas, posiciones imposibles y campos imprevistos", () => {
  const now = Date.now();
  const place = { ...book, ...position, updatedAt: now };
  for (const raw of [
    "{",
    "null",
    JSON.stringify({ version: 2, places: [place] }),
    ...[
      { id: "../privacidad" },
      { paragraph: -1 },
      { paragraph: 1.5 },
      { word: Infinity },
      { level: "adulto" },
      { source: "remote" },
      { answer: "respuesta privada" },
    ].map((change) =>
      JSON.stringify({ version: 1, places: [{ ...place, ...change }] }),
    ),
  ]) {
    assert.deepEqual(parseReadingPlaces(raw, now), []);
  }
});

test("caduca a los siete días y elimina la marca al volver a consultarla", () => {
  const now = Date.now();
  saveReadingPlace(book, position, now - readingPlaceLifetime);
  assert.deepEqual(readReadingPlaces(now), []);
  assert.equal(storage.getItem(readingPlaceKey), null);
  const future = JSON.stringify({
    version: 1,
    places: [{ ...book, ...position, updatedAt: now + 60_001 }],
  });
  assert.deepEqual(parseReadingPlaces(future, now), []);
});

test("limita el guardado a las ocho marcas más recientes, sin duplicar libros", () => {
  const now = Date.now();
  for (let index = 0; index < 12; index++)
    saveReadingPlace({ ...book, id: `cuento-${index}` }, position, now + index);
  const places = readReadingPlaces(now + 12);
  assert.equal(places.length, maxReadingPlaces);
  assert.equal(places[0].id, "cuento-11");
  assert.ok(!places.some((place) => place.id === "cuento-0"));
  saveReadingPlace(
    { ...book, id: "cuento-11" },
    { paragraph: 2, word: 0 },
    now + 13,
  );
  assert.equal(readReadingPlaces(now + 14).length, maxReadingPlaces);
  assert.equal(readReadingPlaces(now + 14)[0].paragraph, 2);
});

test("mantiene separadas las posiciones de cada origen y nivel", () => {
  saveReadingPlace(book, position);
  saveReadingPlace({ ...book, level: "reto" }, { paragraph: 2, word: 0 });
  saveReadingPlace({ ...book, source: "created" }, { paragraph: 3, word: 0 });
  const paragraphs = ["Primero", "Segundo", "Tercero", "Cuarto"];
  assert.equal(readReadingPlace(book, paragraphs)?.paragraph, 1);
  assert.equal(
    readReadingPlace({ ...book, level: "reto" }, paragraphs)?.paragraph,
    2,
  );
  assert.equal(
    readReadingPlace({ ...book, source: "created" }, paragraphs)?.paragraph,
    3,
  );
});

test("volver a la primera página retira una marca que ya no hace falta", () => {
  saveReadingPlace(book, position);
  saveReadingPlace(book, { paragraph: 0, word: 0 });
  assert.equal(storage.getItem(readingPlaceKey), null);
});

test("vuelve al inicio si el texto cambió y la posición ya no existe", () => {
  saveReadingPlace(book, { paragraph: 4, word: 0 });
  assert.equal(readReadingPlace(book, ["Un párrafo"]), null);
  saveReadingPlace(book, { paragraph: 0, word: 9 });
  assert.equal(readReadingPlace(book, ["Solo dos"]), null);
});

test("borrar un libro o todas las marcas no borra otros datos del navegador", () => {
  storage.setItem("tutorial-visto", "true");
  const created = { ...book, source: "created" as const };
  saveReadingPlace(book, position);
  saveReadingPlace(created, position);
  saveReadingPlace({ ...created, level: "reto" }, position);
  removeReadingPlace(created);
  assert.equal(readReadingPlaces().length, 2);
  clearReadingPlaces("created", book.id);
  assert.equal(readReadingPlaces().length, 1);
  clearReadingPlaces();
  assert.equal(storage.getItem(readingPlaceKey), null);
  assert.equal(storage.getItem("tutorial-visto"), "true");
});

test("el modo de demostración no mezcla ni borra las marcas reales", () => {
  saveReadingPlace(book, position);
  browser.location.search = "?demo=1";
  assert.deepEqual(readReadingPlaces(), []);
  saveReadingPlace(book, { paragraph: 2, word: 0 });
  clearReadingPlaces();
  browser.location.search = "?demo=0";
  assert.equal(readReadingPlaces()[0].paragraph, 1);
});

test("leer, guardar y borrar siguen disponibles con el almacenamiento bloqueado", () => {
  define("localStorage", {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  });
  assert.deepEqual(readReadingPlaces(), []);
  assert.equal(readReadingPlace(book, ["Inicio", "Final"]), null);
  assert.doesNotThrow(() => {
    saveReadingPlace(book, position);
    removeReadingPlace(book);
    clearReadingPlaces();
  });
});
