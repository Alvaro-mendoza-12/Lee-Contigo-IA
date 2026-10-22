import { test, expect } from "@playwright/test";

test("las portadas cambian y solo el cuento visible se puede abrir", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const deck = page.getByRole("region", { name: "Cuentos para descubrir" });
  await expect(deck.getByRole("link")).toHaveCount(1);
  await expect(deck.getByRole("link")).toHaveAttribute(
    "href",
    /luz-del-bosque/,
  );
  await deck.getByRole("button", { name: "Ver siguiente cuento" }).click();
  await expect(
    deck.getByRole("heading", { name: "La semilla viajera" }),
  ).toBeVisible();
  await expect(deck.getByRole("link")).toHaveAttribute(
    "href",
    /semilla-viajera/,
  );
  expect(
    await deck
      .locator(".is-front")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await deck.getByRole("button", { name: "Ver cuento anterior" }).click();
  await expect(
    deck.getByRole("heading", { name: "Una luz en el bosque" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("el cambio automático se puede pausar y la animación no desborda", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const deck = page.getByRole("region", { name: "Cuentos para descubrir" });
  await expect(
    deck.getByRole("button", { name: "Pausar cambio automático de cuentos" }),
  ).toBeVisible();
  await page.mouse.move(0, 0);
  await deck.scrollIntoViewIfNeeded();
  await expect(
    deck.getByRole("heading", { name: "Una luz en el bosque" }),
  ).toBeVisible();
  // Give the visibility observer a frame, then advance the real carousel timer.
  await page.clock.runFor(100);
  await page.clock.runFor(3100);
  await expect(
    deck.getByRole("heading", { name: "La semilla viajera" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.clock.runFor(900);
  await deck
    .getByRole("button", { name: "Pausar cambio automático de cuentos" })
    .click();
  await page.clock.runFor(15000);
  await expect(
    deck.getByRole("heading", { name: "La semilla viajera" }),
  ).toBeVisible();
  await expect(
    deck.getByRole("button", { name: "Activar cambio automático de cuentos" }),
  ).toBeVisible();
});

test("un error permite pedir apoyo de reintento sin enviar la respuesta", async ({
  page,
}) => {
  await page.route("**/api/tutor", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        hint: "Busca en el segundo párrafo qué cambió esa noche.",
        quote: "La luna estaba escondida detrás de las nubes.",
        source: "prepared",
        support: "retry",
      }),
    }),
  );
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  await page
    .getByRole("radio", { name: /Porque quería buscar a la luna/ })
    .check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  const request = page.waitForRequest(
    (r) => r.url().endsWith("/api/tutor") && r.method() === "POST",
  );
  await page
    .getByRole("button", { name: "Dame una pista", exact: true })
    .click();
  expect((await request).postDataJSON()).toEqual({
    storyId: "luz-del-bosque",
    level: "paso",
    questionId: "q1",
    tier: 0,
    support: "retry",
  });
  await expect(
    page.getByText("Una ayuda para volver a intentarlo"),
  ).toBeVisible({ timeout: 12000 });
  await expect(
    page.getByRole("button", { name: "Dame otra pista", exact: true }),
  ).toBeFocused();
});
