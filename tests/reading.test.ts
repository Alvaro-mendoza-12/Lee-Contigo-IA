import { test } from "node:test";
import assert from "node:assert/strict";
import { fontSteps, paginateStory } from "../lib/reading.ts";

test("la paginación conserva el relato y reduce texto por página en móvil", () => {
  const paragraphs = [
    "Una luciérnaga pequeña encendió su luz junto al río.",
    "Su amigo buscó con cuidado las piedras para cruzar.",
    "Ada observó el hilo y se detuvo para pensar. La cometa se había inclinado varias veces hacia el jardín. En vez de tirar más fuerte, propuso mirar la cola y comparar lo que ocurría con cada cambio. Teo escuchó su idea y ambos volvieron a probar con paciencia.",
  ];
  for (const size of [0, 3, 5, 8, 10]) {
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
    assert.ok(
      desktopPages.every(
        (page) => page.text.split(/\s+/).length <= fontSteps[size].words,
      ),
    );
    assert.ok(mobilePages.length >= desktopPages.length);
  }
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
      const words = compact
        ? Math.max(size >= 8 ? 4 : 8, Math.floor(fontSteps[size].words * 0.45))
        : fontSteps[size].words;
      assert.ok(pages.every((page) => page.text.length <= words * 7));
    }
});
