import { expect, test, type Page } from "@playwright/test";

const question = (prompt: string, options: string[], quote: string) => ({
  skill: "localizar",
  prompt,
  options,
  correctIndex: 0,
  evidenceParagraph: 0,
  evidenceQuote: quote,
  explanation: "El primer párrafo lo cuenta.",
  hints: [
    "Busca qué objeto llamó la atención de la tortuga junto al jardín.",
    "Vuelve a la primera oración y localiza lo que encontró allí.",
  ],
});
const story = {
  title: "La tortuga y la luz",
  subtitle: "Una aventura pequeña con un gran descubrimiento",
  paragraphs: [
    "Una tortuga curiosa encontró un mapa junto al jardín y quiso saber adónde llevaba el sendero. Se detuvo para mirar los dibujos y preparar su bolso.",
    "El camino subía hasta una colina. La tortuga avanzó despacio y escuchó el viento entre las hojas. Al llegar a la curva, volvió a consultar las señales del mapa.",
    "Al llegar arriba, vio que una luciérnaga buscaba el camino de regreso a casa y parecía confundida. Se acercó con calma para escuchar su problema.",
    "Las dos observaron el mapa y reconocieron un árbol junto a la curva del río. Decidieron seguir aquel sendero despacio, buscando señales entre las piedras.",
    "La luciérnaga alumbró las ramas y la tortuga encontró la entrada del jardín. Cerca de allí dejaron una piedra redonda para reconocer el lugar al volver.",
    "La tortuga compartió el mapa y caminaron juntas bajo las estrellas, felices por haber encontrado compañía. Entre las dos buscaron las pequeñas señales del sendero.",
  ],
  artDescription:
    "Una tortuga amable y una luciérnaga luminosa comparten un mapa en una colina verde al atardecer",
  questions: [
    question(
      "¿Qué encontró la tortuga junto al jardín?",
      ["Un mapa", "Una campana", "Una flor"],
      "Una tortuga curiosa encontró un mapa junto al jardín",
    ),
    {
      ...question(
        "¿Por qué parecía confundida la visitante de la colina?",
        [
          "Porque no encontraba el camino de regreso.",
          "Porque quería llegar a la colina.",
          "Porque buscaba la luz de la luna.",
        ],
        "buscaba el camino de regreso a casa y parecía confundida",
      ),
      skill: "inferir",
      evidenceParagraph: 2,
    },
    {
      ...question(
        "¿Qué idea deja el final sobre ayudar a alguien?",
        [
          "Que una ayuda pequeña puede ser importante.",
          "Que la luna debe guiar a todos.",
          "Que los grillos pueden cruzar cualquier río.",
        ],
        "La tortuga compartió el mapa y caminaron juntas bajo las estrellas",
      ),
      skill: "idea_principal",
      evidenceParagraph: 5,
    },
  ],
};

/** Counts every sound started through Web Audio: tests cannot hear them. */
async function countSounds(page: Page) {
  await page.addInitScript(() => {
    const counter = { started: 0 };
    (window as unknown as { __sonidos: typeof counter }).__sonidos = counter;
    const start = AudioScheduledSourceNode.prototype.start;
    AudioScheduledSourceNode.prototype.start = function (...args) {
      counter.started++;
      return start.apply(this, args);
    };
  });
  return () =>
    page.evaluate(
      () =>
        (window as unknown as { __sonidos: { started: number } }).__sonidos
          .started,
    );
}

async function openQuestions(page: Page) {
  await page.route("**/api/crear", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ story, audioTokens: [] }),
    }),
  );
  await page.route("**/api/crear/portada", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        cover: "/images/lectura-paisajes.png",
        layout: "atlas",
        source: "collection",
      }),
    }),
  );
  await page.goto("/crear");
  await page
    .getByLabel("Mi idea", { exact: true })
    .fill("Una tortuga busca un faro");
  await page.getByLabel(/Un adulto revisó mi idea/).check();
  await page.getByRole("button", { name: "Crear mi cuento" }).click();
  await expect(page.getByRole("heading", { name: story.title })).toBeVisible();
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
  await startQuestions.click();
  await expect(page.getByRole("button", { name: /Una campana/ })).toBeVisible();
}

test("con Sonidos apagado, responder en Crear no suena nada", async ({
  page,
}) => {
  const sounds = await countSounds(page);
  await openQuestions(page);
  await expect(page.getByRole("switch", { name: /Sonidos/ })).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await expect(
    page.getByRole("button", { name: /^Sonido (activado|desactivado)$/ }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: /Una campana/ }).click();
  await page.getByRole("button", { name: "Intentar otra vez" }).click();
  await page.getByRole("button", { name: /Un mapa/ }).click();
  await page.waitForTimeout(800); // la nota de pista llega 0,42 s después
  expect(await sounds()).toBe(0);
});

test("con Sonidos encendido, responder en Crear sí suena", async ({ page }) => {
  const sounds = await countSounds(page);
  await openQuestions(page);
  const toggle = page.getByRole("switch", { name: /Sonidos/ });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  const afterToggle = await sounds();
  await page.getByRole("button", { name: /Una campana/ }).click();
  await expect.poll(sounds).toBeGreaterThan(afterToggle);
});

test("Practicar permanece en silencio por defecto ante error, acierto y pista", async ({
  page,
}) => {
  const sounds = await countSounds(page);
  await page.route("**/api/tutor", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        hint: "Busca lo que no podía ver Tomás.",
        quote: "No veía las piedras.",
        source: "prepared",
      }),
    }),
  );
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  await expect(
    page.getByRole("button", { name: /^Sonido (activado|desactivado)$/ }),
  ).toHaveCount(0);
  await page
    .getByRole("radio", { name: "Porque quería buscar a la luna." })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await page
    .getByRole("button", { name: "Dame una pista", exact: true })
    .click();
  await expect(
    page.getByText("Busca lo que no podía ver Tomás."),
  ).toBeVisible();
  await page
    .getByRole("radio", { name: "Porque no veía las piedras." })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await page.waitForTimeout(800);
  expect(await sounds()).toBe(0);
});

test("la preferencia de Ajustes activa y silencia los sonidos de Practicar", async ({
  page,
}) => {
  const sounds = await countSounds(page);
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const toggle = page.getByRole("switch", { name: /Sonidos/ });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  await page
    .getByRole("radio", { name: "Porque no veía las piedras." })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect.poll(sounds).toBeGreaterThan(0);
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await toggle.click();
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  await page
    .getByRole("radio", { name: "Porque quería buscar a la luna." })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await page.waitForTimeout(800);
  expect(await sounds()).toBe(0);
});
