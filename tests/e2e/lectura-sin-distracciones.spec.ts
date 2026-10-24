import { expect, test } from "@playwright/test";

// Mejora 2: mientras se leen las páginas no aparece ni suena nada automático.
test("leer un cuento entero no muestra avisos, +XP ni sonidos", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const contador = { inicios: 0 };
    Object.assign(window, { sonidosLectura: contador });
    const original = AudioScheduledSourceNode.prototype.start;
    AudioScheduledSourceNode.prototype.start = function (...args) {
      contador.inicios++;
      return original.apply(this, args);
    };
  });
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  // Espera una interacción hidratada antes de enviar el evento sintético:
  // la carga del documento no garantiza que AvisoNivel ya esté escuchando.
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const ajustes = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await expect(ajustes).toBeVisible();
  await ajustes.getByRole("button", { name: "Cerrar ajustes" }).click();
  // Aunque llegue experiencia mientras se lee, nada salta en la página.
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("xp:ganada", {
        detail: {
          motivo: "pregunta-primer-intento",
          ganada: 10,
          total: 510,
          subioDeNivel: true,
          nivel: { numero: 2, titulo: "Lector Brote", xpMinima: 60 },
        },
      }),
    ),
  );
  const siguiente = page.getByRole("button", { name: "Página siguiente" });
  while (await siguiente.isEnabled()) await siguiente.click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".xp-ganada")).toHaveCount(0);
  await expect(page.locator(".xp-insignia-zona[data-latido]")).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { sonidosLectura: { inicios: number } })
          .sonidosLectura.inicios,
    ),
  ).toBe(0);

  // El aviso guardado aparece al salir de las páginas, en las preguntas.
  await page.getByRole("link", { name: "Vamos a pensar" }).click();
  await page.getByRole("button", { name: "¡A pensar!" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("Lector Brote");
});
