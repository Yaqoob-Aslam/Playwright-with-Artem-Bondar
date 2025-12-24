import { test, expect } from '@playwright/test';

test('Visual Testing', async ({ page }) => {

  await page.goto('https://playground.bondaracademy.com/pages/forms/layouts', {
    waitUntil: 'networkidle',
  });

  const usingFormGrid = page.locator("//nb-card-header[contains(text(),'Using the Grid')]/ancestor::nb-card");
  const selectedOption = page.locator("//span[@class='text' and contains(text(),'Option 1')]");
  await selectedOption.waitFor({ state: 'visible' });
  await selectedOption.check();

  await page.waitForLoadState('networkidle');
  await expect(usingFormGrid).toHaveScreenshot({ maxDiffPixels: 250 });

  // await page.pause();
});
