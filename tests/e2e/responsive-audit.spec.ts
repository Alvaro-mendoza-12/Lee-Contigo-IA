import { expect, test, type Page } from "@playwright/test";
import { getStory } from "../../lib/stories";
import { expectMobileReaderLayout } from "./helpers/reader-layout";

test.describe("desplazamiento táctil", () => {
  test.use({ hasTouch: true });

  test("deslizar hacia arriba permite seguir leyendo sin pasar una hoja", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "La inyección de gestos por CDP solo está disponible en Chromium.",
    );
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/leer/puente-de-ardillas?nivel=paso");
    // Wait for the interactive reader: hydration changes its compact page key.
    // A server-rendered illustration can detach before a raw scroll operation.
    await page.getByRole("button", { name: "Ajustes", exact: true }).click();
    const settings = page.getByRole("dialog", { name: "Ajustes de lectura" });
    await expect(settings).toBeVisible();
    await settings
      .getByRole("button", { name: "Cerrar ajustes", exact: true })
      .click();
    await expect(settings).not.toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const art = page.locator(".paper-spread > .paper-art");
    await art.scrollIntoViewIfNeeded();
    const box = (await art.boundingBox())!;
    const before = await page.evaluate(() => scrollY);
    const session = await page.context().newCDPSession(page);
    try {
      const x = box.x + box.width / 2;
      const y = box.y + box.height * 0.8;
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let step = 1; step <= 8; step++) {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x, y: y - step * 18 }],
        });
      }
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    } finally {
      await session.detach();
    }
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(before + 40);
    await expect(
      page.getByText("Página 1 de 4", { exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => scrollX)).toBe(0);
    await page.getByRole("button", { name: "Página siguiente" }).click();
    await expect(
      page.getByText("Página 2 de 4", { exact: true }),
    ).toBeVisible();
  });
});

async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const outside = await page
    .locator(
      "main h1, main h2, main p, button, summary, select, textarea, .kid-nav a",
    )
    .evaluateAll((elements) =>
      elements
        .filter((el) => {
          if (!el.checkVisibility({ checkVisibilityCSS: true })) return false;
          if (el.closest("[inert], .sr-only, .story-rail, .paper-art"))
            return false;
          const r = el.getBoundingClientRect();
          return (
            r.left < -1 || r.right > document.documentElement.clientWidth + 1
          );
        })
        .map((el) => el.getAttribute("aria-label") || el.textContent?.trim()),
    );
  expect(outside).toEqual([]);
}

for (const width of [320, 360, 390, 430, 600, 601, 768, 1024, 1440]) {
  test(`pantallas y controles accesibles sin recortes a ${width} px`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 844 });
    for (const route of [
      "/",
      "/biblioteca",
      "/crear",
      "/acompanar",
      "/privacidad",
      "/leer/puente-de-ardillas?nivel=paso",
      "/practicar/puente-de-ardillas?nivel=reto",
    ]) {
      await page.goto(route);
      if (route === "/biblioteca")
        await page.waitForURL((url) => url.pathname === "/");
      await expect(page.locator("main h1").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expectNoOverflow(page);
      const small = await page
        .locator("button, summary, .kid-nav a")
        .evaluateAll((elements) =>
          elements
            .filter((el) => {
              if (
                !el.checkVisibility({ checkVisibilityCSS: true }) ||
                el.closest("[inert]")
              )
                return false;
              const r = el.getBoundingClientRect();
              return r.width < 44 || r.height < 44;
            })
            .map(
              (el) => el.getAttribute("aria-label") || el.textContent?.trim(),
            ),
        );
      expect(small, route).toEqual([]);
    }
  });
}

for (const width of [320, 360, 390, 430, 600]) {
  test(`texto junto a la ilustración, todas las hojas y letras a ${width} px`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/leer/puente-de-ardillas?nivel=paso");
    await page.getByRole("button", { name: "Reducir tamaño de letra" }).click();
    const paragraphs = getStory("puente-de-ardillas")!.versions.paso.paragraphs;
    for (const size of [18, 22, 26]) {
      for (const [index, text] of paragraphs.entries()) {
        if (index)
          await page.getByRole("button", { name: "Página siguiente" }).click();
        await expect(page.locator(".book-turn-layer")).toHaveCount(0);
        await expect(page.locator(".book-page-text")).toHaveText(text);
        await expect(page.locator(".book-page-text")).toHaveCSS(
          "font-size",
          `${size}px`,
        );
        await expectMobileReaderLayout(page);
        await expectNoOverflow(page);
      }
      if (size !== 26) {
        for (let i = 1; i < paragraphs.length; i++)
          await page
            .getByRole("button", { name: "Anterior", exact: true })
            .click();
        await page
          .getByRole("button", { name: "Aumentar tamaño de letra" })
          .click();
      }
    }
  });
}

test("el giro móvil conserva imagen y texto sin huecos ni contenido cortado", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => {
    const turns: {
      artHeight: number;
      textTop: number;
      chapterTop: number;
      bottom: number;
      height: number;
    }[] = [];
    Object.assign(window, { mobileTurnLayout: turns });
    document.addEventListener("animationstart", (event) => {
      if (!/^paper-mobile-(next|previous)$/.test(event.animationName)) return;
      const leaf = event.target as HTMLElement;
      const face = leaf.querySelector<HTMLElement>(".book-mobile-face")!;
      const art = face.querySelector<HTMLElement>(".paper-art")!;
      const text = face.querySelector<HTMLElement>(".paper-text")!;
      const chapter = text.querySelector<HTMLElement>(".book-chapter")!;
      const paragraph = text.querySelector<HTMLElement>(
        ".paper-copy-paragraph",
      )!;
      turns.push({
        artHeight: art.offsetHeight,
        textTop: text.offsetTop,
        chapterTop: chapter.offsetTop,
        bottom: text.offsetTop + paragraph.offsetTop + paragraph.offsetHeight,
        height: face.offsetHeight,
      });
    });
  });
  await page.goto("/leer/puente-de-ardillas?nivel=paso");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Aumentar tamaño de letra" }).click();
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(page.locator(".book-turn-layer")).toHaveCount(0);
  await page.getByRole("button", { name: "Anterior", exact: true }).click();
  await expect(page.locator(".book-turn-layer")).toHaveCount(0);
  const turns = await page.evaluate(
    () =>
      (
        window as unknown as {
          mobileTurnLayout: {
            artHeight: number;
            textTop: number;
            chapterTop: number;
            bottom: number;
            height: number;
          }[];
        }
      ).mobileTurnLayout,
  );
  expect(turns).toHaveLength(2);
  for (const turn of turns) {
    expect(turn.textTop).toBe(turn.artHeight);
    expect(turn.chapterTop).toBeLessThanOrEqual(28);
    expect(turn.bottom).toBeLessThanOrEqual(turn.height - 24);
  }
});

test("las ilustraciones del lector permanecen quietas mientras se lee", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/leer/puente-de-ardillas?nivel=paso");
    await expect(page.locator(".book-stage")).not.toHaveClass(/book-opening/);
    const idleAnimations = await page.locator(".paper-book").evaluate((book) =>
      book
        .getAnimations({ subtree: true })
        .filter(
          (animation) => animation.effect?.getTiming().iterations === Infinity,
        )
        .map((animation) => (animation as CSSAnimation).animationName),
    );
    expect(idleAnimations).toEqual([]);
  }
});

test("ajustes, ayuda y lectura ampliada caben y devuelven el foco", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.route("**/api/lectura/ayuda", (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 568 : 844 });
    await page.goto("/leer/puente-de-ardillas?nivel=paso");
    const trigger = page.getByRole("button", { name: "Ajustes", exact: true });
    await trigger.click();
    const settings = page.getByRole("dialog", { name: "Ajustes de lectura" });
    await expect(settings).toBeVisible();
    expect(
      await settings.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await settings
      .getByRole("button", { name: "Ampliar página", exact: true })
      .click();
    const reader = page.getByRole("dialog", {
      name: "El puente de las ardillas",
    });
    await expect(reader).toBeVisible();
    await expectNoOverflow(page);
    if (width <= 600) await expectMobileReaderLayout(page);
    await page.keyboard.press("Escape");
    await expect(reader).not.toBeVisible();
    await page.getByRole("button", { name: "No entendí", exact: true }).click();
    const help = page.getByRole("dialog", { name: "Lo pensamos juntos" });
    await expect(help).toBeVisible();
    expect(await help.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    await help
      .getByRole("button", { name: "Seguir leyendo", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "No entendí", exact: true }),
    ).toBeFocused();
    await expectNoOverflow(page);
  }
});
