import { test, expect } from '@playwright/test';
import pdf from 'pdf-parse';

test('PDF Testing', async () => {
  const pdfUrl = 'https://www.princexml.com/samples/invoice-plain/index.pdf';

  // Dynamic import for node-fetch (ESM-only)
  const { default: fetch } = await import('node-fetch');
  // Fetch PDF as buffer
  const response = await fetch(pdfUrl);
  const buffer = await response.arrayBuffer();

  // Parse PDF
  const data = await pdf(Buffer.from(buffer));

  console.log(data.text);

  // Example assertion
  expect(data.text).toContain('Invoice');
});
