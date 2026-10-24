import { expect, test } from "@playwright/test";
import { expectBookMotion, observeBookMotion } from "./helpers/book-motion";

for (const width of [390, 900, 1440]) {
  test(`pasar hojas anima el libro en ambas direcciones a ${width}px y respeta Ajustes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await observeBookMotion(page);
    await page.goto("/leer/luz-del-bosque?nivel=paso");
    const mode = width <= 600 ? "mobile" : "turn";
    const next = page.getByRole("button", { name: "Página siguiente" });
    await next.click();
    await expectBookMotion(page, `paper-${mode}-next`);
    await page.getByRole("button", { name: "Anterior", exact: true }).click();
    await expectBookMotion(page, `paper-${mode}-previous`);

    await page.getByRole("button", { name: "Ajustes", exact: true }).click();
    await expect(page.getByLabel("Animar páginas")).toBeChecked();
    await page.getByLabel("Animar páginas").uncheck();
    await page.getByRole("button", { name: "Cerrar ajustes" }).click();
    await next.click();
    await expect(page.getByText(/^Página 2 de \d+$/)).toBeVisible();
    await expect(page.locator(".book-turn-sheet")).toHaveCount(0);
    await expect(page.locator(".paper-spread")).toHaveCSS(
      "animation-name",
      "none",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Ajustes", exact: true }).click();
    await page.getByLabel("Animar páginas").check();
    await page.getByRole("button", { name: "Cerrar ajustes" }).click();
    await next.click();
    await expect(page.getByText(/^Página 3 de \d+$/)).toBeVisible();
    await expect(page.locator(".book-turn-layer")).not.toBeVisible();
    await expect(page.locator(".paper-spread")).toHaveCSS(
      "animation-name",
      "none",
    );
  });
}
