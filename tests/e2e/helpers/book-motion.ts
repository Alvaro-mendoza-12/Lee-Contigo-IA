import { expect, type Page } from "@playwright/test";

// Keep evidence after the short-lived page-turn layer has disappeared.
export async function observeBookMotion(page: Page) {
  await page.addInitScript(() => {
    const turns: string[] = [];
    Object.assign(window, { observedBookTurns: turns });
    document.addEventListener("animationstart", (event) => {
      if (!/^paper-(turn|mobile)-(next|previous)$/.test(event.animationName))
        return;
      const target = event.target as HTMLElement;
      const sample = () => {
        if (!target.isConnected) return;
        const style = getComputedStyle(target);
        const matrix = new DOMMatrixReadOnly(style.transform);
        if (
          target.getClientRects().length > 0 &&
          (Math.abs(matrix.m13) > 0.01 || Math.abs(matrix.m41) > 0.1)
        )
          turns.push(event.animationName);
        else if (target.getAnimations().some((a) => a.playState === "running"))
          requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
}

export async function expectBookMotion(page: Page, animation: string) {
  await expect
    .poll(() =>
      page.evaluate(
        (name) =>
          (
            window as unknown as { observedBookTurns: string[] }
          ).observedBookTurns.includes(name),
        animation,
      ),
    )
    .toBe(true);
}
