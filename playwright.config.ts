import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 60_000, // ⏱️ Max time for a single test

  expect: {
    timeout: 10_000, // ⏱️ Max wait for expect() assertions
    toHaveScreenshot: {maxDiffPixels: 250 },
  },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    actionTimeout: 30_000, // ⏱️ Max time for actions (click, fill, etc.)
    navigationTimeout: 30_000, // ⏱️ Max time for page navigation
    trace: 'on-first-retry',
    // headless: false,
    // viewport: null,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // launchOptions: {
    //   args: ['--start-maximized'],
    // },
  },

  /* Configure projects for major browsers */
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      viewport: null,          // maximize
      deviceScaleFactor: undefined, // remove device scale factor
      isMobile: false,         // ensure desktop mode
      launchOptions: {
        headless: false,
        args: ['--start-maximized'], // works for Chromium

      },
    },
  },

{
  name: 'firefox',
  use: {
    ...devices['Desktop Firefox'],
    viewport: null,  // Full window control
    deviceScaleFactor: undefined,
    isMobile: false,
    launchOptions: {
      headless: false,
      args: [
        '--width=3840',   // Huge width (tera screen size daal, jaise 1920 ya 2560)
        '--height=2160',  // Huge height (maximize jaisa lagega)
        // Ya screen size ke hisab se badhao, Firefox auto-adjust nahi karta lekin bada khulega
      ],
    },
  },
},

{
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
      viewport: null,
      deviceScaleFactor: undefined,
      isMobile: false,
      launchOptions: {
        headless: false,
      },
    },
  },
],

});