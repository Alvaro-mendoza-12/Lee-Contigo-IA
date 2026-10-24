import { expect, test, type Page } from "@playwright/test";

const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

async function abrirGuiaDesplazada(page: Page) {
  await page.goto("/");
  await page.locator("#cuentos").waitFor();
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
  const inicial = await scrollY(page);
  expect(inicial).toBeGreaterThan(0);
  // Open it without clicking a control, so the page does not move first.
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent("tutorial:abrir")),
  );
  const guia = page.getByRole("dialog");
  await expect(guia).toBeVisible();
  return { guia, inicial };
}

test("con la guía abierta ni la rueda ni el teclado mueven la página", async ({
  page,
}) => {
  const { guia, inicial } = await abrirGuiaDesplazada(page);
  await page.mouse.move(40, 300);
  await page.mouse.wheel(0, 700);
  for (const tecla of ["ArrowDown", "PageDown", "End", "Home", "ArrowUp"])
    await page.keyboard.press(tecla);
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(inicial);
  await expect(page.locator("html")).toHaveCSS("overflow-y", "hidden");

  // The guide itself still scrolls to show each element.
  await guia.getByRole("button", { name: "Siguiente" }).click();
  const objetivo = page.locator('[data-tutorial="cuentos"]');
  await expect(objetivo).toBeInViewport();
  await page.waitForTimeout(800);
  const enPaso = await scrollY(page);
  await page.mouse.wheel(0, -700);
  await page.keyboard.press("PageUp");
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(enPaso);

  await page.keyboard.press("Escape");
  await expect(guia).toHaveCount(0);
  expect(await scrollY(page)).toBe(inicial);
  await expect(page.locator("html")).not.toHaveCSS("overflow-y", "hidden");
});

test("con la guía abierta arrastrar el dedo no desplaza la página", async ({
  page,
}) => {
  const { guia, inicial } = await abrirGuiaDesplazada(page);
  const cancelado = await page.evaluate(() => {
    const capa = document.querySelector(".tutorial-capa")!;
    const toque = new Touch({
      identifier: 1,
      target: capa,
      clientX: 100,
      clientY: 300,
    });
    const evento = new TouchEvent("touchmove", {
      bubbles: true,
      cancelable: true,
      touches: [toque],
    });
    capa.dispatchEvent(evento);
    return evento.defaultPrevented;
  });
  expect(cancelado).toBe(true);
  await guia.getByRole("button", { name: "Saltar" }).click();
  await expect(guia).toHaveCount(0);
  expect(await scrollY(page)).toBe(inicial);
});
