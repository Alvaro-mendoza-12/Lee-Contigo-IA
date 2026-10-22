import { test, expect, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ hasTouch: true });

async function swipe(page: Page, target: Locator, direction: "left" | "right") {
  await target.scrollIntoViewIfNeeded();
  const box = (await target.boundingBox())!;
  const from = box.x + box.width * (direction === "left" ? 0.8 : 0.2);
  const to = box.x + box.width * (direction === "left" ? 0.2 : 0.8);
  const y = box.y + Math.min(box.height / 2, 95);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: from, y }],
    });
    for (let step = 1; step <= 8; step++)
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: from + ((to - from) * step) / 8, y }],
      });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await session.detach();
  }
}

test("el menú móvil ocupa una fila con iconos, nombres y estado actual", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegación principal" });
  await expect(nav.getByRole("link")).toHaveCount(2);
  expect(
    (await page.locator(".site-header").boundingBox())!.height,
  ).toBeLessThanOrEqual(72);
  await nav.getByRole("link", { name: "Cuentos", exact: true }).tap();
  await expect(
    nav.getByRole("link", { name: "Cuentos", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Crear", exact: true }).tap();
  await expect(
    page.getByRole("heading", { name: "Crea tu cuento" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("las tres categorías conservan diez cuentos y se deslizan con dedo, botones y teclado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/biblioteca");
  const friends = page.getByRole("region", { name: "Amigos", exact: true });
  const rail = friends.getByRole("list");
  await expect(friends.getByRole("link")).toHaveCount(3);
  await expect(
    page
      .getByRole("region", { name: "Naturaleza", exact: true })
      .getByRole("link"),
  ).toHaveCount(3);
  await expect(
    page
      .getByRole("region", { name: "Descubrimientos", exact: true })
      .getByRole("link"),
  ).toHaveCount(4);
  const hrefs = await page
    .locator(".story-card-direct")
    .evaluateAll((elements) => elements.map((el) => el.getAttribute("href")));
  expect(new Set(hrefs).size).toBe(10);
  const previous = friends.getByRole("button", {
    name: "Ver cuentos anteriores de Amigos",
  });
  await expect(previous).toBeDisabled();
  await friends
    .getByRole("button", { name: "Ver más cuentos de Amigos" })
    .tap();
  await expect
    .poll(() => rail.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await previous.tap();
  await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBe(0);
  await swipe(page, rail, "left");
  await expect
    .poll(() => rail.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await swipe(page, rail, "right");
  await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBe(0);
  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => rail.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await page.getByRole("radio", { name: "Un nuevo reto", exact: true }).check();
  await expect(page.locator(".story-card-direct").first()).toHaveAttribute(
    "href",
    /nivel=reto/,
  );
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("la tablet horizontal muestra dos caras y deslizar la imagen pasa hojas sin bloquear el texto", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Aumentar tamaño de letra" }).click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator(".book-page-text")).toHaveCSS("font-size", "28px");
  const book = page.locator(".paper-book");
  const art = page.locator(".paper-spread > .paper-art");
  const text = page.locator(".paper-spread > .paper-text");
  const width = (await book.boundingBox())!.width;
  expect((await art.boundingBox())!.width).toBeCloseTo(width / 2, 0);
  expect((await text.boundingBox())!.width).toBeCloseTo(width / 2, 0);
  await swipe(page, art, "left");
  await expect(page.getByText(/^Página 2 de \d+$/)).toBeVisible();
  await swipe(page, art, "right");
  await expect(page.getByText(/^Página 1 de \d+$/)).toBeVisible();
  await text.evaluate((el) => {
    const node = el.querySelector(".book-page-text")!.firstChild!;
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, 4);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
  });
  await expect(
    page.getByRole("button", { name: "Ayúdame con esta parte" }),
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
