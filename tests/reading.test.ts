import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fontSteps,
  paginateStory,
  migrateFontSize,
  nearestFontSize,
} from "../lib/reading.ts";
import { stories } from "../lib/stories.ts";

test("la paginación conserva cada escena entera en móvil y escritorio", () => {
  const paragraphs = [
    "Una luciérnaga pequeña encendió su luz junto al río.",
    "Su amigo buscó con cuidado las piedras para cruzar.",
    "Ada observó el hilo y se detuvo para pensar. La cometa se había inclinado varias veces hacia el jardín. En vez de tirar más fuerte, propuso mirar la cola y comparar lo que ocurría con cada cambio. Teo escuchó su idea y ambos volvieron a probar con paciencia.",
  ];
  assert.equal(fontSteps.length, 3);
  for (const size of [0, 1, 2]) {
    const desktopPages = paginateStory(paragraphs, size);
    const mobilePages = paginateStory(paragraphs, size, true);
    const reconstruct = (pages: ReturnType<typeof paginateStory>) =>
      paragraphs
        .map((_, paragraph) =>
          pages
            .filter((page) => page.paragraph === paragraph)
            .map((page) => page.text)
            .join(" "),
        )
        .join("|");

    assert.equal(reconstruct(desktopPages), paragraphs.join("|"));
    assert.equal(reconstruct(mobilePages), paragraphs.join("|"));
    assert.equal(desktopPages.length, paragraphs.length);
    assert.deepEqual(mobilePages, desktopPages);
  }
});

test("migra los once índices antiguos al tamaño nuevo más cercano", () => {
  assert.deepEqual(
    Array.from({ length: 11 }, (_, index) => migrateFontSize(index)),
    [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2],
  );
  assert.equal(migrateFontSize(-1), 1);
  assert.equal(migrateFontSize(NaN), 1);
  assert.equal(nearestFontSize(23), 1);
  assert.equal(nearestFontSize(44), 2);
});
test("las palabras largas no deforman páginas ni cambian los rangos de voz", () => {
  const text = Array(50).fill("extraordinariamente").join(" ");
  for (let size = 0; size < fontSteps.length; size++)
    for (const compact of [false, true]) {
      const pages = paginateStory([text], size, compact);
      assert.equal(pages.map((page) => page.text).join(" "), text);
      for (const page of pages) {
        assert.equal(
          page.text,
          text.split(/\s+/).slice(page.start, page.end).join(" "),
        );
        assert.ok(page.end > page.start);
      }
      assert.ok(
        pages.every((page) => page.text.trim().split(/\s+/).length >= 12),
      );
    }
});

test("ninguna página del catálogo queda reducida a un fragmento", () => {
  for (const story of stories)
    for (const version of Object.values(story.versions))
      for (let size = 0; size < fontSteps.length; size++)
        for (const compact of [false, true]) {
          const pages = paginateStory(version.paragraphs, size, compact);
          assert.equal(pages.length, version.paragraphs.length, story.id);
          assert.ok(
            pages.every((page) => page.text.trim().split(/\s+/).length >= 12),
          );
        }
});

test("equilibra el final de una escena antes de dejar una página suelta", () => {
  const paragraph =
    "Nina encontró una huella junto al sendero y llamó a su amigo para mirar con cuidado. Juntos compararon las marcas del suelo, siguieron una pista pequeña y descubrieron quién había pasado por allí. Al final, compartieron su hallazgo.";
  for (let size = 0; size < fontSteps.length; size++)
    for (const compact of [false, true]) {
      const pages = paginateStory([paragraph], size, compact);
      assert.ok(pages.every((page) => page.text.split(/\s+/).length >= 12));
      assert.equal(pages.map((page) => page.text).join(" "), paragraph);
    }
});
