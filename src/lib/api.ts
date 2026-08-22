import createClient from 'openapi-fetch';
import type { paths } from 'src/types/api-schema';

const authHeader = () => {
  const token = sessionStorage.getItem('jwt-token') || localStorage.getItem('jwt-token');
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

client.use({
  async onResponse({ response }) {
    if (response.status === 401) {
      sessionStorage.removeItem('jwt-token');
      localStorage.removeItem('jwt-token');
      if (window.location.pathname !== '/signin') {
        const returnUrl = window.location.pathname + window.location.search + window.location.hash;
        window.location.assign(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    }
    return response;
  },
});

export default {
  authHeader,
  get: client.GET,
  post: client.POST,
  delete: client.DELETE,
  patch: client.PATCH,
  put: client.PUT,
};
