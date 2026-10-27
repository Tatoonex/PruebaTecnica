import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    headless: !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 500,
    },
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /.*\.api\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /.*\.api\.spec\.js/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /.*\.api\.spec\.js/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.js/,
    },
  ],
});
