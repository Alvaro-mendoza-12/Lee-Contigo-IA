import { expect, test, type Page } from "@playwright/test";
import { getStory } from "../../lib/stories";

// A first-time reader: no XP yet, the guide already seen.
test.use({
  storageState: {
    cookies: [],
    origins: [
      {
        origin: new URL(process.env.TEST_BASE_URL || "http://127.0.0.1:4173")
          .origin,
        localStorage: [{ name: "tutorial-visto", value: "true" }],
      },
    ],
  },
});

async function guardarXP(page: Page, xp: number) {
  await page.evaluate(
    (valor) =>
      localStorage.setItem(
        "lee-contigo-progreso",
        JSON.stringify({ version: 1, xp: valor, recompensas: [] }),
      ),
    xp,
  );
  await page.reload();
}

test("el inicio muestra la barra y los candados del nivel 1", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "Mi experiencia de lectura" }),
  ).toContainText("Lector Semilla");
  // barco-de-papel solo está en la estantería del reto: usamos tambor-lluvia.
  const bloqueado = page.locator('[data-story-id="tambor-lluvia"]');
  await expect(bloqueado).toHaveAttribute("data-locked", "true");
  await expect(bloqueado).toContainText("Se desbloquea al ser Lector Brote");
  await expect(
    page.locator('[data-story-id="luz-del-bosque"]'),
  ).toHaveAttribute("data-locked", "false");

  await guardarXP(page, 60);
  await expect(bloqueado).toHaveAttribute("data-locked", "false");
  await expect(
    page.locator('[data-story-id="sendero-huellas"]'),
  ).toHaveAttribute("data-locked", "true");
});

test("un cuento bloqueado por URL muestra el candado sin el relato", async ({
  page,
}) => {
  await page.goto("/leer/barco-de-papel?nivel=paso");
  await expect(
    page.getByRole("heading", {
      name: "Este cuento se desbloquea al ser Lector Brote",
    }),
  ).toBeVisible();
  await expect(page.locator(".reader-page")).toHaveCount(0);
  await page.goto("/practicar/barco-de-papel?nivel=paso");
  await expect(page.locator(".question-card")).toHaveCount(0);
  await page.getByRole("link", { name: "Volver a los cuentos" }).click();
  await expect(page).toHaveURL(/\/#cuentos$/);
});

test("sin el reto abierto, ?nivel=reto se lee en Paso a paso con aviso", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=reto&juntos=1");
  await expect(page).toHaveURL(/nivel=paso/);
  await expect(page).toHaveURL(/juntos=1/);
  const aviso = page.getByRole("status").filter({
    hasText:
      "Un nuevo reto se abre al ser Lector Brote. Por ahora leemos en Paso a paso.",
  });
  await expect(aviso).toBeVisible();
  await expect(page.locator(".reader-page")).toBeVisible();
  await aviso.getByRole("button", { name: "Cerrar aviso" }).click();
  await expect(page.getByText("Por ahora leemos en Paso a paso.")).toHaveCount(
    0,
  );
});

test("el selector de nivel bloquea el reto hasta Lector Brote", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  const ajustes = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await expect(
    ajustes.getByRole("radio", { name: "Paso a paso" }),
  ).toBeChecked();
  await expect(
    ajustes.getByRole("radio", { name: "Un nuevo reto" }),
  ).toBeDisabled();
  await expect(ajustes).toContainText(
    "Un nuevo reto se abre al ser Lector Brote.",
  );

  await guardarXP(page, 60);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  // Radio controlado: el cambio llega con la navegación, no con el clic.
  await ajustes.getByRole("radio", { name: "Un nuevo reto" }).click();
  await expect(page).toHaveURL(/nivel=reto/);
  await expect(page.locator(".book-page-text")).toContainText("Cada anochecer");
});

test("«Vamos a pensar» suma 30 XP y sube de nivel una sola vez", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await guardarXP(page, 40);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const ajustes = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await ajustes.getByRole("button", { name: "Ver relato completo" }).click();
  await ajustes.getByRole("button", { name: "Cerrar ajustes" }).click();
  await page.getByRole("link", { name: "Vamos a pensar" }).click();
  const aviso = page.getByRole("alertdialog");
  await expect(aviso).toContainText("¡Ahora eres Lector Brote!");
  await aviso.getByRole("button", { name: "¡Genial!" }).click();
  await expect(page).toHaveURL(/\/practicar\/luz-del-bosque/);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("lee-contigo-progreso")!).xp,
    ),
  ).toBe(70);

  // The same story and level never pay twice.
  await page.goBack();
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await ajustes.getByRole("button", { name: "Ver relato completo" }).click();
  await ajustes.getByRole("button", { name: "Cerrar ajustes" }).click();
  await page.getByRole("link", { name: "Vamos a pensar" }).click();
  await expect(page).toHaveURL(/\/practicar\/luz-del-bosque/);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("lee-contigo-progreso")!).xp,
    ),
  ).toBe(70);
});

async function terminarLuz(page: Page) {
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const ajustes = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await ajustes.getByRole("button", { name: "Ver relato completo" }).click();
  await ajustes.getByRole("button", { name: "Cerrar ajustes" }).click();
  await page.getByRole("link", { name: "Vamos a pensar" }).click();
  await expect(page).toHaveURL(/\/practicar\/luz-del-bosque/);
}

test("la fiesta con personajes llega primero y el aviso de nivel después", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await guardarXP(page, 40);
  await terminarLuz(page);
  const fiesta = page.getByRole("dialog", { name: "¡Terminaste el cuento!" });
  await expect(fiesta).toBeVisible();
  await expect(fiesta).toContainText("+30 XP");
  await expect(fiesta.locator(".fiesta-personaje")).toHaveCount(4);
  const seguir = fiesta.getByRole("button", { name: "¡A pensar!" });
  await expect(seguir).toBeFocused();
  // Mientras dura la fiesta, el aviso de nivel espera su turno.
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await seguir.click();
  await expect(fiesta).toHaveCount(0);
  await expect(page.getByRole("alertdialog")).toContainText(
    "¡Ahora eres Lector Brote!",
  );
  await expect(
    page.locator(".practice-top .xp-pastilla-lector"),
  ).toHaveAccessibleName(/70 XP/);
});

test("un cuento ya terminado tiene una fiesta corta sin +30", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await terminarLuz(page);
  const fiesta = page.getByRole("dialog", { name: "¡Terminaste el cuento!" });
  await fiesta.getByRole("button", { name: "¡A pensar!" }).click();
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await terminarLuz(page);
  await expect(fiesta).toBeVisible();
  await expect(fiesta).not.toContainText("XP");
  // Se cierra sola en unos 2 s; Escape también la cierra.
  await page.keyboard.press("Escape");
  await expect(fiesta).toHaveCount(0);
});

test("con movimiento reducido los personajes quedan quietos y sin confeti", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await terminarLuz(page);
  const fiesta = page.getByRole("dialog", { name: "¡Terminaste el cuento!" });
  await expect(fiesta).toContainText("+30 XP");
  await expect(fiesta.locator(".fiesta-personaje").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(fiesta.locator(".xp-confeti").first()).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("acertar a la primera suma 10 XP y terminar suma 20 más", async ({
  page,
}) => {
  const { questions } = getStory("luz-del-bosque")!.versions.paso;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  const xp = () =>
    page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("lee-contigo-progreso") ?? '{"xp":0}')
          .xp,
    );
  for (const [i, question] of questions.entries()) {
    await page.locator(".answers label").nth(question.correct).click();
    await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
    await expect.poll(xp).toBe(10 * (i + 1));
    await page
      .getByRole("button", {
        name:
          i === questions.length - 1
            ? /Ver mis descubrimientos/
            : /Siguiente pregunta/,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "¡Mira todo lo que exploraste!" }),
  ).toBeVisible();
  await expect.poll(xp).toBe(10 * questions.length + 20);
});

test("en las preguntas la pastilla se actualiza en vivo sin tapar la pregunta", async ({
  page,
}) => {
  const [question] = getStory("luz-del-bosque")!.versions.paso.questions;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  const pastilla = page.locator(".practice-top .xp-pastilla-lector");
  await expect(pastilla).toHaveAccessibleName(/0 XP/);
  const caja = await pastilla.boundingBox();
  const tarjeta = await page.locator(".question-card").boundingBox();
  expect(caja!.y + caja!.height).toBeLessThanOrEqual(tarjeta!.y);

  await page.locator(".answers label").nth(question.correct).click();
  await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
  await expect(pastilla).toHaveAccessibleName(/10 XP/);
  await expect(
    page.locator(".answer.correct .respuesta-estallido"),
  ).toHaveCount(1);
  // El «+10» vuela hacia la pastilla y desaparece al llegar.
  await expect(page.locator(".respuesta-vuelo")).toHaveText("+10");
  await expect(page.locator(".respuesta-vuelo")).toHaveCount(0);
});

test("al fallar se ve un «casi» ámbar que invita a mirar la pista", async ({
  page,
}) => {
  const [question] = getStory("luz-del-bosque")!.versions.paso.questions;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  const incorrecta = (question.correct + 1) % question.options.length;
  await page.locator(".answers label").nth(incorrecta).click();
  await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
  await expect(page.getByText("¡Casi! Mira la pista.")).toBeVisible();
  const opcion = page.locator(".answer.incorrect");
  await expect(opcion).toHaveCSS("background-color", "rgb(255, 244, 214)");
  await expect(opcion).toHaveCSS("animation-name", "respuesta-casi");
});

test("con movimiento reducido solo cambian el color y el ícono", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const [question] = getStory("luz-del-bosque")!.versions.paso.questions;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  await page.locator(".answers label").nth(question.correct).click();
  await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
  const opcion = page.locator(".answer.correct");
  await expect(opcion).toHaveCSS("background-color", "rgb(230, 246, 230)");
  await expect(opcion).toHaveCSS("animation-name", "none");
  await expect(opcion.locator(".respuesta-estallido")).toBeHidden();
  await expect(page.locator(".respuesta-vuelo")).toHaveCount(0);
  await expect(
    page.locator(".practice-top .xp-pastilla-lector"),
  ).toHaveAccessibleName(/10 XP/);
});

test("borrar mi progreso pide confirmación y vuelve al nivel 1", async ({
  page,
}) => {
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await guardarXP(page, 60);
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  const ajustes = page.getByRole("dialog", { name: "Ajustes de lectura" });
  await ajustes.getByRole("button", { name: "Borrar mi progreso" }).click();
  await expect(
    ajustes.getByRole("button", { name: "No, mantenerlo" }),
  ).toBeFocused();
  await ajustes.getByRole("button", { name: "No, mantenerlo" }).click();
  await expect(
    ajustes.getByRole("radio", { name: "Un nuevo reto" }),
  ).toBeEnabled();

  await ajustes.getByRole("button", { name: "Borrar mi progreso" }).click();
  await ajustes.getByRole("button", { name: "Sí, borrar" }).click();
  await expect(ajustes).toContainText("Listo. Tu progreso empezó de nuevo.");
  await expect(
    ajustes.getByRole("radio", { name: "Un nuevo reto" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem("lee-contigo-progreso")),
  ).toBeNull();
});

test("en modo demo todo queda abierto", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.locator('[data-locked="true"]')).toHaveCount(0);
  await page.goto("/leer/orquesta-del-bosque?nivel=reto");
  await expect(page).toHaveURL(/nivel=reto/);
  await expect(page.locator(".reader-page")).toBeVisible();
});
