import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { paginateStory } from "../../lib/reading";
import { getStory } from "../../lib/stories";

function sampleAudio() {
  const data = Buffer.alloc(44 + 16000 * 5);
  data.write("RIFF");
  data.writeUInt32LE(data.length - 8, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(8000, 24);
  data.writeUInt32LE(16000, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(data.length - 44, 40);
  return data;
}

test("la portada infantil organiza sus destinos y no desborda a 320 px", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "¿Leemos un cuento?",
  );
  const chapters = page.getByRole("region", { name: "Más aventuras" });
  await expect(chapters.getByRole("link")).toHaveCount(2);
  await expect(
    chapters.getByRole("link", { name: /Más cuentos/ }),
  ).toHaveAttribute("href", "/biblioteca");
  await expect(
    chapters.getByRole("link", { name: /Crear un cuento/ }),
  ).toHaveAttribute("href", "/crear");
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/crear");
  await expect(page.getByLabel("Mi idea", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("inicio directo, diez cuentos completos y navegación visible en móvil", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Leer un cuento", exact: true }).click();
  await expect(page).toHaveURL(/\/leer\/luz-del-bosque/);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Cuentos", exact: true })
    .click();
  const books = page.locator(".story-card-direct");
  await expect(books).toHaveCount(10);
  const hrefs = await books.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(new Set(hrefs).size).toBe(10);
  for (const href of hrefs) {
    await page.goto(href!);
    await expect(page.locator(".book-page-text")).not.toBeEmpty();
    await expect(page.locator(".paper-spread img")).toHaveCount(1);
    expect(
      await page
        .locator(".paper-spread img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    ).toBeTruthy();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.goto("/biblioteca");
  await page.getByRole("radio", { name: "Un nuevo reto", exact: true }).check();
  await page
    .getByRole("link", { name: "Leer El pan de la abuela", exact: true })
    .click();
  await expect(page).toHaveURL(/nivel=reto/);
  await expect(page.locator(".book-page-text")).toContainText(
    "quería aprender",
  );
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("la voz reproduce audio, detiene al cambiar de página y reutiliza la página", async ({
  page,
}) => {
  const requests: unknown[] = [];
  await page.route("**/api/narrar", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ contentType: "audio/wav", body: sampleAudio() });
  });
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Detener lectura" }),
  ).toBeVisible();
  await expect(
    page.getByText("Voz: elevenlabs.io", { exact: false }),
  ).toBeVisible();
  expect(requests[0]).toMatchObject({
    source: "catalogue",
    storyId: "luz-del-bosque",
    level: "paso",
    paragraph: 0,
    start: 0,
  });
  expect(requests[0]).not.toHaveProperty("text");
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(
    page.getByRole("button", { name: "Escuchar", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Anterior", exact: true }).click();
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Detener lectura" }),
  ).toBeVisible();
  expect(requests).toHaveLength(1);
  await page.locator(".reading-settings > summary").click();
  await page.getByLabel("¿Quién te lee?").selectOption("sarah");
  await page.locator(".reading-settings > summary").click();
  await expect(
    page.getByRole("button", { name: "Escuchar", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Detener lectura" }),
  ).toBeVisible();
  expect(requests).toHaveLength(2);
  expect(requests[1]).toMatchObject({ voice: "sarah" });
  await page.reload();
  await page.locator(".reading-settings > summary").click();
  await expect(page.getByLabel("¿Quién te lee?")).toHaveValue("sarah");
});

test("si la voz externa falla se lee el texto visible con la voz española del dispositivo", async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        text: string;
        constructor(text: string) {
          this.text = text;
        }
      },
      configurable: true,
    });
    const state = {
      texts: [] as string[],
      languages: [] as string[],
      cancelled: 0,
    };
    Object.defineProperty(window, "voiceTest", { value: state });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        cancel: () => state.cancelled++,
        getVoices: () => [{ lang: "es-PE", name: "Spanish test" }],
        speak: (utterance: SpeechSynthesisUtterance) => {
          state.texts.push(utterance.text);
          state.languages.push(utterance.lang);
        },
      },
      configurable: true,
    });
  });
  await page.route("**/api/narrar", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "unavailable" }),
    }),
  );
  await page.goto("/leer/puente-de-ardillas?nivel=paso");
  await expect(page.locator(".book-page-text")).toHaveText(
    paginateStory(
      getStory("puente-de-ardillas")!.versions.paso.paragraphs,
      5,
      isMobile,
    )[0].text,
  );
  const text = await page.locator(".book-page-text").innerText();
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect(page.getByText("Usamos la voz del dispositivo.")).toBeVisible();
  const calls = await page.evaluate(
    () =>
      (
        window as unknown as {
          voiceTest: { texts: string[]; languages: string[] };
        }
      ).voiceTest,
  );
  expect(calls.texts).toEqual([text]);
  expect(calls.languages).toEqual(["es"]);
  await page
    .getByRole("button", { name: "Un nuevo reto", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Escuchar", exact: true }),
  ).toBeVisible();
});

test("un error tiene texto, color, ayuda audible y no se revela por repetir el clic", async ({
  page,
}) => {
  await page.goto("/practicar/puente-de-ardillas?nivel=paso");
  const sound = page.getByRole("button", {
    name: "Sonido activado",
    exact: true,
  });
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await sound.click();
  await expect(
    page.getByRole("button", { name: "Sonido desactivado" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("radio", { name: "Hojas encima del agua." }).check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect(
    page.getByText("Aún no es la respuesta. Busquemos una pista."),
  ).toBeVisible();
  await expect(page.locator(".answer.incorrect")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Escuchar ayuda" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Comprobar respuesta" }),
  ).toBeDisabled();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page
    .getByRole("radio", { name: "Dos piedras junto a las orillas." })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect(
    page.getByRole("button", { name: "Siguiente pregunta" }),
  ).toBeVisible();
});

test("la ruta de voz rechaza texto libre y un origen ajeno", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/narrar", { data: { text: "un prompt libre" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/narrar", {
        headers: { origin: "https://otro.example" },
        data: {
          source: "catalogue",
          storyId: "luz-del-bosque",
          level: "paso",
          paragraph: 0,
          start: 0,
          end: 5,
        },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/narrar", {
        data: {
          source: "generated",
          paragraphText: "otro texto",
          authorization: "invalid",
          start: 0,
          end: 2,
        },
      })
    ).status(),
  ).toBe(400);
});
