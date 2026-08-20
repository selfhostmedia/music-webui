import { existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import type { paths } from 'src/types/api-schema';

type CreateSessionResponse =
  paths['/api/guest/create-session']['post']['responses']['201']['content']['application/json'];

type SignInInput = {
  reuseSession?: boolean;
} & paths['/api/guest/create-session']['post']['requestBody']['content']['application/json'];

const tokenPath = '/tmp/tsa-test-jw53';

/**
 * Interface for navigating the dashboard with optional token caching.  When the token is cached it is stored in the /tmp/ folder and will be considered invalid after one hour.  If the token does not exist in the database tests will get stuck on the login screen.
 */
export class Pom {
  /**
   * The test@testing.localhost JWT token
   */
  private static SHARED_TOKEN: string = '';

  /**
   * The token actually used by this POM instance
   */
  token: string = '';

  /**
   * The Playwright page
   */
  private readonly page: Page;

  /**
   * Cancels a test recording session for cleaning up after tests
   * @param {String} id The ID of the recording session
   * @returns {Promise<void>}
   */
  static async cancelRecordingSession(id: string, token?: string): Promise<void> {
    try {
      await fetch(`http://localhost:9100/v1/api/recorder/terminate-recording-session?id=${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token || this.SHARED_TOKEN}`,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  /**
   * Instantiates the Page-Object-Model and if there is an existing shared JWT token loads it
   * @param {Page} page The Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    if (!existsSync(tokenPath)) {
      return;
    }
    const stat = statSync(tokenPath);
    const now = new Date();
    const age = now.getTime() - stat.birthtime.getTime();
    if (age > 60 * 60 * 1000) {
      unlinkSync(tokenPath);
    } else {
      Pom.SHARED_TOKEN = readFileSync(tokenPath).toString();
    }
  }

  /**
   * Tries to validate a token that has been cached.  This is because when a database is rebuilt the token will no longer be valid.
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line class-methods-use-this
  async validateToken(): Promise<void> {
    if (!Pom.SHARED_TOKEN?.length) {
      return;
    }
    try {
      await fetch(`http://localhost:7100/todo/use/authenticated/url`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${Pom.SHARED_TOKEN}`,
        },
      });
    } catch {
      unlinkSync(tokenPath);
      Pom.SHARED_TOKEN = '';
    }
  }

  /**
   * Signs in to the dashboard using the designated or "test@testing.localhost" account
   * @param {string} params.email Optional account email or default "test@testing.localhost"
   * @param {string} params.password Optional account password or default "password"
   * @param {boolean} params.reuseSession Optionally store the token for reuse by other requests
   * @returns {Promise<void>}
   */
  async signIn(params?: SignInInput): Promise<void> {
    if (Pom.SHARED_TOKEN) {
      await this.validateToken();
    }
    if (params?.reuseSession && Pom.SHARED_TOKEN) {
      this.token = Pom.SHARED_TOKEN;
      await this.page.goto('http://localhost:8000/');
      await this.page.waitForFunction((jwtToken) => {
        localStorage.setItem('jwt-token', jwtToken);
        return true;
      }, Pom.SHARED_TOKEN);
      await this.page.goto('http://localhost:8000/dashboard');
      await this.page.waitForFunction(() => document.location.toString().includes('/dashboard'));
      return;
    }
    await this.page.goto('http://localhost:8000/guest/signin');
    await this.page.getByText('Sign inEnter your username').click();
    await this.page.getByPlaceholder('Enter your email address').fill(params?.email || 'test@testing.localhost');
    await this.page.getByPlaceholder('Enter your email address').press('Tab');
    await this.page.getByPlaceholder('Enter your password').press('Control+a');
    await this.page.getByPlaceholder('Enter your password').fill(params?.password || 'password');
    let tokenRequestPromise;
    if (params?.reuseSession) {
      tokenRequestPromise = this.page.waitForRequest(
        (request) => request.method() === 'POST' && request.url().includes('create-session'),
      );
    }
    await this.page.getByPlaceholder('Enter your password').press('Enter');
    const tokenRequest = await tokenRequestPromise;
    const tokenResponse = await tokenRequest?.response();
    const tokenData = (await tokenResponse?.json()) as CreateSessionResponse;
    this.token = Pom.SHARED_TOKEN;
    if (params?.reuseSession) {
      Pom.SHARED_TOKEN = tokenData.jwtToken;
      writeFileSync(tokenPath, Pom.SHARED_TOKEN);
    }
    await this.page.waitForFunction(() => document.location.toString().includes('/dashboard'));
  }
}
