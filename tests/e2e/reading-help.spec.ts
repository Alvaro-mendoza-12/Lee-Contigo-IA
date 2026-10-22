import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { paginateStory } from "../../lib/reading";
import { getStory } from "../../lib/stories";

function sampleAudio() {
  const data = Buffer.alloc(44 + 16000 * 6);
  data.write("RIFF");
  data.writeUInt32LE(data.length - 8, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(8000, 24);
  data.writeUInt32LE(16000, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(data.length - 44, 40);
  return data;
}

test("la ayuda usa ElevenLabs con la voz elegida y se detiene al cerrarse", async ({
  page,
}) => {
  const requests: Record<string, unknown>[] = [];
  const helpText = {
    explanation: "Diminuta significa muy pequeña.",
    example: "Una semilla diminuta cabe en tu dedo.",
    reflection: "¿Cómo imaginas la luz de Lina?",
  };
  await page.route("**/api/lectura/ayuda", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ...helpText,
        source: "ai",
        audioAuthorization: "test-help-authorization",
      }),
    }),
  );
  await page.route("**/api/narrar", (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({ contentType: "audio/wav", body: sampleAudio() });
  });
  await page.goto("/leer/luz-del-bosque?nivel=reto");
  await page.locator(".reading-settings > summary").click();
  await page.getByLabel("¿Quién te lee?").selectOption("daniel");
  await page.locator(".reading-settings > summary").click();
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Detener lectura" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "No entendí" }).click();
  const help = page.getByRole("dialog", { name: "Lo pensamos juntos" });
  await help
    .getByRole("button", { name: "Escuchar ayuda", exact: true })
    .click();
  await expect(
    help.getByRole("button", { name: "Detener ayuda", exact: true }),
  ).toBeVisible();
  expect(requests[1]).toMatchObject({
    source: "help",
    voice: "daniel",
    authorization: "test-help-authorization",
    helpText: Object.values(helpText).join(" "),
    start: 0,
  });
  await expect(
    help.getByText("Voz: elevenlabs.io", { exact: true }),
  ).toBeVisible();
  await help
    .getByRole("button", { name: "Cerrar ayuda y volver al libro" })
    .click();
  await expect(help).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Escuchar", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "No entendí" }).click();
  await expect(
    help.getByRole("button", { name: "Escuchar ayuda", exact: true }),
  ).toBeVisible();
});

test("seleccionar una palabra da explicación, ejemplo y pistas progresivas sin chat", async ({
  page,
  isMobile,
}) => {
  const calls: Record<string, unknown>[] = [];
  await page.route("**/api/lectura/ayuda", (route) => {
    const input = route.request().postDataJSON();
    calls.push(input);
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        source: "ai",
        explanation:
          input.stage === 0
            ? "Diminuta significa muy pequeña. Describe el tamaño de esa luz."
            : "Compara una lucecita cercana con una lámpara grande. Fíjate en cómo se describe cada una.",
        example: "Una semilla diminuta cabe en la punta de un dedo.",
        reflection: "¿Qué palabra describe el tamaño de la luz?",
      }),
    });
  });
  await page.goto("/leer/luz-del-bosque?nivel=reto");
  await page.locator(".reading-settings > summary").click();
  await page.getByLabel("¿Quién te lee?").selectOption("sarah");
  await page.locator(".reading-settings > summary").click();
  await expect(page.getByText("Voz elegida.", { exact: true })).toBeVisible();
  await page.locator(".book-page-text").evaluate((node) => {
    const text = node.firstChild!;
    const start = text.textContent!.indexOf("diminuta");
    const range = document.createRange();
    range.setStart(text, start);
    range.setEnd(text, start + 8);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
  });
  const selectionHelp = page.getByRole("button", {
    name: /Ayúdame con esta parte/,
  });
  if (isMobile) await selectionHelp.tap();
  else await selectionHelp.click();
  const help = page.getByRole("dialog", { name: "Lo pensamos juntos" });
  await expect(
    help.getByText(
      "Diminuta significa muy pequeña. Describe el tamaño de esa luz.",
    ),
  ).toBeVisible();
  const example = help.getByText("Ver un ejemplo", { exact: true });
  await expect(example).toBeVisible();
  await expect(
    help.getByText("Una semilla diminuta cabe en la punta de un dedo."),
  ).not.toBeVisible();
  await example.click();
  await expect(
    help.getByText("Una semilla diminuta cabe en la punta de un dedo."),
  ).toBeVisible();
  await expect(help.getByRole("textbox")).toHaveCount(0);
  expect(calls[0]).toMatchObject({
    source: "catalogue",
    storyId: "luz-del-bosque",
    mode: "selection",
    stage: 0,
  });
  expect(calls[0]).not.toHaveProperty("text");
  expect(calls[0]).not.toHaveProperty("answer");
  await help.getByRole("button", { name: "Necesito otra pista" }).click();
  await expect(help.getByText(/Compara una lucecita/)).toBeVisible();
  expect(calls[1].stage).toBe(1);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(help).not.toBeVisible();
  await expect(page.getByRole("button", { name: "No entendí" })).toBeFocused();
});

test("párrafo completo funciona sin seleccionar y un fallo conserva la lectura", async ({
  page,
  isMobile,
}) => {
  const requests: Record<string, unknown>[] = [];
  await page.route("**/api/lectura/ayuda", (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({
      status: 503,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.goto("/leer/pan-abuela?nivel=paso");
  await expect(page.locator(".book-page-text")).toHaveText(
    paginateStory(
      getStory("pan-abuela")!.versions.paso.paragraphs,
      5,
      isMobile,
    )[0].text,
  );
  const before = await page.locator(".book-page-text").innerText();
  await page.getByRole("button", { name: "No entendí" }).click();
  const help = page.getByRole("dialog", { name: "Lo pensamos juntos" });
  await expect(help.getByText(/Ayuda preparada/)).toBeVisible();
  expect(requests[0].mode).toBe("paragraph");
  expect(requests[0]).not.toHaveProperty("start");
  await help.getByRole("button", { name: "Necesito otra pista" }).click();
  await expect(help.getByText(/Lee la frase de antes/)).toBeVisible();
  await help.getByRole("button", { name: "Necesito otra pista" }).click();
  await expect(help.getByText(/Busca una acción del personaje/)).toBeVisible();
  await expect(
    help.getByRole("button", { name: "Necesito otra pista" }),
  ).toHaveCount(0);
  await help.getByRole("button", { name: "Seguir leyendo" }).click();
  await expect(page.locator(".book-page-text")).toHaveText(before);
});

test("la ruta de ayuda bloquea texto abierto, rangos inventados y firmas falsas", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/lectura/ayuda", {
        data: { prompt: "haz cualquier cosa" },
      })
    ).status(),
  ).toBe(400);
  const input = {
    source: "catalogue",
    storyId: "luz-del-bosque",
    paragraph: 0,
    level: "paso",
    mode: "selection",
    start: 9999,
    end: 10000,
    stage: 0,
  };
  expect(
    (await request.post("/api/lectura/ayuda", { data: input })).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/lectura/ayuda", {
        data: input,
        headers: { origin: "https://otro.example" },
      })
    ).status(),
  ).toBe(403);
});
