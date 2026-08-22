import createClient from 'openapi-fetch';
import type { components, paths } from './types/api-schema';

if (!process.env.VITE_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not set');
}

type CreateUserBody = components['schemas']['AdminCreateAccountBodyDto'];

type User = components['schemas']['AdminAccountDto'];

const api = createClient<paths>({
  baseUrl: process.env.VITE_API_BASE_URL,
});

export async function createSession(username: string, password: string): Promise<string> {
  const { data, error } = await api.POST('/api/guest/create-session', {
    body: { username, password },
  });
  if (error || !data) {
    throw new Error(`Failed to create session: ${JSON.stringify(error)}`);
  }
  return data.jwtToken;
}

export class AdminApi {
  constructor(private readonly jwtToken: string) {}

  private get authHeader() {
    return {
      Authorization: `Bearer ${this.jwtToken}`,
    };
  }

  async createUser(userData: CreateUserBody): Promise<User> {
    const { error, data } = await api.POST('/api/admin/create-account', {
      body: userData,
      params: {
        header: this.authHeader,
      },
    });
    if (error) {
      throw new Error(`Failed to create user: ${JSON.stringify(error)}`);
    }
    const { data: data2, error: listError } = await api.GET('/api/admin/list-accounts', {
      params: {
        header: this.authHeader,
      },
    });
    if (listError) {
      throw new Error(`Failed to list users: ${JSON.stringify(listError)}`);
    }
    const account = data2?.accounts.find((account) => account.username === userData.username);
    if (!account) {
      throw new Error(`Created user "${userData.username}" was not found`);
    }
    return account;
  }

  async deleteUser(accountId: number): Promise<void> {
    const { error } = await api.DELETE('/api/admin/delete-account', {
      params: {
        header: this.authHeader,
        query: { id: accountId },
      },
    });
    if (error) {
      throw new Error(`Failed to delete user: ${JSON.stringify(error)}`);
    }
  }

  async createRootPath(accountId: number, rootPath: string): Promise<void> {
    const { error } = await api.POST('/api/admin/create-root-path', {
      body: { rootPath },
      params: {
        header: this.authHeader,
        query: { id: accountId },
      },
    });
    if (error) {
      throw new Error(`Failed to create root path: ${JSON.stringify(error)}`);
    }
  }

  async getIndexerConfiguration(): Promise<components['schemas']['AdminIndexerConfigurationDto']> {
    const { data, error } = await api.GET('/api/admin/indexer-configuration', {
      params: {
        header: this.authHeader,
      },
    });
    if (error || !data) {
      throw new Error(`Failed to load indexer configuration: ${JSON.stringify(error)}`);
    }
    return data.configuration;
  }
}
