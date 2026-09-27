const { defineConfig } = require('@playwright/test');
const external = process.env.SITE_TEST_URL;
module.exports = defineConfig({
  testDir: './tests',
  testMatch: 'portfolio*.spec.cjs',
  fullyParallel: true,
  workers: 3,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: external || 'http://127.0.0.1:4323/cfd.github.io/',
    browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
    trace: 'retain-on-failure',
  },
  ...(external ? {} : { webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4323',
    url: 'http://127.0.0.1:4323/cfd.github.io/',
    reuseExistingServer: !process.env.CI,
  }}),
});
