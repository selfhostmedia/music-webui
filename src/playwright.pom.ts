import { type Locator, type Page, expect } from '@playwright/test';
import type { components } from './types/api-schema';

type CreateSessionBody = components['schemas']['GuestCreateSessionBodyDto'];

export class Pom {
  private readonly page: Page;

  public jwtToken: string | undefined;

  constructor(page: Page, jwtToken?: string) {
    this.page = page;
    this.jwtToken = jwtToken;
  }

  async findNavigationLink(name: string): Promise<Locator> {
    const responsiveMode = await this.isResponsive();
    if (responsiveMode) {
      await this.page.getByRole('button', { name: 'Toggle account menu' }).click();
      await this.page.waitForTimeout(500);
      await this.page.locator(`a[aria-label="${name}"]`).waitFor({ state: 'visible' });
      return this.page.getByRole('link', { name });
    }
    return this.page.getByRole('link', { name });
  }

  async toggleDarkMode(): Promise<void> {
    const responsiveMode = await this.isResponsive();
    if (responsiveMode) {
      await this.page.getByRole('button', { name: 'Toggle account menu' }).click();
      await this.page.waitForTimeout(500);
    }
    await this.page.locator('button[aria-label="Toggle dark mode"]').waitFor({ state: 'visible' });
    await this.page.locator('button[aria-label="Toggle dark mode"]').click();
    await this.page.waitForTimeout(500);
  }

  async isResponsive(): Promise<boolean> {
    const isResponsive = await this.page.evaluate(() => {
      return window.innerWidth < 768;
    });
    return isResponsive;
  }

  async navigateToAdmin(): Promise<void> {
    await (await this.findNavigationLink('Administration')).click();
    await this.page.waitForURL('/admin');
  }

  async signIn(params?: CreateSessionBody, expectSuccess = true): Promise<void> {
    await this.page.goto('/signin');
    if (this.jwtToken) {
      await this.page.waitForLoadState('networkidle');
      try {
        await this.page.evaluate((token) => {
          sessionStorage.setItem('jwt-token', token);
        }, this.jwtToken);
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
        return;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('*** POM SIGN-IN ERROR:', error);
      }
    }
    await this.page.waitForSelector('input[placeholder="Enter your username"]');
    await this.page.getByPlaceholder('Enter your username').click();
    await this.page.getByPlaceholder('Enter your username').fill(params?.username || '');
    await this.page.getByPlaceholder('Enter your password').click();
    await this.page.getByPlaceholder('Enter your password').fill(params?.password || '');
    if (params?.expiresDays) {
      await this.page.getByRole('checkbox', { name: 'Remember me' }).check();
    }
    const response = this.page.waitForResponse((res) => {
      const url = res.url();
      const status = res.status();
      return (
        url.includes('/api/guest/create-session') &&
        ((expectSuccess && status === 201) || (!expectSuccess && (status === 400 || status === 404)))
      );
    });
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    const responseData = await response;
    const responseJSon = await responseData.json();
    this.jwtToken = responseJSon?.jwtToken;
    if (expectSuccess) {
      expect(this.jwtToken).not.toBeNull();
      await this.page.waitForURL('/');
    }
  }
}
