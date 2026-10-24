import { expect, test, type Page } from "@playwright/test";
import { getStory, stories } from "../../lib/stories";

// Garantías verificables del objetivo. Ya cubierto en reading.spec.ts:
// axe sin infracciones en /, /leer, /practicar y /acompanar (G5).

const xp = (page: Page) =>
  page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lee-contigo-progreso") ?? '{"xp":0}')
        .xp as number,
  );

async function leerHastaElFinal(page: Page) {
  const siguiente = page.getByRole("button", { name: "Página siguiente" });
  await expect(page.locator(".book-page-text")).not.toBeEmpty();
  while (await siguiente.isEnabled()) await siguiente.click();
}

async function responderBien(page: Page, id: string, nivel: "paso" | "reto") {
  const { questions } = getStory(id)!.versions[nivel];
  for (const [i, pregunta] of questions.entries()) {
    await page.locator(".answers label").nth(pregunta.correct).click();
    await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
    await page
      .getByRole("button", {
        name:
          i === questions.length - 1
            ? /Ver mis descubrimientos/
            : /Siguiente pregunta/,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "¡Mira todo lo que exploraste!" }),
  ).toBeVisible();
}

test("G1 · los 19 cuentos abren en ambos niveles con texto y 3 preguntas", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Basta una vez por suite.");
  test.setTimeout(240_000);
  expect(stories).toHaveLength(19);
  for (const story of stories)
    for (const nivel of ["paso", "reto"] as const) {
      await page.goto(`/leer/${story.id}?nivel=${nivel}`);
      await expect(page.locator(".book-page-text"), story.id).not.toBeEmpty();
      await page.goto(`/practicar/${story.id}?nivel=${nivel}`);
      await expect(page.getByText("PREGUNTA 1 DE 3")).toBeVisible();
      await expect(page.locator(".answers label")).toHaveCount(3);
    }
});

for (const [id, nivel] of [
  ["luz-del-bosque", "paso"],
  ["botella-mar", "reto"],
] as const)
  test(`G1 · ${id} (${nivel}) se lee hasta el final y se practica sin claves`, async ({
    page,
  }) => {
    await page.goto(`/leer/${id}?nivel=${nivel}`);
    await leerHastaElFinal(page);
    await page.getByRole("link", { name: "Vamos a pensar" }).click();
    await expect(page).toHaveURL(new RegExp(`/practicar/${id}`));
    await page.getByRole("button", { name: "¡A pensar!" }).click();
    await responderBien(page, id, nivel);
  });

test("G4 · el +30 solo se gana al llegar al final del cuento", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  const antes = await xp(page);
  const pensar = page.getByRole("link", { name: "Vamos a pensar" });
  await expect(pensar).toHaveCount(0);
  const siguiente = page.getByRole("button", { name: "Página siguiente" });
  await siguiente.click();
  await expect(pensar).toHaveCount(0);
  expect(await xp(page)).toBe(antes);
  await leerHastaElFinal(page);
  await pensar.click();
  await expect(page).toHaveURL(/\/practicar\/luz-del-bosque/);
  expect(await xp(page)).toBe(antes + 30);
});

test("G5 · letra mínima de 16 px y sin scroll horizontal a 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  const reducir = page.getByRole("button", { name: "Reducir tamaño de letra" });
  while (await reducir.isEnabled()) await reducir.click();
  const tamano = await page
    .locator(".book-page-text")
    .evaluate((nodo) => parseFloat(getComputedStyle(nodo).fontSize));
  expect(tamano).toBeGreaterThanOrEqual(16);
  for (const ruta of [
    "/leer/luz-del-bosque?nivel=paso",
    "/practicar/luz-del-bosque?nivel=paso",
    "/acompanar",
  ]) {
    await page.goto(ruta);
    await expect(page.locator("main h1").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      ruta,
    ).toBe(true);
  }
});

test("G3 · tras usar las 2 pistas, el siguiente error muestra la respuesta", async ({
  page,
}) => {
  const [pregunta] = getStory("luz-del-bosque")!.versions.paso.questions;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  const antes = await xp(page);
  await page.getByRole("button", { name: "Dame una pista" }).click();
  await page.getByRole("button", { name: "Dame otra pista" }).click();
  await expect(
    page.getByRole("button", { name: "Ya tienes las dos pistas" }),
  ).toBeVisible();
  const incorrecta = (pregunta.correct + 1) % pregunta.options.length;
  await page.locator(".answers label").nth(incorrecta).click();
  await page.getByRole("button", { name: /Comprobar respuesta/ }).click();

  await expect(
    page.getByText("Esta es la respuesta. Mira lo que dice el cuento:"),
  ).toBeVisible();
  await expect(page.getByText(pregunta.explanation)).toBeVisible();
  await expect(page.locator(".answer.revealed-answer")).toContainText(
    pregunta.options[pregunta.correct],
  );
  await expect(page.locator(".answer-evidence--resaltada")).toHaveText(
    getStory("luz-del-bosque")!.versions.paso.paragraphs[pregunta.paragraph],
  );
  // G4: una pregunta revelada no da experiencia.
  expect(await xp(page)).toBe(antes);
  await page.getByRole("button", { name: "Siguiente pregunta" }).click();
  await expect(page.getByText("PREGUNTA 2 DE 3")).toBeVisible();
});

test("G3 · sin pedir pistas, el tercer error también muestra la respuesta", async ({
  page,
}) => {
  const [pregunta] = getStory("luz-del-bosque")!.versions.paso.questions;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  const antes = await xp(page);
  const incorrectas = pregunta.options
    .map((_, i) => i)
    .filter((i) => i !== pregunta.correct);
  for (const intento of [incorrectas[0], incorrectas[1]]) {
    await page.locator(".answers label").nth(intento).click();
    await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
    await expect(page.getByText("¡Casi! Mira la pista.")).toBeVisible();
  }
  await page.locator(".answers label").nth(incorrectas[0]).click();
  await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
  await expect(
    page.getByText("Esta es la respuesta. Mira lo que dice el cuento:"),
  ).toBeVisible();
  expect(await xp(page)).toBe(antes);
});
