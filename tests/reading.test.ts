import { test } from "node:test";
import assert from "node:assert/strict";
import { fontSteps, paginateStory } from "../lib/reading.ts";

test("la paginación conserva el relato y reduce texto por página en móvil", () => {
  const paragraphs = [
    "Una luciérnaga pequeña encendió su luz junto al río.",
    "Su amigo buscó con cuidado las piedras para cruzar.",
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
