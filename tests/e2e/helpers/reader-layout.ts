import { expect, type Page } from "@playwright/test";

export async function expectMobileReaderLayout(page: Page) {
  const geometry = await page.locator(".paper-spread").evaluate((spread) => {
    const art = spread.querySelector<HTMLElement>(".paper-art")!;
    const text = spread.querySelector<HTMLElement>(".paper-text")!;
    const chapter = text.querySelector<HTMLElement>(".book-chapter")!;
    const paragraph = text.querySelector<HTMLElement>(".book-page-text")!;
    const rect = spread.getBoundingClientRect();
    const a = art.getBoundingClientRect();
    const t = text.getBoundingClientRect();
    const c = chapter.getBoundingClientRect();
    const p = paragraph.getBoundingClientRect();
    return {
      artLeft: a.left - rect.left,
      textLeft: t.left - rect.left,
      artWidth: a.width,
      textWidth: t.width,
      width: rect.width,
      gap: t.top - a.bottom,
      chapterGap: c.top - a.bottom,
      textBottom: p.bottom,
      paperBottom: t.bottom,
    };
  });
  expect(geometry.artLeft).toBeCloseTo(0, 0);
  expect(geometry.textLeft).toBeCloseTo(0, 0);
  expect(geometry.artWidth).toBeCloseTo(geometry.width, 0);
  expect(geometry.textWidth).toBeCloseTo(geometry.width, 0);
  expect(geometry.gap).toBeCloseTo(0, 0);
  expect(geometry.chapterGap).toBeGreaterThanOrEqual(16);
  expect(geometry.chapterGap).toBeLessThanOrEqual(28);
  expect(geometry.textBottom).toBeLessThanOrEqual(geometry.paperBottom - 24);
}
