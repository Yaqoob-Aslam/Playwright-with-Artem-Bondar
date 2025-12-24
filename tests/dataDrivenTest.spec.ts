import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';
import path from 'path';


const userDataFile = path.join(__dirname, '../data/credentials.xlsx');


test('Login to application', async ({ page }) => {
  
  interface credentials {
    email: string;
    password: string;
  }
  
  const workbook = XLSX.readFile(userDataFile);
  const worksheet = workbook.Sheets["credentials"];
  const xlsxToJson = XLSX.utils.sheet_to_json<credentials>(worksheet);
//   console.log(xlsxToJson);

  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(`${xlsxToJson[0].email}`);
  await page.getByRole('textbox', { name: 'Password' }).fill(`${xlsxToJson[0].password}`);
  await page.getByRole('button', { name: 'Sign in' }).click();
});