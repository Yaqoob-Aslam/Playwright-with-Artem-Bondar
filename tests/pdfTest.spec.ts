import { test, expect } from '@playwright/test'; 
import pdfParse from 'pdf-parse';
import * as fs from 'fs';

async function extractPdfText(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

test('PDF Testing - Read directly from URL', async () => {
  const pdfUrl = 'https://www.princexml.com/samples/invoice-plain/index.pdf';
  const { default: fetch } = await import('node-fetch');
  const response = await fetch(pdfUrl);
  if (!response.ok) throw new Error('PDF fetch failed');
  const buffer = Buffer.from(await response.arrayBuffer());
  const pdfText = await extractPdfText(buffer);
  const addressRegex = /231\s+Swanston\s+St,\s*Melbourne,\s*VIC\s*3000,\s*Australia/i;
  expect(pdfText).toMatch(addressRegex);
});

test('Download PDF & Read Content', async ({ page }) => {
  await page.goto('https://playground.bondaracademy.com/pages/extra-components/pdf-download');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download PDF' }).click(),
  ]);
  const filePath = await download.path();
  const pdfBuffer = fs.readFileSync(filePath!);
  const pdfText = await extractPdfText(pdfBuffer);
  const addressRegex = /231\s+Swanston\s+St,\s*Melbourne,\s*VIC\s*3000,\s*Australia/i;
  expect(pdfText).toMatch(addressRegex);
});