import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';
import path from 'path';
import { Credential } from '../types/credentials.interface';  // Clean import
const userDataFile = path.join(__dirname, '../data/credentials.xlsx');


const workbook = XLSX.readFile(userDataFile);
const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Automatically takes the first sheet
const credentials: Credential[] = XLSX.utils.sheet_to_json(worksheet);

credentials.forEach((cred, index) => {
  test(`Login to application with user ${index + 1}: ${cred.email}`, async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(cred.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(cred.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
  });
});