import { test, expect } from '@playwright/test';
import pdf from 'pdf-parse';
const fs = require('fs');

test('PDF Testing- Read from this site:', async () => {
  const pdfUrl = 'https://www.princexml.com/samples/invoice-plain/index.pdf';

  const { default: fetch } = await import('node-fetch');
  const response = await fetch(pdfUrl);
  const buffer = await response.arrayBuffer();

  // Parse PDF
  const data = await pdf(Buffer.from(buffer));

  const pdfText = data.text;
  const addressRegex = /231\s+Swanston\s+St,\s*Melbourne,\s*VIC\s*3000,\s*Australia/i;
  expect(pdfText).toMatch(addressRegex);
});
 

test('Download PDF & Read Content:', async ({page}) => {
  await page.goto('https://playground.bondaracademy.com/pages/extra-components/pdf-download');
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download PDF' }).click()
  ]);

  // 1️⃣ Get downloaded file path
  const filePath = await download.path();

  // 2️⃣ Create Buffer from PDF
  const pdfBuffer = fs.readFileSync(filePath);

  // 3️⃣ Parse PDF
  const data = await pdf(pdfBuffer);

  // console.log(data.text);
  const pdfText = data.text;
  const addressRegex = /231\s+Swanston\s+St,\s*Melbourne,\s*VIC\s*3000,\s*Australia/i;
  expect(pdfText).toMatch(addressRegex);
});
