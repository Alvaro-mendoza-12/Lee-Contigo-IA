import { expect, test } from "@playwright/test";

test("la música baja con la narración y recupera volumen al detenerla o salir", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = { volume: 0, events: [] as string[] };
    Object.assign(window, { audioIntegration: state });
    // A deterministic music player lets us inspect ducking without hearing it
    // or depending on an external audio file. Narration uses the device fallback.
    class MusicPlayer {
      private currentVolume = 1;
      preload = "";
      loop = false;
      src = "";
      get volume() {
        return this.currentVolume;
      }
      set volume(value: number) {
        this.currentVolume = value;
        state.volume = value;
      }
      canPlayType() {
        return "probably";
      }
      addEventListener() {}
      play() {
        return Promise.resolve();
      }
      pause() {}
    }
    Object.defineProperty(window, "Audio", {
      value: MusicPlayer,
      configurable: true,
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: { getVoices: () => [], cancel() {}, speak() {} },
      configurable: true,
    });
    for (const event of ["voz:inicio", "voz:fin"])
      window.addEventListener(event, () => state.events.push(event));
  });
  await page.route("**/api/narrar", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto("/leer/luz-del-bosque?nivel=paso");
  await page.getByRole("button", { name: "Ajustes", exact: true }).click();
  await page.getByRole("switch", { name: /Música/ }).click();
  await page.getByRole("button", { name: "Cerrar ajustes" }).click();
  const state = () =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            audioIntegration: { volume: number; events: string[] };
          }
        ).audioIntegration,
    );
  await expect.poll(async () => (await state()).volume).toBeCloseTo(0.15);
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Detener lectura" }),
  ).toBeVisible();
  await expect.poll(async () => (await state()).volume).toBeCloseTo(0.03);
  await page.getByRole("button", { name: "Detener lectura" }).click();
  await expect.poll(async () => (await state()).volume).toBeCloseTo(0.15);
  await page.getByRole("button", { name: "Escuchar", exact: true }).click();
  await expect.poll(async () => (await state()).volume).toBeCloseTo(0.03);
  await page.getByRole("link", { name: "Crear", exact: true }).click();
  await expect(page).toHaveURL(/\/crear$/);
  await expect.poll(async () => (await state()).volume).toBeCloseTo(0.15);
  expect((await state()).events).toContain("voz:inicio");
  expect((await state()).events.at(-1)).toBe("voz:fin");
});

for (const enabled of [false, true]) {
  test(`subir de nivel respeta Sonidos ${enabled ? "encendido" : "apagado"}`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const counter = { value: 0 };
      Object.assign(window, { levelSound: counter });
      const original = AudioScheduledSourceNode.prototype.start;
      AudioScheduledSourceNode.prototype.start = function (...args) {
        counter.value++;
        return original.apply(this, args);
      };
    });
    await page.goto("/leer/luz-del-bosque?nivel=paso");
    // 55 XP: «Vamos a pensar» suma 30 y sube a Lector Brote (60 XP).
    await page.evaluate(() =>
      localStorage.setItem(
        "lee-contigo-progreso",
        JSON.stringify({ version: 1, xp: 55, recompensas: [] }),
      ),
    );
    await page.reload();
    const settings = page.getByRole("dialog", { name: "Ajustes de lectura" });
    await page.getByRole("button", { name: "Ajustes", exact: true }).click();
    if (enabled)
      await settings.getByRole("switch", { name: /Sonidos/ }).click();
    await settings.getByRole("button", { name: "Ver relato completo" }).click();
    await settings.getByRole("button", { name: "Cerrar ajustes" }).click();
    await page.getByRole("link", { name: "Vamos a pensar" }).click();
    await page.getByRole("button", { name: "¡A pensar!" }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    const starts = () =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              levelSound: { value: number };
            }
          ).levelSound.value,
      );
    if (enabled) await expect.poll(starts).toBeGreaterThan(0);
    else expect(await starts()).toBe(0);
  });
}
