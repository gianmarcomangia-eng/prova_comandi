import { test, expect } from '@playwright/test';

test('login test con successo', async ({ page }) => { 
  await page.goto('http://localhost:4200/login');  

  await page.getByLabel('Username').fill('test1');
  await page.getByLabel('Password').fill('test1');

  await page.getByRole('button', { name: 'Invia' }).click();

  
  await expect(page).toHaveURL(/.*dashboard\/timesheet/);
});

test('login test fallito', async ({ page }) => { 
    await page.goto('http://localhost:4200/login');

    await page.getByLabel('Username').fill('test1');
    await page.getByLabel('Password').fill('test1');

    await page.getByRole('button', { name: 'Invia' }).click();

    
    await expect(page).toHaveURL(/.*login/);

});