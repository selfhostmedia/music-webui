import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from 'src/types/api-schema';

const authHeader = () => {
  const token =
    sessionStorage.getItem('jwt-token') || localStorage.getItem('jwt-token');
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};

const requireSignIn = () => {
  localStorage.removeItem('jwt-token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('jwt-token');
  sessionStorage.removeItem('user');
  const returnUrl = window.location.pathname + window.location.search;
  const newLocation = `/signin?returnUrl=${encodeURIComponent(returnUrl)}`;
  window.location.href = newLocation;
};

const authenticationGuard: Middleware = {
  async onResponse({ response }) {
    if (response.status === 401) {
      // eslint-disable-next-line no-console
      console.warn('Session expired or was invalid.');
      requireSignIn();
      throw new Error('authentication-error');
    }
    return response;
  },
  async onError({ error }) {
    // eslint-disable-next-line no-console
    console.error('API Error:', error);
    throw new Error('internal-server-error');
  },
};

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
client.use(authenticationGuard);

export default {
  authHeader,
  get: client.GET,
  post: client.POST,
  delete: client.DELETE,
  patch: client.PATCH,
  put: client.PUT,
};
