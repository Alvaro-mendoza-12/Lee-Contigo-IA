import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { stories } from "../../lib/stories";

for (const width of [320, 390, 768, 1024, 1366, 1920]) {
  test(`lector y ajustes sin recorte a ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 1000 });
    await page.goto("/leer/luz-del-bosque?nivel=reto");
    await expect(
      page.getByRole("button", { name: "Un nuevo reto", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Paso a paso", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Ampliar página", exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("button", { name: "Aumentar tamaño de letra" })
      .click();
    await expect(
      page.getByRole("button", { name: "Aumentar tamaño de letra" }),
    ).toBeDisabled();
    await expect(page.locator(".book-page-text")).toHaveText(
      stories[0].versions.reto.paragraphs[0],
    );
    const pause = page.locator(".reading-help-controls .reading-pause");
    await expect(pause.locator("summary")).toHaveText("Pensemos");
    await pause.locator("summary").click();
    await expect(
      pause.getByText("¿Qué quiere hacer el personaje?", { exact: true }),
    ).toBeVisible();
    await pause
      .getByRole("button", { name: "Ya lo pensé", exact: true })
      .click();
    await expect(pause.locator("summary")).toHaveText("Ya lo pensé");
    await expect(pause).not.toHaveAttribute("open");
    await expect(pause.locator("summary")).toBeFocused();
    await pause.locator("summary").click();
    await expect(
      pause.getByText("¿Qué quiere hacer el personaje?", { exact: true }),
    ).toBeVisible();
    await expect(pause.getByText("Ya lo pensé", { exact: true })).toHaveCount(
      1,
    );
    await expect(
      pause.getByRole("button", { name: "Ya lo pensé", exact: true }),
    ).toHaveCount(0);
    await pause.locator("summary").click();
    await page.getByRole("button", { name: "Ajustes", exact: true }).click();
    const settings = page.getByRole("dialog", { name: "Ajustes de lectura" });
    await expect(settings).toBeVisible();
    expect(
      await settings.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    const axeSettings = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axeSettings.violations).toEqual([]);
    await settings
      .getByRole("button", { name: "Ampliar página", exact: true })
      .click();
    const expanded = page.getByRole("dialog", { name: stories[0].title });
    await expect(expanded).toBeVisible();
    await expect(page.locator(".site-header")).not.toBeVisible();
    await expect(page.locator(".paper-spread .art-camera")).toHaveCSS(
      "overflow",
      "hidden",
    );
    for (let i = 0; i < stories[0].versions.reto.paragraphs.length; i++) {
      const text = page.locator(".paper-spread .book-page-text");
      await expect(text).toHaveText(stories[0].versions.reto.paragraphs[i]);
      expect(
        await text.evaluate((el) => {
          const p = el.parentElement!.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return r.top >= p.top && r.bottom <= p.bottom - 24;
        }),
      ).toBe(true);
      if (i < stories[0].versions.reto.paragraphs.length - 1)
        await page.getByRole("button", { name: "Página siguiente" }).click();
    }
    await expect(page.locator(".book-turn-layer")).toHaveCount(0);
    await expanded.evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.screenshot({
      path: `output/playwright/lector-${width}-${info.project.name}.png`,
      fullPage: true,
    });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(expanded).not.toBeVisible();
    await expect(page.locator(".site-header")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("cada cuento y nivel conserva párrafos e ilustraciones al cambiar la letra", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.addInitScript(() =>
    localStorage.setItem("lee-contigo-reading-font-v2", "26"),
  );
  for (const width of [390, 768, 1366]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const story of stories)
      for (const level of ["paso", "reto"] as const) {
        await page.goto(`/leer/${story.id}?nivel=${level}`);
        const enlarge = page.getByRole("button", {
          name: "Aumentar tamaño de letra",
        });
        await expect(enlarge).toBeDisabled();
        await expect(
          page.getByText(
            `Página 1 de ${story.versions[level].paragraphs.length}`,
            { exact: true },
          ),
        ).toBeVisible();
        await expect(page.locator(".book-page-text")).toHaveText(
          story.versions[level].paragraphs[0],
        );
        expect(
          await page
            .locator(".book-page-text")
            .evaluate(
              (el) =>
                el.getBoundingClientRect().bottom <=
                el.parentElement!.getBoundingClientRect().bottom - 24,
            ),
          story.id,
        ).toBe(true);
        const before = await page.locator(".paper-book").boundingBox();
        await page.getByRole("button", { name: "Página siguiente" }).click();
        const after = await page.locator(".paper-book").boundingBox();
        expect(after!.height).toBeCloseTo(before!.height, 0);
        await expect(page.locator(".book-page-text")).toHaveText(
          story.versions[level].paragraphs[1],
        );
      }
  }
});

test("el creador permite ideas seguras y bloquea insultos en la entrada y el servidor", async ({
  page,
  request,
}) => {
  await page.goto("/crear");
  await page.getByLabel(/Un adulto revisó mi idea/).check();
  const idea = page.getByLabel("Mi idea", { exact: true });
  const submit = page.getByRole("button", {
    name: "Crear mi cuento",
    exact: true,
  });
  for (const text of [
    "Un armadillo arma un cohete de cartón",
    "Una heroína supera su vergüenza al hablar",
  ]) {
    await idea.fill(text);
    await expect(submit).toBeEnabled();
  }
  for (const text of [
    "Un s0ns0 se burla de su amigo",
    "Un t.o.n.t.o pierde su pelota",
    "Un so\u200bnso se burla de su amigo",
    "Un ton-to pierde su pelota",
  ]) {
    await idea.fill(text);
    await expect(submit).toBeDisabled();
    await expect(page.locator("#idea-safety")).toBeVisible();
    const r = await request.post("/api/crear", {
      data: { idea: text, level: "paso", adultReviewed: true },
    });
    expect(r.status()).toBe(422);
    expect((await r.json()).safetyBlocked).toBe(true);
  }
});
