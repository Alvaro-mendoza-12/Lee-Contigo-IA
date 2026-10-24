import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { storiesForShelf } from "../../lib/stories";

test("los tres destinos del inicio funcionan y Cuentos enfoca la biblioteca", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const destinations = page.getByRole("group", { name: "¿Qué quieres hacer?" });
  await expect(destinations.getByRole("link")).toHaveCount(3);
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(page.locator("[data-slot='barra-xp']")).toContainText("Nivel 5");
  const books = page.locator(".story-card-direct[href^='/leer/']");
  await expect(books).toHaveCount(storiesForShelf("paso").length);
  expect(
    await books.evaluateAll((links) =>
      links.every((link) => link.getAttribute("href")?.endsWith("?nivel=paso")),
    ),
  ).toBe(true);
  await destinations
    .getByRole("link", { name: "Cuentos", exact: true })
    .click();
  await expect(page).toHaveURL(/#cuentos$/);
  await expect(page.locator("#cuentos")).toBeFocused();
  await destinations.getByRole("link", { name: "Crear", exact: true }).click();
  await expect(page.getByLabel("Mi idea", { exact: true })).toBeVisible();
  await page.goBack();
  await destinations
    .getByRole("link", { name: "Acompañar", exact: true })
    .click();
  await expect(page).toHaveURL(/\/acompanar$/);
  await expect(page).toHaveTitle(/^Acompañar · LeeContigo IA$/);
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Acompañar" }),
  ).toHaveAttribute("href", "/acompanar");
  expect(errors).toEqual([]);
});

test("el menú resalta solo la sección actual, también al volver y dentro del cuento", async ({
  page,
}) => {
  const nav = page.getByRole("navigation", { name: "Navegación principal" });
  for (const [route, label] of [
    ["/", "Cuentos"],
    ["/crear", "Crear"],
    ["/acompanar", "Acompañar"],
    ["/leer/luz-del-bosque?nivel=paso", "Cuentos"],
    ["/practicar/luz-del-bosque?nivel=paso", "Cuentos"],
  ]) {
    await page.goto(route);
    await expect(nav.locator("[aria-current='page']")).toHaveCount(1);
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      nav.getByRole("link", { name: "Adultos", exact: true }),
    ).toHaveCount(0);
  }
  await nav.getByRole("link", { name: "Crear", exact: true }).click();
  await expect(
    nav.getByRole("link", { name: "Crear", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.goBack();
  await expect(
    nav.getByRole("link", { name: "Cuentos", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.goto("/privacidad");
  await expect(nav.locator("[aria-current='page']")).toHaveCount(0);
});

for (const [width, height] of [
  [320, 740],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1366, 900],
  [1920, 1080],
]) {
  test(`inicio legible y sin desbordamiento a ${width} px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const destinations = page.getByRole("group", {
      name: "¿Qué quieres hacer?",
    });
    for (const name of ["Cuentos", "Crear", "Acompañar"]) {
      const link = destinations.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(200);
      expect(box.height).toBeGreaterThanOrEqual(80);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    const first = (await nav.getByRole("link").first().boundingBox())!;
    const last = (await nav.getByRole("link").last().boundingBox())!;
    expect(Math.abs(first.y - last.y)).toBeLessThan(2);
    expect(last.x + last.width).toBeLessThanOrEqual(width);
    await expect(
      nav.getByRole("link", { name: "Cuentos", exact: true }),
    ).toHaveCSS("background-color", "rgb(255, 214, 107)");
    await expect(page.locator(".home-welcome")).toHaveCSS(
      "background-size",
      "cover",
    );
    await expect(page.locator(".home-welcome")).toHaveCSS(
      "background-image",
      /lee-contigo-fondo-infancia.webp/,
    );
    if (width === 320 || width === 1366) {
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(axe.violations).toEqual([]);
    }
    await page.locator(".story-art img").evaluateAll(async (images) => {
      await Promise.all(
        images.map(async (element) => {
          const image = element as HTMLImageElement;
          image.loading = "eager";
          await image.decode();
        }),
      );
    });
    await page.screenshot({
      path: `output/playwright/piero-inicio-${width}-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
}
