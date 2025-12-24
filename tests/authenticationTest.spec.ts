import { test, expect } from '@playwright/test';

test.beforeEach('Login', async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
});

test('create article', async ({ page, request }) => {
  await page.getByText('New Article').click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome');
  await page.getByRole('textbox', { name: "What's this article about?" }).fill('About the Playwright');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('We like to use playwright for automation.');
  await page.getByRole('button', { name: 'Publish Article' }).click();

  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome');
  await page.getByText('Home').first().click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome');

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RnZW5AdGVzdC5jb20iLCJ1c2VybmFtZSI6InRlc3RnZW4iLCJpYXQiOjE3Mjg0NTY3MzAsImV4cCI6MTczMzY0MDczMH0.xxxxx' // Token truncated for security
    }
  });

  // Optional: Add assertion for delete if needed
  // expect(deleteArticleResponse.status()).toBe(204);
});