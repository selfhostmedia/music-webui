import createClient from 'openapi-fetch';
import type { Page } from '@playwright/test';
import type { components, paths } from './types/api-schema';

type CreateUserBody = components['schemas']['AdminCreateAccountBodyDto'];
type CreateSessionBody = components['schemas']['GuestCreateSessionBodyDto'];
type User = components['schemas']['AdminAccountDto'];

export class Pom {
  private readonly page: Page;
  public jwtToken: string | undefined;

  constructor(page: Page, jwtToken?: string) {
    this.page = page;
    this.jwtToken = jwtToken;
  }

  async signIn(params?: CreateSessionBody): Promise<void> {
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
        console.error('*** POM SIGNIN ERROR:', error);
      }
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.getByPlaceholder('Enter your username').click();
    await this.page.getByPlaceholder('Enter your username').fill(params?.username || '');
    await this.page.getByPlaceholder('Enter your password').click();
    await this.page.getByPlaceholder('Enter your password').fill(params?.password || '');
    if (params?.expiresDays) {
      await this.page.getByRole('checkbox', { name: 'Remember me' }).check();
    }
    const response = this.page.waitForResponse((response) => response.url().includes('/api/guest/create-session'));
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    const responseData = await response;
    const responseJSon = await responseData.json();
    this.jwtToken = responseJSon?.jwtToken;
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAdmin(): Promise<void> {
    await this.page.getByRole('link', { name: 'Admin' }).click();
  }
}

const api = createClient<paths>({
  baseUrl: process.env.VITE_API_BASE_URL,
});

export async function createTestUser(userData: CreateUserBody, jwtToken?: string): Promise<User> {
  if (!jwtToken) {
    throw new Error('JWT token is required to create a test user');
  }
  const { error } = await api.POST('/api/admin/create-account', {
    body: userData,
    params: {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  if (error) {
    throw new Error(`API error: ${error.message}`);
  }
  const { data } = await api.GET('/api/admin/list-accounts', {
    params: {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  const account = data?.accounts.find((account) => account.username === userData.username);
  if (!account) {
    throw new Error('Failed to create test user');
  }
  return account;
}

export async function deleteTestUser(accountId: number, jwtToken?: string): Promise<void> {
  if (!jwtToken) {
    throw new Error('JWT token is required to delete a test user');
  }
  const { error } = await api.DELETE('/api/admin/delete-account', {
    params: {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      query: { id: accountId },
    },
  });
  if (error) {
    throw new Error(`API error: ${error.message}`);
  }
}

export async function createRootPath(accountId: number, rootPath: string, jwtToken?: string): Promise<void> {
  if (!jwtToken) {
    throw new Error('JWT token is required to create a root path');
  }
  const { error } = await api.POST('/api/admin/create-root-path', {
    body: { rootPath },
    params: {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      query: { id: accountId },
    },
  });
  if (error) {
    throw new Error(`API error: ${error.message}`);
  }
}

export async function getIndexerConfiguration(
  jwtToken?: string,
): Promise<components['schemas']['AdminIndexerConfigurationDto']> {
  if (!jwtToken) {
    throw new Error('JWT token is required to get indexer configuration');
  }
  const { data } = await api.GET('/api/admin/indexer-configuration', {
    params: {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  if (!data) {
    throw new Error('API error could not load configuration');
  }
  return data.configuration;
}
