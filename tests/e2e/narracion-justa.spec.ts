import { expect, test, type Page } from "@playwright/test";
import { getStory } from "../../lib/stories";

// Mejora 5: la voz llega solo cuando el niño la pide, nunca sola.
function espiarNarracion(page: Page) {
  const pedidos: Record<string, unknown>[] = [];
  return page
    .route("**/api/narrar", async (ruta) => {
      pedidos.push(JSON.parse(ruta.request().postData() ?? "{}"));
      // Sin claves de voz el servidor responde 503 y se usa la del dispositivo.
      await ruta.fulfill({ status: 503, body: "" });
    })
    .then(() => pedidos);
}

test("al fallar se ofrece escuchar el párrafo de la evidencia", async ({
  page,
}) => {
  const pedidos = await espiarNarracion(page);
  const [pregunta] = getStory("luz-del-bosque")!.versions.paso.questions;
  await page.goto("/practicar/luz-del-bosque?nivel=paso");
  const incorrecta = (pregunta.correct + 1) % pregunta.options.length;
  await page.locator(".answers label").nth(incorrecta).click();
  await page.getByRole("button", { name: /Comprobar respuesta/ }).click();
  const escuchar = page.getByRole("button", {
    name: "Escuchar esta parte del cuento",
  });
  await expect(escuchar).toBeVisible();
  await page.waitForTimeout(500);
  expect(pedidos).toHaveLength(0);
  await escuchar.click();
  await expect.poll(() => pedidos.length).toBe(1);
  expect(pedidos[0]).toMatchObject({
    source: "catalogue",
    storyId: "luz-del-bosque",
    level: "paso",
    paragraph: pregunta.paragraph,
    start: 0,
  });
});

test("«No entendí» ofrece escuchar el párrafo sin reproducirlo solo", async ({
  page,
}) => {
  const pedidos = await espiarNarracion(page);
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "No entendí" }).click();
  const escuchar = page.getByRole("button", { name: "Escuchar este párrafo" });
  await expect(escuchar).toBeVisible();
  await page.waitForTimeout(500);
  expect(pedidos).toHaveLength(0);
  await escuchar.click();
  await expect.poll(() => pedidos.length).toBe(1);
  expect(pedidos[0]).toMatchObject({
    source: "catalogue",
    storyId: "luz-del-bosque",
    paragraph: 0,
  });
});
