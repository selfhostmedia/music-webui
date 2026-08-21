import { Pom } from '@/playwright.pom';
import { expect, test } from '@playwright/test';

test.describe('signout', () => {
  test.describe('authorized access', () => {
    test('should not allow guest access', async ({ page }, testInfo) => {
      await page.goto('/signout');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toBe(`${testInfo.project.use.baseURL}/signin`);
    });
  });

  test('success', async ({ page }, testInfo) => {
    const pom = new Pom(page);
    await pom.signIn({ username: 'admin', password: 'admin' });
    expect(page.url()).toBe(`${testInfo.project.use.baseURL}/`);
    await page.getByRole('link', { name: 'Sign Out' }).click();
    await page.waitForURL('/signin');
    expect(page.url()).toBe(`${testInfo.project.use.baseURL}/signin`);
    // tokens are gone
    const sessionStorageToken = await page.evaluate(() => {
      return sessionStorage.getItem('jwt-token');
    });
    const localStorageToken = await page.evaluate(() => {
      return localStorage.getItem('jwt-token');
    });
    expect(sessionStorageToken).toBeNull();
    expect(localStorageToken).toBeNull();
  });
});
