import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getStory } from "../../lib/stories";
import { readingPlaceKey } from "../../lib/reading-place";

const reader = "/leer/puente-de-ardillas?nivel=paso";

test("retoma la última página después de cerrar y volver al cuento", async ({
  page,
}) => {
  await page.goto(reader);
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(page.getByText("Página 2 de 4", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Página 2 de 4", { exact: true })).toBeVisible();
  await expect(page.locator(".book-turn-layer")).toHaveCount(0);
});

test("recuerda que el lector apagó el giro de páginas", async ({ page }) => {
  await page.goto(reader);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await page.getByLabel("Animar páginas").uncheck();
  await page.reload();
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await expect(page.getByLabel("Animar páginas")).not.toBeChecked();
});

test("Seguir leyendo mantiene tres destinos y permite volver al inicio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(reader);
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await page.goto("/");
  const destinations = page.getByRole("group", { name: "¿Qué quieres hacer?" });
  await expect(destinations.getByRole("link")).toHaveCount(3);
  await destinations
    .getByRole("link", { name: "Seguir leyendo El puente de las ardillas" })
    .click();
  await expect(page.getByText("Página 2 de 4", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await page
    .getByRole("button", { name: "Leer desde el inicio", exact: true })
    .click();
  await expect(page.getByText("Página 1 de 4", { exact: true })).toBeVisible();
  await page.goto("/");
  await expect(
    destinations.getByRole("link", { name: "Cuentos", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("cada nivel vuelve a su propia página y el reingreso no llama a la IA", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname.startsWith("/api/")
    )
      posts.push(request.url());
  });
  await page.goto(reader);
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await page.goto(reader.replace("paso", "reto"));
  await expect(page.getByText("Página 1 de 4", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await page.goto(reader);
  await expect(page.getByText("Página 2 de 4", { exact: true })).toBeVisible();
  await page.goto(reader.replace("paso", "reto"));
  await expect(page.getByText("Página 3 de 4", { exact: true })).toBeVisible();
  expect(posts).toEqual([]);
});

test("Borrar mi progreso quita también las marcas de lectura", async ({
  page,
}) => {
  await page.goto(reader);
  await page.getByRole("button", { name: "Página siguiente" }).click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), readingPlaceKey),
  ).not.toBeNull();
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await settings
    .getByRole("button", { name: "Borrar mi progreso", exact: true })
    .click();
  await settings
    .getByRole("button", { name: "Sí, borrar", exact: true })
    .click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), readingPlaceKey),
  ).toBeNull();
  await page.reload();
  await expect(page.getByText("Página 1 de 4", { exact: true })).toBeVisible();
});

test("la reflexión final es opcional, accesible y no recoge respuestas", async ({
  page,
}) => {
  await page.goto("/practicar/puente-de-ardillas?nivel=paso");
  const questions = getStory("puente-de-ardillas")!.versions.paso.questions;
  for (const [index, question] of questions.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[question.correct],
        exact: true,
      })
      .check();
    await page.getByRole("button", { name: "Comprobar respuesta" }).click();
    await page
      .getByRole("button", {
        name:
          index === questions.length - 1
            ? "Ver mis descubrimientos"
            : "Siguiente pregunta",
      })
      .click();
  }
  await expect(
    page.getByText("¿Qué pasó al principio? ¿Y al final?", { exact: true }),
  ).not.toBeVisible();
  const stored = await page.evaluate(() => JSON.stringify(localStorage));
  await page.getByText("Cuéntalo a tu manera", { exact: true }).click();
  await expect(
    page.getByText("¿Qué pasó al principio? ¿Y al final?", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(stored);
  await expect(page.locator(".respuesta-vuelo")).toHaveCount(0);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("privacidad presenta un resumen corto y conserva el detalle para adultos", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/privacidad");
  await expect(
    page.getByRole("heading", { name: "Lo más importante" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Puntos y últimas páginas en este navegador",
    }),
  ).not.toBeVisible();
  await page.getByText("Para familias y docentes", { exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Puntos y últimas páginas en este navegador",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("se puede leer y elegir menos movimiento aunque el navegador no guarde preferencias", async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"] as const) {
      const original = Storage.prototype[method];
      Object.defineProperty(Storage.prototype, method, {
        value(key: string, ...args: string[]) {
          if (
            key.startsWith("lee-contigo-reading-place") ||
            key === "lee-contigo-page-animation-v1"
          )
            throw new Error("StorageBlocked");
          return Reflect.apply(original, this, [key, ...args]);
        },
      });
    }
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(reader);
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(page.getByText("Página 2 de 4", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await page.getByLabel("Animar páginas").uncheck();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByLabel("Animar páginas")).not.toBeChecked();
  await page
    .getByRole("button", { name: "Cerrar ajustes", exact: true })
    .click();
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(page.getByText("Página 3 de 4", { exact: true })).toBeVisible();
  await expect(page.locator(".book-turn-layer")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("empieza sin giro si el dispositivo pide menos movimiento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(reader);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await expect(page.getByLabel("Animar páginas")).not.toBeChecked();
});
