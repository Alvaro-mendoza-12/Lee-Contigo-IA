import { test, expect } from "@playwright/test";
import { getStory } from "../../lib/stories";
import { paginateStory } from "../../lib/reading";

test("Aventuras desliza portadas completas en móvil y usa una grilla en tablet y escritorio", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/biblioteca");
  const shelf = page.getByRole("region", { name: "Aventuras", exact: true });
  const rail = shelf.getByRole("list");
  const next = shelf.getByRole("button", {
    name: "Ver más cuentos de Aventuras",
  });
  const previous = shelf.getByRole("button", {
    name: "Ver cuentos anteriores de Aventuras",
  });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    if (width > 760) {
      // The current desktop design presents the complete category as a grid.
      await expect(next).not.toBeVisible();
      await expect(previous).not.toBeVisible();
      expect(
        await rail.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      await expect(shelf.getByRole("link")).toHaveCount(9);
      continue;
    }
    await rail.evaluate((el) => el.scrollTo({ left: 0, behavior: "instant" }));
    if (width >= 761) {
      await expect(next).toHaveCount(0);
      await expect(previous).toHaveCount(0);
      expect(
        await rail.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      for (const card of await rail.getByRole("link").all())
        await expect(card).toBeVisible();
    } else {
      await expect(previous).toBeDisabled();
      let turns = 0;
      const count = await rail.locator(":scope > li").count();
      while (!(await next.isDisabled()) && turns++ < count) {
        const before = await rail.evaluate((el) => el.scrollLeft);
        await next.click();
        await expect
          .poll(() => rail.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(before);
        const alignment = await rail.evaluate((el) => {
          const items = Array.from(el.children) as HTMLElement[];
          const step = items[1].offsetLeft - items[0].offsetLeft;
          const index = Math.round(el.scrollLeft / step);
          const box = el.getBoundingClientRect();
          const columns = Number(
            getComputedStyle(el).getPropertyValue("--rail-columns"),
          );
          return {
            error: Math.abs(el.scrollLeft - index * step),
            full: items.slice(index, index + columns).every((item) => {
              const card = item.getBoundingClientRect();
              return card.left >= box.left - 1 && card.right <= box.right + 1;
            }),
          };
        });
        expect(alignment.error).toBeLessThan(2);
        expect(alignment.full).toBe(true);
      }
      expect(turns).toBeGreaterThan(0);
      await expect(next).toBeDisabled();
      await previous.click();
      await expect(next).toBeEnabled();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 390 || width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `output/playwright/catalogue-${width}.png`,
        fullPage: true,
      });
    }
  }
});

test("los nuevos cuentos muestran cuatro escenas y conservan el texto al graduar la letra", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const id of ["sendero-huellas", "buzon-bosque"]) {
    await page.goto(`/leer/${id}?nivel=reto`);
    await expect(page.locator(".reader-book-heading")).toBeVisible();
    await expect(page.locator(".paper-spread .book-page-text")).toHaveText(
      paginateStory(getStory(id)!.versions.reto.paragraphs, 5, isMobile)[0]
        .text,
    );
    expect(
      (await page.locator(".reader-book-heading").boundingBox())!.height,
    ).toBeLessThan(180);
    await page.screenshot({
      path: `output/playwright/${id}-${testInfo.project.name}.png`,
      fullPage: true,
    });
    const scenes = new Set<string>();
    const finish = page.getByRole("link", { name: "Vamos a pensar" });
    for (let turn = 0; turn < 40; turn++) {
      scenes.add(
        (await page
          .locator(".paper-spread .story-art")
          .getAttribute("data-scene"))!,
      );
      const text = page.locator(".paper-spread .book-page-text");
      await expect(text).not.toBeEmpty();
      expect(
        await text.evaluate((el) => {
          const parent = el.parentElement!.getBoundingClientRect();
          const box = el.getBoundingClientRect();
          return box.top >= parent.top && box.bottom <= parent.bottom - 15;
        }),
      ).toBe(true);
      if (await finish.isVisible()) break;
      await page.getByRole("button", { name: "Página siguiente" }).click();
    }
    expect(scenes.size).toBe(4);
    await expect(finish).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
