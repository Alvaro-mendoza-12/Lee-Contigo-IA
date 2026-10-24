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
        if (target.getClientRects().length > 0 && Math.abs(matrix.m13) > 0.01)
          turns.push(event.animationName);
        else if (target.getAnimations().some((a) => a.playState === "running"))
          requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
}

export async function expectBookMotion(
  page: Page,
  animation: string,
  minimumCount = 1,
) {
  await expect
    .poll(() =>
      page.evaluate(
        ({ name, count }) =>
          (
            window as unknown as { observedBookTurns: string[] }
          ).observedBookTurns.filter((turn) => turn === name).length >= count,
        { name: animation, count: minimumCount },
      ),
    )
    .toBe(true);
}
