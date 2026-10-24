import { expect, test } from "@playwright/test";

test("«Ver guía» se lee bien, mide al menos 48 px y abre la guía", async ({
  page,
}) => {
  await page.goto("/");
  const guia = page.getByRole("button", { name: "Ver guía", exact: true });
  await expect(guia).toHaveText(/Ver guía/i);
  await expect(guia).toHaveCSS("text-transform", "uppercase");
  expect((await guia.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  await guia.click();
  await expect(
    page.getByRole("heading", { name: /Soy tu luciérnaga lectora/ }),
  ).toBeVisible();
});

test("el botón de sonido empieza apagado y se sincroniza con Ajustes", async ({
  page,
}) => {
  await page.goto("/");
  const sonido = page.getByRole("switch", { name: "Sonido", exact: true });
  await expect(sonido).toHaveAttribute("aria-checked", "false");
  await sonido.click();
  await expect(sonido).toHaveAttribute("aria-checked", "true");

  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const ajustes = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await expect(
    ajustes.getByRole("switch", { name: /Sonidos/ }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(ajustes.getByRole("switch", { name: /Música/ })).toHaveAttribute(
    "aria-checked",
    "false",
  );
  // La música se elige en Ajustes; el botón del inicio la apaga junto al resto.
  await ajustes.getByRole("switch", { name: /Música/ }).click();

  await page.goto("/");
  await expect(sonido).toHaveAttribute("aria-checked", "true");
  await sonido.click();
  await expect(sonido).toHaveAttribute("aria-checked", "false");
  expect(
    await page.evaluate(() => [
      localStorage.getItem("audio-activo"),
      localStorage.getItem("musica-activa"),
    ]),
  ).toEqual(["false", "false"]);

  // Encender desde el inicio activa solo los efectos.
  await sonido.click();
  expect(
    await page.evaluate(() => [
      localStorage.getItem("audio-activo"),
      localStorage.getItem("musica-activa"),
    ]),
  ).toEqual(["true", "false"]);
});

test("en el celular el botón de sonido es redondo y solo tiene ícono", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const sonido = page.getByRole("switch", { name: "Sonido", exact: true });
  const caja = (await sonido.boundingBox())!;
  expect(Math.round(caja.width)).toBe(48);
  expect(Math.round(caja.height)).toBe(48);
  await expect(sonido.locator(".boton-sonido-texto")).toBeHidden();

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(sonido).toContainText("Sonido: no");
});
