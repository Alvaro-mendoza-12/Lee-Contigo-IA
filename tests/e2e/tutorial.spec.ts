import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Exercise first visits here; the other suites start with the guide already seen.
test.use({ storageState: { cookies: [], origins: [] } });

test("solo el inicio abre la guía en la primera visita y no la repite", async ({
  page,
}) => {
  await page.goto("/");
  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await guide.getByRole("button", { name: "Saltar" }).click();
  await expect(guide).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(700);
  await expect(guide).toHaveCount(0);
  await page.getByRole("button", { name: "Ver la guía" }).click();
  await expect(guide).toBeVisible();
  await guide.getByRole("button", { name: "Siguiente" }).click();
  const target = page.locator('[data-tutorial="cuentos"]');
  await expect(target).toHaveClass(/home-destination/);
  // The highlight animates to the card after the smooth scroll settles.
  await expect
    .poll(async () => {
      const focus = await page.locator(".tutorial-foco").boundingBox();
      const card = await target.boundingBox();
      return Math.max(
        Math.abs(focus!.x + 8 - card!.x),
        Math.abs(focus!.width - 16 - card!.width),
      );
    })
    .toBeLessThan(2);
});

test("Ajustes cierra el diálogo antes de abrir una sola guía", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.waitForTimeout(700);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await expect(
    settings.getByRole("switch", { name: /Sonidos/ }),
  ).toHaveAttribute("aria-checked", "false");
  await settings.getByRole("button", { name: "Ver la guía" }).click();
  await expect(settings).not.toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: /Soy tu luciérnaga lectora/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Ajustes", exact: true }),
  ).toBeFocused();
});

test("en Crear no se abre solo ni guarda «tutorial-visto»", async ({
  page,
}) => {
  await page.goto("/crear");
  await page.waitForTimeout(800);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("tutorial-visto")),
  ).toBeNull();
});

test("el botón «?» abre el tutorial, recorre los pasos y devuelve el foco", async ({
  page,
}) => {
  await page.goto("/crear");
  const ayuda = page.getByRole("button", { name: "Ver la guía" });
  await ayuda.click();
  const dialogo = page.getByRole("dialog");
  await expect(dialogo).toBeVisible();
  await expect(dialogo).toHaveAttribute("aria-modal", "true");
  // Bienvenida, Cuentos, Crear y Acompañar: la barra XP aún no existe.
  await expect(dialogo.getByText("Paso 1 de 4")).toBeVisible();
  await expect(
    dialogo.getByRole("heading", { name: /Soy tu luciérnaga lectora/ }),
  ).toBeVisible();
  const siguiente = dialogo.getByRole("button", { name: "Siguiente" });
  await expect(siguiente).toBeFocused();

  // El foco queda atrapado dentro del globo.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  expect(
    await dialogo.evaluate((nodo) => nodo.contains(document.activeElement)),
  ).toBe(true);

  const accesibilidad = await new AxeBuilder({ page })
    .include(".tutorial-capa")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accesibilidad.violations).toEqual([]);

  await siguiente.click();
  await expect(dialogo.getByRole("heading", { name: "Cuentos" })).toBeVisible();
  await expect(page.locator(".tutorial-foco")).toBeVisible();
  await siguiente.click();
  await expect(dialogo.getByRole("heading", { name: "Crear" })).toBeVisible();
  await siguiente.click();
  await expect(
    dialogo.getByRole("heading", { name: "Acompañar" }),
  ).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Saltar" })).toHaveCount(0);
  await dialogo.getByRole("button", { name: "¡A leer!" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(ayuda).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.getItem("tutorial-visto")),
  ).toBe("true");
});

test("Esc y «Saltar» cierran el tutorial", async ({ page }) => {
  await page.goto("/crear");
  const ayuda = page.getByRole("button", { name: "Ver la guía" });
  await ayuda.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await ayuda.click();
  await page.getByRole("button", { name: "Saltar" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("en un celular de 320 px el globo va abajo, a todo el ancho", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/crear");
  await page.getByRole("button", { name: "Ver la guía" }).click();
  await page.getByRole("button", { name: "Siguiente" }).click();
  const globo = page.locator(".tutorial-globo");
  await expect(globo).toBeVisible();
  const caja = await globo.boundingBox();
  expect(caja?.x).toBe(0);
  expect(caja?.width).toBe(320);
  expect(Math.round((caja?.y ?? 0) + (caja?.height ?? 0))).toBe(640);
  for (const nombre of ["Saltar", "Siguiente"]) {
    const boton = page.getByRole("button", { name: nombre });
    const medida = await boton.boundingBox();
    expect(medida?.height).toBeGreaterThanOrEqual(44);
    // El botón y su texto caben completos dentro del globo.
    expect((medida?.x ?? 0) + (medida?.width ?? 0)).toBeLessThanOrEqual(320);
    expect(
      await boton.evaluate((nodo) => nodo.scrollWidth <= nodo.clientWidth),
    ).toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
