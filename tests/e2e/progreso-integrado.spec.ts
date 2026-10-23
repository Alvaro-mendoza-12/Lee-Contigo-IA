import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const origin = new URL(process.env.TEST_BASE_URL || "http://127.0.0.1:4173")
  .origin;
test.use({
  storageState: {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          { name: "tutorial-visto", value: "true" },
          {
            name: "lee-contigo-progreso",
            value: JSON.stringify({ version: 1, xp: 0, recompensas: [] }),
          },
        ],
      },
    ],
  },
});
const xp = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lee-contigo-progreso") || '{"xp":0}').xp,
  );

test("leer, pedir ayuda y responder sube de nivel una sola vez y abre cuentos", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("Lector Semilla", { exact: true })).toBeVisible();
  await page.goto("/?nivel=reto");
  await expect(
    page.locator("[data-story-id='barco-de-papel']"),
  ).toHaveAttribute("data-locked", "true");
  await page.goto("/leer/barco-de-papel?nivel=paso");
  await expect(
    page.getByRole("heading", { name: "¡Este cuento es un nuevo reto!" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Buscar otro cuento" }),
  ).toHaveAttribute("href", "/?nivel=reto");
  await page.goto("/practicar/barco-de-papel?nivel=paso");
  await expect(
    page.getByRole("heading", { name: "¡Este cuento es un nuevo reto!" }),
  ).toBeVisible();
  await page.goto("/leer/luz-del-bosque?nivel=reto");
  await expect(
    page.getByRole("heading", { name: "¡Este cuento es un nuevo reto!" }),
  ).toBeVisible();
  await page.goto("/practicar/luz-del-bosque?nivel=reto");
  await expect(
    page.getByRole("heading", { name: "¡Este cuento es un nuevo reto!" }),
  ).toBeVisible();
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await expect(
    page.getByLabel("Cómo leer").locator("option[value='reto']"),
  ).toHaveAttribute("disabled", "");
  await page.getByRole("button", { name: "Cerrar ajustes" }).click();
  const explore = page.getByRole("link", { name: "Vamos a pensar" });
  for (let i = 0; i < 25 && !(await explore.isVisible()); i++)
    await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect.poll(() => xp(page)).toBe(30);
  await explore.click();
  await page.route("**/api/tutor", (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  await page
    .getByRole("radio", { name: /Porque quería buscar a la luna/ })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await page
    .getByRole("button", { name: "Dame una pista", exact: true })
    .click();
  await page.getByRole("radio", { name: /Porque no veía las piedras/ }).check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect.poll(() => xp(page)).toBe(35);
  await page.getByRole("button", { name: "Siguiente pregunta" }).click();
  await page.getByRole("radio", { name: /Para que Tomás siguiera/ }).check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await page.getByRole("button", { name: "Siguiente pregunta" }).click();
  await page.getByRole("radio", { name: /Que una pequeña ayuda/ }).check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await page.getByRole("button", { name: "Ver mis descubrimientos" }).click();
  const celebration = page.getByRole("alertdialog");
  await expect(celebration).toBeVisible();
  await expect(
    celebration.getByRole("button", { name: "¡Genial!" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    celebration.getByRole("button", { name: "¡Genial!" }),
  ).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await celebration.getByRole("button", { name: "¡Genial!" }).click();
  await expect.poll(() => xp(page)).toBe(75);
  await page.goto("/?nivel=reto");
  await expect(page.getByText("Lector Brote", { exact: true })).toBeVisible();
  await expect(
    page.locator("[data-story-id='barco-de-papel']"),
  ).toHaveAttribute("data-locked", "false");
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await page.getByLabel("Cómo leer").selectOption("reto");
  await expect(page).toHaveURL(/nivel=reto/);
  await page.getByLabel("Cómo leer").selectOption("paso");
  await page.getByRole("button", { name: "Cerrar ajustes" }).click();
  for (let i = 0; i < 25 && !(await explore.isVisible()); i++)
    await page.getByRole("button", { name: "Página siguiente" }).click();
  await page.reload();
  expect(await xp(page)).toBe(75);
});

test("crear, leer y explorar un libro propio suma XP sin duplicarlo al abrirlo de nuevo", async ({
  page,
}) => {
  const paragraphs = Array.from(
    { length: 6 },
    (_, i) =>
      `La tortuga encontró una cometa azul junto al río. Caminó con calma por el sendero del jardín para buscar a su amiga. Miró las flores y escuchó a los pájaros. Era el paso ${i + 1} de su pequeña aventura.`,
  );
  const story = {
    title: "La cometa de la tortuga",
    subtitle: "Una aventura en compañía",
    paragraphs,
    artDescription: "Una tortuga verde con una cometa azul junto al río",
    questions: ["localizar", "inferir", "idea_principal"].map((skill) => ({
      skill,
      prompt: "¿Qué encontró la tortuga?",
      options: ["Una cometa azul", "Una campana", "Un sombrero"],
      correctIndex: 0,
      evidenceParagraph: 0,
      evidenceQuote: "La tortuga encontró una cometa azul junto al río.",
      explanation: "La primera frase dice que encontró una cometa.",
      hints: ["Mira el objeto junto al río.", "Busca el objeto de color azul."],
    })),
  };
  await page.route("**/api/crear", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ story }),
    }),
  );
  await page.goto("/crear");
  await page
    .getByLabel("Mi idea", { exact: true })
    .fill("Una tortuga busca una cometa");
  await page.getByLabel(/Un adulto revisó mi idea/).check();
  await page.getByRole("button", { name: "Crear mi cuento" }).click();
  await expect(page.getByRole("heading", { name: story.title })).toBeVisible();
  await expect(
    page.getByText("Guardado por 7 días.", { exact: true }),
  ).toBeVisible();
  await expect.poll(() => xp(page)).toBe(15);
  const explore = page.getByRole("button", { name: /Leer y explorar/ });
  for (let i = 0; i < 25 && !(await explore.isVisible()); i++)
    await page.getByRole("button", { name: "Página siguiente" }).click();
  await explore.click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: /Una cometa azul/ }).click();
    if (i === 1)
      await page
        .getByRole("alertdialog")
        .getByRole("button", { name: "¡Genial!" })
        .click();
    await page
      .getByRole("button", {
        name: i === 2 ? "Terminar cuento" : "Siguiente pregunta",
      })
      .click();
  }
  await expect.poll(() => xp(page)).toBe(95);
  await page.reload();
  await page.getByRole("button", { name: /Mis libros/ }).click();
  await page.getByRole("button", { name: `Abrir ${story.title}` }).click();
  expect(await xp(page)).toBe(95);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await page.getByText("Mis puntos", { exact: true }).click();
  await page.getByRole("button", { name: "Reiniciar progreso" }).click();
  await page.getByRole("button", { name: "Conservar mis puntos" }).click();
  expect(await xp(page)).toBe(95);
  await page.getByRole("button", { name: "Reiniciar progreso" }).click();
  await page.getByRole("button", { name: "Sí, borrar puntos" }).click();
  expect(await xp(page)).toBe(0);
  await page.getByRole("button", { name: "Cerrar ajustes" }).click();
  await page.getByRole("button", { name: /Mis libros/ }).click();
  await expect(
    page.getByRole("button", { name: `Abrir ${story.title}` }),
  ).toBeVisible();
});

test("estado informa configuración sin exponer secretos ni prometer disponibilidad", async ({
  request,
}) => {
  const result = await request.get("/api/estado");
  expect(result.status()).toBe(200);
  const status = await result.json();
  expect(status.providerAvailability).toBe("not_checked");
  expect(typeof status.textProviders.openRouterConfigured).toBe("boolean");
  expect(JSON.stringify(status)).not.toMatch(/sk-or-v1-|sk_[a-f\d]{20}|cfut_/);
});
