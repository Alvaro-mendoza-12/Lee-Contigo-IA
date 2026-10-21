import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
const localChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  expect: { timeout: 10000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: existsSync(localChrome) ? localChrome : undefined,
    },
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --hostname 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
      },
});
