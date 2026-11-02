import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: [
    "responsive-audit.spec.ts",
    "learning-experience.spec.ts",
    "story-creator.spec.ts",
  ],
  workers: 1,
  use: { ...base.use, launchOptions: {} },
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], hasTouch: true },
    },
  ],
  reporter: [
    ["list"],
    [
      "html",
      { outputFolder: "output/playwright/webkit-report", open: "never" },
    ],
  ],
  outputDir: "output/playwright/webkit-results",
});
