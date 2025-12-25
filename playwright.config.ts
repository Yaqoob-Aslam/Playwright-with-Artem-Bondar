import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60_000,

  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixels: 250 },
  },

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [

    { 
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', // Use saved auth
        viewport: null,             
        deviceScaleFactor: undefined,
        isMobile: false,
        launchOptions: {
          headless: false,
          args: ['--start-maximized'], 
        },
      },
       dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1040 },  
        deviceScaleFactor: undefined,
        isMobile: false,
        launchOptions: {
          headless: false,
         
        },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },  
        deviceScaleFactor: undefined,
        isMobile: false,
        launchOptions: {
          headless: false,
        },
      },
    },
  ],
});