import { expect, test } from "@playwright/test";

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
