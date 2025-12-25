import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
});

/* ==================== TEST CASE 1: Create Article ==================== */
test('create article', async ({ page }) => {
  await page.getByRole('link', { name: 'New Article' }).click();

  const title = 'Playwright is awesome tool! ' + Date.now();
  await page.getByRole('textbox', { name: 'Article Title' }).fill(title);
  await page.getByRole('textbox', { name: "What's this article about?" }).fill('About Playwright');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('Playwright rocks!');
  await page.getByRole('textbox', { name: 'Enter tags' }).fill('playwright');
  await page.getByRole('button', { name: 'Publish Article' }).click();

  await page.waitForURL('**/article/**');

  // Extract slug correctly (ignores any query params)
  const url = new URL(page.url());
  const slug = url.pathname.split('/').pop()!;
  console.log('Created article slug:', slug);

  await expect(page.locator('.article-page h1')).toHaveText(title);

  // Go to home and verify in Global Feed
  await page.getByText('Home').first().click();
  await page.getByText('Global Feed').click();

  // FIXED: Use .getByText(title) instead of locator().toContainText() - works with multiple elements
  await expect(page.getByText(title)).toBeVisible();
});

/* ==================== TEST CASE 2: Delete Article ==================== */
test('delete article', async ({ page, request }) => {
  await page.getByRole('link', { name: 'New Article' }).click();

  const title = 'Playwright is awesome tool! ' + Date.now();
  await page.getByRole('textbox', { name: 'Article Title' }).fill(title);
  await page.getByRole('textbox', { name: "What's this article about?" }).fill('About Playwright');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('Playwright rocks!');
  await page.getByRole('textbox', { name: 'Enter tags' }).fill('playwright');
  await page.getByRole('button', { name: 'Publish Article' }).click();

  await page.waitForURL('**/article/**');

  // Extract slug correctly (ignores any query params)
  const url = new URL(page.url());
  const slug = url.pathname.split('/').pop()!;
  console.log('Created article slug:', slug);

  await expect(page.locator('.article-page h1')).toHaveText(title);

  // Go to home and verify in Global Feed
  await page.getByText('Home').first().click();
  await page.getByText('Global Feed').click();

  // FIXED: Add small wait + use getByText instead of .first()
  await page.waitForTimeout(2000); // Wait for feed to update and sort
  await expect(page.getByText(title)).toBeVisible();

  // === NEW: Extract JWT token from localStorage ===
  const token = await page.evaluate(() => localStorage.getItem('jwtToken'));
  if (!token) {
    throw new Error('No JWT token found in localStorage – authentication failed');
  }
  console.log('Using JWT token for delete');

  // Delete article with proper Authorization header
  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slug}`,
    {
      headers: {
        'Authorization': `Token ${token}`,
      },
    }
  );

  console.log('Delete status:', deleteResponse.status());
  if (!deleteResponse.ok()) {
    console.log('Delete error body:', await deleteResponse.text());
  }

  expect(deleteResponse.ok()).toBeTruthy();    // 200-299
  expect(deleteResponse.status()).toBe(204);  // Fixed!

  // Verify article is gone
  await page.reload();
  await expect(page.getByText(title)).not.toBeVisible();
});