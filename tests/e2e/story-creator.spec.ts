import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const story = {
  title: "La tortuga y la luz",
  subtitle: "Una aventura pequeña con un gran descubrimiento",
  paragraphs: [
    "Una tortuga curiosa encontró un mapa junto al jardín y quiso saber adónde llevaba el sendero.",
    "El camino subía hasta una colina. La tortuga avanzó despacio y escuchó el viento entre las hojas.",
    "Al llegar arriba, vio que una luciérnaga buscaba el camino de regreso a casa y parecía confundida.",
    "La tortuga compartió el mapa y caminaron juntas bajo las estrellas, felices por haber encontrado compañía.",
  ],
  artDescription:
    "Una tortuga amable y una luciérnaga luminosa comparten un mapa en una colina verde al atardecer",
  questions: [
    {
      skill: "localizar",
      prompt: "¿Qué encontró la tortuga junto al jardín?",
      options: ["Un mapa", "Una campana", "Una flor"],
      correctIndex: 0,
      evidenceParagraph: 0,
      evidenceQuote: "Una tortuga curiosa encontró un mapa junto al jardín",
      explanation:
        "El primer párrafo cuenta que la tortuga encontró un mapa junto al jardín.",
      hints: [
        "Busca qué objeto llamó la atención de la tortuga junto al jardín.",
        "Vuelve a la primera oración y localiza lo que encontró allí.",
      ],
    },
    {
      skill: "inferir",
      prompt: "¿Por qué parecía confundida la visitante de la colina?",
      options: [
        "Porque no encontraba el camino de regreso.",
        "Porque quería llegar a la colina.",
        "Porque buscaba la luz de la luna.",
      ],
      correctIndex: 0,
      evidenceParagraph: 2,
      evidenceQuote: "buscaba el camino de regreso a casa y parecía confundida",
      explanation:
        "La visitante buscaba el camino de regreso y no sabía cómo encontrarlo.",
      hints: [
        "Fíjate qué estaba intentando encontrar la visitante en la colina.",
        "Relaciona su búsqueda con la emoción que muestra en ese momento.",
      ],
    },
    {
      skill: "idea_principal",
      prompt: "¿Qué idea deja el final sobre ayudar a alguien?",
      options: [
        "Que una ayuda pequeña puede ser importante.",
        "Que la luna debe guiar a todos.",
        "Que los grillos pueden cruzar cualquier río.",
      ],
      correctIndex: 0,
      evidenceParagraph: 3,
      evidenceQuote:
        "La tortuga compartió el mapa y caminaron juntas bajo las estrellas",
      explanation:
        "El último párrafo muestra cómo compartir una ayuda permitió que ambas siguieran juntas.",
      hints: [
        "Recuerda qué cambió para las dos después de encontrarse.",
        "Compara el problema del comienzo con lo que pudieron hacer al final.",
      ],
    },
  ],
};

test("el cuento creado conecta la respuesta con una cita del texto sin reenviar respuestas", async ({
  page,
}) => {
  await page.route("**/api/crear", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ story }),
    });
  });
  const illustrationRequests: unknown[] = [];
  await page.route("**/api/crear/portada", async (route) => {
    illustrationRequests.push(route.request().postDataJSON());
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        cover:
          "data:image/svg+xml;base64," +
          Buffer.from(
            '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="#cedfc7"/></svg>',
          ).toString("base64"),
        layout: "atlas",
      }),
    });
  });

  const tutorRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/api/tutor")) tutorRequests.push(request.url());
  });

  await page.goto("/crear");
  await page
    .getByLabel("Mi idea para el cuento")
    .fill("Una tortuga busca un faro");
  await page.getByLabel(/Una persona adulta está conmigo/).check();
  await page.getByRole("button", { name: "Crear mi cuento" }).click();
  await expect(
    page.getByText("Tu libro está ilustrado. Las escenas cambian al avanzar."),
  ).toBeVisible();
  expect(illustrationRequests).toHaveLength(1);
  await expect(page.getByText("¿Quieres ilustrar la portada?")).toHaveCount(0);

  const nextPage = page.getByRole("button", { name: "Página siguiente" });
  const startQuestions = page.getByRole("button", { name: /Leer y explorar/ });
  for (
    let turns = 0;
    turns < 16 && !(await startQuestions.isVisible());
    turns++
  ) {
    await nextPage.scrollIntoViewIfNeeded();
    await nextPage.click();
  }
  await expect(startQuestions).toBeVisible();
  await startQuestions.click();

  await page.getByRole("button", { name: /Un mapa/ }).click();
  await expect(
    page.getByText("Una tortuga curiosa encontró un mapa junto al jardín", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByText("Leer el párrafo 1 completo", { exact: true }).click();
  await expect(
    page.getByText(story.paragraphs[0], { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  expect(tutorRequests).toEqual([]);
});
