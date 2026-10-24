import { expect, test, type Page } from "@playwright/test";
import { storiesForShelf } from "../../lib/stories";

async function marcarLeidos(page: Page, ids: string[]) {
  await page.evaluate(
    (lista) =>
      localStorage.setItem(
        "lee-contigo-progreso",
        JSON.stringify({
          version: 1,
          xp: 500,
          recompensas: lista.map((id) => `cuento-terminado:${id}:paso:`),
        }),
      ),
    ids,
  );
  await page.reload();
}

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

test("«Ya los leíste» aparece al final y no repite cuentos", async ({
  page,
}) => {
  await page.goto("/");
  const leidos = page.locator("#cuentos-leidos");
  await expect(page.getByRole("heading", { name: "Amigos" })).toBeVisible();
  await expect(leidos).toHaveCount(0);

  await marcarLeidos(page, ["luz-del-bosque", "mapa-sonidos"]);
  await expect(
    page.getByRole("heading", { name: "Ya los leíste" }),
  ).toBeVisible();
  await expect(leidos.locator("[data-story-id]")).toHaveCount(2);
  await expect(page.locator('[data-story-id="luz-del-bosque"]')).toHaveCount(1);
  await expect(leidos.locator(".story-read-badge")).toHaveCount(2);
  await expect(
    leidos.getByRole("link", { name: "Volver a leer Una luz en el bosque" }),
  ).toBeVisible();
  // La fila de leídos es la última de la biblioteca.
  await expect(page.locator(".story-shelf-row").last()).toHaveAttribute(
    "aria-labelledby",
    "cuentos-leidos-title",
  );
  const total = await page
    .locator(".story-card-direct[href^='/leer/']")
    .count();
  expect(total).toBe(storiesForShelf("paso").length);
});

test("«Inventar mi cuento» sigue visible con todas las Aventuras leídas", async ({
  page,
}) => {
  await page.goto("/");
  const aventuras = storiesForShelf("paso")
    .filter((story) => story.category === "aventuras")
    .map((story) => story.id);
  await marcarLeidos(page, aventuras);
  const fila = page.locator("#cuentos-descubrimientos");
  await expect(fila.locator("[data-story-id]")).toHaveCount(0);
  await expect(
    fila.getByRole("link", {
      name: "Inventar mi cuento con inteligencia artificial",
    }),
  ).toBeVisible();
  await expect(page.locator("#cuentos-leidos [data-story-id]")).toHaveCount(
    aventuras.length,
  );
});
