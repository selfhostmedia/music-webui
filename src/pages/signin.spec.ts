import { expect, test } from '@playwright/test';

test('can sign in', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await page.goto('http://localhost:8000/guest/signin');
  await page.getByPlaceholder('Enter your email address').fill('test@testing.localhost');
  await page.getByPlaceholder('Enter your password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByText('Home').click();
  expect(page.url()).toContain('/');
});
